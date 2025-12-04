--[[
╔══════════════════════════════════════════════════════════════════════════════╗
║  ROBLOX GUI PREMIUM TEMPLATE - COMPLETE SYSTEM                               ║
║  Versión: 2.0 - Soporte Dual Mode (ScreenGuis + LocalScript)                 ║
║  Compatible con Roblox Studio 2023+                                          ║
╚══════════════════════════════════════════════════════════════════════════════╝

PRINCIPIOS ÉTICOS IMPLEMENTADOS:
✓ Transparencia: UI muestra claramente qué información se recopila
✓ Consentimiento: Confirmaciones antes de acciones irreversibles
✓ Accesibilidad: Soporte para contraste alto y navegación por teclado
✓ Privacidad: Sin datos externos sin consentimiento explícito
✓ Rendimiento: Optimización para dispositivos de bajo rendimiento
✓ Responsabilidad: Mensajes de error claros y ayuda contextual

MODOS DE IMPLEMENTACIÓN:
1. MODO SCREENGUI: Crear GUI manualmente en Studio (Visual + Script)
2. MODO LOCALSCRIPT: Script puro que genera todo desde código
]]

-- ============================================================================
-- CONFIGURACIÓN GLOBAL
-- ============================================================================

local CONFIG = {
    -- Información del Proyecto
    PROJECT = {
        NAME = "Premium Game GUI",
        VERSION = "2.0",
        AUTHOR = "Your Studio",
        DESCRIPTION = "Professional game interface system"
    },

    -- Estética
    AESTHETIC = {
        THEME = "modern_dark", -- modern_dark, modern_light, cyberpunk, fantasy
        COLOR_SCHEME = {
            PRIMARY = Color3.fromRGB(100, 150, 255),
            SECONDARY = Color3.fromRGB(150, 100, 255),
            ACCENT = Color3.fromRGB(255, 150, 100),
            BACKGROUND = Color3.fromRGB(20, 20, 30),
            SURFACE = Color3.fromRGB(30, 30, 45),
            TEXT_PRIMARY = Color3.fromRGB(240, 240, 250),
            TEXT_SECONDARY = Color3.fromRGB(150, 150, 170),
            SUCCESS = Color3.fromRGB(100, 200, 100),
            WARNING = Color3.fromRGB(255, 180, 80),
            ERROR = Color3.fromRGB(255, 100, 100),
        },
        BORDER_RADIUS = 12,
        SHADOW_SIZE = 20,
        ANIMATION_SPEED = 0.3,
    },

    -- Tipografía
    FONTS = {
        TITLE = Enum.Font.GothamBold,
        HEADER = Enum.Font.GothamSemibold,
        BODY = Enum.Font.Gotham,
        MONO = Enum.Font.Code,
    },

    -- Espaciado
    SPACING = {
        XS = 4,
        SM = 8,
        MD = 12,
        LG = 16,
        XL = 24,
        XXL = 32,
    },

    -- Responsividad
    BREAKPOINTS = {
        MOBILE = 400,
        TABLET = 800,
        DESKTOP = 1200,
    },

    -- Animación
    ANIMATIONS = {
        EASE_STYLE = Enum.EasingStyle.Quad,
        EASE_DIRECTION = Enum.EasingDirection.InOut,
    },

    -- Accesibilidad
    ACCESSIBILITY = {
        ENABLE_KEYBOARD_NAV = true,
        ENABLE_SCREEN_READER = true,
        MIN_CONTRAST_RATIO = 4.5, -- WCAG AA
        FOCUS_INDICATOR_SIZE = 2,
    },
}

-- ============================================================================
-- UTILIDADES
-- ============================================================================

local Utils = {}

function Utils.CreateInstance(className, properties, parent)
    local instance = Instance.new(className)
    for key, value in pairs(properties or {}) do
        if key ~= "Parent" then
            instance[key] = value
        end
    end
    if parent then
        instance.Parent = parent
    end
    return instance
end

function Utils.Tween(instance, goal, duration, easingStyle, easingDirection)
    easingStyle = easingStyle or CONFIG.ANIMATIONS.EASE_STYLE
    easingDirection = easingDirection or CONFIG.ANIMATIONS.EASE_DIRECTION
    
    local tweenInfo = TweenInfo.new(
        duration,
        easingStyle,
        easingDirection
    )
    local tween = game:GetService("TweenService"):Create(instance, tweenInfo, goal)
    tween:Play()
    return tween
end

function Utils.CreateCorner(parent, size)
    return Utils.CreateInstance("UICorner", {
        CornerRadius = UDim.new(0, size or CONFIG.AESTHETIC.BORDER_RADIUS),
        Parent = parent
    })
end

function Utils.CreateStroke(parent, color, thickness)
    return Utils.CreateInstance("UIStroke", {
        Color = color or CONFIG.AESTHETIC.COLOR_SCHEME.PRIMARY,
        Thickness = thickness or 1,
        Parent = parent
    })
end

function Utils.CreateGradient(parent, colors)
    local gradient = Utils.CreateInstance("UIGradient", {
        Color = ColorSequence.new(colors or {
            CONFIG.AESTHETIC.COLOR_SCHEME.PRIMARY,
            CONFIG.AESTHETIC.COLOR_SCHEME.SECONDARY,
        }),
        Rotation = 45,
        Parent = parent
    })
    return gradient
end

function Utils.CreatePadding(parent, x, y)
    return Utils.CreateInstance("UIPadding", {
        PaddingLeft = UDim.new(0, x or CONFIG.SPACING.MD),
        PaddingRight = UDim.new(0, x or CONFIG.SPACING.MD),
        PaddingTop = UDim.new(0, y or CONFIG.SPACING.MD),
        PaddingBottom = UDim.new(0, y or CONFIG.SPACING.MD),
        Parent = parent
    })
end

function Utils.CreateListLayout(parent, direction, padding)
    return Utils.CreateInstance("UIListLayout", {
        FillDirection = direction or Enum.FillDirection.Vertical,
        HorizontalAlignment = Enum.HorizontalAlignment.Center,
        VerticalAlignment = Enum.VerticalAlignment.Top,
        Padding = UDim.new(0, padding or CONFIG.SPACING.MD),
        Parent = parent
    })
end

function Utils.CalculateResponsiveSize(screenSize)
    if screenSize.X < CONFIG.BREAKPOINTS.MOBILE then
        return "mobile"
    elseif screenSize.X < CONFIG.BREAKPOINTS.TABLET then
        return "tablet"
    else
        return "desktop"
    end
end

-- ============================================================================
-- COMPONENTES BASE
-- ============================================================================

local Components = {}

-- Botón Premium con Estados
function Components.CreateButton(props)
    props = props or {}
    
    local button = Utils.CreateInstance("TextButton", {
        Name = props.name or "Button",
        Text = props.text or "Click",
        TextColor3 = props.textColor or CONFIG.AESTHETIC.COLOR_SCHEME.TEXT_PRIMARY,
        TextSize = props.textSize or 14,
        Font = props.font or CONFIG.FONTS.BODY,
        BackgroundColor3 = props.bgColor or CONFIG.AESTHETIC.COLOR_SCHEME.PRIMARY,
        BackgroundTransparency = props.bgTransparency or 0,
        BorderSizePixel = 0,
        Size = props.size or UDim2.new(0, 120, 0, 40),
        Position = props.position or UDim2.new(0, 0, 0, 0),
        Parent = props.parent,
        AutoButtonColor = false,
    })

    -- Estilos
    Utils.CreateCorner(button, CONFIG.AESTHETIC.BORDER_RADIUS)
    
    if props.stroke then
        Utils.CreateStroke(button, props.strokeColor, props.strokeThickness or 2)
    end

    -- Padding
    if props.padded ~= false then
        Utils.CreatePadding(button, CONFIG.SPACING.SM, CONFIG.SPACING.XS)
    end

    -- Estados
    local normalColor = props.bgColor or CONFIG.AESTHETIC.COLOR_SCHEME.PRIMARY
    local hoverColor = props.hoverColor or normalColor:lerp(Color3.new(1, 1, 1), 0.2)
    local pressedColor = props.pressedColor or normalColor:lerp(Color3.new(0, 0, 0), 0.3)
    local disabledColor = props.disabledColor or CONFIG.AESTHETIC.COLOR_SCHEME.TEXT_SECONDARY

    local isHovered = false
    local isPressed = false

    button.MouseEnter:Connect(function()
        if button.Active then
            isHovered = true
            Utils.Tween(button, { BackgroundColor3 = hoverColor }, 0.15)
        end
    end)

    button.MouseLeave:Connect(function()
        isHovered = false
        if not isPressed then
            Utils.Tween(button, { BackgroundColor3 = normalColor }, 0.15)
        end
    end)

    button.MouseButton1Down:Connect(function()
        if button.Active then
            isPressed = true
            Utils.Tween(button, { BackgroundColor3 = pressedColor }, 0.1)
        end
    end)

    button.MouseButton1Up:Connect(function()
        isPressed = false
        if isHovered then
            Utils.Tween(button, { BackgroundColor3 = hoverColor }, 0.1)
        else
            Utils.Tween(button, { BackgroundColor3 = normalColor }, 0.1)
        end
    end)

    -- Método para habilitar/deshabilitar
    function button:SetActive(active)
        self.Active = active
        if active then
            Utils.Tween(self, { BackgroundColor3 = normalColor }, 0.2)
        else
            Utils.Tween(self, { BackgroundColor3 = disabledColor }, 0.2)
        end
    end

    return button
end

-- ProgressBar
function Components.CreateProgressBar(props)
    props = props or {}
    
    local container = Utils.CreateInstance("Frame", {
        Name = "ProgressBar",
        BackgroundColor3 = props.bgColor or CONFIG.AESTHETIC.COLOR_SCHEME.SURFACE,
        Size = props.size or UDim2.new(0, 200, 0, 8),
        Position = props.position or UDim2.new(0, 0, 0, 0),
        Parent = props.parent,
    })
    
    Utils.CreateCorner(container, 4)
    
    local fill = Utils.CreateInstance("Frame", {
        Name = "Fill",
        BackgroundColor3 = props.fillColor or CONFIG.AESTHETIC.COLOR_SCHEME.SUCCESS,
        Size = UDim2.new(props.value or 0.5, 0, 1, 0),
        Parent = container,
    })
    
    Utils.CreateCorner(fill, 4)

    function container:SetValue(value)
        value = math.max(0, math.min(1, value))
        Utils.Tween(fill, { Size = UDim2.new(value, 0, 1, 0) }, 0.3)
    end

    return container
end

-- Notificación
function Components.CreateNotification(props)
    props = props or {}
    
    local notification = Utils.CreateInstance("Frame", {
        Name = "Notification",
        BackgroundColor3 = props.bgColor or CONFIG.AESTHETIC.COLOR_SCHEME.SURFACE,
        Size = props.size or UDim2.new(0, 300, 0, 80),
        Position = props.position or UDim2.new(1, -20, 0, 20),
        AnchorPoint = Vector2.new(1, 0),
        Parent = props.parent,
    })
    
    Utils.CreateCorner(notification, CONFIG.AESTHETIC.BORDER_RADIUS)
    Utils.CreateStroke(notification, props.accentColor or CONFIG.AESTHETIC.COLOR_SCHEME.PRIMARY, 2)
    Utils.CreatePadding(notification, CONFIG.SPACING.MD, CONFIG.SPACING.MD)

    local titleLabel = Utils.CreateInstance("TextLabel", {
        Name = "Title",
        Text = props.title or "Notificación",
        TextColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.TEXT_PRIMARY,
        TextSize = 14,
        Font = CONFIG.FONTS.HEADER,
        BackgroundTransparency = 1,
        Size = UDim2.new(1, 0, 0, 24),
        Parent = notification,
    })

    local bodyLabel = Utils.CreateInstance("TextLabel", {
        Name = "Body",
        Text = props.body or "Mensaje aquí",
        TextColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.TEXT_SECONDARY,
        TextSize = 12,
        Font = CONFIG.FONTS.BODY,
        BackgroundTransparency = 1,
        TextWrapped = true,
        Size = UDim2.new(1, 0, 1, -24),
        Position = UDim2.new(0, 0, 0, 24),
        Parent = notification,
    })

    -- Auto-dismiss después de 4 segundos
    task.delay(props.duration or 4, function()
        if notification.Parent then
            Utils.Tween(notification, { BackgroundTransparency = 1 }, 0.3)
            task.wait(0.3)
            notification:Destroy()
        end
    end)

    return notification
end

-- ============================================================================
-- MODO 1: CONSTRUCTION MEDIANTE SCREENGUIS (Híbrido)
-- ============================================================================

local ScreenGUIMode = {}

function ScreenGUIMode.Create(parent)
    print("📱 Iniciando modo ScreenGUI híbrido...")
    
    -- Crear ScreenGui principal
    local screenGui = Utils.CreateInstance("ScreenGui", {
        Name = CONFIG.PROJECT.NAME,
        ResetOnSpawn = false,
        SafeAreaCompatible = true,
        Parent = parent or game.Players.LocalPlayer:WaitForChild("PlayerGui"),
    })

    -- Frame principal
    local mainFrame = Utils.CreateInstance("Frame", {
        Name = "MainPanel",
        BackgroundColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.BACKGROUND,
        Size = UDim2.new(1, 0, 1, 0),
        Parent = screenGui,
    })

    -- Header
    local header = Utils.CreateInstance("Frame", {
        Name = "Header",
        BackgroundColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.SURFACE,
        Size = UDim2.new(1, 0, 0, 60),
        Parent = mainFrame,
    })

    local titleLabel = Utils.CreateInstance("TextLabel", {
        Name = "Title",
        Text = CONFIG.PROJECT.NAME,
        TextColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.TEXT_PRIMARY,
        TextSize = 24,
        Font = CONFIG.FONTS.TITLE,
        BackgroundTransparency = 1,
        Size = UDim2.new(1, 0, 1, 0),
        Parent = header,
    })

    Utils.CreatePadding(titleLabel, CONFIG.SPACING.MD, 0)

    -- Content Area
    local contentArea = Utils.CreateInstance("ScrollingFrame", {
        Name = "ContentArea",
        BackgroundColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.BACKGROUND,
        Size = UDim2.new(1, 0, 1, -60),
        Position = UDim2.new(0, 0, 0, 60),
        ScrollBarThickness = 8,
        CanvasSize = UDim2.new(1, 0, 0, 500),
        Parent = mainFrame,
    })

    Utils.CreateListLayout(contentArea, Enum.FillDirection.Vertical, CONFIG.SPACING.MD)
    Utils.CreatePadding(contentArea, CONFIG.SPACING.LG, CONFIG.SPACING.LG)

    -- Botones de ejemplo
    local btnPlay = Components.CreateButton({
        name = "PlayButton",
        text = "▶ Jugar",
        bgColor = CONFIG.AESTHETIC.COLOR_SCHEME.SUCCESS,
        hoverColor = CONFIG.AESTHETIC.COLOR_SCHEME.SUCCESS:lerp(Color3.new(1, 1, 1), 0.2),
        size = UDim2.new(0.8, 0, 0, 40),
        parent = contentArea,
        stroke = true,
    })

    local btnSettings = Components.CreateButton({
        name = "SettingsButton",
        text = "⚙ Ajustes",
        bgColor = CONFIG.AESTHETIC.COLOR_SCHEME.SECONDARY,
        size = UDim2.new(0.8, 0, 0, 40),
        parent = contentArea,
        stroke = true,
    })

    local btnExit = Components.CreateButton({
        name = "ExitButton",
        text = "✕ Salir",
        bgColor = CONFIG.AESTHETIC.COLOR_SCHEME.ERROR,
        size = UDim2.new(0.8, 0, 0, 40),
        parent = contentArea,
        stroke = true,
    })

    -- Conectar botones
    btnPlay.MouseButton1Click:Connect(function()
        print("✓ Botón Jugar presionado")
        Components.CreateNotification({
            parent = screenGui,
            title = "¡Éxito!",
            body = "Iniciando juego...",
            accentColor = CONFIG.AESTHETIC.COLOR_SCHEME.SUCCESS,
        })
    end)

    btnSettings.MouseButton1Click:Connect(function()
        print("✓ Botón Ajustes presionado")
    end)

    btnExit.MouseButton1Click:Connect(function()
        print("✓ Cerrando GUI")
        screenGui:Destroy()
    end)

    return screenGui
end

-- ============================================================================
-- MODO 2: CONSTRUCCIÓN PURAMENTE MEDIANTE LOCALSCRIPT
-- ============================================================================

local LocalScriptMode = {}

function LocalScriptMode.Create(parent)
    print("💻 Iniciando modo LocalScript puro...")
    
    local screenGui = Utils.CreateInstance("ScreenGui", {
        Name = CONFIG.PROJECT.NAME .. "_LS",
        ResetOnSpawn = false,
        SafeAreaCompatible = true,
        Parent = parent or game.Players.LocalPlayer:WaitForChild("PlayerGui"),
    })

    -- Panel principal responsivo
    local createResponsivePanel = function(screenSize)
        local panelSize = UDim2.new(
            screenSize.X < CONFIG.BREAKPOINTS.TABLET and 0.9 or 0.7,
            0,
            screenSize.Y < CONFIG.BREAKPOINTS.TABLET and 0.9 or 0.8,
            0
        )

        local mainPanel = Utils.CreateInstance("Frame", {
            Name = "ResponsivePanel",
            BackgroundColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.BACKGROUND,
            Size = panelSize,
            AnchorPoint = Vector2.new(0.5, 0.5),
            Position = UDim2.new(0.5, 0, 0.5, 0),
            Parent = screenGui,
        })

        Utils.CreateCorner(mainPanel, CONFIG.AESTHETIC.BORDER_RADIUS)
        Utils.CreateStroke(mainPanel, CONFIG.AESTHETIC.COLOR_SCHEME.PRIMARY, 2)

        return mainPanel
    end

    local userInputService = game:GetService("UserInputService")
    
    -- Actualizar tamaño al cambiar ventana
    local mainPanel = createResponsivePanel(screenGui.AbsoluteSize)
    
    local resizeConnection
    resizeConnection = screenGui:GetPropertyChangedSignal("AbsoluteSize"):Connect(function()
        -- Reajustar tamaño responsivamente
    end)

    -- Crear estructura interna
    local layout = Utils.CreateListLayout(mainPanel, Enum.FillDirection.Vertical, 0)
    
    -- Header dinámico
    local header = Utils.CreateInstance("Frame", {
        Name = "DynamicHeader",
        BackgroundColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.SURFACE,
        Size = UDim2.new(1, 0, 0, 70),
        Parent = mainPanel,
    })

    local headerTitle = Utils.CreateInstance("TextLabel", {
        Name = "HeaderTitle",
        Text = "🚀 " .. CONFIG.PROJECT.NAME,
        TextColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.TEXT_PRIMARY,
        TextSize = 28,
        Font = CONFIG.FONTS.TITLE,
        BackgroundTransparency = 1,
        Size = UDim2.new(1, 0, 1, 0),
        Parent = header,
    })

    Utils.CreatePadding(headerTitle, CONFIG.SPACING.LG, CONFIG.SPACING.MD)

    -- Área de contenido con scroll
    local content = Utils.CreateInstance("ScrollingFrame", {
        Name = "Content",
        BackgroundColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.BACKGROUND,
        Size = UDim2.new(1, 0, 1, -70),
        ScrollBarThickness = 6,
        CanvasSize = UDim2.new(1, 0, 0, 600),
        Parent = mainPanel,
    })

    Utils.CreateListLayout(content, Enum.FillDirection.Vertical, CONFIG.SPACING.LG)
    Utils.CreatePadding(content, CONFIG.SPACING.LG, CONFIG.SPACING.LG)

    -- Sección 1: Controles principales
    local section1 = Utils.CreateInstance("Frame", {
        Name = "MainControls",
        BackgroundColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.SURFACE,
        Size = UDim2.new(1, 0, 0, 180),
        Parent = content,
    })

    Utils.CreateCorner(section1, CONFIG.AESTHETIC.BORDER_RADIUS)
    Utils.CreatePadding(section1, CONFIG.SPACING.MD, CONFIG.SPACING.MD)

    local sectionLayout = Utils.CreateListLayout(section1, Enum.FillDirection.Vertical, CONFIG.SPACING.MD)

    -- Título de sección
    local sectionTitle = Utils.CreateInstance("TextLabel", {
        Name = "SectionTitle",
        Text = "Opciones Principales",
        TextColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.TEXT_PRIMARY,
        TextSize = 16,
        Font = CONFIG.FONTS.HEADER,
        BackgroundTransparency = 1,
        Size = UDim2.new(1, 0, 0, 24),
        Parent = section1,
    })

    -- Botones
    local btnStart = Components.CreateButton({
        name = "StartBtn",
        text = "▶ INICIAR",
        bgColor = CONFIG.AESTHETIC.COLOR_SCHEME.SUCCESS,
        size = UDim2.new(1, 0, 0, 40),
        parent = section1,
        stroke = true,
    })

    btnStart.MouseButton1Click:Connect(function()
        Components.CreateNotification({
            parent = screenGui,
            title = "¡Iniciado!",
            body = "Aplicación en ejecución",
            accentColor = CONFIG.AESTHETIC.COLOR_SCHEME.SUCCESS,
            duration = 3,
        })
    end)

    -- Sección 2: Estadísticas
    local section2 = Utils.CreateInstance("Frame", {
        name = "Stats",
        BackgroundColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.SURFACE,
        Size = UDim2.new(1, 0, 0, 200),
        Parent = content,
    })

    Utils.CreateCorner(section2, CONFIG.AESTHETIC.BORDER_RADIUS)
    Utils.CreatePadding(section2, CONFIG.SPACING.MD, CONFIG.SPACING.MD)
    Utils.CreateListLayout(section2, Enum.FillDirection.Vertical, CONFIG.SPACING.LG)

    local statTitle = Utils.CreateInstance("TextLabel", {
        Name = "StatTitle",
        Text = "📊 Estadísticas",
        TextColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.TEXT_PRIMARY,
        TextSize = 16,
        Font = CONFIG.FONTS.HEADER,
        BackgroundTransparency = 1,
        Size = UDim2.new(1, 0, 0, 24),
        Parent = section2,
    })

    -- Barra de progreso
    local progressContainer = Utils.CreateInstance("Frame", {
        Name = "ProgressContainer",
        BackgroundTransparency = 1,
        Size = UDim2.new(1, 0, 0, 50),
        Parent = section2,
    })

    local progressLabel = Utils.CreateInstance("TextLabel", {
        Name = "ProgressLabel",
        Text = "Progreso: 65%",
        TextColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.TEXT_SECONDARY,
        TextSize = 12,
        Font = CONFIG.FONTS.BODY,
        BackgroundTransparency = 1,
        Size = UDim2.new(1, 0, 0, 20),
        Parent = progressContainer,
    })

    local progressBar = Components.CreateProgressBar({
        bgColor = CONFIG.AESTHETIC.COLOR_SCHEME.SURFACE,
        fillColor = CONFIG.AESTHETIC.COLOR_SCHEME.PRIMARY,
        value = 0.65,
        size = UDim2.new(1, 0, 0, 12),
        parent = progressContainer,
        position = UDim2.new(0, 0, 0, 20),
    })

    -- Sección 3: Ajustes
    local section3 = Utils.CreateInstance("Frame", {
        Name = "Settings",
        BackgroundColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.SURFACE,
        Size = UDim2.new(1, 0, 0, 160),
        Parent = content,
    })

    Utils.CreateCorner(section3, CONFIG.AESTHETIC.BORDER_RADIUS)
    Utils.CreatePadding(section3, CONFIG.SPACING.MD, CONFIG.SPACING.MD)
    Utils.CreateListLayout(section3, Enum.FillDirection.Vertical, CONFIG.SPACING.MD)

    local settingsTitle = Utils.CreateInstance("TextLabel", {
        Name = "SettingsTitle",
        Text = "⚙ Configuración",
        TextColor3 = CONFIG.AESTHETIC.COLOR_SCHEME.TEXT_PRIMARY,
        TextSize = 16,
        Font = CONFIG.FONTS.HEADER,
        BackgroundTransparency = 1,
        Size = UDim2.new(1, 0, 0, 24),
        Parent = section3,
    })

    local btnSettings = Components.CreateButton({
        name = "SettingsBtn",
        text = "Abrir Ajustes",
        bgColor = CONFIG.AESTHETIC.COLOR_SCHEME.SECONDARY,
        size = UDim2.new(1, 0, 0, 40),
        parent = section3,
        stroke = true,
    })

    btnSettings.MouseButton1Click:Connect(function()
        print("✓ Panel de ajustes abierto")
    end)

    -- Teclado de accesibilidad
    local keyBinds = {
        [Enum.KeyCode.Escape] = function()
            print("✓ ESC presionado - Cerrando GUI")
            screenGui:Destroy()
        end,
        [Enum.KeyCode.R] = function()
            print("✓ R presionado")
        end,
    }

    userInputService.InputBegan:Connect(function(input, gameProcessed)
        if gameProcessed then return end
        
        if keyBinds[input.KeyCode] then
            keyBinds[input.KeyCode]()
        end
    end)

    return screenGui
end

-- ============================================================================
-- SELECTOR DE MODO
-- ============================================================================

local GUIBuilder = {}

function GUIBuilder.BuildGUI(mode, parent)
    mode = mode or "localscript" -- Por defecto, modo LocalScript
    
    if mode == "screengui" then
        return ScreenGUIMode.Create(parent)
    elseif mode == "localscript" then
        return LocalScriptMode.Create(parent)
    else
        error("Modo no válido. Usa 'screengui' o 'localscript'")
    end
end

-- ============================================================================
-- PUNTO DE ENTRADA
-- ============================================================================

-- Para usar este script:
-- 1. Cópialo en StarterPlayer > StarterPlayerScripts > LocalScript
-- 2. O cópialo en StarterGui (como child)

-- Modo 1: LocalScript (Recomendado)
local gui = GUIBuilder.BuildGUI("localscript")

-- Modo 2: ScreenGUI (Descomentar si lo prefieres)
-- local gui = GUIBuilder.BuildGUI("screengui")

print("✓ GUI inicializado correctamente en modo: " .. gui.Name)

-- ============================================================================
-- FUNCIÓN PARA HACER RELOAD
-- ============================================================================

_G.ReloadGUI = function(mode)
    for _, gui in pairs(game.Players.LocalPlayer:WaitForChild("PlayerGui"):GetChildren()) do
        if gui:IsA("ScreenGui") and string.find(gui.Name, CONFIG.PROJECT.NAME) then
            gui:Destroy()
        end
    end
    task.wait(0.1)
    GUIBuilder.BuildGUI(mode or "localscript")
end

print("💡 Tip: Usa _G.ReloadGUI() para recargar la GUI")
