# 🔴 CONTRATO OBLIGATORIO - ROBLOX CODE GENERATION

**Este contrato DEBE ser leído y aceptado ANTES de cualquier generación de código Roblox.**

---

## CLÁUSULA 1: VALIDACIÓN OBLIGATORIA

Por este medio, **DECLARO QUE**:

✅ LocalScripts serán **AUTOCONTENIDOS** (TODO en un archivo, sin módulos)  
✅ LocalScripts serán **SIN COMENTARIOS** (código limpio)  
✅ Voy a leer **AGENTS.md** completamente antes de generar código  
✅ Voy a leer **ROBLOX_DOCUMENTATION.md** completamente  
✅ Voy a leer **.amp/ROBLOX_API_REAL.md** (propiedades válidas)  
✅ Voy a leer **ROBLOX_VALIDATION.md** antes de entregar código  
✅ Voy a ejecutar: `npm run validate:lua <archivo.lua>` (errores rojos/naranjas)  
✅ Voy a ejecutar: `npm run validate:api <archivo.lua>` (propiedades inválidas)  
✅ Voy a verificar que NO hay errores naranja, rojos, NI API inválida  

**Si no cumplo estos requisitos, mi código será RECHAZADO.**

---

## CLÁUSULA 2: ERRORES PROHIBIDOS

### ❌ Errores Rojos (Runtime Errors)
```lua
-- PROHIBIDO: Nil indexing
local player = game.Players:WaitForChild("Player1")
player.Backpack.Sword:Destroy()  -- ERROR: player puede ser nil

-- CORRECTO:
local player = game.Players:WaitForChild("Player1")
if player and player:FindFirstChild("Backpack") then
    local sword = player.Backpack:FindFirstChild("Sword")
    if sword then
        sword:Destroy()
    end
end
```

### ⚠️ Errores Naranja (Forward References)
```lua
-- PROHIBIDO: Usar función antes de definirla
functionA()
local function functionA()
    return 42
end

-- CORRECTO: Definir ANTES de usar
local function functionA()
    return 42
end
functionA()
```

---

## CLÁUSULA 3: CHECKLIST DE VALIDACIÓN

Antes de entregar código, debo verificar:

### Errores Rojos - ¿Nil Indexing?
```
[ ] ¿Valido que las variables existan antes de usarlas?
[ ] ¿Uso WaitForChild() con timeout?
[ ] ¿Verifico :FindFirstChild() antes de acceder?
[ ] ¿Valido que no hay acceso a propiedades de nil?
```

### Errores Naranja - ¿Forward References?
```
[ ] ¿Todas las funciones se definen ANTES de usarlas?
[ ] ¿Todos los métodos se definen ANTES de render()?
[ ] ¿Todos los callbacks se definen ANTES de Connect()?
[ ] ¿No hay forward references sin pre-declaración?
```

### Orden de Código
```
[ ] Línea 1-50: Declaración de variables locales
[ ] Línea 51-150: Definición de funciones helper
[ ] Línea 151-300: Definición de métodos de clase
[ ] Línea 301-400: Callbacks y handlers
[ ] Línea 401+: Inicialización y main logic
```

---

## CLÁUSULA 4: PATRONES OBLIGATORIOS

### Patrón 1: Variables con validación
```lua
-- ✅ CORRECTO
local player = game.Players:WaitForChild("Player1")
assert(player, "Player1 not found")

local backpack = player:WaitForChild("Backpack")
assert(backpack, "Backpack not found")
```

### Patrón 2: FindFirstChild con validación
```lua
-- ✅ CORRECTO
local item = container:FindFirstChild("ItemName")
if not item then
    warn("Item not found:", container.Name)
    return
end
item:DoSomething()
```

### Patrón 3: Orden de declaración
```lua
-- ✅ CORRECTO
-- 1. Variables locales
local config = {
    timeout = 5,
    maxRetries = 3
}

-- 2. Funciones helper
local function validateInput(value)
    return type(value) == "number" and value > 0
end

local function processData(data)
    if not validateInput(data) then
        return nil
    end
    return data * 2
end

-- 3. Main logic
local result = processData(10)
print(result)
```

### Patrón 4: Métodos de clase
```lua
-- ✅ CORRECTO
local Button = {}
Button.__index = Button

-- 1. Definir TODOS los métodos PRIMERO
function Button:OnClick()
    self:UpdateUI()
end

function Button:UpdateUI()
    self.label.Text = "Clicked"
end

-- 2. Constructor DESPUÉS
function Button.new(props)
    local self = setmetatable({}, Button)
    self.label = props.label
    self.onClick = props.onClick
    return self
end

-- 3. Usar DESPUÉS
local btn = Button.new({label = Label})
btn:OnClick()
```

---

## CLÁUSULA 5: VALIDACIÓN AUTOMÁTICA

Ejecutar SIEMPRE antes de entregar:

```bash
# Validar orden de funciones
npm run validate:lua ./mi_script.lua

# Debe mostrar:
# ✅ Sin errores naranja detectados
# ✅ Orden de declaración correcto
```

**Si hay errores, NO entregar el código.**

---

## CLÁUSULA 6: ERRORES COMUNES A EVITAR

| Error | Causa | Solución |
|-------|-------|----------|
| "attempt to index nil" | Variable es nil | Validar antes de usar |
| "function X undefined" | Usar antes de definir | Definir ANTES |
| "cannot call nil value" | Llamar variable que no es función | Validar tipo |
| "expected identifier, got <eof>" | Sintaxis incorrecta | Revisar paréntesis/end |

---

## CLÁUSULA 7: DOCUMENTACIÓN REQUERIDA

Cada bloque de código debe tener:

```lua
-- ✅ CORRECTO
--- Descripción corta de la función
--- @param param1 (type) - Descripción
--- @return (type) - Descripción
local function myFunction(param1)
    -- validación
    if not param1 then
        error("param1 is required")
    end
    
    -- lógica
    return param1 * 2
end
```

---

## CLÁUSULA 8: PRUEBAS REQUERIDAS

Antes de entregar, probar:

```lua
-- ✅ Test caso 1: Entrada válida
assert(myFunction(5) == 10, "Test 1 failed")

-- ✅ Test caso 2: Entrada inválida
pcall(function()
    myFunction(nil)
end)
-- Debe fallar con error claro
```

---

## CLÁUSULA 9: PENALIDADES

Si incumplo este contrato:

- ❌ Código rechazado
- ❌ No será usado en producción
- ❌ Causará errores rojos/naranjas en Studio
- ❌ Ralentizará desarrollo
- ❌ Perderá confianza en el sistema

---

## ACEPTACIÓN

**AL GENERAR CÓDIGO ROBLOX, ACEPTO:**

✅ Leer AGENTS.md, ROBLOX_DOCUMENTATION.md, ROBLOX_VALIDATION.md  
✅ Aplicar orden de declaración correcto  
✅ Validar variables antes de usarlas  
✅ Ejecutar npm run validate:lua  
✅ NO generar código con errores rojos/naranjas  
✅ Documentar y testear el código  

**Si no acepto, NO debo generar código Roblox.**

---

## FECHA DE VIGENCIA

- **Efectivo desde**: 5/12/2025
- **Versión**: 1.0
- **Scope**: Todos los modelos IA / Desarrolladores
- **Revisión**: Diaria

---

**AL LEER ESTE CONTRATO, ACEPTAS SUS TÉRMINOS.**
