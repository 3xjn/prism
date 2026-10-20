--!strict
local Package = game:GetService("ReplicatedStorage").Prism
local React = require(Package.React)
local ReactRoblox = require(Package.ReactRoblox)
local Prism = require(Package)
local e = React.createElement
local SaveButton = Prism.styled(Prism.Button)({ variant = "outline" })

local function Preferences()
	local name, setName = React.useState("")
	local enabled, setEnabled = React.useState(false)
	local status, setStatus = React.useState("")

	local saveProps: Prism.ButtonProps = {
		label = "Save",
		disabled = name == "",
		layoutOrder = 5,
		onPress = function()
			setStatus("Saved " .. name)
		end,
		styleOverrides = function(styles, context)
			return { strokeTransparency = if context.state == "pressed" then 0 else styles.strokeTransparency }
		end,
		slotProps = { root = { ZIndex = 2 } },
	}

	return e(Prism.Stack, { width = "100%", p = "md", gap = "sm" }, {
		Heading = e(Prism.Text, { text = "Preferences", size = "lg", layoutOrder = 1 }),
		Name = e(Prism.Input, { value = name, placeholder = "Name", onChange = setName, layoutOrder = 2 }),
		Notifications = e(Prism.Switch, {
			label = "Notifications",
			checked = enabled,
			onChange = setEnabled,
			layoutOrder = 3,
		}),
		NotificationDetails = if enabled
			then e(Prism.Text, { text = "Notifications enabled", layoutOrder = 4 })
			else nil,
		Save = e(SaveButton, saveProps),
		Status = e(Prism.Text, { text = status, layoutOrder = 6 }),
	})
end

-- The caller supplies and owns a host; the returned root owns its mounted tree.
return function(host: Instance)
	local root = ReactRoblox.createRoot(host)
	root:render(e(Prism.ThemeProvider, { density = "compact" }, { Preferences = e(Preferences) }))
	return root
end
