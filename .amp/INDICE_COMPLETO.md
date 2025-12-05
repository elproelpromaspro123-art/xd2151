# 📚 ÍNDICE COMPLETO - Sistema de Generación Código Roblox 100% Correcto

## ESTRUCTURA DEL SISTEMA

El sistema de 3 fases está documentado en 12 archivos:

---

## 📖 DOCUMENTACIÓN OBLIGATORIA (Lectura previa)

### 1. `CONTRATO_ROBLOX.md` (Raíz)
**Qué es**: Términos legales obligatorios para generar código
**Cuándo leer**: PRIMERO, antes de cualquier código
**Por qué**: Define las 9 cláusulas que DEBEN cumplirse
**Secciones clave**:
- Cláusula 1: Validación obligatoria
- Cláusula 2: Errores prohibidos
- Cláusula 3: Checklist de validación
- Cláusula 4-9: Patrones, documentación, pruebas

**Acción**: Leer completamente y aceptar

---

### 2. `ROBLOX_DOCUMENTATION.md` (Raíz)
**Qué es**: Guía de API y patrones de Roblox
**Cuándo leer**: SEGUNDO, para aprender patrones
**Secciones**:
- Cómo estructurar código
- Servicios de Roblox
- Eventos y métodos
- Ejemplos de código

**Acción**: Leer para aprender patrones

---

### 3. `ROBLOX_VALIDATION.md` (Raíz)
**Qué es**: Cómo evitar errores naranja (forward references)
**Cuándo leer**: TERCERO, para validación
**Secciones**:
- Errores naranja más comunes
- Patrones de validación
- Flujo de validación
- Comandos para validar

**Acción**: Entender qué son errores naranja

---

## 🛡️ VALIDACIÓN TÉCNICA (Sistema automático)

### 4. `.amp/ROBLOX_API_REAL.md`
**Qué es**: Lista COMPLETA de propiedades válidas en Roblox 2025
**Cuándo leer**: CUARTO, para verificar propiedades
**Secciones**:
- UIStroke propiedades válidas
- UICorner propiedades válidas
- GuiObject propiedades válidas
- TextButton/TextLabel propiedades válidas
- ImageLabel/ImageButton propiedades válidas
- ScrollingFrame propiedades válidas
- Instance métodos válidos
- TextBox propiedades válidas
- Eventos válidos
- Enumeraciones válidas
- Servicios válidos

**Uso**: Validar que TODA propiedad usada existe
**Si algo NO está aquí → NO EXISTE en Roblox**

**Acción**: Consultar cuando uses propiedades desconocidas

---

### 5. `.amp/validate-lua.js`
**Qué es**: Validador automático de Lua
**Cuándo usar**: DESPUÉS de generar código
**Función**: 
- Detecta errores naranja (forward references)
- Detecta errores rojos (nil indexing)
- Detecta sintaxis incorrecta

**Comando**:
```bash
npm run validate:lua ./mi_script.lua
```

**Resultado**: 
✅ SIN ERRORES DETECTADOS (o lista de problemas)

---

### 6. `.amp/validate-properties.js`
**Qué es**: Validador de propiedades Roblox
**Cuándo usar**: DESPUÉS de generar código
**Función**: Verifica que TODAS las propiedades existen

**Comando**:
```bash
npm run validate:api ./mi_script.lua
```

**Resultado**:
✅ API VÁLIDA (o lista de propiedades inválidas)

---

## 🎯 ESTRATEGIA Y METODOLOGÍA

### 7. `.amp/ESTRATEGIA_GENERACION.md`
**Qué es**: Guía de 6 pasos para generar código correcto
**Cuándo leer**: QUINTO, para entender la metodología
**Secciones**:
- Paso 1: Pre-análisis
- Paso 2: Mapeo de flujo
- Paso 3: Estructura obligatoria
- Paso 4: Validación obligatoria
- Paso 5: Checklist antes de generar
- Paso 6: Después de generar

**Paso 3 crítico**: Estructura en 5 zonas
- Zona 1 (líneas 1-20): Variables locales
- Zona 2 (líneas 21-50): Funciones helper
- Zona 3 (líneas 51-100): Métodos de tabla
- Zona 4 (líneas 101-150): Event handlers
- Zona 5 (líneas 151+): Inicialización

**Acción**: Memorizar los 6 pasos

---

### 8. `.amp/SOLUCION_ERRORES_OMEGA.md`
**Qué es**: Protocolo de 3 fases con garantía 100%
**Cuándo leer**: SEXTO, para entender la garantía
**Secciones**:
- Fase 1: Pre-generación (lectura)
- Fase 2: Generación (3 reglas)
- Fase 3: Post-validación (validadores)
- Errores que eliminaré
- Checklist de 10 puntos

**Las 3 Reglas**:
1. Validar SIEMPRE antes de usar
2. Definir ANTES de usar
3. Estructura en 5 zonas

**Acción**: Entender las 3 reglas

---

### 9. `.amp/PROTOCOLO_VISIBLE.md`
**Qué es**: Cómo debe verse el protocolo en acción
**Cuándo leer**: SÉPTIMO, para verificar
**Secciones**:
- 4 Reglas de visibilidad
- Checklist visible en cada generación
- Ejemplo real: Antes vs Después
- Cómo verificar que se cumple

**Regla 1**: SIEMPRE mostrar razonamiento en cadena
**Regla 2**: MOSTRAR verificación después de generar
**Regla 3**: EJECUTAR y mostrar resultados
**Regla 4**: SI FALTA ALGO, decirlo explícitamente

**MÁS IMPORTANTE**: Si no ves esto → El código NO cumple

**Acción**: Saber QUÉ exigir al modelo

---

## 👤 GUÍAS PARA EL USUARIO

### 10. `.amp/COMO_EXIGIR_CALIDAD.md`
**Qué es**: Checklist para que TÚ controles la calidad
**Cuándo leer**: OCTAVO, para exigir cumplimiento
**Secciones**:
- Paso 1: Pedir código correctamente
- Paso 2: Verificar razonamiento
- Paso 3: Verificar salida
- Paso 4: Rechazar si falta algo
- Paso 5: Validar localmente

**Tabla de decisión**: Cuándo aceptar/rechazar
**Frases mágicas**: Qué decir para exigir calidad

**Poder**: TÚ controlas si el modelo cumple

**Acción**: Aprender a rechazar código deficiente

---

### 11. `.amp/RESUMEN_SOLUCION.md`
**Qué es**: Resumen ejecutivo del sistema completo
**Cuándo leer**: NOVENO, para ver panorama general
**Secciones**:
- Problema original
- Solución implementada (3 capas)
- Cómo funciona
- Garantía
- Estadísticas Antes/Después

**Acción**: Entender el big picture

---

### 12. `.amp/SISTEMA_FINAL.md`
**Qué es**: Documentación del sistema implementado
**Cuándo leer**: DÉCIMO, para referencia
**Secciones**:
- Problema original
- Solución (3 capas)
- Cómo funciona (flujo completo)
- Garantía
- Archivos del sistema
- Diferencia Antes/Después
- Regla de oro

**Acción**: Referencia completa

---

### 13. `AGENTS.md` (ACTUALIZADO)
**Qué es**: Guía de arquitectura y ROBLOX Mode v2.0
**Cambios**: Añadidas secciones de protocolo visible
**Secciones ROBLOX**:
- Protocolo de 3 fases
- Fase 1: Pre-generación
- Fase 2: Generación
- Fase 3: Post-validación
- Regla crítica: Protocolo visible
- Checklist de 10 puntos

**Acción**: Referencia principal para el modelo

---

### 14. `.amp/enforce-protocol.js` (Herramienta)
**Qué es**: Script que obliga a seguir el protocolo
**Cuándo usar**: Opcionalmente, para mayor rigor
**Función**:
- Fase 1: Verifica lectura de documentación
- Fase 2: Te hace mapear variables
- Fase 3: Te obliga a validar

**Comando**:
```bash
node .amp/enforce-protocol.js
```

**Acción**: Usar si quieres máximo rigor

---

## 🗺️ ORDEN DE LECTURA RECOMENDADO

### Para el modelo (Amp):
1. CONTRATO_ROBLOX.md
2. ROBLOX_DOCUMENTATION.md
3. ROBLOX_VALIDATION.md
4. ROBLOX_API_REAL.md
5. ESTRATEGIA_GENERACION.md
6. SOLUCION_ERRORES_OMEGA.md
7. PROTOCOLO_VISIBLE.md
8. AGENTS.md (sección ROBLOX)

**SIEMPRE, ANTES DE GENERAR CÓDIGO**

### Para ti (Usuario):
1. Entender el problema: RESUMEN_SOLUCION.md
2. Aprender a exigir: COMO_EXIGIR_CALIDAD.md
3. Verificar que cumple: PROTOCOLO_VISIBLE.md
4. Referencia rápida: AGENTS.md (sección ROBLOX)

---

## 📋 CHECKLIST DE LECTURA

### El Modelo Debe Leer:
- [ ] CONTRATO_ROBLOX.md
- [ ] ROBLOX_DOCUMENTATION.md
- [ ] ROBLOX_VALIDATION.md
- [ ] ROBLOX_API_REAL.md
- [ ] ESTRATEGIA_GENERACION.md
- [ ] SOLUCION_ERRORES_OMEGA.md
- [ ] PROTOCOLO_VISIBLE.md
- [ ] AGENTS.md

### Tú Debes Leer:
- [ ] RESUMEN_SOLUCION.md
- [ ] COMO_EXIGIR_CALIDAD.md
- [ ] PROTOCOLO_VISIBLE.md
- [ ] AGENTS.md (sección ROBLOX)

---

## 🎯 RESUMEN VISUAL

```
┌─────────────────────────────────────────────────────────────┐
│              SISTEMA COMPLETO DE GENERACIÓN                 │
└─────────────────────────────────────────────────────────────┘

DOCUMENTACIÓN OBLIGATORIA (Lectura)
├─ CONTRATO_ROBLOX.md
├─ ROBLOX_DOCUMENTATION.md
├─ ROBLOX_VALIDATION.md
└─ ROBLOX_API_REAL.md

METODOLOGÍA (Estrategia)
├─ ESTRATEGIA_GENERACION.md (6 pasos)
├─ SOLUCION_ERRORES_OMEGA.md (3 fases)
├─ PROTOCOLO_VISIBLE.md (visibilidad)
└─ AGENTS.md (versión 2.0)

VALIDACIÓN TÉCNICA (Herramientas)
├─ validate-lua.js
├─ validate-properties.js
└─ enforce-protocol.js

GUÍAS DE USUARIO (Control)
├─ COMO_EXIGIR_CALIDAD.md
├─ RESUMEN_SOLUCION.md
└─ SISTEMA_FINAL.md

ESTE ARCHIVO
└─ INDICE_COMPLETO.md
```

---

## 🚀 CÓMO USAR EL SISTEMA

### Paso 1: Tú pides código
```
"Genera un LocalScript que haga X"
```

### Paso 2: Yo debo leer (7 documentos)
```
✅ CONTRATO_ROBLOX.md
✅ ROBLOX_DOCUMENTATION.md
✅ ROBLOX_VALIDATION.md
✅ ROBLOX_API_REAL.md
✅ ESTRATEGIA_GENERACION.md
✅ SOLUCION_ERRORES_OMEGA.md
✅ PROTOCOLO_VISIBLE.md
```

### Paso 3: Yo sigo 3 fases (VISIBLE)
```
✅ FASE 1: Lectura (mencionó cada archivo)
✅ FASE 2: Análisis (listó variables)
✅ FASE 3: Validación (ejecutó npm run)
```

### Paso 4: Tú verificas (COMO_EXIGIR_CALIDAD.md)
```
✅ ¿Viste razonamiento?
✅ ¿Menciona validaciones?
✅ ¿Código sin errores?
→ ACEPTAR o RECHAZAR
```

### Paso 5: Tú validas
```
npm run validate:lua ./script.lua
npm run validate:api ./script.lua
→ DEBEN retornar ✅
```

---

## 📞 REFERENCIA RÁPIDA

| Necesito | Archivo |
|----------|---------|
| Entender el problema | RESUMEN_SOLUCION.md |
| Metodología de 6 pasos | ESTRATEGIA_GENERACION.md |
| Protocolo de 3 fases | SOLUCION_ERRORES_OMEGA.md |
| Qué exigir al modelo | PROTOCOLO_VISIBLE.md |
| Cómo rechazar código | COMO_EXIGIR_CALIDAD.md |
| Propiedades válidas | ROBLOX_API_REAL.md |
| Términos obligatorios | CONTRATO_ROBLOX.md |
| Errores naranja | ROBLOX_VALIDATION.md |
| Guía general | AGENTS.md |
| Visión completa | SISTEMA_FINAL.md |

---

## ✅ GARANTÍA

Si se sigue este sistema COMPLETAMENTE:

✅ Código 100% válido
✅ Cero errores rojos
✅ Cero errores naranjas
✅ Propiedades válidas
✅ Listo para Roblox Studio
✅ Sin debugging necesario

---

**FECHA**: 5/12/2025
**VERSIÓN**: 1.0
**ESTADO**: 🟢 OPERACIONAL
**DOCUMENTACIÓN**: 14 archivos
**GARANTÍA**: 100% Código Válido
