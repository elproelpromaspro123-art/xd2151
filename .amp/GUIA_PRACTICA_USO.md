# 📖 GUÍA PRÁCTICA - Cómo usar el PROMPT MAESTRO

## ESCENARIO 1: Con Claude (u otro modelo)

### PASO 1: Abre una nueva conversación
```
https://claude.ai (o tu modelo favorito)
```

### PASO 2: Copia el PROMPT MAESTRO
1. Abre: `.amp/PROMPT_MAESTRO_ROBLOX.md`
2. Selecciona TODO entre las líneas `═══` 
3. Copia (Ctrl+C)

### PASO 3: Pega en el modelo
```
En tu conversación, pega TODO el prompt

[CTRL+V]
```

### PASO 4: Espera confirmación
El modelo debe responder algo como:

```
"Entendido. Confirmo que:
✅ Leeré los documentos sobre Roblox
✅ Validaré variables antes de usarlas
✅ Mostraré explícitamente cada fase
✅ Incluiré checklist visual
✅ Rechazarás código que viole esto

¿Procedo?"
```

**Si NO menciona todo → Responde:**
```
No completaste la confirmación.
Debes responder SÍ o NO a las 5 preguntas
antes de continuar.
```

### PASO 5: Pide código
```
"Genera un LocalScript que itere sobre una tabla Config

Protocolo obligatorio aplicable.
Muestra explícitamente:
1. Lectura de documentos
2. Análisis de variables
3. Validaciones planeadas
4. Código estructurado
5. Checklist visual"
```

### PASO 6: Verifica el código

**En el razonamiento debe ver:**
```
✅ Leyendo CONTRATO_ROBLOX.md
✅ Leyendo ROBLOX_DOCUMENTATION.md
✅ Leyendo ROBLOX_VALIDATION.md
✅ Leyendo ROBLOX_API_REAL.md

📊 Análisis:
   Variable: Config (tabla) → puede ser nil
   Validación: if not Config then Config = {} end

📐 Estructura:
   Zona 1: Variables
   Zona 2: Funciones

✅ Verificación:
   [✅] Sin forward references
   [✅] Variables validadas
   [✅] Propiedades válidas
```

**En el código debe ver:**
```lua
local Config = {}

local function Create()
    if not Config then
        Config = {}
    end
    for k, v in pairs(Config) do
        print(v)
    end
end

Create()
```

### PASO 7: Valida
```bash
# En tu terminal:
npm run validate:lua ./test.lua
npm run validate:api ./test.lua

# Debe mostrar:
✅ SIN ERRORES DETECTADOS
✅ API VÁLIDA
```

---

## ESCENARIO 2: Rechazar código deficiente

### Código tiene error
```
El modelo entregó:

local function Create()
    for k, v in pairs(Config) do  ← ERROR: Config puede ser nil
        print(v)
    end
end
```

### Respuesta correcta
```
❌ RECHAZADO - No cumple protocolo

Problemas encontrados:
- ❌ Config se usa en pairs() sin validación
- ❌ No validaste variables ANTES de usarlas
- ❌ Violó ROBLOX_VALIDATION.md

Esto es un ERROR ROJO prohibido.

Regenera cumpliendo ESTRICTAMENTE el protocolo:

[PEGA EL PROMPT MAESTRO NUEVAMENTE]

Luego: Genera el código validando Config antes de pairs()
```

### El modelo debe regenerar
```
✅ Leyendo CONTRATO_ROBLOX.md - Cláusula 2: Errores prohibidos
✅ Leyendo ROBLOX_VALIDATION.md - pairs(nil) es error rojo
✅ Leyendo ROBLOX_DOCUMENTATION.md

📊 Análisis:
   Config puede ser nil → DEBO validar

[Código CORRECTO con validación]
```

---

## ESCENARIO 3: Código sin razonamiento visible

### Problema
El modelo solo entrega código sin mostrar fases:

```
Aquí está el código:
[código]
```

### Respuesta
```
❌ RECHAZADO - Falta protocolo visible

No veo:
- ❌ Lectura explícita de documentos
- ❌ Análisis de variables
- ❌ Validaciones planeadas
- ❌ Checklist visual

El protocolo DEBE ser VISIBLE en tu respuesta.

Regenera mostrando EXPLÍCITAMENTE:

1. ✅ Leyendo CONTRATO_ROBLOX.md
2. ✅ Leyendo ROBLOX_DOCUMENTATION.md
3. ✅ Leyendo ROBLOX_VALIDATION.md
4. ✅ Leyendo ROBLOX_API_REAL.md
5. 📊 Análisis de variables
6. 📐 Estructura planificada
7. ✅ Verificación completada
8. [Código]
```

---

## ESCENARIO 4: Propiedades inválidas

### Problema
```lua
UIStroke.ApplyToBorder = true  ← MALO, NO EXISTE
```

### Respuesta
```
❌ ERROR - Propiedad inválida

"ApplyToBorder" NO existe en UIStroke.
Violás ROBLOX_API_REAL.md que lista propiedades válidas:
- ✅ Color
- ✅ Thickness
- ✅ Transparency
- ❌ ApplyToBorder (NO EXISTE)

Regenera usando SOLO propiedades válidas.
Consulta ROBLOX_API_REAL.md antes de usar propiedades.
```

---

## ESCENARIO 5: Forward reference

### Problema
```lua
Init()  ← MALO, función no definida aún
local function Init() end
```

### Respuesta
```
❌ ERROR NARANJA - Forward reference

Init() se usa en línea 1 pero se define en línea 2.
Esto viola ROBLOX_VALIDATION.md: "Funciones definidas ANTES"

Regenera con orden correcto:
1. Definir Init()
2. Luego usar Init()
```

---

## 🎯 FLUJO TÍPICO

```
1. INYECTA PROMPT
   └─ Pega .amp/PROMPT_MAESTRO_ROBLOX.md
   └─ Espera confirmación del modelo

2. PIDE CÓDIGO
   └─ Describe qué quieres
   └─ Remarca protocolo obligatorio

3. RECIBE RESPUESTA
   └─ Verifica razonamiento (¿ves fases?)
   └─ Verifica código (¿sin errores?)
   └─ Si falta → RECHAZA

4. COPIAS CÓDIGO
   └─ Si pasó verificación
   └─ Copia a archivo .lua

5. VALIDAS LOCALMENTE
   └─ npm run validate:lua
   └─ npm run validate:api
   └─ Deben mostrar ✅

6. USAS EN STUDIO
   └─ Código 100% correcto
```

---

## 💡 TIPS IMPORTANTES

### Tip 1: Inyecta en cada conversación NUEVA
```
Cada modelo nuevo = Inyecta el prompt PRIMERO
No reutilices conversaciones viejas (sin protocolo)
```

### Tip 2: Sé estricto en rechazo
```
Código deficiente → RECHAZA inmediatamente
No aceptes "casi correcto"
Exige PERFECTO
```

### Tip 3: Valida siempre localmente
```
npm run validate:lua ./script.lua
npm run validate:api ./script.lua

Si tiene error → El modelo mintió o incumplió
```

### Tip 4: Usa frases claras
```
NO: "El código no me gusta"
SÍ: "Violá ROBLOX_VALIDATION.md: pairs(nil) es error rojo"

NO: "Regenera"
SÍ: "Regenera inyectando el protocolo nuevamente"
```

### Tip 5: Copia exacto
```
El PROMPT MAESTRO debe copiarse EXACTO
NO parafrasees
NO resumidas
COPIA COMPLETO
```

---

## 📊 CHECKLIST PRE-USO

Antes de pedir código:

- [ ] ¿Tengo .amp/PROMPT_MAESTRO_ROBLOX.md?
- [ ] ¿Tengo npm run validate:lua disponible?
- [ ] ¿Tengo npm run validate:api disponible?
- [ ] ¿Entiendo las 5 preguntas de confirmación?
- [ ] ¿Sé qué rechazar?

---

## 🚨 SI ALGO SALE MAL

| Problema | Solución |
|----------|----------|
| Modelo no confirma | Pega el prompt nuevamente, completo |
| Código con pairs(nil) | Rechaza y menciona ROBLOX_VALIDATION.md |
| Propiedades inválidas | Rechaza y menciona ROBLOX_API_REAL.md |
| Sin razonamiento visible | Rechaza y pide "fases explícitas" |
| Validate dice error | El modelo incumplió, rechaza |

---

## 📌 REFERENCIA RÁPIDA

```
USAR CON:
├─ Claude
├─ ChatGPT (4, 4o)
├─ Gemini (Pro, Advanced)
├─ Llama (70B)
├─ Mistral (Large)
└─ Cualquier modelo LLM

FLUJO:
1. Inyecta PROMPT MAESTRO
2. Espera confirmación
3. Pide código
4. Verifica razonamiento
5. Verifica código
6. Valida con npm run
7. Usa en Studio

GARANTÍA:
✅ Código 100% correcto
✅ O rechazas y regeneras
```

---

## 🎉 EJEMPLO COMPLETO

### Paso 1: Inyecta
```
[Pega PROMPT MAESTRO]
```

### Paso 2: Modelo confirma
```
✅ Entendido. Confirmo que seguiré el protocolo.
¿Procedo?
```

### Paso 3: Tú pides
```
"Genera un LocalScript que cree un GUI button
y muestre la mouse position cuando lo cliques

Protocolo obligatorio aplicable"
```

### Paso 4: Modelo responde
```
✅ Leyendo CONTRATO_ROBLOX.md
✅ Leyendo ROBLOX_DOCUMENTATION.md
✅ Leyendo ROBLOX_VALIDATION.md
✅ Leyendo ROBLOX_API_REAL.md

📊 Variables:
- player (puede ser nil)
- mouse (puede ser nil)
- button (Instance creado)

🛡️ Validaciones:
- if not player then return end
- if not mouse then return end

📐 Estructura:
- Zona 1: Variables (player, mouse)
- Zona 2: Función createButton()
- Zona 3: Event handler
- Zona 4: Init

[Código perfecto con validaciones]

✅ Verificación:
[✅] Sin nil indexing
[✅] Sin forward references
[✅] Propiedades válidas
[✅] Estructura correcta
```

### Paso 5: Tú copias
```lua
local Players = game:GetService("Players")
local player = Players.LocalPlayer

if not player then return end

local mouse = player:GetMouse()
if not mouse then return end

local playerGui = player:WaitForChild("PlayerGui")
if not playerGui then return end

local function createButton()
    if not playerGui then return nil end
    
    local button = Instance.new("TextButton")
    button.Text = "Show Position"
    button.Parent = playerGui
    return button
end

local function onButtonClicked()
    if mouse then
        print("Position:", mouse.X, mouse.Y)
    end
end

local btn = createButton()
if btn then
    btn.Activated:Connect(onButtonClicked)
end
```

### Paso 6: Validas
```bash
npm run validate:lua ./script.lua
npm run validate:api ./script.lua

✅ SIN ERRORES DETECTADOS
✅ API VÁLIDA
```

### Paso 7: Usas
```
Copias directo a Roblox Studio
SIN DEBUGGING
SIN ERRORES
✅ Funciona perfectamente
```

---

**FECHA**: 5/12/2025
**VERSIÓN**: 1.0
**GARANTÍA**: Funciona con cualquier modelo
