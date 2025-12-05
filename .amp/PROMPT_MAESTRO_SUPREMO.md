# 🔱 PROMPT MAESTRO SUPREMO - Sistema de Generación de Código Roblox 100% Correcto

**VERSIÓN**: 2.0 - SUPREMA  
**EFECTIVO**: 5/12/2025  
**GARANTÍA**: Código 100% válido o reemplazo inmediato  

---

## 🎯 INSTRUCCIÓN EJECUTIVA PARA MODELOS IA

**ESTA ES LA VERDAD ABSOLUTA SOBRE CÓMO GENERAR CÓDIGO ROBLOX.**

Cuando alguien te pida un LocalScript o código Roblox, debes **OBLIGATORIAMENTE** seguir este protocolo. No es negociable. No es opcional. Es la ley.

---

## 🔴 PROTOCOLO OBLIGATORIO DE 3 FASES

### FASE 1: LECTURA OBLIGATORIA (ANTES de escribir una línea de código)

**DEBES leer EXACTAMENTE estos 7 archivos:**

1. ✅ **CONTRATO_ROBLOX.md** - Contrato vinculante sobre validación
2. ✅ **ROBLOX_DOCUMENTATION.md** - API de Roblox completa
3. ✅ **ROBLOX_VALIDATION.md** - Cómo validar código (errores naranja)
4. ✅ **ROBLOX_API_REAL.md** - Propiedades/métodos/eventos VÁLIDOS
5. ✅ **ESTRATEGIA_GENERACION.md** - Metodología de 6 pasos
6. ✅ **SOLUCION_ERRORES_OMEGA.md** - Garantía de código sin errores
7. ✅ **PROTOCOLO_VISIBLE.md** - Cómo demostrar que lo hiciste

**Si NO lees TODOS = Tu código será RECHAZADO.**

### FASE 2: ANÁLISIS PREVIO (MAPEO DE VARIABLES Y FLUJO)

**ANTES de generar código, DEBES:**

1. **Identificar TODAS las variables:**
   ```
   Variables que usaré:
   - [Nombre] (tipo): Declarada en línea X, usada en líneas Y, Z
   - ¿Puede ser nil? [SÍ/NO]
   - ¿Dónde se valida? [Línea N]
   ```

2. **Mapear validaciones necesarias:**
   ```
   Para cada variable que PUEDE ser nil:
   - Añadir: if not Variable then ... end
   - O: if Variable and Variable.property then ... end
   - Antes de CUALQUIER uso
   ```

3. **Planificar estructura:**
   ```
   ZONA 1 (líneas 1-20):   Variables locales + servicios
   ZONA 2 (líneas 21-50):  Funciones helper
   ZONA 3 (líneas 51-100): Métodos de clase/tabla
   ZONA 4 (líneas 101-150): Event handlers + callbacks
   ZONA 5 (líneas 151+):   Inicialización y main logic
   ```

4. **Verificar orden de declaración:**
   ```
   ✅ Función A se define en línea 10
   ✅ Función A se usa en línea 30
   ✅ (10 < 30 = Correcto)
   
   ❌ Función B se usa en línea 5
   ❌ Función B se define en línea 20
   ❌ (5 < 20 = ERROR NARANJA - Rechazado)
   ```

### FASE 3: GENERACIÓN CON VALIDACIONES

**REGLA 1: Validar SIEMPRE antes de usar**
```lua
-- ❌ NUNCA HAGAS ESTO
local function Create()
    for k, v in pairs(Config) do
        print(v)
    end
end

-- ✅ SIEMPRE HAZ ESTO
local function Create()
    if not Config then
        Config = {}
    end
    for k, v in pairs(Config) do
        print(v)
    end
end
```

**REGLA 2: Definir ANTES de usar**
```lua
-- ❌ NUNCA HAGAS ESTO
Init()
local function Init() end

-- ✅ SIEMPRE HAZ ESTO
local function Init() end
Init()
```

**REGLA 3: Validación en cascada**
```lua
-- ✅ PATRÓN CORRECTO
local player = game.Players.LocalPlayer
if not player then
    warn("No player found")
    return
end

local char = player.Character
if not char then
    warn("No character found")
    return
end

local humanoid = char:FindFirstChild("Humanoid")
if not humanoid then
    warn("No humanoid found")
    return
end
-- Ahora es SEGURO usar humanoid
```

---

## 🎓 CÓMO ESTRUCTURAR EL CÓDIGO (OBLIGATORIO)

**ESTRUCTURA DE 5 ZONAS - NO NEGOCIABLE:**

```lua
-- =====================================
-- ZONA 1: VARIABLES LOCALES (1-20)
-- =====================================
local Players = game:GetService("Players")
local player = Players.LocalPlayer
local UserInputService = game:GetService("UserInputService")

local config = {
    maxHealth = 100,
    items = {},
    enabled = true
}

-- =====================================
-- ZONA 2: FUNCIONES HELPER (21-50)
-- =====================================
local function validateConfig()
    if not config then
        warn("Config es nil, inicializando")
        config = {}
    end
    return config
end

local function getPlayer()
    if not player then
        warn("No hay jugador")
        return nil
    end
    return player
end

-- =====================================
-- ZONA 3: MÉTODOS DE CLASE (51-100)
-- =====================================
local Button = {}
Button.__index = Button

function Button:render()
    if not self.frame then
        warn("Frame no existe")
        return
    end
    self.frame.Visible = true
end

function Button:onClick()
    self:render()
end

-- =====================================
-- ZONA 4: EVENT HANDLERS (101-150)
-- =====================================
local function onPlayerLoaded()
    local p = getPlayer()
    if not p then return end
    print("Jugador cargado:", p.Name)
end

local function onInputBegan(input, gameProcessed)
    if gameProcessed then return end
    if input.KeyCode == Enum.KeyCode.R then
        print("R presionado")
    end
end

-- =====================================
-- ZONA 5: INICIALIZACIÓN (151+)
-- =====================================
if player then
    onPlayerLoaded()
else
    warn("No hay jugador para inicializar")
end

UserInputService.InputBegan:Connect(onInputBegan)
```

---

## 🔴 ERRORES ROJOS (NIL INDEXING) - PROHIBIDOS ABSOLUTAMENTE

**ERROR ROJO = Intento acceder a propiedad de nil**

```lua
-- ❌ ROJO: PROHIBIDO
local player = game.Players.LocalPlayer
player.leaderstats.Gold = 100  -- ¿leaderstats existe?

-- ✅ VERDE: CORRECTO
local player = game.Players.LocalPlayer
if player then
    local leaderstats = player:FindFirstChild("leaderstats")
    if leaderstats then
        local gold = leaderstats:FindFirstChild("Gold")
        if gold then
            gold.Value = 100
        end
    end
end
```

**PATTERN CORRECTO para acceso a propiedades:**
```lua
-- Usar siempre esta estructura:
local obj = something:FindFirstChild("Name")
if not obj then
    warn("Objeto no encontrado")
    return
end
-- Ahora es seguro usar obj
```

---

## ⚠️ ERRORES NARANJAS (FORWARD REFERENCES) - PROHIBIDOS ABSOLUTAMENTE

**ERROR NARANJA = Usar función/variable antes de definirla**

```lua
-- ❌ NARANJA: PROHIBIDO
functionA()  -- No existe aún
local function functionA()
    return 42
end

-- ✅ VERDE: CORRECTO
local function functionA()
    return 42
end
functionA()  -- Ya existe
```

**CHECKLIST DE ORDEN:**
- [ ] Todas las funciones `local function` definidas ANTES de usarlas
- [ ] Todos los métodos de clase definidos ANTES de `render()`
- [ ] Todos los callbacks definidos ANTES de `Connect()` o similar
- [ ] Sin forward references sin pre-declaración

---

## 📋 API VÁLIDA (PROPIEDADES REALES DE ROBLOX 2025)

**SOLO puedes usar propiedades que existen REALMENTE en Roblox.**

### Propiedades válidas de UICorner:
```lua
UICorner.CornerRadius = UDim.new(0, 8)  -- ✅ VÁLIDO

-- ❌ INVÁLIDO (NO EXISTEN):
-- UICorner.BorderRadius
-- UICorner.RoundCorners
```

### Propiedades válidas de UIStroke:
```lua
UIStroke.Color = Color3.new(1, 0, 0)        -- ✅ VÁLIDO
UIStroke.Thickness = 2                      -- ✅ VÁLIDO
UIStroke.Transparency = 0                   -- ✅ VÁLIDO

-- ❌ INVÁLIDO (NO EXISTEN):
-- UIStroke.ApplyToBorder
-- UIStroke.BorderRadius
```

### Propiedades válidas de TextButton/TextLabel:
```lua
obj.Text = "Texto"                                   -- ✅ VÁLIDO
obj.TextSize = 14                                    -- ✅ VÁLIDO
obj.TextColor3 = Color3.new(0, 0, 0)               -- ✅ VÁLIDO
obj.Font = Enum.Font.GothamBold                    -- ✅ VÁLIDO

-- ❌ INVÁLIDO (NO EXISTEN):
-- obj.FontSize (usa TextSize)
-- obj.FontColor (usa TextColor3)
```

### Eventos válidos:
```lua
obj.Activated:Connect(function() end)               -- ✅ VÁLIDO (TextButton)
obj.MouseButton1Click:Connect(function() end)       -- ✅ VÁLIDO
obj.MouseEnter:Connect(function() end)              -- ✅ VÁLIDO

-- ❌ INVÁLIDO (NO EXISTEN):
-- obj.OnClick (usa Activated o MouseButton1Click)
-- obj.Clicked
```

**REGLA DE ORO: Si no está en ROBLOX_API_REAL.md = NO EXISTE**

---

## 🛡️ VALIDACIÓN OBLIGATORIA

### Paso 1: Verificar Funciones
```
[ ] ¿Todas las funciones se definen ANTES de usarlas?
    Línea de definición < Línea de uso
```

### Paso 2: Verificar Variables
```
[ ] ¿Se valida Config antes de usar?
[ ] ¿Se valida player antes de usar?
[ ] ¿Se valida cada objeto encontrado con FindFirstChild?
[ ] ¿No hay pairs(nil)?
[ ] ¿No hay acceso a propiedades sin validación?
```

### Paso 3: Verificar Propiedades
```
[ ] ¿Todas las propiedades existen en ROBLOX_API_REAL.md?
[ ] ¿No usé propiedades renombradas? (ej: FontSize → TextSize)
[ ] ¿No usé eventos que no existen?
```

### Paso 4: Verificar Estructura
```
[ ] Zona 1: Variables (líneas 1-20)
[ ] Zona 2: Funciones (líneas 21-50)
[ ] Zona 3: Métodos (líneas 51-100)
[ ] Zona 4: Handlers (líneas 101-150)
[ ] Zona 5: Init (líneas 151+)
```

---

## 🚀 CÓMO MOSTRAR EL PROTOCOLO (VISIBLE)

**Cuando generes código, DEBES mostrar EXPLÍCITAMENTE:**

### 1. Lectura de documentación
```
📖 FASE 1: LECTURA OBLIGATORIA
✅ Leo CONTRATO_ROBLOX.md
✅ Leo ROBLOX_DOCUMENTATION.md
✅ Leo ROBLOX_VALIDATION.md
✅ Leo ROBLOX_API_REAL.md
✅ Leo ESTRATEGIA_GENERACION.md
✅ Leo SOLUCION_ERRORES_OMEGA.md
✅ Leo PROTOCOLO_VISIBLE.md
```

### 2. Análisis de variables
```
📊 FASE 2: ANÁLISIS
Variables identificadas:
- Config (tabla): puede ser nil → validar
- player (Player): puede ser nil → validar
- frame (GuiObject): puede ser nil → validar
```

### 3. Plan de validaciones
```
🛡️ VALIDACIONES PLANEADAS:
- Config: if not Config then Config = {} end
- player: if not player then return end
- frame: if not self.frame then return end
```

### 4. Verificación del código
```
🔍 POST-VALIDACIÓN:
✅ Funciones definidas ANTES de usarlas
✅ Variables validadas ANTES de usarlas
✅ Sin forward references
✅ Solo propiedades válidas
```

### 5. Resultado final
```
📋 CHECKLIST FINAL:
- [✅] Lectura obligatoria completada
- [✅] Variables identificadas y validadas
- [✅] Propiedades verificadas en ROBLOX_API_REAL.md
- [✅] Orden correcto (Vars → Funciones → Handlers → Init)
- [✅] Listo para Studio
```

---

## 📊 CHECKLIST OBLIGATORIO (ANTES DE ENTREGAR)

```
LECTURA:
[ ] ¿Leí CONTRATO_ROBLOX.md?
[ ] ¿Leí ROBLOX_DOCUMENTATION.md?
[ ] ¿Leí ROBLOX_VALIDATION.md?
[ ] ¿Leí ROBLOX_API_REAL.md?
[ ] ¿Leí ESTRATEGIA_GENERACION.md?
[ ] ¿Leí SOLUCION_ERRORES_OMEGA.md?
[ ] ¿Leí PROTOCOLO_VISIBLE.md?

ERRORES ROJOS (Nil indexing):
[ ] ¿Valido variables ANTES de usarlas?
[ ] ¿Valido ANTES de iterar con pairs()?
[ ] ¿No hay acceso a nil sin validación?
[ ] ¿No hay pairs(nil)?

ERRORES NARANJAS (Forward references):
[ ] ¿Funciones definidas ANTES de usarlas?
[ ] ¿Callbacks definidos ANTES de Connect()?
[ ] ¿Sin forward references?

PROPIEDADES VÁLIDAS:
[ ] ¿Todas son de ROBLOX_API_REAL.md?
[ ] ¿No usé propiedades renombradas?
[ ] ¿No usé eventos que no existen?

ESTRUCTURA:
[ ] Zona 1 (vars): líneas 1-20
[ ] Zona 2 (funciones): líneas 21-50
[ ] Zona 3 (métodos): líneas 51-100
[ ] Zona 4 (handlers): líneas 101-150
[ ] Zona 5 (init): líneas 151+

VALIDACIÓN FINAL:
[ ] npm run validate:lua: ✅ SIN ERRORES
[ ] npm run validate:api: ✅ API VÁLIDA
[ ] Listo para Studio
```

---

## ❌ ERRORES QUE GARANTIZO NO OCURRIRÁN

Si sigo este protocolo, **JURO QUE NO HABRÁ:**

❌ `pairs(nil)` error  
❌ `attempt to index nil` error  
❌ Forward reference errors  
❌ Undefined variable errors  
❌ Undefined function errors  
❌ Invalid property errors  
❌ Invalid event errors  
❌ Syntax errors  

**O REEMPLAZO INMEDIATO.**

---

## 🎯 GARANTÍA FINAL

### Si cumplo:
1. ✅ Lectura de 7 archivos (visible en reasoning)
2. ✅ Análisis de variables (visible)
3. ✅ Plan de validaciones (visible)
4. ✅ Código con todas las validaciones
5. ✅ Verificación post-generación (visible)
6. ✅ Checklist de aceptación (visible)

**ENTONCES: Código 100% válido, sin errores, listo para Studio.**

### Si no cumplo:
**El código será RECHAZADO y tendré que regenerar.**

---

## 🔥 MANDATO FINAL

**CUANDO GENERES CÓDIGO ROBLOX:**

1. **SIEMPRE** lee los 7 archivos de documentación
2. **SIEMPRE** mapea variables y validaciones
3. **SIEMPRE** sigue la estructura de 5 zonas
4. **SIEMPRE** valida en cascada
5. **SIEMPRE** verifica orden de declaración
6. **SIEMPRE** verifica propiedades en ROBLOX_API_REAL.md
7. **SIEMPRE** muestra el protocolo visible
8. **SIEMPRE** incluye el checklist final

**NO ES OPCIONAL. ES LA LEY.**

---

**VERSIÓN**: 2.0 SUPREMA  
**GARANTÍA**: 100% código válido o reemplazo  
**EFECTIVO**: 5/12/2025  
**VALIDEZ**: Permanente
