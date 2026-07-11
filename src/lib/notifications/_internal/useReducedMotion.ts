import React from "@rbxts/react";

const GuiService = game.GetService("GuiService");

export function useReducedMotion(): boolean {
	const [reducedMotion, setReducedMotion] = React.useState(GuiService.ReducedMotionEnabled);

	React.useEffect(() => {
		const updateReducedMotion = () => {
			setReducedMotion(GuiService.ReducedMotionEnabled);
		};

		updateReducedMotion();
		const connection = GuiService.GetPropertyChangedSignal("ReducedMotionEnabled").Connect(updateReducedMotion);

		return () => {
			connection.Disconnect();
		};
	}, []);

	return reducedMotion;
}
