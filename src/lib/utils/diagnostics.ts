const RunService = game.GetService("RunService");

type DiagnosticAction = "ignore" | "warn" | "throw";

type DiagnosticScopeName = "bridge" | "component";

interface DiagnosticPolicy {
	readonly defaultAction: DiagnosticAction;
	readonly scopes?: Readonly<Partial<Record<DiagnosticScopeName, DiagnosticAction>>>;
	readonly codes?: Readonly<Partial<Record<string, DiagnosticAction>>>;
}

interface DiagnosticScope {
	violation(code: string, message: () => string): void;
}

interface Diagnostics {
	scope(scope: DiagnosticScopeName): DiagnosticScope;
}

function resolveDiagnosticAction(policy: DiagnosticPolicy, scope: DiagnosticScopeName, code: string): DiagnosticAction {
	return policy.codes?.[`${scope}.${code}`] ?? policy.scopes?.[scope] ?? policy.defaultAction;
}

function createDiagnostics(policy: DiagnosticPolicy): Diagnostics {
	return {
		scope(scope) {
			return {
				violation(code, message) {
					switch (resolveDiagnosticAction(policy, scope, code)) {
						case "ignore":
							return;
						case "warn":
							warn(message());
							return;
						case "throw":
							error(message());
					}
				},
			};
		},
	};
}

const studioDiagnosticAction: DiagnosticAction = RunService.IsStudio() ? "throw" : "ignore";

const diagnostics = createDiagnostics({
	defaultAction: "ignore",
	scopes: {
		bridge: studioDiagnosticAction,
		component: studioDiagnosticAction,
	},
});

export const bridgeDiagnostics = diagnostics.scope("bridge");
export const componentDiagnostics = diagnostics.scope("component");
