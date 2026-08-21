import React from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { afterEach, describe, expect, it } from "@rbxts/jest-globals";
import { ThemeProvider } from "@prism/theme";

import { Window } from "./Window";

const ReplicatedStorage = game.GetService("ReplicatedStorage");

let root: ReactRoblox.Root | undefined;
let host: Folder | undefined;

function mountWindow(element: React.ReactElement): ScreenGui {
	const testHost = new Instance("Folder");
	testHost.Name = "PrismWindowTestHost";
	testHost.Parent = ReplicatedStorage;

	const screenGui = new Instance("ScreenGui");
	screenGui.Name = "PrismWindowTestGui";
	screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling;
	screenGui.ResetOnSpawn = false;
	screenGui.Parent = testHost;

	const testRoot = ReactRoblox.createRoot(screenGui);
	host = testHost;
	root = testRoot;

	ReactRoblox.act(() => {
		testRoot.render(<ThemeProvider>{element}</ThemeProvider>);
	});

	return screenGui;
}

function findTextLabel(root: Instance, text: string): TextLabel | undefined {
	for (const descendant of root.GetDescendants()) {
		if (descendant.IsA("TextLabel") && descendant.Text === text) {
			return descendant;
		}
	}

	return undefined;
}

function findTextButton(root: Instance, layoutOrder: number): TextButton | undefined {
	for (const descendant of root.GetDescendants()) {
		if (descendant.IsA("TextButton") && descendant.LayoutOrder === layoutOrder) {
			return descendant;
		}
	}

	return undefined;
}

afterEach(() => {
	const currentRoot = root;
	if (currentRoot !== undefined) {
		ReactRoblox.act(() => {
			currentRoot.unmount();
		});
		root = undefined;
	}

	host?.Destroy();
	host = undefined;
});

describe("Window chrome", () => {
	it("hosts in a ScreenGui with ZIndexBehavior.Sibling", () => {
		const screenGui = mountWindow(<Window title="Inspector" />);
		expect(screenGui.ZIndexBehavior).toBe(Enum.ZIndexBehavior.Sibling);
		expect(findTextLabel(screenGui, "Inspector")).toBeDefined();
	});

	it("renders title, collapse, and maximize chrome", () => {
		const screenGui = mountWindow(<Window title="Tools" />);

		expect(findTextLabel(screenGui, "Tools")).toBeDefined();
		expect(findTextButton(screenGui, 2)).toBeDefined();
		expect(findTextButton(screenGui, 3)).toBeDefined();
		expect(findTextButton(screenGui, 4)).toBeUndefined();
	});

	it("renders close only when onClose is passed", () => {
		const screenGui = mountWindow(<Window title="Closeable" onClose={() => undefined} />);
		expect(findTextButton(screenGui, 4)).toBeDefined();
	});

	it("renders the rail slot when rail content is passed", () => {
		const screenGui = mountWindow(
			<Window title="With rail" rail={<textlabel key="rail-mark" Text="WindowRailMarker" />} />,
		);

		expect(findTextLabel(screenGui, "WindowRailMarker")).toBeDefined();
	});
});
