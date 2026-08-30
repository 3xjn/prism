-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local React = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local _utils = TS.import(script, script.Parent, "utils")
local areWindowBoundsEqual = _utils.areWindowBoundsEqual
local interpolateWindowBounds = _utils.interpolateWindowBounds
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")
local function useWindowCollapseMotion(options)
	local _binding = options
	local collapsed = _binding.collapsed
	local targetBounds = _binding.targetBounds
	local duration = _binding.duration
	local easing = _binding.easing
	local displayBounds, setDisplayBounds = React.useState(targetBounds)
	local showCollapseControl, setShowCollapseControl = React.useState(collapsed)
	local tweening, setTweening = React.useState(false)
	local displayBoundsRef = React.useRef(targetBounds)
	local targetBoundsRef = React.useRef(targetBounds)
	local collapsedRef = React.useRef(collapsed)
	local appliedCollapsedRef = React.useRef(collapsed)
	local tweeningRef = React.useRef(false)
	local versionRef = React.useRef(0)
	local connectionRef = React.useRef(nil)
	local durationRef = React.useRef(duration)
	local easingRef = React.useRef(easing)
	targetBoundsRef.current = targetBounds
	collapsedRef.current = collapsed
	durationRef.current = duration
	easingRef.current = easing
	local stopTweenConnection = React.useCallback(function()
		versionRef.current += 1
		local _result = connectionRef.current
		if _result ~= nil then
			_result:Disconnect()
		end
		connectionRef.current = nil
		tweeningRef.current = false
		setTweening(false)
	end, {})
	local cancelTween = React.useCallback(function()
		stopTweenConnection()
		local target = targetBoundsRef.current
		displayBoundsRef.current = target
		setDisplayBounds(function(current)
			return if areWindowBoundsEqual(current, target) then current else target
		end)
		setShowCollapseControl(collapsedRef.current)
	end, { stopTweenConnection })
	local startTween = React.useCallback(function(from, to, collapsing)
		stopTweenConnection()
		setShowCollapseControl(false)
		local motionDuration = durationRef.current
		local motionEasing = easingRef.current
		if motionDuration <= 0 or areWindowBoundsEqual(from, to) then
			displayBoundsRef.current = to
			setDisplayBounds(function(current)
				return if areWindowBoundsEqual(current, to) then current else to
			end)
			setShowCollapseControl(collapsing)
			return nil
		end
		local version = versionRef.current
		local startedAt = os.clock()
		tweeningRef.current = true
		setTweening(true)
		displayBoundsRef.current = from
		setDisplayBounds(function(current)
			return if areWindowBoundsEqual(current, from) then current else from
		end)
		connectionRef.current = RunService.Heartbeat:Connect(function()
			if versionRef.current ~= version then
				local _result = connectionRef.current
				if _result ~= nil then
					_result:Disconnect()
				end
				connectionRef.current = nil
				return nil
			end
			local alpha = math.clamp((os.clock() - startedAt) / motionDuration, 0, 1)
			local easedAlpha = TweenService:GetValue(alpha, motionEasing.style, motionEasing.direction)
			local nextBounds = interpolateWindowBounds(from, to, easedAlpha)
			displayBoundsRef.current = nextBounds
			setDisplayBounds(function(current)
				return if areWindowBoundsEqual(current, nextBounds) then current else nextBounds
			end)
			if alpha >= 1 then
				local _result = connectionRef.current
				if _result ~= nil then
					_result:Disconnect()
				end
				connectionRef.current = nil
				tweeningRef.current = false
				setTweening(false)
				setShowCollapseControl(collapsing)
			end
		end)
	end, { stopTweenConnection })
	React.useEffect(function()
		local nextTarget = targetBoundsRef.current
		local collapsedChanged = appliedCollapsedRef.current ~= collapsed
		appliedCollapsedRef.current = collapsed
		if collapsedChanged then
			startTween(displayBoundsRef.current, nextTarget, collapsed)
			return nil
		end
		if not tweeningRef.current and not areWindowBoundsEqual(displayBoundsRef.current, nextTarget) then
			displayBoundsRef.current = nextTarget
			setDisplayBounds(function(current)
				return if areWindowBoundsEqual(current, nextTarget) then current else nextTarget
			end)
		end
	end, { collapsed, startTween, targetBounds.height, targetBounds.width, targetBounds.x, targetBounds.y })
	React.useEffect(function()
		return function()
			versionRef.current += 1
			local _result = connectionRef.current
			if _result ~= nil then
				_result:Disconnect()
			end
			connectionRef.current = nil
		end
	end, {})
	return {
		displayBounds = displayBounds,
		showCollapseControl = showCollapseControl,
		tweening = tweening,
		cancelTween = cancelTween,
	}
end
return {
	useWindowCollapseMotion = useWindowCollapseMotion,
}
