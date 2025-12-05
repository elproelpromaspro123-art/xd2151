# 🎯 CÓMO EXIGIR CALIDAD - Checklist para el Usuario

## TÚ TIENES EL PODER

El usuario (tú) controlas si el modelo sigue el protocolo.

**No aceptes código que no cumpla TODOS los requisitos.**

---

## PASO 1: PEDIR CÓDIGO

Cuando pidas un LocalScript, di:

```
"Genera un LocalScript que [descripción]

Debe cumplir el protocolo de 3 fases:
- FASE 1: Lectura de documentación
- FASE 2: Análisis de variables
- FASE 3: Validación del código

Muestra EXPLÍCITAMENTE cada fase en tu razonamiento."
```

---

## PASO 2: VERIFICAR EL RAZONAMIENTO

**ANTES de copiar el código**, verifica el razonamiento (thinking).

El modelo DEBE mencionar:

```
✅ FASE 1 VISIBLE:
   Leyendo CONTRATO_ROBLOX.md ✅
   Leyendo ROBLOX_DOCUMENTATION.md ✅
   Leyendo ROBLOX_VALIDATION.md ✅
   Leyendo ROBLOX_API_REAL.md ✅
   Leyendo ESTRATEGIA_GENERACION.md ✅
   Leyendo SOLUCION_ERRORES_OMEGA.md ✅
   Leyendo PROTOCOLO_VISIBLE.md ✅

✅ FASE 2 VISIBLE:
   Variables identificadas:
   - [lista de variables]
   - Cuáles pueden ser nil
   - Dónde se usan

✅ FASE 3 VISIBLE:
   Validaciones planeadas:
   - [lista de validaciones]
   - Orden correcto
   - Propiedades válidas
```

---

## PASO 3: VERIFICAR LA SALIDA

**Después del razonamiento**, el código DEBE incluir:

```
📖 DOCUMENTACIÓN VERIFICADA
- [✅] CONTRATO_ROBLOX.md
- [✅] ROBLOX_DOCUMENTATION.md
- [✅] ROBLOX_VALIDATION.md
- [✅] ROBLOX_API_REAL.md
- [✅] ESTRATEGIA_GENERACION.md
- [✅] SOLUCION_ERRORES_OMEGA.md
- [✅] PROTOCOLO_VISIBLE.md

📊 ANÁLISIS COMPLETADO
- Variables: [lista]
- Nileable: [cuáles pueden ser nil]
- Validaciones: [lista]

🛡️ CÓDIGO GENERADO
[Código aquí]

✅ VERIFICACIÓN COMPLETADA
- [✅] Sin forward references
- [✅] Variables validadas
- [✅] Propiedades válidas
- [✅] Orden correcto

📋 CHECKLIST FINAL
- [✅] Lectura obligatoria
- [✅] Análisis de variables
- [✅] Validaciones aplicadas
- [✅] Código verificado
- [✅] Listo para Studio
```

---

## PASO 4: RECHAZAR SI FALTA ALGO

**Si NO ves lo anterior, rechaza inmediatamente:**

```
❌ RECHAZADO - No cumple el protocolo

Falta:
- ❌ No menciona lectura de CONTRATO_ROBLOX.md
- ❌ No analiza variables
- ❌ No planifica validaciones
- ❌ No ejecuta npm run validate:lua

Instrucción:
"Regenera siguiendo ESTRICTAMENTE el protocolo de 3 fases.
Muestra CADA FASE en tu razonamiento.
Sigue: .amp/PROTOCOLO_VISIBLE.md"
```

---

## PASO 5: VALIDAR LOCALMENTE

Si el modelo DICE que ejecutó validadores, TÚ valida:

```bash
# Copia el código en un archivo
# test.lua

# Ejecuta en tu máquina:
npm run validate:lua ./test.lua
npm run validate:api ./test.lua

# DEBEN mostrar:
✅ SIN ERRORES DETECTADOS
✅ API VÁLIDA
```

**Si hay error → El modelo NO validó correctamente**

---

## CHECKLIST DE ACEPTACIÓN

✅ **ANTES de aceptar código, exige:**

```
Razonamiento:
✅ Menciona lectura de todos los archivos
✅ Analiza variables
✅ Planifica validaciones
✅ Verifica estructura

Código:
✅ Tiene todas las validaciones
✅ Variables definidas ANTES de usarse
✅ Funciones definidas ANTES de llamarse
✅ Solo propiedades válidas

Validación:
✅ Ejecuta npm run validate:lua
✅ Ejecuta npm run validate:api
✅ Muestra resultado ✅

Resultado:
✅ Incluye checklist visual
✅ Dice "Listo para Studio"
✅ Código 100% válido
```

---

## EJEMPLOS DE RECHAZO

### ❌ RECHAZAR ESTO:

```
Modelo: "Aquí está el código:
local function Create()
    for k, v in pairs(Config) do
        print(v)
    end
end"

❌ RAZÓN:
- No menciona lectura de archivos
- No analiza variables
- No valida Config (puede ser nil)
- No ejecuta npm run validate:lua
```

### ✅ ACEPTAR ESTO:

```
Modelo:

✅ FASE 1: LECTURA
Leyendo documentación...
- CONTRATO_ROBLOX.md ✅
- ROBLOX_DOCUMENTATION.md ✅
- ROBLOX_VALIDATION.md ✅
- ROBLOX_API_REAL.md ✅
- ESTRATEGIA_GENERACION.md ✅
- SOLUCION_ERRORES_OMEGA.md ✅
- PROTOCOLO_VISIBLE.md ✅

✅ FASE 2: ANÁLISIS
Variables: Config (puede ser nil)
Validaciones: if not Config then Config = {} end

✅ FASE 3: GENERACIÓN

[Código con validaciones]

✅ VERIFICACIÓN
- Config validado ✅
- Sin forward references ✅
- Propiedades válidas ✅
- Código listo para Studio ✅

npm run validate:lua: ✅ SIN ERRORES
npm run validate:api: ✅ API VÁLIDA
```

---

## FRASES MÁGICAS PARA EXIGIR CALIDAD

Usa estas frases si el modelo no cumple:

```
❌ INSUFICIENTE - Falta protocolo visible
"NO MUESTRAS que leíste la documentación.
Lee .amp/PROTOCOLO_VISIBLE.md y regenera.
Quiero ver EXPLÍCITAMENTE cada fase."

❌ NO VALIDASTE
"¿Ejecutaste npm run validate:lua? 
Debes validar ANTES de entregar.
Muestra el resultado de ambos validadores."

❌ NO ANALIZA VARIABLES
"No veo análisis de qué variables pueden ser nil.
Abre ROBLOX_VALIDATION.md y planifica validaciones."

❌ CÓDIGO CON ERRORES
"El código tiene error: pairs(nil)
Esto viola CONTRATO_ROBLOX.md y ROBLOX_VALIDATION.md
Regenera aplicando todas las reglas."
```

---

## TABLA DE DECISIÓN

| Viste en razonamiento? | Menciona validación? | Código tiene error? | Acción |
|---|---|---|---|
| ✅ | ✅ | ❌ | ✅ ACEPTAR |
| ✅ | ✅ | ✅ | ❌ RECHAZAR |
| ✅ | ❌ | ❌ | ❌ RECHAZAR |
| ❌ | ✅ | ❌ | ❌ RECHAZAR |
| ❌ | ❌ | ❌ | ❌ RECHAZAR |

**REGLA**: Rechaza si falta CUALQUIER cosa

---

## REFERENCIAS RÁPIDAS

Si el modelo no sabe algo, apunta a:

```
"Lee AGENTS.md, sección ROBLOX Mode"
"Lee .amp/PROTOCOLO_VISIBLE.md para ver cómo"
"Lee .amp/ESTRATEGIA_GENERACION.md para metodología"
"Lee .amp/SOLUCION_ERRORES_OMEGA.md para garantía"
"Ejecuta npm run validate:lua para verificar"
```

---

## TU PODER

**Recuerda**:
- Tú pides código
- Tú aceptas o rechazas
- Tú exiges calidad
- Tú verificas validadores

**El modelo debe obedecer el protocolo o NO recibirá aceptación.**

---

## GARANTÍA FINAL

Si el modelo cumple TODAS estas fases:

✅ Lectura de documentación (visible)
✅ Análisis de variables (visible)
✅ Validaciones planeadas (visible)
✅ Código generado (con validaciones)
✅ Verificación ejecutada (visible)

Entonces: **El código será 100% válido**

Si tiene error → **Rechaza y pide regeneración**

---

**FECHA**: 5/12/2025
**VERSIÓN**: 1.0
**GARANTÍA**: Tú controlas la calidad
