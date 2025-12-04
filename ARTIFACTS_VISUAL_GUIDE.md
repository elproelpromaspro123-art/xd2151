# Sistema de Artifacts - Guía Visual

## Comparación: Antes vs Después

### ANTES (Código completo en chat)
```
Usuario: Crea un script de Luau para Roblox

AI: Aquí te presento un script completo para...

```lua
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

local function onPlayerAdded(player)
    print("Player joined: " .. player.Name)
    
    player.CharacterAdded:Connect(function(character)
        print("Character loaded for: " .. player.Name)
    end)
end

Players.PlayerAdded:Connect(onPlayerAdded)

for _, player in pairs(Players:GetPlayers()) do
    onPlayerAdded(player)
end
```

[Botón: Artifact] [Copiar]
```

❌ Problema: El código ocupa mucho espacio, distrae la lectura del mensaje explicativo

---

### DESPUÉS (Tipo Claude - Compacto)
```
Usuario: Crea un script de Luau para Roblox

AI: Aquí te presento un script completo para...

┌─────────────────────────────────────────┐
│ 📝 LUA Code                        [LUA] │
│ Click to open code                       │
│ 31 lines                                 │
│                          [→ Open Code]  │
└─────────────────────────────────────────┘

Este script carga automáticamente...
```

✅ Ventaja: Código compacto, mensaje legible, acceso rápido al código completo

---

## Flujo de Interacción

### 1. Viendo el Chat
```
┌─────────────────────────────────────────────────────┐
│ AI: Aquí está tu código...                          │
│                                                      │
│ ╭─────────────────────────────────────────────╮    │
│ │ 📝 JavaScript Code              [JAVASCRIPT]│    │
│ │ Click to open code                          │    │
│ │ 47 lines              [→]                   │    │
│ ╰─────────────────────────────────────────────╯    │
│                                                      │
│ Te recomiendo usar este enfoque porque...          │
└─────────────────────────────────────────────────────┘
```

### 2. Click → Abre Panel Lateral
```
┌──────────────────────┬──────────────────────────────┐
│ Chat (50%)           │ Código (50%)                 │
│                      │                              │
│ AI: Aquí está...     │ 📝 JavaScript Code [JAVASCRIPT]
│                      │ ⚙ [Copy] [Download] [Close] │
│ ╭────────────╮       ├──────────────────────────────┤
│ │ 📝 JS Code │       │ 1  function processData()    │
│ │ ...        │       │ 2    const items = [];       │
│ │ Click here │       │ 3    return items;           │
│ ╰────────────╯       │ 4  }                         │
│                      │ 5                            │
│ Luego aplica...      │ 6  // Use it                 │
└──────────────────────┴──────────────────────────────┘
```

### 3. Panel Cerrado
```
┌─────────────────────────────────────────────────────┐
│ Chat vuelve a ocupar 100%                           │
│                                                      │
│ ╭─────────────────────────────────────────────╮    │
│ │ 📝 JavaScript Code              [JAVASCRIPT]│    │
│ │ Click to open code                          │    │
│ │ 47 lines              [→]                   │    │
│ ╰─────────────────────────────────────────────╯    │
└─────────────────────────────────────────────────────┘
```

---

## Estilos Visuales

### ArtifactCard (Compacto)
```
Componentes:
├─ Icono Azul (📝)
├─ Título (e.g., "JavaScript Code")
├─ Lenguaje (badge: "JAVASCRIPT")
├─ CTA ("Click to open code")
├─ Metadata ("47 lines")
└─ Chevron animado (→)

Colores:
- Border: border/50 (sutil)
- Background: gradient muted/35 → muted/15
- Icon background: blue-500/20
- Text: foreground (principal)

Estados:
- Default: Bordes y colores sutiles
- Hover: 
  - Border intensificado (border/70)
  - Background más brillante (muted/55 → muted/25)
  - Icon más brillante (blue-500/30)
  - Chevron visible y desplazado
  - Shadow aumentado
- Focus: Ring azul subtle
```

### Panel Lateral
```
Header:
├─ Icono + "Code" + Lenguaje
├─ Buttons: [Copy] [Download] [Close]
└─ Background: #252526 con blur

Content:
├─ Code con syntax highlighting
├─ Line numbers
├─ Monospace font
└─ Dark theme (VSCode style)

Animations:
- Entrada: slide-in-from-right (300ms)
- Smooth scrolling
- Transiciones suaves en hover
```

---

## Comportamiento Responsivo

### Desktop (≥1024px)
```
┌────────┬──────────────────────────────────┐
│ Sidebar│ Chat (50%) │ Panel (50%)          │
│        └────────────┴──────────────────────┘
```

### Tablet (768px-1023px)
```
┌────────┬─────────────────────────────┐
│Sidebar │ Chat full → Click → Panel   │
└────────┴─────────────────────────────┘
(Panel reemplaza chat)
```

### Mobile (<768px)
```
┌──────────┐
│ Sidebar  │
│ (Toggle) │
├──────────┤
│   Chat   │ ← Swipe para panel
└──────────┘
```

---

## Código Base64 > 50 caracteres

```javascript
// Esto aparecerá como ArtifactCard
function hello() {
  console.log("Hello World");
}

// Esto aparecerá como CodeBlock normal (inline)
fn()
```

---

## Integración con Gemini 2.5 Flash Premium

```
Sistema de Modelos:
├─ FREE USERS:
│  ├─ Qwen 3 Coder (262k)
│  ├─ Llama 3.3 70B
│  ├─ [❌ Gemini 2.5 Flash - BLOQUEADO]
│  └─ [❌ Otros Premium - BLOQUEADOS]
│
└─ PREMIUM USERS:
   ├─ Todos los FREE
   ├─ Gemini 2.5 Flash (1M contexto)
   ├─ DeepSeek R1T2
   ├─ Gemma 3 27B
   ├─ GPT-OSS 120B
   └─ Qwen 3 32B
```

---

## Mejoras de UX

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Visibilidad** | Código ocupa 70% del espacio | Código en 1 tarjeta compacta |
| **Lectura** | Interrumpida por bloques de código | Fluida, con contexto |
| **Acceso** | Botón "Artifact" (a veces confuso) | "Click to open code" (claro) |
| **Panel** | Grande, puede ser abrumador | Optimizado, íconos claros |
| **Mobile** | Difícil de usar | Mejor manejo de espacio |
| **Animaciones** | Básicas | Suaves y refinadas |

---

## Ejemplos de Uso

### Caso 1: Usuario pide código Luau
```
User: Hazme un GUI de tienda para Roblox

AI: Aquí te presento una tienda completa...

┌─────────────────────────────────────────┐
│ 📝 LUAU Code                      [LUAU]│
│ Click to open code                      │
│ 127 lines                   [→ Open]   │
└─────────────────────────────────────────┘

Este código incluye:
- Frame principal de tienda
- Items dinámicos
- Sistema de compra
- Animaciones suaves

[Usuario hace click]
→ Se abre panel con código completo
→ Puede copiar, descargar, editar
```

### Caso 2: Usuario pide pequeño snippet
```
User: ¿Cómo obtengo el jugador actual?

AI: Es muy simple:

local Players = game:GetService("Players")
local player = Players.LocalPlayer

[Aparece como CodeBlock normal porque es < 50 chars]
```

### Caso 3: Usuario premium con Gemini 2.5
```
User: Analiza este código complejo
[Sube imagen]

Model: Gemini 2.5 Flash

AI: Analizando la imagen...

┌─────────────────────────────────────────┐
│ 📝 Analysis Code               [PYTHON] │
│ Click to open code                      │
│ 89 lines                   [→ Open]   │
└─────────────────────────────────────────┘

Tu código puede optimizarse con:
1. ...
2. ...
```

---

## Notas de Implementación

- ✅ ArtifactCard es un componente puro (no tiene estado)
- ✅ Panel utiliza scroll area para códigos muy largos
- ✅ Syntax highlighting usa VSCode Dark theme
- ✅ Animaciones son smooth (nunca abruptas)
- ✅ Accesibilidad: Focus rings, keyboard navigation
- ✅ Performance: Re-renders optimizados
