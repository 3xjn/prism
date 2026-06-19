import React from "@rbxts/react";
import { useTheme } from "@prism/theme";

interface StoryCanvasProps {
	readonly children?: React.ReactNode;
}

export function StoryCanvas({ children }: StoryCanvasProps): React.ReactElement {
	const theme = useTheme();

	return (
		<scrollingframe
			Size={UDim2.fromScale(1, 1)}
			CanvasSize={UDim2.fromOffset(0, 0)}
			AutomaticCanvasSize={Enum.AutomaticSize.Y}
			BackgroundColor3={theme.colors.background.default}
			BorderSizePixel={0}
			ScrollBarImageColor3={theme.colors.text.disabled}
			ScrollBarThickness={8}
		>
			<uipadding
				PaddingTop={new UDim(0, theme.spacing.lg)}
				PaddingRight={new UDim(0, theme.spacing.lg)}
				PaddingBottom={new UDim(0, theme.spacing.lg)}
				PaddingLeft={new UDim(0, theme.spacing.lg)}
			/>
			<uilistlayout Padding={new UDim(0, theme.spacing.lg)} FillDirection={Enum.FillDirection.Vertical} SortOrder={Enum.SortOrder.LayoutOrder} />
			{children}
		</scrollingframe>
	);
}
