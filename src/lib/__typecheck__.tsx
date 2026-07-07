import React from "@rbxts/react";

import { Button, styled } from ".";

const brandButtonRef = React.createRef<TextButton>();

const BrandButton = styled(Button)({
	color: "secondary",
	styleOverrides: (_styles, ctx) => (ctx.state === "hovered" ? { shouldRenderStroke: true } : {}),
});

const acceptsPresetDefaults = <BrandButton label="Save" onPress={() => undefined} ref={brandButtonRef} />;
const acceptsCallerOverride = <BrandButton label="Delete" color="error" />;

const RefPresetButton = styled(Button)({ ref: brandButtonRef });
const acceptsRefOnPresetComponent = <RefPresetButton label="Ref" ref={brandButtonRef} />;

export { acceptsCallerOverride, acceptsPresetDefaults, acceptsRefOnPresetComponent };
