-- TEST: Código CON ERROR ROJO (Nil indexing)

local function openGui()
    local player = game.Players.LocalPlayer
    player.PlayerGui.ScreenGui.Frame:TweenPosition(UDim2.new(0, 0, 0, 0))  -- ERROR ROJO: PlayerGui/ScreenGui pueden no existir
end

openGui()
