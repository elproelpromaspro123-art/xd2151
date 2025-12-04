# 🎮 Referencia Rápida - Roblox GUI Premium

## 📦 Archivos Principales

```
ROBLOX_GUI_COMPLETE_TEMPLATE.lua  ← Tu script principal
ROBLOX_QUICK_REFERENCE.md          ← Tú estás aquí
ETHICAL_PRINCIPLES_FRAMEWORK.md    ← Guía ética
```

---

## 🚀 Inicio Rápido (30 segundos)

### Opción A: LocalScript (Recomendado)
```
1. Abre Roblox Studio
2. StarterPlayer → StarterPlayerScripts → LocalScript (nuevo)
3. Copia contenido de ROBLOX_GUI_COMPLETE_TEMPLATE.lua
4. Ejecuta el juego (F5)
```

### Opción B: ScreenGUI
```
1. StarterGui → + ScreenGui
2. Copia Lua de modo SCREENGUI
3. Crea LocalScript dentro del ScreenGui
4. Pega el código
```

---

## 🎨 Personalización en 60 Segundos

### Cambiar Colores
```lua
-- Línea ~25: Edita COLOR_SCHEME
PRIMARY = Color3.fromRGB(100, 150, 255),    -- Tu color azul
SECONDARY = Color3.fromRGB(150, 100, 255),  -- Tu color secundario
```

### Cambiar Título
```lua
-- Línea ~6: Edita PROJECT
NAME = "Mi Juego Épico",
```

### Cambiar Botones
```lua
-- Busca "CreateButton" y agrega nuevos:
local btnMiBoton = Components.CreateButton({
    name = "MiBoton",
    text = "Mi Acción",
    bgColor = CONFIG.AESTHETIC.COLOR_SCHEME.SUCCESS,
    size = UDim2.new(0.8, 0, 0, 40),
    parent = contentArea,
})

btnMiBoton.MouseButton1Click:Connect(function()
    print("¡Mi botón fue clickeado!")
    -- Tu código aquí
end)
```

---

## 💡 Componentes Disponibles

### TextButton (Botón)
```lua
local btn = Components.CreateButton({
    name = "NombreBoton",
    text = "Texto del Botón",
    bgColor = Color3.fromRGB(100, 150, 255),
    hoverColor = Color3.fromRGB(120, 170, 255),
    size = UDim2.new(0.8, 0, 0, 40),
    parent = parentFrame,
    stroke = true,  -- Con borde
    padded = true,  -- Con padding
})
```

### ProgressBar (Barra de Progreso)
```lua
local bar = Components.CreateProgressBar({
    bgColor = Color3.fromRGB(50, 50, 60),
    fillColor = Color3.fromRGB(100, 200, 100),
    value = 0.65,  -- 65% lleno
    size = UDim2.new(1, 0, 0, 12),
    parent = parentFrame,
})

-- Actualizar valor
bar:SetValue(0.80)  -- Cambia a 80%
```

### Notificación
```lua
Components.CreateNotification({
    parent = screenGui,
    title = "¡Éxito!",
    body = "Acción completada correctamente",
    accentColor = Color3.fromRGB(100, 200, 100),
    duration = 3,  -- Segundos antes de desaparecer
})
```

---

## 🎯 Casos de Uso Comunes

### Menú Principal
```lua
-- Usa LocalScriptMode.Create()
-- Agregar botones: Jugar, Ajustes, Créditos

local btnPlay = Components.CreateButton({...})
btnPlay.MouseButton1Click:Connect(function()
    -- Iniciar juego
    game.Players.LocalPlayer.Character:MoveTo(Vector3.new(0, 50, 0))
end)
```

### Panel de Inventario
```lua
-- Crear frame con ScrollingFrame
local content = Utils.CreateInstance("ScrollingFrame", {...})

-- Listar items
for _, item in pairs(playerInventory) do
    local itemFrame = Components.CreateButton({...})
    itemFrame.Parent = content
end
```

### HUD de Juego
```lua
-- Mostrar vida, maná, experiencia
local healthBar = Components.CreateProgressBar({...})
healthBar:SetValue(player.Health / player.MaxHealth)
```

### Shop/Tienda
```lua
-- Mostrar productos con precios
local shopItems = {{name="Espada", price=100}, {...}}

for _, item in pairs(shopItems) do
    local itemBtn = Components.CreateButton({
        text = item.name .. " - $" .. item.price,
        parent = shopContent
    })
end
```

---

## 🔧 Funciones Útiles

### Crear Frame con Esquinas Redondas
```lua
local frame = Utils.CreateInstance("Frame", {...})
Utils.CreateCorner(frame, 12)  -- Radio 12 píxeles
```

### Animar Elemento
```lua
-- Cambiar color suavemente en 0.3 segundos
Utils.Tween(frame, {BackgroundColor3 = newColor}, 0.3)
```

### Crear Padding (Espaciado Interno)
```lua
-- 16px izq/der, 12px arriba/abajo
Utils.CreatePadding(frame, 16, 12)
```

### Crear Layout (Organizar Elementos)
```lua
-- Organizar verticalmente con 12px entre elementos
Utils.CreateListLayout(frame, Enum.FillDirection.Vertical, 12)
```

---

## 📊 Tabla de Colores Predefinidos

```lua
-- En CONFIG.AESTHETIC.COLOR_SCHEME:

PRIMARY       = Color3.fromRGB(100, 150, 255)   -- Azul
SECONDARY     = Color3.fromRGB(150, 100, 255)   -- Púrpura
ACCENT        = Color3.fromRGB(255, 150, 100)   -- Naranja
BACKGROUND    = Color3.fromRGB(20, 20, 30)      -- Negro profundo
SURFACE       = Color3.fromRGB(30, 30, 45)      -- Gris oscuro
TEXT_PRIMARY   = Color3.fromRGB(240, 240, 250)  -- Blanco suave
TEXT_SECONDARY = Color3.fromRGB(150, 150, 170)  -- Gris claro
SUCCESS       = Color3.fromRGB(100, 200, 100)   -- Verde
WARNING       = Color3.fromRGB(255, 180, 80)    -- Naranja
ERROR         = Color3.fromRGB(255, 100, 100)   -- Rojo
```

### Crear Color Personalizado
```lua
local miColor = Color3.fromRGB(r, g, b)
-- r, g, b: 0-255

-- Ejemplos:
Color3.fromRGB(255, 0, 0)      -- Rojo puro
Color3.fromRGB(0, 255, 0)      -- Verde puro
Color3.fromRGB(0, 0, 255)      -- Azul puro
Color3.fromRGB(255, 255, 255)  -- Blanco
Color3.fromRGB(0, 0, 0)        -- Negro
```

---

## 🎬 Animaciones

### Fade In/Out
```lua
-- Aparecer
Utils.Tween(frame, {BackgroundTransparency = 0}, 0.3)

-- Desaparecer
Utils.Tween(frame, {BackgroundTransparency = 1}, 0.3)
```

### Scale (Crecer/Encoger)
```lua
-- Agrandar
Utils.Tween(frame, {Size = UDim2.new(0, 300, 0, 300)}, 0.3)

-- Encoger
Utils.Tween(frame, {Size = UDim2.new(0, 100, 0, 100)}, 0.3)
```

### Mover
```lua
-- Deslizar a nueva posición
Utils.Tween(frame, {Position = UDim2.new(0.5, 0, 0.5, 0)}, 0.5)
```

---

## ⌨️ Navegación por Teclado

```lua
-- Ya implementado en el script
-- Teclas disponibles:
ESC    → Cierra GUI
R      → Personalizable (ver keyBinds)

-- Agregar nueva tecla:
local keyBinds = {
    [Enum.KeyCode.Escape] = function()
        screenGui:Destroy()
    end,
    [Enum.KeyCode.E] = function()
        print("Tecla E presionada")
    end,
}
```

---

## 📱 Responsividad

El sistema detecta automáticamente:
```lua
CONFIG.BREAKPOINTS = {
    MOBILE = 400,    -- < 400px: mobile
    TABLET = 800,    -- 400-800px: tablet
    DESKTOP = 1200,  -- > 800px: desktop
}
```

Para adaptar UI:
```lua
local screenSize = screenGui.AbsoluteSize
if screenSize.X < CONFIG.BREAKPOINTS.MOBILE then
    -- Modo teléfono
elseif screenSize.X < CONFIG.BREAKPOINTS.TABLET then
    -- Modo tablet
else
    -- Modo desktop
end
```

---

## 🐛 Debugging

### Ver Logs
```lua
-- Abre Output (View → Output)
-- Los logs aparecen automáticamente

print("✓ Mensaje")
warn("⚠ Advertencia")
error("❌ Error")
```

### Recargar GUI
```lua
-- En Command Bar:
_G.ReloadGUI()

-- Recargar con modo específico:
_G.ReloadGUI("localscript")
_G.ReloadGUI("screengui")
```

### Verificar Estructura
```lua
-- Ver la jerarquía en Explorer
-- Click derecho en ScreenGui → Properties
```

---

## ⚡ Consejos de Performance

### ✅ Hacer
```lua
-- Usar memoización
local colorCache = {}

-- Reutilizar instancias
local buttonTemplate = Components.CreateButton({...})

-- Usar conexiones locales
local myConnection = button.MouseButton1Click:Connect(function()
    myConnection:Disconnect()  -- Desconectar cuando no se necesite
end)
```

### ❌ NO Hacer
```lua
-- Crear elementos en bucles sin control
for i = 1, 1000 do
    Components.CreateButton({...})  -- ❌ Muy pesado
end

-- Usar task.wait(0) en bucles rápidos
while true do
    task.wait(0)  -- ❌ Consumirá CPU
    -- Hacer algo
end

-- Conectar eventos sin desconectar
for i = 1, 100 do
    button.MouseButton1Click:Connect(function()
        print(i)  -- ❌ Memory leak
    end)
end
```

---

## 🎓 Ejemplos Completos

### Ejemplo 1: Contador Interactivo
```lua
local counterValue = 0

local btnIncrement = Components.CreateButton({
    name = "IncrementBtn",
    text = "➕ " .. counterValue,
    parent = contentArea,
})

btnIncrement.MouseButton1Click:Connect(function()
    counterValue = counterValue + 1
    btnIncrement.Text = "➕ " .. counterValue
end)
```

### Ejemplo 2: Modal de Confirmación
```lua
local function ShowConfirmation(title, message, onConfirm)
    local modal = Utils.CreateInstance("Frame", {
        Name = "ConfirmationModal",
        Size = UDim2.new(0, 300, 0, 150),
        AnchorPoint = Vector2.new(0.5, 0.5),
        Position = UDim2.new(0.5, 0, 0.5, 0),
        Parent = screenGui,
    })
    
    local btnYes = Components.CreateButton({
        text = "Sí",
        parent = modal,
    })
    
    btnYes.MouseButton1Click:Connect(function()
        onConfirm()
        modal:Destroy()
    end)
end
```

### Ejemplo 3: Progress en Tiempo Real
```lua
local progress = 0
local bar = Components.CreateProgressBar({
    value = progress,
    parent = contentArea,
})

-- Incrementar progreso cada 0.1 segundos
task.spawn(function()
    while progress < 1 do
        progress = progress + 0.01
        bar:SetValue(progress)
        task.wait(0.1)
    end
end)
```

---

## 📚 Recursos Adicionales

- **Marco Ético:** `ETHICAL_PRINCIPLES_FRAMEWORK.md`
- **Guía Completa:** `COMPLETE_INTEGRATION_GUIDE.md`
- **Documentación Roblox:** https://create.roblox.com/docs
- **Color Picker:** https://www.rapidtables.com/web/color/RGB_Color.html

---

## 🆘 Preguntas Frecuentes

**P: ¿Cómo cambio el tamaño de los botones?**
R: Edita `size = UDim2.new(0, 120, 0, 40)` en CreateButton

**P: ¿Cómo agrego más secciones?**
R: Crea nuevo `Frame` en `contentArea` y agrega contenido

**P: ¿Cómo conecto un botón a una función?**
R: Usa `btn.MouseButton1Click:Connect(function() ... end)`

**P: ¿Cómo guardo datos del usuario?**
R: Usa `DataStoreService` de Roblox (no incluido aquí)

**P: ¿Puedo usar esto en otros juegos?**
R: Sí, es completamente reutilizable. Solo copia el archivo.

---

**Hecho con ❤️ para desarrolladores de Roblox**

*Última actualización: Diciembre 2024*
