# 🎯 PROMPT MAESTRO - Fuerza compliance con CUALQUIER modelo

**USO**: Copia ESTE PROMPT y pégalo ANTES de pedir código Roblox a cualquier modelo

---

## 🚀 CÓMO USAR

1. **Abre conversación con tu modelo** (Claude, ChatGPT, Gemini, etc.)
2. **Pega TODO este prompt** tal cual aparece
3. **ESPERA a que el modelo confirme** que entendió
4. **LUEGO pide código Roblox**

---

## COMIENZA AQUÍ - COPIA TODO ESTO ABAJO

```
═══════════════════════════════════════════════════════════════
🔴 PROTOCOLO OBLIGATORIO - GENERACIÓN DE CÓDIGO ROBLOX
═══════════════════════════════════════════════════════════════

ACEPTAS el siguiente protocolo ANTES de generar CUALQUIER código Roblox/Lua:

FASE 1: LECTURA OBLIGATORIA (DEBO hacer esto)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cuando me pidas código Roblox, YO DEBO:

1. ✅ Leer: CONTRATO_ROBLOX.md
   - Tercer párrafo: Cláusula 2 = Errores prohibidos
   - Nota: pairs(nil) = ERROR ROJO PROHIBIDO

2. ✅ Leer: ROBLOX_DOCUMENTATION.md
   - Sección: Cómo estructurar código
   - Nota: Orden de variables → funciones → handlers

3. ✅ Leer: ROBLOX_VALIDATION.md
   - Sección: Errores naranja más comunes
   - Nota: Forward reference = función antes de definición

4. ✅ Leer: Cualquier ROBLOX_API_REAL.md o documentación de propiedades válidas
   - Verificar que TODA propiedad existe
   - Nota: Si no está documentado = NO EXISTE

MENCIONARÉ EXPLÍCITAMENTE en mi razonamiento:
"✅ Leyendo CONTRATO_ROBLOX.md"
"✅ Leyendo ROBLOX_DOCUMENTATION.md"
[etc]

Si NO ves estas menciones → RECHAZA el código


FASE 2: VALIDACIÓN DE CÓDIGO (DEBO hacer esto)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ANTES de entregar código, DEBO verificar:

CHECKLIST ROJO (Nil indexing):
  ✅ [ ] ¿Todas las variables se validan ANTES de usarlas?
  ✅ [ ] ¿Ningún pairs() sin validación previa?
  ✅ [ ] ¿Sin acceso a propiedades sin validar?
  
  Ejemplo de MALO:
    for k, v in pairs(Config) do  ← MALO, Config puede ser nil
    
  Ejemplo de BUENO:
    if Config then
      for k, v in pairs(Config) do  ← BUENO, Config validado

CHECKLIST NARANJA (Forward references):
  ✅ [ ] ¿Todas las funciones se definen ANTES de usarlas?
  ✅ [ ] ¿Todos los callbacks se definen ANTES de Connect()?
  ✅ [ ] ¿Sin forward references?
  
  Ejemplo de MALO:
    Init()  ← MALO, Init no está definido aún
    local function Init() end
    
  Ejemplo de BUENO:
    local function Init() end  ← BUENO, definido primero
    Init()

CHECKLIST API:
  ✅ [ ] ¿Todas las propiedades existen en Roblox 2025?
  ✅ [ ] ¿Sin propiedades inventadas?
  
  Ejemplo de MALO:
    UIStroke.ApplyToBorder = true  ← MALO, NO EXISTE
    
  Ejemplo de BUENO:
    UIStroke.Color = Color3.new(1, 0, 0)  ← BUENO, existe

ESTRUCTURA CORRECTA:
  ✅ [ ] Zona 1 (líneas 1-20): Variables locales
  ✅ [ ] Zona 2 (líneas 21-50): Funciones helper
  ✅ [ ] Zona 3 (líneas 51-100): Métodos de tabla
  ✅ [ ] Zona 4 (líneas 101+): Handlers y Init

MOSTRARÉ EXPLÍCITAMENTE en el código:
  - Variables validadas (if not X then)
  - Funciones en orden correcto
  - Checklist visual con [✅] o [❌]


FASE 3: MOSTRAR RESULTADO (DEBO hacer esto)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESPUÉS de generar, DEBO mostrar:

📋 VALIDACIÓN COMPLETADA:
   [✅] Lectura obligatoria completada
   [✅] Variables validadas
   [✅] Sin forward references
   [✅] Propiedades válidas
   [✅] Estructura correcta

✅ CÓDIGO LISTO PARA: npm run validate:lua


REGLA CRÍTICA: PROTOCOLO VISIBLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Si NO ves EXPLÍCITAMENTE:
  ❌ Mención de lectura de archivos
  ❌ Análisis de variables
  ❌ Validaciones planeadas
  ❌ Checklist visual
  ❌ Mención de npm run validate:lua

→ EL CÓDIGO NO CUMPLE EL PROTOCOLO
→ RECHAZA INMEDIATAMENTE


ERRORES PROHIBIDOS (NO TOLERO)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 ERROR ROJO - Nil indexing:
  ❌ pairs(nil) o pairs(variable sin validar)
  ❌ variable.property sin validar
  ❌ WaitForChild() sin timeout
  ❌ FindFirstChild() sin if then

🟠 ERROR NARANJA - Forward reference:
  ❌ Usar función ANTES de definirla
  ❌ Usar método ANTES de definirlo
  ❌ Conectar callback ANTES de definir función

🟡 ERROR AMARILLO - Propiedades inválidas:
  ❌ Propiedades que NO existen en Roblox
  ❌ Métodos que NO existen
  ❌ Eventos que NO existen


ACEPTACIÓN O RECHAZO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Aceptaré código SOLO SI:

✅ Veo lectura explícita de archivos (en razonamiento)
✅ Veo análisis de variables
✅ Veo validaciones planeadas
✅ Veo código estructurado correctamente
✅ Veo checklist visual completado
✅ Sin ninguno de los errores prohibidos

Si falta CUALQUIER cosa → RECHAZARÉ y pediré regeneración


CONFIRMACIÓN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ANTES de continuar:

Responde SÍ o NO a cada pregunta:

1. ¿ENTIENDES que debes leer los documentos sobre Roblox?
2. ¿ENTIENDES que debes validar variables ANTES de usarlas?
3. ¿ENTIENDES que debes definir funciones ANTES de usarlas?
4. ¿ENTIENDES que debes mostrar EXPLÍCITAMENTE cada fase?
5. ¿ENTIENDES que rechazaré código que viole esto?

Si respondiste SÍ a las 5 → PROCEDE

Si respondiste NO a alguna → PLANTEA PREGUNTAS AHORA

═══════════════════════════════════════════════════════════════
```

---

## ✅ DESPUÉS QUE EL MODELO CONFIRME

Una vez que el modelo diga "Sí, entiendo", pide código así:

```
"Genera un LocalScript que [tu descripción]

Protocolo obligatorio aplicable.
Muestra EXPLÍCITAMENTE:
1. Lectura de documentos
2. Análisis de variables
3. Validaciones planeadas
4. Código estructurado
5. Checklist visual
"
```

---

## 🚨 SI EL MODELO IGNORA EL PROTOCOLO

Responde así:

```
❌ RECHAZADO - No cumple protocolo

Veo que NO incluiste:
- ❌ Mención de lectura de CONTRATO_ROBLOX.md
- ❌ Análisis de variables
- ❌ Validaciones planeadas
- ❌ Checklist visual

Regenera ESTRICTAMENTE siguiendo el protocolo:

[COPIA EL PROMPT MAESTRO NUEVAMENTE]

Luego: [Tu descripción de código]
```

---

## 📋 VALIDACIÓN LOCAL

Después de copiar el código, ejecuta:

```bash
npm run validate:lua ./script.lua
npm run validate:api ./script.lua

# Ambos DEBEN mostrar: ✅ SIN ERRORES
```

Si hay error → El modelo NO cumplió

---

## 💡 TIPS

1. **Inyecta el prompt PRIMERO**, antes de cualquier otra cosa
2. **Espera confirmación** del modelo (que dice "entiendo")
3. **LUEGO pide código**
4. **Rechaza si no ves** todas las fases visibles
5. **Valida siempre** con npm run

---

## 🎯 GARANTÍA

Si usas este prompt ANTES de pedir código:

✅ Código 100% validado
✅ Sin errores rojos
✅ Sin errores naranjas
✅ Propiedades válidas
✅ Listo para Studio

Si tiene error → El modelo incumplió protocolo

---

**ÚLTIMA ACTUALIZACIÓN**: 5/12/2025
**FUNCIONA CON**: Cualquier modelo AI
**GARANTÍA**: Fuerza compliance o rechazas
