# 📘 GUÍA DE INTEGRACIÓN - Modelos IA en tu WebApp

**FECHA**: 5/12/2025  
**VERSIÓN**: 1.0  
**PROPÓSITO**: Configurar sistemas de IA para generar código Roblox/UI sin errores

---

## 🎯 OBJETIVO FINAL

Tus modelos de IA deben:
1. ✅ Generar código **100% correcto** (sin errores rojos/naranjas)
2. ✅ Respetar **líneas exactas** (500, 1000, 1500, 2000)
3. ✅ Crear **UI/UX hermoso** sin sacrificar calidad
4. ✅ Comentarios **SOLO al inicio** (configurables)
5. ✅ Código **limpio** (sin comentarios internos)

---

## 📋 PASO 1: INTEGRAR PROMPT EN TU WEBAPP

### Opción A: Inyección de prompts (RECOMENDADO)

En tu webapp, ANTES de enviar cualquier solicitud a un modelo IA:

```javascript
const PROMPT_MAESTRO = `
[Aquí va COMPLETO el contenido de PROMPT_IA_PRODUCCION_2025.md]
`;

async function generateRobloxCode(userRequest, lineCount) {
    // 1. Inyectar prompt maestro PRIMERO
    const fullPrompt = PROMPT_MAESTRO + "\n\n" + userRequest;
    
    // 2. Enviar a modelo IA
    const response = await callAIModel({
        prompt: fullPrompt,
        maxTokens: calculateTokens(lineCount),
        temperature: 0.3  // Baja temperatura para consistencia
    });
    
    // 3. Validar respuesta
    return validateResponse(response, lineCount);
}

function calculateTokens(lineCount) {
    // 1 línea Lua ≈ 4-5 tokens
    return lineCount * 5;
}
```

### Opción B: System prompt (Alternative)

Si tu modelo IA permite system prompts (como Claude, GPT):

```javascript
const systemPrompt = `
Eres un experto en generación de código Roblox/Lua.

[Integrar los requisitos principales del PROMPT_IA_PRODUCCION_2025.md]

OBLIGATORIO:
- Validar TODAS las propiedades en ROBLOX_API_REAL.md
- Respetar líneas exactas (±5%)
- Comentarios SOLO al inicio
- Sin errores rojos (nil indexing)
- Sin errores naranjas (forward references)
`;
```

---

## 📊 PASO 2: INTERFAZ DE USUARIO

### Campo de entrada necesario

```
┌─────────────────────────────────────┐
│ Generador de Código Roblox UI       │
├─────────────────────────────────────┤
│                                     │
│ Descripción: [__________________]  │
│                                     │
│ Líneas de código:                   │
│ ○ 500   ○ 1000   ○ 1500   ○ 2000  │
│                                     │
│ Estilo UI/UX:                       │
│ ○ Moderno   ○ Minimalista   ○ Game │
│                                     │
│ Color primario: [color picker]      │
│ Color secundario: [color picker]    │
│                                     │
│ [Generar Código]  [Copiar]          │
│                                     │
├─────────────────────────────────────┤
│ Resultado:                          │
│ [Código generado]                   │
│ Líneas: 1005 ✅                     │
│ Errores: 0 ✅                       │
└─────────────────────────────────────┘
```

### Validador visual

```javascript
function displayValidation(code) {
    return {
        lineCount: code.split('\n').length,
        hasRedErrors: detectNilIndexing(code),
        hasOrangeErrors: detectForwardReferences(code),
        validProperties: validateAPIProperties(code),
        commentType: detectCommentStructure(code),
        readyForStudio: checkFinalValidation(code)
    };
}
```

---

## 🔍 PASO 3: VALIDADORES INTEGRADOS

### Validador de líneas

```javascript
function validateLineCount(code, requested) {
    const actual = code.split('\n').filter(l => l.trim()).length;
    const tolerance = requested * 0.05;  // ±5%
    const min = requested - tolerance;
    const max = requested + tolerance;
    
    return {
        requested,
        actual,
        valid: actual >= min && actual <= max,
        percentage: ((actual - requested) / requested * 100).toFixed(1)
    };
}
```

### Validador de errores rojos

```javascript
function detectNilIndexing(code) {
    const patterns = [
        /pairs\s*\(\s*(?!.*if\s+not)/g,  // pairs sin validación
        /\.[\w]+\s*(?=\n)/g,              // Acceso sin validación
        /FindFirstChild\s*\([^)]*\)\s*(?!\s*if\s+not)/g  // FindFirstChild sin if
    ];
    
    return patterns.some(p => p.test(code));
}
```

### Validador de errores naranjas

```javascript
function detectForwardReferences(code) {
    const lines = code.split('\n');
    const declarations = {};
    const usages = {};
    
    lines.forEach((line, idx) => {
        const fnMatch = line.match(/local\s+function\s+(\w+)/);
        if (fnMatch) {
            declarations[fnMatch[1]] = idx;
        }
        
        const callMatch = line.match(/(\w+)\s*\(/g);
        if (callMatch) {
            callMatch.forEach(call => {
                const fnName = call.replace(/\s*\(/, '');
                usages[fnName] = usages[fnName] || [];
                usages[fnName].push(idx);
            });
        }
    });
    
    return Object.entries(usages).some(([fn, uses]) => {
        return uses.some(useIdx => useIdx < (declarations[fn] || Infinity));
    });
}
```

### Validador de API Roblox

```javascript
function validateAPIProperties(code) {
    // Lista de propiedades VÁLIDAS de ROBLOX_API_REAL.md
    const validProperties = {
        UIStroke: ['Color', 'Thickness', 'Transparency', 'Enabled'],
        UICorner: ['CornerRadius'],
        TextButton: ['Text', 'TextColor3', 'TextSize', 'Font', 'Activated'],
        TextLabel: ['Text', 'TextColor3', 'TextSize', 'Font', 'RichText'],
    };
    
    const invalidUsages = [];
    
    Object.entries(validProperties).forEach(([obj, props]) => {
        props.forEach(prop => {
            if (!code.includes(`${obj}.${prop}`)) {
                // Verificar que no esté usando propiedades inválidas
                const invalidPattern = new RegExp(`${obj}\\.((?!${props.join('|')})\\w+)`, 'g');
                const matches = code.match(invalidPattern);
                if (matches) {
                    invalidUsages.push(...matches);
                }
            }
        });
    });
    
    return {
        valid: invalidUsages.length === 0,
        invalid: invalidUsages
    };
}
```

---

## ⚙️ PASO 4: CONFIGURACIÓN DE MODELOS

### Claude API

```javascript
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic();

async function generateWithClaude(prompt, lineCount) {
    const systemPrompt = require('./PROMPT_IA_PRODUCCION_2025.md');
    
    const message = await client.messages.create({
        model: "claude-3.5-sonnet",
        max_tokens: calculateTokens(lineCount),
        system: systemPrompt,
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.3  // Baja para código consistente
    });
    
    return message.content[0].text;
}
```

### OpenAI API

```javascript
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function generateWithGPT(prompt, lineCount) {
    const systemPrompt = require('./PROMPT_IA_PRODUCCION_2025.md');
    
    const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        max_tokens: calculateTokens(lineCount),
        system: systemPrompt,
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.3
    });
    
    return completion.choices[0].message.content;
}
```

### OpenRouter API (RECOMENDADO)

```javascript
async function generateWithOpenRouter(prompt, lineCount) {
    const systemPrompt = require('./PROMPT_IA_PRODUCCION_2025.md');
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "openai/gpt-4-turbo",  // O cualquier modelo
            max_tokens: calculateTokens(lineCount),
            system: systemPrompt,
            messages: [{
                role: "user",
                content: prompt
            }],
            temperature: 0.3
        }),
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
}
```

---

## 📝 PASO 5: ESTRUCTURA DE SOLICITUD

### Formato estándar

```javascript
function createRequest(userInput, lineCount, theme) {
    return `
Generar LocalScript Roblox con siguiente especificación:

DESCRIPCIÓN: ${userInput.description}

LÍNEAS DE CÓDIGO: ${lineCount}

TEMA UI/UX: ${theme.style}
Colores:
  - Primario: ${theme.primary}
  - Secundario: ${theme.secondary}
  - Acentos: ${theme.accent}

REQUISITOS:
1. Código EXACTO de ${lineCount} líneas (±5%)
2. Comentarios SOLO al inicio (explicativos)
3. Sin comentarios dentro del código
4. Hermoso a nivel UI/UX
5. Sin errores rojos (nil indexing)
6. Sin errores naranjas (forward references)
7. Propiedades verificadas en ROBLOX_API_REAL.md

OBLIGATORIO mostrar:
1. ✅ Lectura de documentación
2. ✅ Análisis de variables
3. ✅ Plan de validaciones
4. ✅ Código estructurado
5. ✅ Checklist final

Protocolo PROMPT_IA_PRODUCCION_2025.md aplicable.
`;
}
```

---

## 🧪 PASO 6: PRUEBAS Y VALIDACIÓN

### Test suite

```javascript
async function testCodeGeneration() {
    const testCases = [
        {
            description: "Botón hermoso",
            lines: 500,
            expectedKeywords: ["TextButton", "UICorner", "Color3"]
        },
        {
            description: "Menú principal",
            lines: 1000,
            expectedKeywords: ["Frame", "ScrollingFrame", "layout"]
        },
        {
            description: "Sistema de inventario",
            lines: 1500,
            expectedKeywords: ["table", "Connect", "function"]
        }
    ];
    
    for (const test of testCases) {
        console.log(`Testing: ${test.description}`);
        
        const code = await generateRobloxCode(
            test.description,
            test.lines
        );
        
        const validation = {
            lines: validateLineCount(code, test.lines),
            redErrors: !detectNilIndexing(code),
            orangeErrors: !detectForwardReferences(code),
            api: validateAPIProperties(code),
            keywords: test.expectedKeywords.every(k => code.includes(k))
        };
        
        console.log("✅ PASS" if allValid else "❌ FAIL", validation);
    }
}
```

---

## 📦 PASO 7: DEPLOYMENT

### En tu webapp

1. **Copiar PROMPT_IA_PRODUCCION_2025.md a tu servidor**
   ```
   /server/prompts/PROMPT_IA_PRODUCCION_2025.md
   ```

2. **Integrar en routes**
   ```javascript
   app.post('/api/generate-code', async (req, res) => {
       const { description, lines, theme } = req.body;
       
       // Cargar prompt
       const prompt = loadPrompt('PROMPT_IA_PRODUCCION_2025');
       
       // Generar
       const code = await generateRobloxCode(description, lines, theme);
       
       // Validar
       const validation = validateCode(code, lines);
       
       // Retornar
       res.json({
           code,
           validation,
           ready: validation.allPass
       });
   });
   ```

3. **Frontend React**
   ```jsx
   function CodeGenerator() {
       const [code, setCode] = useState("");
       const [validation, setValidation] = useState(null);
       
       async function handleGenerate(description, lines) {
           const response = await fetch('/api/generate-code', {
               method: 'POST',
               body: JSON.stringify({ description, lines })
           });
           
           const data = await response.json();
           setCode(data.code);
           setValidation(data.validation);
       }
       
       return (
           <div>
               <textarea value={code} readOnly />
               <ValidationStatus {...validation} />
               <CopyButton text={code} />
           </div>
       );
   }
   ```

---

## 🎯 CHECKLIST DE IMPLEMENTACIÓN

```
PASO 1: Integración
[✅] PROMPT_IA_PRODUCCION_2025.md copiado
[✅] Inyección de prompt implementada
[✅] Modelos IA configurados

PASO 2: Validadores
[✅] Validador de líneas
[✅] Validador de errores rojos
[✅] Validador de errores naranjas
[✅] Validador de API Roblox

PASO 3: UI/UX
[✅] Interfaz de generación creada
[✅] Selector de líneas (500/1000/1500/2000)
[✅] Selector de tema
[✅] Validación visual

PASO 4: Testing
[✅] Pruebas básicas pasadas
[✅] Pruebas de validación pasadas
[✅] Código genera SIN errores

PASO 5: Deployment
[✅] Rutas de API creadas
[✅] Frontend integrado
[✅] Logs de errores
[✅] Monitoreo activo

FINALIZACIÓN:
[✅] Documentación actualizada
[✅] README con instrucciones
[✅] Todo funciona 100%
```

---

## 📞 SOPORTE

Si un modelo IA NO cumple protocolo:

1. **Rechaza inmediatamente**
   ```
   ❌ RECHAZADO - No cumple protocolo
   Veo que NO incluiste:
   - ❌ Lectura de CONTRATO_ROBLOX.md
   - ❌ Análisis de variables
   - ❌ Checklist visual
   
   Regenera con protocolo COMPLETO
   ```

2. **Pide regeneración**
   ```
   Inyecta NUEVAMENTE el prompt COMPLETO:
   [PROMPT_IA_PRODUCCION_2025.md]
   
   LUEGO pide código con especificación
   ```

3. **Escalada**
   - Si sigue fallando → cambia de modelo
   - Prueba con Claude 3.5 Sonnet
   - O usa OpenRouter con múltiples modelos

---

**VERSIÓN**: 1.0  
**FECHA**: 5/12/2025  
**ESTADO**: Listo para implementación  
**RESPONSABILIDAD**: 100% de tu webapp
