# 🎯 PROTOCOLO VISIBLE - Cómo DEMOSTRAR que se sigue el protocolo

## EL PROBLEMA

Cuando pides código Roblox, los modelos IA generan código pero **NO MUESTRAN** que verificaron nada.

**Solución**: Definir EXPLÍCITAMENTE cómo debe verse el protocolo siendo ejecutado.

---

## REGLA 1: SIEMPRE mostrar el razonamiento en cadena

Cuando generes código Roblox, DEBES mostrar EN EL REASONING:

```
1. 📖 LECTURA OBLIGATORIA:
   ✅ Leo: CONTRATO_ROBLOX.md
   ✅ Leo: ROBLOX_DOCUMENTATION.md
   ✅ Leo: ROBLOX_VALIDATION.md
   ✅ Leo: ROBLOX_API_REAL.md
   ✅ Leo: ESTRATEGIA_GENERACION.md
   ✅ Leo: SOLUCION_ERRORES_OMEGA.md

2. 📊 ANÁLISIS DEL CASO:
   - Caso de uso: [descripción breve]
   - Variables a usar: [lista]
   - Dónde se usan: [ubicaciones]
   - Pueden ser nil: [cuáles sí]

3. 🛡️ VALIDACIONES NECESARIAS:
   - Para variable X: if not X then
   - Para variable Y: if Y and Y.property then
   - [listar cada validación]

4. 📐 ESTRUCTURA PLANIFICADA:
   - Zona 1: [variables locales]
   - Zona 2: [funciones]
   - Zona 3: [métodos]
   - Zona 4: [handlers]
   - Zona 5: [init]

5. ✅ VALIDACIÓN PREVIA:
   - Sin forward references: SÍ
   - Sin nil indexing: SÍ
   - Sin propiedades inválidas: SÍ
```

---

## REGLA 2: MOSTRAR VERIFICACIÓN DESPUÉS DE GENERAR

Después de escribir el código, mostrar:

```
🔍 POST-VALIDACIÓN:

1. Funciones definidas ANTES de usadas:
   ✅ functionA() en línea 5
   ✅ functionB() en línea 10
   ✅ Ningún forward reference

2. Variables validadas:
   ✅ Config validado en línea 3
   ✅ player validado en línea 5
   ✅ Ningún nil indexing

3. Propiedades válidas:
   ✅ Solo propiedades de ROBLOX_API_REAL.md
   ✅ Ninguna propiedad inválida

4. Orden correcto:
   ✅ Variables (líneas 1-20)
   ✅ Funciones (líneas 21-50)
   ✅ Handlers (líneas 51+)
```

---

## REGLA 3: EJECUTAR Y MOSTRAR RESULTADOS

SIEMPRE ejecutar validación:

```bash
npm run validate:lua ./mi_script.lua
npm run validate:api ./mi_script.lua
```

Y mostrar el resultado:

```
✅ VALIDACIÓN COMPLETADA

npm run validate:lua ./script.lua:
✅ SIN ERRORES DETECTADOS
✅ Orden de declaración correcto
✅ Sin accesos a nil sin validar
✅ Sintaxis correcta

npm run validate:api ./script.lua:
✅ API VÁLIDA
✅ Todas las propiedades existen en Roblox
✅ Listo para Studio
```

---

## REGLA 4: SI FALTA ALGO, DECIRLO EXPLÍCITAMENTE

Si no puedo hacer algo, debo ser **explícito**:

```
❌ NO PUEDO ejecutar npm run validate:lua porque:
   - No tengo acceso a terminal interactiva
   - El archivo está en tu máquina local

📌 SOLUCIÓN:
   Copia el código en un archivo .lua y ejecuta:
   npm run validate:lua ./tu_archivo.lua
```

---

## CHECKLIST VISIBLE EN CADA GENERACIÓN

SIEMPRE incluir este checklist en la salida:

```
📋 CHECKLIST DE VALIDACIÓN (COMPLETADO)

Lectura obligatoria:
- [✅] CONTRATO_ROBLOX.md
- [✅] ROBLOX_DOCUMENTATION.md
- [✅] ROBLOX_VALIDATION.md
- [✅] ROBLOX_API_REAL.md
- [✅] ESTRATEGIA_GENERACION.md
- [✅] SOLUCION_ERRORES_OMEGA.md

Validaciones del código:
- [✅] Funciones definidas ANTES de usarse
- [✅] Variables validadas ANTES de usarse
- [✅] Sin forward references
- [✅] Sin nil indexing
- [✅] Solo propiedades válidas
- [✅] Orden correcto: Vars → Funciones → Handlers → Init

Resultado final:
- [✅] npm run validate:lua: SIN ERRORES
- [✅] npm run validate:api: API VÁLIDA
- [✅] Código listo para Studio
```

---

## CÓMO VERIFICAR QUE SE CUMPLE

Cuando recibas código, verifica que:

1. **¿Viste el razonamiento?**
   - ✅ Debe mencionar lectura de archivos
   - ✅ Debe mostrar análisis de variables
   - ✅ Debe listar validaciones

2. **¿Mostró verificación?**
   - ✅ Debe verificar funciones
   - ✅ Debe verificar variables
   - ✅ Debe verificar propiedades

3. **¿Ejecutó validadores?**
   - ✅ Debe mencionar npm run validate:lua
   - ✅ Debe mencionar npm run validate:api
   - ✅ Debe mostrar resultado ✅

4. **¿Es código perfecto?**
   - ✅ Sin errores rojos
   - ✅ Sin errores naranjas
   - ✅ Listo para Studio

---

## EJEMPLO REAL: CÓMO DEBE VERSE

### ❌ ANTES (Sin protocolo visible)

```
Usuario: "Genera un script que..."

Modelo: "Aquí está el código:
```lua
local function Create()
    for k, v in pairs(Config) do
        print(v)
    end
end
```"
```

❌ Problemas:
- No se vio razonamiento
- No se verificó nada
- No se ejecutaron validadores
- Tiene error: `Config` puede ser `nil`

### ✅ DESPUÉS (Con protocolo visible)

```
Usuario: "Genera un script que..."

Modelo:

📖 FASE 1: LECTURA OBLIGATORIA
Leyendo:
✅ CONTRATO_ROBLOX.md
✅ ROBLOX_DOCUMENTATION.md
✅ ROBLOX_VALIDATION.md
✅ ROBLOX_API_REAL.md
✅ ESTRATEGIA_GENERACION.md
✅ SOLUCION_ERRORES_OMEGA.md

📊 FASE 2: ANÁLISIS
Caso de uso: Script que itera sobre Config
Variables identificadas:
- Config (tabla de configuración) → puede ser nil
- v (valores de Config) → depende de Config

Validaciones necesarias:
- if not Config then Config = {} end
- Validar ANTES de iterar

📐 ESTRUCTURA PLANIFICADA:
Zona 1 (líneas 1-10): Declarar Config
Zona 2 (líneas 11-25): Función Create con validación
Zona 3 (líneas 26+): Inicialización

✅ CÓDIGO GENERADO

[código aquí con validación]

🔍 POST-VALIDACIÓN
✅ Config validado antes de pairs()
✅ Sin forward references
✅ Orden correcto

📋 CHECKLIST FINAL:
- [✅] Lectura obligatoria completada
- [✅] Variables identificadas
- [✅] Validaciones aplicadas
- [✅] Orden correcto
- [✅] Listo para Studio
```

✅ Resultado visible:
- Se vio el razonamiento completo
- Se verificó cada punto
- Se sabe qué se validó
- Código sin errores

---

## COMANDO PARA VERIFICAR ESTO

```bash
# El usuario ejecuta esto:
npm run validate:lua ./mi_script.lua
npm run validate:api ./mi_script.lua

# Debe mostrar:
✅ SIN ERRORES DETECTADOS
✅ API VÁLIDA
```

---

## GARANTÍA CON PROTOCOLO VISIBLE

Si el modelo:
1. ✅ Muestra lectura de archivos (visible en reasoning)
2. ✅ Muestra análisis de variables (visible)
3. ✅ Muestra validaciones planeadas (visible)
4. ✅ Muestra verificación del código (visible)
5. ✅ Ejecuta validadores (visible)
6. ✅ Muestra resultado final (visible)

Entonces: **El código será 100% correcto**

---

**FECHA**: 5/12/2025
**VERSIÓN**: 1.0
**GARANTÍA**: Protocolo totalmente visible o NO SE ENTREGA
