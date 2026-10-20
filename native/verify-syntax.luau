local fs = require("@lune/fs")
local luau = require("@lune/luau")
local process = require("@lune/process")
local serde = require("@lune/serde")

local paths = serde.decode("json", fs.readFile(process.args[1]))
for _, path in paths do
	local ok, message = pcall(luau.compile, fs.readFile(path))
	assert(ok, path .. ": " .. tostring(message))
end
print("Compiled " .. #paths .. " native Luau files")
