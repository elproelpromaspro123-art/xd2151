# Validación de Código Roblox - Checklist de Errores Naranja

Este archivo define cómo validar código Roblox para evitar errores naranja (orange warnings).

## 🔴 Errores Naranja Más Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Function undefined` | Usas función antes de definirla | Declara función ANTES |
| `Variable undefined` | Usas variable sin inicializar | Declara variable ANTES |
| `Cannot index nil` | Accedes a propiedad de nil | Valida antes de usar |
| `Forward reference` | Llamas función que aún no existe | Pre-declara o usa tabla |

## ✅ Validación de Orden de Declaración

### Paso 1: Identificar todas las funciones
```lua
❌ Código problemático:
functionA()        -- ← Donde se usa

local function functionA()  -- ← Donde se define
end
```

### Paso 2: Reorganizar
```lua
✅ Código correcto:
local function functionA()  -- ← Defínir PRIMERO
end

functionA()        -- ← Usar DESPUÉS
```

## 🔍 Patrones a Validar

### Patrón 1: Funciones locales
```lua
-- ✅ CORRECTO
local function helper()
    return 42
end

local function main()
    return helper()  -- helper existe
end

main()

-- ❌ INCORRECTO
local function main()
    return helper()  -- helper no existe aún
end

local function helper()
    return 42
end

main()
```

### Patrón 2: Métodos de clase
```lua
-- ✅ CORRECTO
local Button = {}
Button.__index = Button

function Button:render()
    self:onClick()  -- onClick ya existe
end

function Button:onClick()
    print("Clicked")
end

-- ❌ INCORRECTO
local Button = {}
Button.__index = Button

function Button:render()
    self:onClick()  -- onClick no existe aún
end

function Button:onClick()
    print("Clicked")
end
```

### Patrón 3: Eventos con callbacks
```lua
-- ✅ CORRECTO
local function handleButtonClick()
    print("Button clicked")
end

local button = Instance.new("TextButton")
button.Activated:Connect(handleButtonClick)  -- handleButtonClick existe

-- ❌ INCORRECTO
local button = Instance.new("TextButton")
button.Activated:Connect(handleButtonClick)  -- handleButtonClick no existe aún

local function handleButtonClick()
    print("Button clicked")
end
```

### Patrón 4: Roact Components
```lua
-- ✅ CORRECTO
local Counter = Roact.Component:extend("Counter")

function Counter:init()
    self.state = {count = 0}
end

function Counter:increment()
    self:setState({count = self.state.count + 1})
end

function Counter:render()
    return Roact.createElement("TextButton", {
        [Roact.Event.Activated] = function()
            self:increment()  -- increment existe
        end
    })
end

-- ❌ INCORRECTO
local Counter = Roact.Component:extend("Counter")

function Counter:render()
    return Roact.createElement("TextButton", {
        [Roact.Event.Activated] = function()
            self:increment()  -- increment no existe aún
        end
    })
end

function Counter:increment()
    self:setState({count = self.state.count + 1})
end
```

### Patrón 5: Tablas (Forward references permitidas)
```lua
-- ✅ CORRECTO - Tablas permiten referencias cruzadas
local Module = {}

function Module.functionA()
    Module.functionB()  -- OK, usa tabla.función
end

function Module.functionB()
    return 42
end

-- ✅ TAMBIÉN CORRECTO - Pre-declarar
local functionA
local functionB

function functionA()
    functionB()
end

function functionB()
    return 42
end
```

## 📋 Flujo de Validación (para modelos IA)

1. **Leer código Roblox generado**
2. **Listar todas las funciones/métodos**
   ```
   - functionA() → línea 5
   - functionB() → línea 10
   - Class:method() → línea 15
   ```
3. **Listar todos los calls**
   ```
   - functionA() usado en línea 2
   - functionB() usado en línea 8
   - Class:method() usado en línea 12
   ```
4. **Validar orden**
   ```
   ❌ Si: línea de uso < línea de definición → ERROR NARANJA
   ✅ Si: línea de uso > línea de definición → OK
   ```

## 🛠️ Comandos para Validar

### En VS Code
1. Abre Script en Roblox Studio
2. Mira Output/Errors (esquina inferior)
3. Si ves errores naranja (warnings):
   - Pausa el script
   - Reorganiza funciones: **Defínir ANTES de usar**
   - Prueba nuevamente

### En Roblox Studio 2025
- Los errores naranja aparecen en: **View → Output** (símbolo ⚠️)
- Click en error naranja → Te lleva a la línea problemática
- Solución: Mueve la definición ARRIBA del uso

## 🎯 Garantía de Código Correcto

Si tu código cumple TODOS estos puntos, NO tendrá errores naranja:

- ✅ Toda `local function` está definida ANTES de ser usada
- ✅ Todo método de clase está definido ANTES de `render()`
- ✅ Todo callback está definido ANTES de `Connect()` o similar
- ✅ Si usas forward references, usas tablas (Module.function)
- ✅ No hay variables undefined
- ✅ No hay nil indexing sin validar

---

**Fecha de validación**: 5/12/2025 - Roblox Studio 2025.1
