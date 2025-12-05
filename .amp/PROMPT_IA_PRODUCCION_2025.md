# 🎯 PROMPT MAESTRO PRODUCCIÓN 2025 - Generación de Código UI/UX 100% Correcto

**VERSIÓN**: 3.0 - PRODUCCIÓN  
**FECHA**: 5/12/2025  
**CONTEXTO**: 1200+ líneas de instrucciones + documentación integrada  
**GARANTÍA**: Código sin errores rojos/naranjas + UI/UX hermoso + Líneas exactas  

---

## 📋 ÍNDICE

1. [Requisitos Iniciales](#requisitos-iniciales)
2. [Protocolo de 3 Fases](#protocolo-de-3-fases)
3. [Restricciones de Código](#restricciones-de-código)
4. [Control de Líneas](#control-de-líneas)
5. [Validación de API](#validación-de-api)
6. [Patrones UI/UX](#patrones-uiux)
7. [Checklist Final](#checklist-final)

---

## ✅ REQUISITOS INICIALES

### Antes de CUALQUIER generación:

1. **Acceso a documentación en tiempo real**
   - Puedes leer/consultar archivos de documentación
   - Debes verificar TODAS las propiedades en ROBLOX_API_REAL.md
   - Actualización: 5/12/2025

2. **Contexto obligatorio**
   - Lees: CONTRATO_ROBLOX.md
   - Lees: ROBLOX_DOCUMENTATION.md
   - Lees: ROBLOX_VALIDATION.md
   - Lees: ROBLOX_API_REAL.md
   - Lees: ESTRATEGIA_GENERACION.md
   - Lees: SOLUCION_ERRORES_OMEGA.md
   - Lees: PROTOCOLO_VISIBLE.md

3. **Confirmación explícita**
   - Mencionas CADA archivo leído
   - Muestras que lo procesaste
   - Extractas información relevante

---

## 🔴 PROTOCOLO DE 3 FASES

### FASE 1: LECTURA Y ANÁLISIS (OBLIGATORIO)

**Paso 1.1: Lectura de documentación**
```
Debo leer Y mencionar explícitamente:

📖 CONTRATO_ROBLOX.md
   - Cláusula 2: Errores prohibidos (rojo/naranja)
   - Cláusula 3: Estructura obligatoria
   - Cláusula 4: Validación de propiedades

📖 ROBLOX_DOCUMENTATION.md
   - Sección: Core Objects (líneas 54-108)
   - Sección: Properties Reference (líneas 111-175)
   - Sección: Methods Reference (líneas 188-220)
   - Sección: Events Reference (líneas 255-298)
   - Sección: Modern UI Development (líneas 300-500)

📖 ROBLOX_VALIDATION.md
   - Sección: Errores Naranja Más Comunes (líneas 5-13)
   - Sección: Patrones a Validar (líneas 34-168)
   - Sección: Flujo de Validación (líneas 170-189)

📖 ROBLOX_API_REAL.md
   - Todas las propiedades válidas (líneas 10-295)
   - Errores comunes detectados (líneas 314-321)
   - Regla de oro (líneas 325-329)

📖 ESTRATEGIA_GENERACION.md (si existe)
   - Metodología de 6 pasos
   - Patrones de validación
   - Ejemplos correctos

📖 SOLUCION_ERRORES_OMEGA.md (si existe)
   - Garantía de código sin errores
   - Patrones que funcionan 100%
   - Casos especiales

📖 PROTOCOLO_VISIBLE.md
   - Cómo demostrar cada fase
   - Checklist visual
   - Cómo rechazar código deficiente
```

**Paso 1.2: Identificación de variables**
```
Mapeo de variables del usuario:
- [Nombre variable]: tipo, inicialización, ¿puede ser nil?
- [Dónde se declara]: línea X
- [Dónde se usa]: líneas Y, Z
- [Validación necesaria]: sí/no

Ejemplo:
- Config (tabla): inicialización línea 5, uso líneas 12-50
  ¿Puede ser nil? SÍ → Validar con: if not Config then Config = {} end
```

**Paso 1.3: Plan de estructura**
```
ZONA 1 (líneas 1-20): Declaraciones de variables
ZONA 2 (líneas 21-50): Funciones helper + validación
ZONA 3 (líneas 51-100): Métodos de clase/tabla
ZONA 4 (líneas 101-150): Event handlers + callbacks
ZONA 5 (líneas 151+): Inicialización + main logic
```

---

### FASE 2: GENERACIÓN CON VALIDACIONES

**Regla 1: Validación exhaustiva**
```lua
-- ❌ NUNCA - Sin validar
local function UseConfig()
    for k, v in pairs(Config) do
        print(v)
    end
end

-- ✅ SIEMPRE - Con validación en cascada
local function UseConfig()
    if not Config then
        Config = {}
    end
    
    if not next(Config) then
        return
    end
    
    for k, v in pairs(Config) do
        if v then
            print(v)
        end
    end
end
```

**Regla 2: Orden de declaración (CRÍTICO)**
```lua
-- ❌ ERROR NARANJA - Forward reference
Init()  -- Línea 5
local function Init() end  -- Línea 20
-- Error: Init no existe en línea 5

-- ✅ CORRECTO - Definir primero
local function Init() end  -- Línea 5
Init()  -- Línea 20
-- OK: Init existe desde línea 5
```

**Regla 3: Validación de propiedades (CRÍTICO)**
```lua
-- ❌ INVÁLIDO - Propiedad inexistente
UIStroke.ApplyToBorder = true  -- NO EXISTE

-- ✅ VÁLIDO - Propiedades reales
UIStroke.Color = Color3.new(1, 0, 0)
UIStroke.Thickness = 2
UIStroke.Transparency = 0
UIStroke.Enabled = true
```

**Regla 4: Estructura de comentarios**
```lua
-- SOLO comentarios al INICIO
-- Describen qué hace el script
-- Qué variables son configurables
-- Estructura general
-- Sin comentarios dentro del código

local Config = {
    maxHealth = 100,  -- No comentarios aquí
    items = {},       -- Código limpio
    enabled = true
}

local function Init()  -- Sin comentarios entre líneas
    if not Config then
        Config = {}
    end
end
```

**Regla 5: Respeto a líneas solicitadas**
```
Usuario elige: 500, 1000, 1500, 2000 líneas
Tú generas: EXACTAMENTE esa cantidad (±5%)
Ejemplo:
- Usuario: 1000 líneas
- Tú generas: 950-1050 líneas
- Control: contador de líneas al final
```

---

## 🚫 RESTRICCIONES DE CÓDIGO

### Comentarios
```lua
-- ✅ PERMITIDO
-- Inicio del script (líneas 1-5)
-- Descripción: Interfaz de usuario principal
-- Config editable: maxHealth, maxMana, colors
-- Estructura: Vars → Funciones → Handlers → Init

-- ❌ PROHIBIDO
-- Comentarios en el medio del código
local x = 10  -- Cambiar si necesitas más
function test()  -- Prueba de función
    return 42  -- Resultado
end
```

### Código limpio
```lua
-- ✅ LIMPIO
local Players = game:GetService("Players")
local player = Players.LocalPlayer
local gui = player:WaitForChild("PlayerGui")

local mainFrame = Instance.new("Frame")
mainFrame.Size = UDim2.new(1, 0, 1, 0)
mainFrame.Parent = gui

-- ❌ SUCIO (muchos comentarios/innecesarios)
local Players = game:GetService("Players")  -- Get Players service
local player = Players.LocalPlayer  -- Get local player
local gui = player:WaitForChild("PlayerGui")  -- Wait for GUI
```

---

## 📊 CONTROL DE LÍNEAS

### Sistema de conteo

1. **Contador automático**
   - Cada línea de código = 1
   - Líneas vacías = no contar (espaciado visual)
   - Comentarios iniciales = contar

2. **Validación de cantidad**
   ```
   Usuario solicita: 1000 líneas
   
   Tú generas y cuentas:
   - Línea 1-5: Comentarios (5 líneas)
   - Línea 6-50: Variables (45 líneas)
   - Línea 51-100: Funciones (50 líneas)
   - Línea 101-200: Handlers (100 líneas)
   - Línea 201-1000: Lógica (800 líneas)
   
   Total: 1000 líneas ✅
   ```

3. **Mostrar resultado**
   ```
   📊 CONTROL DE LÍNEAS
   Solicitado: 1000
   Generado: 1005 (rango válido 950-1050)
   ✅ CUMPLE
   ```

---

## ✅ VALIDACIÓN DE API

### Propiedades válidas verificadas

**UIStroke (del documento)**
```lua
✅ Color = Color3.new(1, 0, 0)
✅ Thickness = 2
✅ Transparency = 0
✅ Enabled = true
✅ LineJoinMode = Enum.LineJoinMode.Miter
✅ ApplyStrokeMode = Enum.ApplyStrokeMode.Contextual
❌ ApplyToBorder (NO EXISTE)
❌ StrokeType (NO EXISTE)
```

**UICorner (del documento)**
```lua
✅ CornerRadius = UDim.new(0, 8)
❌ BorderRadius (NO EXISTE)
❌ RoundCorners (NO EXISTE)
```

**TextButton/TextLabel (del documento)**
```lua
✅ Text = "Texto"
✅ TextColor3 = Color3.new(0, 0, 0)
✅ TextSize = 14
✅ Font = Enum.Font.GothamBold
✅ TextWrapped = true
✅ RichText = true
❌ FontSize (NO EXISTE - usar TextSize)
❌ FontColor (NO EXISTE - usar TextColor3)
```

**Eventos válidos (del documento)**
```lua
✅ obj.Activated:Connect()
✅ obj.MouseButton1Click:Connect()
✅ obj.MouseEnter:Connect()
✅ obj.MouseLeave:Connect()
✅ obj.TouchTap:Connect()
❌ obj.OnClick (NO EXISTE)
❌ obj.Clicked (NO EXISTE)
```

**Métodos válidos (del documento)**
```lua
✅ obj:TweenPosition()
✅ obj:TweenSize()
✅ obj:FindFirstChild()
✅ obj:WaitForChild()
✅ instance:Clone()
✅ instance:Destroy()
❌ obj:Tween() (NO EXISTE)
❌ obj:MoveTo() (NO EXISTE)
```

### Checklist de validación
```
[✅] ¿Todas las propiedades están en ROBLOX_API_REAL.md?
[✅] ¿Todos los eventos son válidos?
[✅] ¿Todos los métodos son válidos?
[✅] ¿No hay propiedades renombradas?
[✅] ¿No hay eventos inexistentes?
```

---

## 🎨 PATRONES UI/UX

### Diseño hermoso pero funcional

**Patrón 1: Colores coherentes**
```lua
local theme = {
    primary = Color3.fromRGB(100, 150, 255),    -- Azul
    secondary = Color3.fromRGB(50, 50, 50),     -- Gris oscuro
    accent = Color3.fromRGB(255, 200, 50),      -- Naranja
    text = Color3.fromRGB(255, 255, 255),       -- Blanco
    background = Color3.fromRGB(30, 30, 30)     -- Negro
}
```

**Patrón 2: Tipografía clara**
```lua
local fonts = {
    title = {Font = Enum.Font.GothamBold, Size = 24},
    subtitle = {Font = Enum.Font.Gotham, Size = 18},
    body = {Font = Enum.Font.GothamMedium, Size = 14},
    small = {Font = Enum.Font.Gotham, Size = 12}
}
```

**Patrón 3: Espaciado consistente**
```lua
local spacing = {
    xs = UDim.new(0, 4),
    sm = UDim.new(0, 8),
    md = UDim.new(0, 12),
    lg = UDim.new(0, 16),
    xl = UDim.new(0, 24)
}
```

**Patrón 4: Animaciones suaves**
```lua
local function tweenElement(element, targetPos, time)
    if not element then return end
    element:TweenPosition(
        targetPos,
        Enum.EasingDirection.Out,
        Enum.EasingStyle.Quad,
        time,
        true
    )
end
```

**Patrón 5: Componentes reutilizables**
```lua
local function createButton(config)
    if not config then config = {} end
    
    local button = Instance.new("TextButton")
    button.Size = config.size or UDim2.new(0, 100, 0, 40)
    button.BackgroundColor3 = config.color or Color3.new(0.2, 0.2, 0.8)
    button.Text = config.text or "Button"
    button.TextColor3 = Color3.new(1, 1, 1)
    button.BorderSizePixel = 0
    
    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 8)
    corner.Parent = button
    
    return button
end
```

---

## 📋 CHECKLIST FINAL

### ANTES de entregar código

**LECTURA:**
```
[✅] Leí CONTRATO_ROBLOX.md completo
[✅] Leí ROBLOX_DOCUMENTATION.md (secciones relevantes)
[✅] Leí ROBLOX_VALIDATION.md completo
[✅] Leí ROBLOX_API_REAL.md (todas propiedades)
[✅] Leí ESTRATEGIA_GENERACION.md (si existe)
[✅] Leí SOLUCION_ERRORES_OMEGA.md (si existe)
[✅] Leí PROTOCOLO_VISIBLE.md
```

**ANÁLISIS:**
```
[✅] Identifiqué TODAS las variables
[✅] Marqué cuáles pueden ser nil
[✅] Planeé validaciones para cada una
[✅] Verifiqué orden de declaración
[✅] Planeé estructura de 5 zonas
```

**ERRORES ROJOS (Nil indexing):**
```
[✅] Valido variables ANTES de usarlas
[✅] No hay pairs(nil) sin validación
[✅] No hay acceso a propiedades sin validar
[✅] FindFirstChild() siempre tiene validación
[✅] No hay indexing en nil
```

**ERRORES NARANJAS (Forward references):**
```
[✅] Funciones definidas ANTES de usarlas
[✅] Métodos definidos ANTES de render()
[✅] Callbacks definidos ANTES de Connect()
[✅] No hay forward references
[✅] Orden correcto: línea definición < línea uso
```

**PROPIEDADES:**
```
[✅] TODAS las propiedades están en ROBLOX_API_REAL.md
[✅] No usé propiedades renombradas
[✅] No usé propiedades inventadas
[✅] Eventos son válidos
[✅] Métodos son válidos
```

**ESTRUCTURA:**
```
[✅] Zona 1 (vars): líneas 1-20
[✅] Zona 2 (funciones): líneas 21-50
[✅] Zona 3 (métodos): líneas 51-100
[✅] Zona 4 (handlers): líneas 101-150
[✅] Zona 5 (init): líneas 151+
```

**CÓDIGO:**
```
[✅] Comentarios SOLO al inicio
[✅] Sin comentarios en el código
[✅] Código limpio y legible
[✅] Patrón UI/UX hermoso
[✅] Líneas exactas (±5%)
```

**VALIDACIÓN FINAL:**
```
[✅] Sin errores rojos
[✅] Sin errores naranjas
[✅] Sin propiedades inválidas
[✅] npm run validate:lua: OK
[✅] npm run validate:api: OK
```

---

## 🎯 DEMOSTRACIÓN OBLIGATORIA

Cuando generes código, DEBES mostrar EXPLÍCITAMENTE:

### Paso 1: Lectura
```
📖 FASE 1: LECTURA OBLIGATORIA
✅ Leo CONTRATO_ROBLOX.md - Cláusulas críticas identificadas
✅ Leo ROBLOX_DOCUMENTATION.md - API Core Objects procesada
✅ Leo ROBLOX_VALIDATION.md - Patrones de validación confirmados
✅ Leo ROBLOX_API_REAL.md - Propiedades verificadas
```

### Paso 2: Análisis
```
📊 FASE 2: ANÁLISIS DE VARIABLES
Variables identificadas:
- Players (servicio): nunca nil
- player (Player): puede ser nil → validar
- gui (PlayerGui): puede ser nil → validar
- mainFrame (Frame): creado → validación local

Funciones:
- Init() - línea 30
- CreateUI() - línea 50
- onButtonClick() - línea 100

Orden verificado:
✅ Init (30) < uso (200)
✅ CreateUI (50) < uso (150)
✅ onButtonClick (100) < Connect (180)
```

### Paso 3: Plan
```
🛡️ VALIDACIONES PLANEADAS
Variable: player
Validación: if not player then return end

Variable: gui
Validación: if not gui then return end

Variable: Config
Validación: if not Config then Config = {} end
```

### Paso 4: Checklist
```
✅ CHECKLIST POST-GENERACIÓN
[✅] 1000 líneas exactas (±5%)
[✅] Sin errores rojos
[✅] Sin errores naranjas
[✅] Propiedades validadas
[✅] Estructura correcta
[✅] UI/UX hermoso
[✅] Listo para Studio
```

---

## 🚨 RECHAZO INMEDIATO SI:

```
❌ NO mencionas lectura de archivos
❌ NO muestras análisis de variables
❌ NO planeás validaciones
❌ NO sigues estructura de 5 zonas
❌ Hay errores rojos (pairs(nil), indexing nil)
❌ Hay errores naranjas (forward references)
❌ Propiedades no están en ROBLOX_API_REAL.md
❌ Comentarios dentro del código
❌ Líneas no coinciden (fuera del ±5%)
```

---

## 📝 CÓMO PEDIR CÓDIGO

```
Quiero un LocalScript que [descripción]

Requisitos:
- Líneas: 1000 (o 500/1500/2000)
- UI/UX: [hermoso/minimalista/moderno]
- Colores: [primario, secundario, acentos]
- Funcionalidad: [lo que hace]

Protocolo obligatorio aplicable.
Muestra EXPLÍCITAMENTE:
1. Lectura de documentos
2. Análisis de variables
3. Validaciones planeadas
4. Código estructurado
5. Checklist visual
```

---

## ✅ GARANTÍA

Si sigues ESTE PROTOCOLO:

✅ **Código 100% válido**
✅ **Sin errores rojos**
✅ **Sin errores naranjas**
✅ **Propiedades correctas**
✅ **UI/UX hermoso**
✅ **Líneas exactas**
✅ **Listo para Studio**

Si NO lo sigues → **CÓDIGO RECHAZADO**.

---

**VERSIÓN**: 3.0 - PRODUCCIÓN  
**FECHA**: 5/12/2025  
**VALIDEZ**: Permanente  
**RESPONSABILIDAD**: 100% del modelo de IA
