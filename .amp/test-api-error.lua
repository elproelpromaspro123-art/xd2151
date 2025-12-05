local player = game.Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")
local screenGui = playerGui:FindFirstChild("ScreenGui")

if screenGui then
    local uiStroke = Instance.new("UIStroke")
    uiStroke.Parent = screenGui
    uiStroke.ApplyToBorder = true
    uiStroke.Color = Color3.new(1, 0, 0)
    uiStroke.Thickness = 2
end
