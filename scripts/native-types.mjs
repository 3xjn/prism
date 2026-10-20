import ts from "typescript";
import path from "node:path";
import { createHash } from "node:crypto";

// Read the same public declarations as rbxtsc. This is a type-only emitter;
// component execution remains entirely in Prism's compiled implementation.
export function emitNativeTypes(repoRoot) {
	const configPath = path.join(repoRoot, "tsconfig.package.json");
	const config = ts.readConfigFile(configPath, ts.sys.readFile);
	if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"));
	const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, repoRoot);
	const program = ts.createProgram(parsed.fileNames, parsed.options);
	const checker = program.getTypeChecker();
	const entry = program.getSourceFile(path.join(repoRoot, "src/lib/index.ts"));
	const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(entry));
	const pending = new Map();
	const emitted = new Map();
	const unions = new Map();
	const normalized = (value) => value.replace(/\\/g, "/");
	const libRoot = normalized(path.join(repoRoot, "src/lib")) + "/";
	const quote = (value) => JSON.stringify(value);
	const keywords = new Set(
		"and break continue do else elseif end export false for function if in local nil not or repeat return then true type until while".split(
			" ",
		),
	);
	const field = (name) => (/^[A-Za-z_][A-Za-z_0-9]*$/.test(name) && !keywords.has(name) ? name : `[${quote(name)}]`);
	const resolve = (symbol) => (symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol);
	const localDecl = (symbol) =>
		symbol?.declarations?.find(
			(decl) =>
				normalized(decl.getSourceFile().fileName).startsWith(libRoot) &&
				(ts.isInterfaceDeclaration(decl) || ts.isTypeAliasDeclaration(decl)),
		);
	const nativeReact = new Map([
		["ReactNode", "React.Node"],
		["ReactElement", "React.ReactElement"],
		["Binding", "React.Binding"],
		["Ref", "React.Ref"],
	]);
	function union(parts) {
		const unique = [...new Set(parts)].map((part) => (part.includes(" -> ") ? `(${part})` : part));
		if (unique.length <= 64) return unique.join(" | ");
		const name = `NativeUnion_${createHash("sha256").update(unique.join("|")).digest("hex").slice(0, 8)}`;
		if (!unions.has(name)) {
			const chunks = [];
			for (let offset = 0; offset < unique.length; offset += 64) {
				chunks.push(`${name}_${offset / 64 + 1}`);
				unions.set(chunks[chunks.length - 1], unique.slice(offset, offset + 64).join(" | "));
			}
			unions.set(name, chunks.join(" | "));
		}
		return name;
	}

	function enqueue(symbol) {
		const name = symbol.getName();
		const prior = pending.get(name);
		if (prior && prior !== symbol) throw new Error(`Native type name collision: ${name}`);
		pending.set(name, symbol);
		return name;
	}

	function convert(type, expanding, depth = 0) {
		if (depth > 30) throw new Error(`Native type nesting exceeded: ${checker.typeToString(type)}`);
		const recur = (next) => convert(next, undefined, depth + 1);
		const symbol = type.aliasSymbol || type.getSymbol();
		const name = symbol?.getName();
		const args =
			type.aliasTypeArguments || (type.objectFlags & ts.ObjectFlags.Reference ? checker.getTypeArguments(type) : []);
		const enumDecl = symbol?.declarations?.find((decl) =>
			normalized(decl.getSourceFile().fileName).endsWith("/generated/enums.d.ts"),
		);
		if (enumDecl) {
			let scope = enumDecl.parent;
			while (scope && !ts.isModuleDeclaration(scope)) scope = scope.parent;
			return `Enum.${scope?.name.text === "Enum" ? name : scope?.name.text}`;
		}
		if (name && nativeReact.has(name) && !localDecl(symbol)) {
			const base = nativeReact.get(name);
			return (name === "Binding" || name === "Ref") && args.length ? `${base}<${recur(args[0])}>` : base;
		}
		if (name === "RawSlotProps") {
			return `{ ${checker
				.getPropertiesOfType(args[0])
				.map((slot) => `${field(slot.name)}: RawInstanceProps?`)
				.join(", ")} }`;
		}
		if (name === "StyleOverride") {
			const fields = checker
				.getPropertiesOfType(args[0])
				.map(
					(prop) =>
						`${field(prop.name)}: (${recur(checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration || entry))})?`,
				);
			return `(styles: ${recur(args[0])}, context: ${recur(args[1])}) -> { ${fields.join(", ")} }`;
		}
		if (name && localDecl(symbol) && symbol !== expanding) {
			return enqueue(symbol) + (args.length ? `<${args.map(recur).join(", ")}>` : "");
		}
		if (type.flags & ts.TypeFlags.TypeParameter) return name;
		if (type.flags & ts.TypeFlags.Any) return "any";
		if (type.flags & ts.TypeFlags.Unknown) return "unknown";
		if (type.flags & ts.TypeFlags.Never) return "never";
		if (type.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null | ts.TypeFlags.Void)) return "nil";
		if (type.flags & ts.TypeFlags.BooleanLike) return "boolean";
		if (type.flags & ts.TypeFlags.StringLiteral) return quote(type.value);
		if (type.flags & ts.TypeFlags.StringLike) return "string";
		if (type.flags & ts.TypeFlags.EnumLike) {
			const member = symbol?.declarations?.find(ts.isEnumMember);
			if (member) return `Enum.${member.parent.name.text}`;
			throw new Error(`Unknown engine enum: ${checker.typeToString(type)}`);
		}
		if (type.flags & ts.TypeFlags.NumberLike) return "number";
		if (type.isUnion()) return union(type.types.map(recur));
		if (type.isIntersection()) return type.types.map((part) => `(${recur(part)})`).join(" & ");
		if (checker.isArrayType(type)) return `{ ${recur(checker.getTypeArguments(type)[0])} }`;
		if (checker.isTupleType(type)) return `{ ${[...new Set(checker.getTypeArguments(type).map(recur))].join(" | ")} }`;
		// Roblox datatypes and classes remain native Luau engine types.
		if (
			name &&
			symbol.declarations?.some((decl) => normalized(decl.getSourceFile().fileName).includes("/@rbxts/types/"))
		) {
			const text = checker.typeToString(type);
			if (text.startsWith("Enum.")) return text;
			if (/^[A-Za-z_][A-Za-z_0-9]*$/.test(name)) return name;
		}
		const calls = type.getCallSignatures();
		if (calls.length) {
			return calls
				.map((signature) => {
					const params = signature.getParameters().map((param, index) => {
						const decl = param.valueDeclaration;
						const value = checker.getTypeOfSymbolAtLocation(param, decl || entry);
						const rest = decl && ts.isParameter(decl) && decl.dotDotDotToken;
						return rest
							? `...${checker.isArrayType(value) ? recur(checker.getTypeArguments(value)[0]) : recur(value)}`
							: `${field(param.name || `arg${index}`)}: ${recur(value)}`;
					});
					const result = checker.getReturnTypeOfSignature(signature);
					return `(${params.join(", ")}) -> ${result.flags & ts.TypeFlags.Void ? "()" : recur(result)}`;
				})
				.map((part) => `(${part})`)
				.join(" & ");
		}
		const props = checker.getPropertiesOfType(type);
		const index = checker.getIndexTypeOfType(type, ts.IndexKind.String);
		const lines = props.map((prop) => {
			let value;
			if (prop.name === "children") value = "React.Node";
			else if (prop.name === "Event" || prop.name === "Change") {
				const instance =
					prop.valueDeclaration?.type?.getText().match(/InstanceProps<([A-Za-z0-9_]+)>/)?.[1] || "Instance";
				value = `InstanceEventMap<${instance}> | nil`;
			} else {
				try {
					value = recur(
						checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration || prop.declarations?.[0] || entry),
					);
				} catch (error) {
					throw new Error(`${name || checker.typeToString(type)}.${prop.name}: ${error.message}`);
				}
			}
			if (prop.flags & ts.SymbolFlags.Optional) value = `(${value})?`;
			return `${field(prop.name)}: ${value}`;
		});
		if (index) lines.push(`[string]: ${recur(index)}`);
		if (lines.length || type.flags & ts.TypeFlags.Object)
			return `{\n${lines.map((line) => `\t${line},`).join("\n")}\n}`;
		throw new Error(`Unsupported public native type: ${checker.typeToString(type)} (${type.flags})`);
	}

	const components = [];
	for (const exported of exports) {
		const symbol = resolve(exported);
		const decl = localDecl(symbol);
		if (decl && exported.name.endsWith("Props") && !exported.name.startsWith("PrismLuau")) enqueue(symbol);
		if (!(symbol.flags & ts.SymbolFlags.Value)) continue;
		const type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration || entry);
		const props = exports.find((candidate) => candidate.name === `${exported.name}Props`);
		if (props && /^[A-Z]/.test(exported.name)) {
			const propSymbol = resolve(props);
			const propDecl = localDecl(propSymbol);
			const params = propDecl?.typeParameters;
			const typeName =
				enqueue(propSymbol) +
				(params?.length
					? `<${params.map((param) => (param.default ? convert(checker.getTypeFromTypeNode(param.default)) : "unknown")).join(", ")}>`
					: "");
			components.push(`${exported.name}: React.AbstractComponent<${typeName}, Instance>`);
		} else if (exported.name === "ThemeProvider") {
			const signature = type.getCallSignatures()[0];
			const param = signature.getParameters()[0];
			const propsType = checker.getTypeOfSymbolAtLocation(param, param.valueDeclaration);
			components.push(`ThemeProvider: (${convert(propsType)}) -> React.ReactElement`);
		} else if (exported.name === "SUPPORTED_LUCIDE_ICON_NAMES") {
			components.push("SUPPORTED_LUCIDE_ICON_NAMES: { string }");
		} else if (
			[
				"DEFAULT_THEME",
				"DEFAULT_DARK_THEME",
				"theme",
				"useTheme",
				"resolveColor",
				"resolveSize",
				"toUDim",
				"toUDim2",
				"toUDimAxis",
				"getLucideIconAsset",
				"isLucideIconName",
			].includes(exported.name)
		) {
			components.push(`${exported.name}: ${convert(type)}`);
		}
	}
	for (const [name, symbol] of pending) {
		const decl = localDecl(symbol);
		const params = decl.typeParameters;
		const generics = params?.length
			? `<${params.map((param) => param.name.text + (param.default ? ` = ${convert(checker.getTypeFromTypeNode(param.default))}` : "")).join(", ")}>`
			: "";
		const type = ts.isTypeAliasDeclaration(decl)
			? checker.getTypeFromTypeNode(decl.type)
			: checker.getDeclaredTypeOfSymbol(symbol);
		emitted.set(name, `export type ${name}${generics} = ${convert(type, symbol)}\n`);
	}
	return {
		types:
			[...unions].map(([name, value]) => `type ${name} = ${value}\n`).join("\n") +
			"\n" +
			[...emitted.values()].join("\n"),
		fields: components.join(",\n\t"),
		typeCount: emitted.size,
	};
}
