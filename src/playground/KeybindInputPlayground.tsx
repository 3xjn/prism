import React from "@rbxts/react";

import { KeybindInput } from "@prism";
import { ThemeProvider } from "@prism/theme";
import type { ThemeOverride } from "@prism/theme";

type KeybindInputProps = React.ComponentProps<typeof KeybindInput>;
type KeybindInputSlotProps = KeybindInputProps["slotProps"];
type KeybindInputLabelSlotProps = NonNullable<KeybindInputSlotProps>["label"];

type MockupDevice = "keyboard" | "mouse" | "gamepad";

interface MockupKeybindTile {
	readonly device: MockupDevice;
	readonly value: Enum.KeyCode;
	readonly label?: string;
	readonly listening?: boolean;
}

interface MockupTileProps {
	readonly tile: MockupKeybindTile;
	readonly rowIndex: number;
	readonly columnIndex: number;
}

const MOCKUP_WIDTH = 626;
const MOCKUP_HEIGHT = 445;
const TILE_WIDTH = 182;
const TILE_HEIGHT = 56;
const TILE_LEFT = 20;
const TILE_TOP = 16;
const TILE_GAP_X = 23;
const TILE_GAP_Y = 38;
const ACTIVE_BLUE = Color3.fromRGB(54, 151, 255);
const ACTIVE_TILE_SURFACE = Color3.fromRGB(15, 29, 44);

const DARK_KEYBIND_THEME: ThemeOverride = table.freeze({
	colors: table.freeze({
		primary: table.freeze({
			main: ACTIVE_BLUE,
			light: Color3.fromRGB(20, 67, 118),
			dark: Color3.fromRGB(121, 192, 255),
			contrast: Color3.fromRGB(11, 16, 23),
		}),
		text: table.freeze({
			primary: Color3.fromRGB(235, 240, 247),
			secondary: Color3.fromRGB(177, 187, 201),
			disabled: Color3.fromRGB(111, 122, 137),
			inverse: Color3.fromRGB(11, 16, 23),
		}),
		background: table.freeze({
			default: Color3.fromRGB(11, 16, 23),
			surface: Color3.fromRGB(20, 27, 37),
		}),
		border: table.freeze({
			subtle: Color3.fromRGB(31, 43, 58),
			default: Color3.fromRGB(43, 56, 73),
			strong: Color3.fromRGB(83, 98, 118),
		}),
		action: table.freeze({
			hover: Color3.fromRGB(26, 36, 49),
			pressed: Color3.fromRGB(34, 47, 63),
			disabled: Color3.fromRGB(111, 122, 137),
			disabledBackground: Color3.fromRGB(26, 34, 45),
		}),
	}),
});

const MOCKUP_ROWS: readonly (readonly MockupKeybindTile[])[] = [
	[
		{ device: "keyboard", value: Enum.KeyCode.Space },
		{ device: "mouse", value: Enum.KeyCode.Unknown, label: "—" },
		{ device: "gamepad", value: Enum.KeyCode.ButtonA },
	],
	[
		{ device: "keyboard", value: Enum.KeyCode.LeftShift, label: "⇧ Shift" },
		{ device: "mouse", value: Enum.KeyCode.Unknown, label: "Mouse4" },
		{ device: "gamepad", value: Enum.KeyCode.ButtonR1 },
	],
	[
		{ device: "keyboard", value: Enum.KeyCode.Unknown, label: "Press a key...", listening: true },
		{ device: "mouse", value: Enum.KeyCode.C, label: "C" },
		{ device: "gamepad", value: Enum.KeyCode.ButtonB },
	],
	[
		{ device: "keyboard", value: Enum.KeyCode.E },
		{ device: "mouse", value: Enum.KeyCode.Unknown, label: "Mouse1" },
		{ device: "gamepad", value: Enum.KeyCode.ButtonX },
	],
	[
		{ device: "keyboard", value: Enum.KeyCode.R },
		{ device: "mouse", value: Enum.KeyCode.Unknown, label: "—" },
		{ device: "gamepad", value: Enum.KeyCode.ButtonY },
	],
];

function resolveCaptureDevice(device: MockupDevice): KeybindInputProps["captureDevice"] {
	return device === "gamepad" ? "gamepad" : "keyboard";
}

function resolveLabelSlot(tile: MockupKeybindTile, value: Enum.KeyCode): KeybindInputLabelSlotProps | undefined {
	if (tile.label === undefined) {
		return undefined;
	}

	if (tile.device !== "mouse" && value !== tile.value) {
		return undefined;
	}

	return {
		Text: tile.label,
		TextColor3: tile.listening ? ACTIVE_BLUE : undefined,
	};
}

function resolveSlotProps(tile: MockupKeybindTile, value: Enum.KeyCode): KeybindInputSlotProps | undefined {
	const label = resolveLabelSlot(tile, value);

	if (tile.listening) {
		return {
			deviceIcon: { ImageColor3: ACTIVE_BLUE },
			keycap: { BackgroundColor3: ACTIVE_TILE_SURFACE, BackgroundTransparency: 0 },
			keycapStroke: { Color: ACTIVE_BLUE, Thickness: 2, Transparency: 0 },
			label,
		};
	}

	return label === undefined ? undefined : { label };
}

function shouldRenderReadOnlyTile(tile: MockupKeybindTile): boolean {
	return tile.device === "mouse" || tile.listening === true;
}

function MockupTile({ tile, rowIndex, columnIndex }: MockupTileProps): React.ReactElement {
	const [value, setValue] = React.useState(tile.value);
	const slotProps = resolveSlotProps(tile, value);
	const readOnly = shouldRenderReadOnlyTile(tile);

	return (
		<KeybindInput
			key={`mockup-keybind-${rowIndex}-${columnIndex}`}
			value={value}
			onChange={setValue}
			captureDevice={resolveCaptureDevice(tile.device)}
			displayDevice={tile.device}
			clearable={false}
			readOnly={readOnly}
			size="lg"
			variant="outline"
			color="primary"
			width={TILE_WIDTH}
			height={TILE_HEIGHT}
			position={UDim2.fromOffset(
				TILE_LEFT + columnIndex * (TILE_WIDTH + TILE_GAP_X),
				TILE_TOP + rowIndex * (TILE_HEIGHT + TILE_GAP_Y),
			)}
			slotProps={slotProps}
		/>
	);
}

function KeybindInputPlaygroundSurface(): React.ReactElement {
	return (
		<frame BackgroundColor3={Color3.fromRGB(11, 16, 23)} BorderSizePixel={0} Size={UDim2.fromScale(1, 1)}>
			<frame
				BackgroundColor3={Color3.fromRGB(11, 16, 23)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0.5)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={UDim2.fromOffset(MOCKUP_WIDTH, MOCKUP_HEIGHT)}
			>
				{MOCKUP_ROWS.map((row, rowIndex) =>
					row.map((tile, columnIndex) => (
						<MockupTile
							key={`mockup-keybind-${rowIndex}-${columnIndex}`}
							tile={tile}
							rowIndex={rowIndex}
							columnIndex={columnIndex}
						/>
					)),
				)}
				{[1, 2, 3, 4].map((rowIndex) => (
					<frame
						key={`mockup-divider-${rowIndex}`}
						BackgroundColor3={Color3.fromRGB(29, 40, 54)}
						BackgroundTransparency={0.35}
						BorderSizePixel={0}
						Position={UDim2.fromOffset(0, rowIndex * (TILE_HEIGHT + TILE_GAP_Y) - 2)}
						Size={UDim2.fromOffset(MOCKUP_WIDTH, 1)}
					/>
				))}
			</frame>
		</frame>
	);
}

export function KeybindInputPlayground(): React.ReactElement {
	return (
		<ThemeProvider theme={DARK_KEYBIND_THEME}>
			<KeybindInputPlaygroundSurface />
		</ThemeProvider>
	);
}
