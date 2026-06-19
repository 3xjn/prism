import React from "@rbxts/react";

import { PopoverSmokeTest } from "./PopoverSmokeTest";
import { TooltipSliderSmokeTest } from "./TooltipSliderSmokeTest";

export function OverlaySmokeTest(): React.ReactElement {
	return (
		<frame BackgroundTransparency={1} BorderSizePixel={0} Size={UDim2.fromScale(1, 1)}>
			<frame BackgroundTransparency={1} BorderSizePixel={0} Size={new UDim2(0.6, 0, 1, 0)}>
				<PopoverSmokeTest />
			</frame>
			<frame
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Position={new UDim2(0.6, 0, 0, 0)}
				Size={new UDim2(0.4, 0, 1, 0)}
			>
				<TooltipSliderSmokeTest />
			</frame>
		</frame>
	);
}
