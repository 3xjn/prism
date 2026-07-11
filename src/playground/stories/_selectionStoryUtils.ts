import React from "@rbxts/react";

const GuiService = game.GetService("GuiService");

function describeSelectedObject(selectedObject: GuiObject | undefined): string {
	if (selectedObject === undefined) {
		return "SelectedObject: none";
	}

	return `SelectedObject: ${selectedObject.Name} (${selectedObject.ClassName}, order ${selectedObject.SelectionOrder})`;
}

export function useSelectedObjectLabel(): string {
	const [label, setLabel] = React.useState(describeSelectedObject(GuiService.SelectedObject));

	React.useEffect(() => {
		const updateLabel = () => {
			setLabel(describeSelectedObject(GuiService.SelectedObject));
		};
		const connection = GuiService.GetPropertyChangedSignal("SelectedObject").Connect(updateLabel);
		updateLabel();

		return () => {
			connection.Disconnect();
		};
	}, []);

	return label;
}
