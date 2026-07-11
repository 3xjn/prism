import React from "@rbxts/react";

const UserInputService = game.GetService("UserInputService");

export function usePreferredInput(): Enum.PreferredInput {
	const [preferredInput, setPreferredInput] = React.useState(UserInputService.PreferredInput);

	React.useEffect(() => {
		const connection = UserInputService.GetPropertyChangedSignal("PreferredInput").Connect(() => {
			setPreferredInput(UserInputService.PreferredInput);
		});

		return () => {
			connection.Disconnect();
		};
	}, []);

	return preferredInput;
}
