-- TEST: Código CORRECTO (sin errores rojos ni naranjas)

local function openGui()
    -- ✅ Validar cada paso
    local player = game.Players.LocalPlayer
    if not player then
        warn("Player not found")
        return
    end

    -- ✅ Esperar y validar
    local playerGui = player:WaitForChild("PlayerGui")
    if not playerGui then
        warn("PlayerGui not found")
        return
    end

    -- ✅ Buscar con validación
    local screenGui = playerGui:FindFirstChild("ScreenGui")
    if not screenGui then
        warn("ScreenGui not found")
        return
    end

    -- ✅ Buscar Frame
    local frame = screenGui:FindFirstChild("Frame")
    if not frame then
        warn("Frame not found")
        return
    end

    -- ✅ Ahora es seguro usar
    frame:TweenPosition(UDim2.new(0, 0, 0, 0), Enum.EasingDirection.Out, Enum.EasingStyle.Quad, 0.5, true)
end

-- ✅ Definido ANTES de usar
openGui()
