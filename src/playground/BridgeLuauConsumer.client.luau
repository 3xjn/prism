local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Prism = ReplicatedStorage:WaitForChild("Prism")
local Bridge = require(Prism:WaitForChild("bridge"))
local mountPrism = Bridge.mountPrism

local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")
local screenGuiName = "PrismBridgeLuauSmoke"

local existingGui = playerGui:FindFirstChild(screenGuiName)
if existingGui and existingGui:IsA("ScreenGui") then
	existingGui:Destroy()
end

local screenGui = Instance.new("ScreenGui")
screenGui.Name = screenGuiName
screenGui.DisplayOrder = 1001
screenGui.IgnoreGuiInset = true
screenGui.ResetOnSpawn = false
screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
screenGui.Parent = playerGui

local handle
local cleanedUp = false
local ancestryConnection

local state = {
	backdropVisible = false,
	buttonPresses = 0,
	pressablePresses = 0,
	inputValue = "hello from Luau",
	modalOpened = false,
	selectValue = "alpha",
	sliderValue = 25,
	sliderEndValue = 25,
	switchChecked = true,
	dragOrder = { "one", "two", "three" },
	lastCallback = "mounted",
	updates = 0,
}

local function copyArray(values)
	local result = {}
	for index, value in ipairs(values) do
		result[index] = value
	end
	return result
end

local function joinStrings(values)
	local parts = {}
	for index, value in ipairs(values) do
		parts[index] = value
	end
	return table.concat(parts, ", ")
end

local renderTree

local function setState(changes)
	for key, value in pairs(changes) do
		state[key] = value
	end

	state.updates += 1
	if handle and not cleanedUp then
		handle.update(renderTree())
	end
end

local function textNode(text, color, size)
	return {
		component = "Text",
		props = {
			text = text,
			color = color or "text.secondary",
			size = size,
			width = "100%",
			wrap = true,
		},
	}
end

local function section(title, children)
	local sectionChildren = {
		{
			component = "Text",
			props = {
				text = title,
				color = "text.primary",
				size = "md",
				weight = 700,
				width = "100%",
				wrap = true,
			},
		},
		{
			component = "Divider",
			props = {
				orientation = "horizontal",
				color = "border.subtle",
				size = 1,
			},
		},
	}

	for _, child in ipairs(children) do
		table.insert(sectionChildren, child)
	end

	return {
		component = "Card",
		props = {
			width = "100%",
			variant = "outline",
			p = "md",
			radius = "lg",
			shadow = "sm",
		},
		children = {
			component = "Stack",
			props = {
				width = "100%",
				gap = "sm",
			},
			children = sectionChildren,
		},
	}
end

local function cleanup()
	if cleanedUp then
		return
	end

	cleanedUp = true
	if handle then
		handle.destroy()
		handle = nil
	end

	if screenGui.Parent then
		screenGui:Destroy()
	end

	if ancestryConnection then
		ancestryConnection:Disconnect()
		ancestryConnection = nil
	end
end

renderTree = function()
	return {
		component = "Fragment",
		children = {
			{
				component = "Backdrop",
				props = {
					visible = state.backdropVisible,
					active = state.backdropVisible,
					color = "background.default",
					opacity = 0.35,
					zIndex = 900,
					cursor = "pointer",
					excludeRect = {
						position = UDim2.fromOffset(24, 24),
						size = UDim2.fromOffset(560, 520),
						anchor = Vector2.new(0, 0),
					},
					onPress = function()
						setState({ backdropVisible = false, lastCallback = "Backdrop.onPress()" })
					end,
				},
			},
			{
				component = "Stack",
				props = {
					width = 560,
					height = 700,
					position = UDim2.fromOffset(24, 24),
					p = "lg",
					gap = "md",
					bg = "background.default",
					borderColor = "border.default",
					radius = "lg",
					zIndex = 910,
				},
				children = {
					{
						component = "Stack",
						props = {
							width = "100%",
							gap = "xs",
						},
						children = {
							{
								component = "Text",
								props = {
									text = "Prism bridge full Luau smoke",
									size = "lg",
									weight = 700,
									color = "text.primary",
									width = "100%",
									wrap = true,
								},
							},
							textNode("Real Luau consumer: require(ReplicatedStorage.Prism.bridge), mountPrism, controlled updates, callbacks, and destroy.", "text.secondary", "sm"),
							textNode("Last callback: " .. state.lastCallback .. " | renders: " .. tostring(state.updates), "info.main", "sm"),
						},
					},
					{
						component = "ScrollArea",
						props = {
							width = "100%",
							height = 560,
							direction = "vertical",
							automaticCanvasSize = Enum.AutomaticSize.Y,
							scrollingEnabled = true,
							scrollbarSize = 8,
							scrollbarColor = "primary.main",
							scrollbarTransparency = 0.2,
							slotProps = {
								root = { ClipsDescendants = true },
							},
						},
						children = {
							component = "Stack",
							props = {
								width = "100%",
								gap = "md",
								p = "sm",
							},
							children = {
								section("Layout, slots, icon, image", {
									{
										component = "Box",
										props = {
											width = "100%",
											p = "md",
											bg = "background.surface",
											borderColor = "border.subtle",
											stroke = {
												color = "primary.main",
												thickness = 1,
												transparency = 0.15,
												mode = Enum.ApplyStrokeMode.Border,
											},
											radius = "md",
											slotProps = {
												root = { ZIndex = 912 },
											},
										},
										children = {
											component = "Stack",
											props = { width = "100%", direction = "horizontal", gap = "sm", align = "center" },
											children = {
												{ component = "Icon", props = { name = "check", size = "md", color = "success.main" } },
												{ component = "Image", props = { src = "rbxassetid://0", width = 36, height = 36, scaleType = Enum.ScaleType.Fit, resampleMode = Enum.ResamplerMode.Default, bg = "action.hover", radius = "sm" } },
												textNode("Box + slotProps + stroke + Icon + Image are bridged.", "text.primary"),
											},
										},
									},
								}),
								section("Callbacks", {
									{
										component = "Button",
										props = {
											label = "Button.onPress count = " .. tostring(state.buttonPresses),
											variant = "filled",
											color = "primary",
											fullWidth = true,
											onPress = function()
												setState({ buttonPresses = state.buttonPresses + 1, lastCallback = "Button.onPress()" })
											end,
										},
									},
									{
										component = "Pressable",
										props = {
											width = "100%",
											p = "sm",
											bg = "action.hover",
											radius = "md",
											cursor = "pointer",
											onPress = function()
												setState({ pressablePresses = state.pressablePresses + 1, lastCallback = "Pressable.onPress()" })
											end,
										},
										children = textNode("Pressable.onPress count = " .. tostring(state.pressablePresses), "text.primary"),
									},
									{
										component = "Button",
										props = {
											label = "Show Backdrop, then click outside panel",
											variant = "outline",
											color = "info",
											fullWidth = true,
											onPress = function()
												setState({ backdropVisible = true, lastCallback = "show Backdrop" })
											end,
										},
									},
								}),
								section("Controlled state", {
									{
										component = "Input",
										props = {
											value = state.inputValue,
											placeholder = "Type to test Input.onChange",
											variant = "outline",
											color = "primary",
											fullWidth = true,
											onChange = function(value)
												setState({ inputValue = value, lastCallback = "Input.onChange(" .. value .. ")" })
											end,
										},
									},
									{
										component = "Select",
										props = {
											options = {
												{ value = "alpha", label = "Alpha" },
												{ value = "beta", label = "Beta" },
												{ value = "gamma", label = "Gamma", disabled = true },
											},
											value = state.selectValue,
											placeholder = "Choose option",
											variant = "outline",
											color = "secondary",
							fullWidth = true,
							maxVisibleOptions = 3,
							onChange = function(value)
												setState({ selectValue = value, lastCallback = "Select.onChange(" .. value .. ")" })
											end,
										},
									},
									{
										component = "Slider",
										props = {
											value = state.sliderValue,
											min = 0,
											max = 100,
											step = 5,
											color = "primary",
											tooltip = true,
											fullWidth = true,
											onChange = function(value)
												setState({ sliderValue = value, lastCallback = "Slider.onChange(" .. tostring(value) .. ")" })
											end,
											onChangeEnd = function(value)
												setState({ sliderEndValue = value, lastCallback = "Slider.onChangeEnd(" .. tostring(value) .. ")" })
											end,
										},
									},
									textNode("Slider value: " .. tostring(state.sliderValue) .. " | end: " .. tostring(state.sliderEndValue), "text.secondary", "sm"),
									{
										component = "Switch",
										props = {
											label = "Switch checked = " .. tostring(state.switchChecked),
											checked = state.switchChecked,
											color = "success",
											onChange = function(value)
												setState({ switchChecked = value, lastCallback = "Switch.onChange(" .. tostring(value) .. ")" })
											end,
										},
									},
								}),
								section("Draggable, Tooltip, Modal", {
									{
										component = "Draggable",
										props = {
											items = {
												{ id = "one", label = "One" },
												{ id = "two", label = "Two" },
												{ id = "three", label = "Three", disabled = true },
											},
											value = copyArray(state.dragOrder),
											width = "100%",
											gap = "sm",
											direction = "vertical",
											onReorder = function(value)
												setState({ dragOrder = copyArray(value), lastCallback = "Draggable.onReorder(" .. joinStrings(value) .. ")" })
											end,
										},
									},
									textNode("Drag order: " .. joinStrings(state.dragOrder), "text.secondary", "sm"),
									{
										component = "Tooltip",
										props = {
											label = "Tooltip trigger",
											content = "Tooltip is forced open through bridge props.",
							opened = true,
							gap = 8,
							width = "100%",
						},
										children = {
											component = "Button",
											props = { label = "Tooltip child Button", variant = "light", color = "info", fullWidth = true },
										},
									},
									{
										component = "Button",
										props = {
											label = "Open Modal",
											variant = "outline",
											color = "secondary",
											fullWidth = true,
											onPress = function()
												setState({ modalOpened = true, lastCallback = "open Modal" })
											end,
										},
									},
								}),
							},
						},
					},
					{
						component = "Stack",
						props = { width = "100%", direction = "horizontal", gap = "sm" },
						children = {
							{
								component = "Button",
								props = {
									label = "Force update",
									variant = "light",
									color = "primary",
									fullWidth = true,
									onPress = function()
										setState({ lastCallback = "handle.update(renderTree())" })
									end,
								},
							},
							{
								component = "Button",
								props = {
									label = "Destroy bridge UI",
									variant = "outline",
									color = "error",
									fullWidth = true,
									onPress = cleanup,
								},
							},
						},
					},
				},
			},
			{
				component = "Modal",
				props = {
					opened = state.modalOpened,
					title = "Bridge Modal",
					size = "md",
					withCloseButton = true,
					zIndex = 1000,
					onClose = function()
						setState({ modalOpened = false, lastCallback = "Modal.onClose()" })
					end,
				},
				children = {
					component = "Stack",
					props = { width = "100%", gap = "md" },
					children = {
						textNode("Modal opened/closed through bridge state.", "text.secondary"),
						{
							component = "Button",
							props = {
								label = "Close Modal",
								variant = "filled",
								color = "primary",
								onPress = function()
									setState({ modalOpened = false, lastCallback = "Modal body close button" })
								end,
							},
						},
					},
				},
			},
		},
	}
end

handle = mountPrism(screenGui, renderTree())

task.delay(2, function()
	if handle and not cleanedUp then
		setState({ lastCallback = "task.delay auto update" })
	end
end)

ancestryConnection = script.AncestryChanged:Connect(function(_, parent)
	if parent == nil then
		cleanup()
	end
end)
