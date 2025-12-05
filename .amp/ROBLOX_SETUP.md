# Roblox Setup - Sistema Anti-Errores Naranja

Sistema completo para evitar errores naranja en Roblox (forward references, undefined functions).

## 📋 Archivos de Configuración

```
├── AGENTS.md                    ← Normas obligatorias (lee primero)
├── ROBLOX_DOCUMENTATION.md      ← API Reference 2025.1
├── ROBLOX_VALIDATION.md         ← Checklist de validación
├── CONTEXT.md                   ← Contexto para modelos IA
├── README.md                    ← Punto de entrada
└── .amp/
    ├── system.prompt            ← Inyección de contexto
    ├── validate-lua.js          ← Script validador
    └── ROBLOX_SETUP.md          ← Este archivo
```

## 🔄 Workflow Automático

```
1. Usuario pide código Roblox
   ↓
2. Modelo lee AGENTS.md
   ↓
3. Sistema detecta "ROBLOX Mode"
   ↓
4. Modelo lee ROBLOX_DOCUMENTATION.md
   ↓
5. Modelo ejecuta CHECKLIST de ROBLOX_VALIDATION.md
   ↓
6. ✅ Genera código sin errores naranja
   ❌ O avisa si falta contexto
```

## ✅ Reglas Obligatorias

### Orden de Declaración
```lua
❌ MALO:
local function functionA()
    functionB()  -- ERROR: functionB no existe
end
local function functionB()
    return 42
end

✅ BUENO:
local function functionB()
    return 42
end
local function functionA()
    functionB()  -- OK
end
```

### Métodos de Clase
```lua
❌ MALO:
local Button = {}
function Button:render()
    self:onClick()  -- ERROR: onClick no existe
end
function Button:onClick()
    print("Click")
end

✅ BUENO:
local Button = {}
function Button:onClick()
    print("Click")
end
function Button:render()
    self:onClick()  -- OK
end
```

### Eventos
```lua
❌ MALO:
button.Activated:Connect(handleClick)
local function handleClick()
    print("Clicked")
end

✅ BUENO:
local function handleClick()
    print("Clicked")
end
button.Activated:Connect(handleClick)
```

## 🛠️ Validación Local

Usa el validador automático:

```bash
# Validar un archivo .lua
npm run validate:lua ./tu_archivo.lua

# Output:
# ✅ Sin errores naranja detectados
# ✅ Orden de declaración correcto

# O muestra errores:
# ❌ Forward reference: functionB
#    Usada en línea: 5
#    Definida en línea: 12
#    FIX: Mueve la definición a una línea anterior a 5
```

## 📚 Referencia Rápida

| Archivo | Propósito | Para quién |
|---------|-----------|-----------|
| AGENTS.md | Normas del proyecto | Todos |
| ROBLOX_DOCUMENTATION.md | API Reference | Programadores |
| ROBLOX_VALIDATION.md | Validación de código | Validadores |
| CONTEXT.md | Contexto IA | Modelos IA |
| validate-lua.js | Validación automática | CI/CD |

## 🎯 Guarantee - Código sin Errores Naranja

Si tu código cumple con:
- ✅ Funciones definidas ANTES de usarlas
- ✅ Métodos de clase definidos ANTES de render()
- ✅ Callbacks definidos ANTES de Connect()
- ✅ No hay forward references (o usas tablas)
- ✅ Sigue patrones de ROBLOX_DOCUMENTATION.md

**GARANTIZADO**: Tu código NO tendrá errores naranja en Roblox Studio 2025.1

## 🔗 Integración CI/CD

Agregar a tu pipeline (GitHub Actions, GitLab CI, etc.):

```yaml
# .github/workflows/validate-lua.yml
name: Validate Lua Code
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm run validate:lua ./your-script.lua
```

## 📝 Checklist Final

Antes de pushear código Roblox:

- [ ] Leí AGENTS.md
- [ ] Leí ROBLOX_DOCUMENTATION.md
- [ ] Validé orden de declaración (ROBLOX_VALIDATION.md)
- [ ] Ejecuté `npm run validate:lua` (sin errores)
- [ ] El código no tiene forward references
- [ ] Los métodos están antes de render()
- [ ] Los callbacks están antes de Connect()

---

**Última actualización**: 5/12/2025 - Sistema de validación anti-errores naranja activado
