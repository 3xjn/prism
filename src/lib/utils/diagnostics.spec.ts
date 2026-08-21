import { describe, expect, it } from "@rbxts/jest-globals";

import { bridgeDiagnostics, componentDiagnostics } from "./diagnostics";

const RunService = game.GetService("RunService");

describe("diagnostics", () => {
	it("throws component violations in Studio and stays silent otherwise", () => {
		if (RunService.IsStudio()) {
			expect(() => componentDiagnostics.violation("invalid-token", () => "Studio violation")).toThrow();
			return;
		}

		let messageEvaluated = false;
		componentDiagnostics.violation("invalid-token", () => {
			messageEvaluated = true;
			return "Production violation";
		});
		expect(messageEvaluated).toBe(false);
	});

	it("throws bridge violations in Studio and stays silent otherwise", () => {
		if (RunService.IsStudio()) {
			expect(() => bridgeDiagnostics.violation("unknown-component", () => "Studio bridge violation")).toThrow();
			return;
		}

		let messageEvaluated = false;
		bridgeDiagnostics.violation("unknown-component", () => {
			messageEvaluated = true;
			return "Production bridge violation";
		});
		expect(messageEvaluated).toBe(false);
	});
});
