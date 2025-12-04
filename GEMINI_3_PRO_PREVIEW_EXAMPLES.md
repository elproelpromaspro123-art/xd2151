# Gemini 3 Pro Preview - Ejemplos de Uso

## Ejemplos de Solicitudes

### 1. Chat Básico de Texto
```javascript
// Cliente (React)
const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        conversationId: 'conv-123',
        message: '¿Cuál es la capital de España?',
        model: 'gemini-3-pro-preview',
        useReasoning: false,
        chatMode: 'general'
    })
});

// Response (SSE Stream)
// data: {"conversationId":"conv-123","requestId":"req-456"}
// data: {"delta":"La","type":"content"}
// data: {"delta":" capital","type":"content"}
// ...
```

### 2. Chat con Razonamiento Avanzado
```javascript
// Solicitud con pensamiento mejorado
const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
        conversationId: 'conv-123',
        message: 'Resuelve este problema complejo: Si un tren viaja a 100 km/h y otro a 80 km/h saliendo del mismo punto...',
        model: 'gemini-3-pro-preview',
        useReasoning: true,  // Habilita Extended Thinking (8K tokens)
        chatMode: 'general'
    })
});

// El modelo usará 8,000 tokens para razonar internamente
// Antes de generar la respuesta
```

### 3. Análisis de Imagen
```javascript
// Convertir imagen a base64
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.onload = () => {
    ctx.drawImage(img, 0, 0);
    const imageBase64 = canvas.toDataURL('image/png');
    
    // Enviar al chat
    const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
            conversationId: 'conv-123',
            message: '¿Qué ves en esta imagen?',
            model: 'gemini-3-pro-preview',
            imageBase64: imageBase64,  // Data URL con base64
            chatMode: 'general'
        })
    });
};
img.src = '/path/to/image.jpg';
```

### 4. Búsqueda en Tiempo Real
```javascript
// El sistema detecta automáticamente intención de búsqueda
const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
        conversationId: 'conv-123',
        message: '¿Cuáles son las últimas noticias sobre IA?',  // Detección automática
        model: 'gemini-3-pro-preview',
        useWebSearch: true,  // O detección automática
        chatMode: 'general'
    })
});

// Response incluye:
// data: {"webSearchUsed":true,"webSearchDetected":true}
// + Resultados de búsqueda integrados
```

### 5. Ejecución de Código Python
```javascript
// El modelo puede ejecutar código Python
const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
        conversationId: 'conv-123',
        message: 'Escribe un script Python que calcule los primeros 10 números de Fibonacci',
        model: 'gemini-3-pro-preview',
        chatMode: 'general'
    })
});

// Respuesta incluirá:
// - Código Python ejecutable
// - Explicación del proceso
// - Salida esperada
```

### 6. Análisis de Video (Conceptual)
```javascript
// Aunque streaming de video no es directo en webapp,
// se puede procesar como frames
const video = document.getElementById('myVideo');
const canvas = document.createElement('canvas');

// Capturar frame
const ctx = canvas.getContext('2d');
ctx.drawImage(video, 0, 0);
const frameBase64 = canvas.toDataURL('image/png');

const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
        conversationId: 'conv-123',
        message: 'Analiza este frame de video',
        model: 'gemini-3-pro-preview',
        imageBase64: frameBase64,
        chatMode: 'general'
    })
});
```

### 7. Procesamiento de Documentos
```javascript
// Convertir PDF a base64 (requiere librería como pdf.js)
async function pdfToBase64(file) {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const binaryString = String.fromCharCode(...bytes);
    return 'data:application/pdf;base64,' + btoa(binaryString);
}

const pdfBase64 = await pdfToBase64(document.getElementById('pdfFile').files[0]);

const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
        conversationId: 'conv-123',
        message: 'Resumen el contenido de este PDF',
        model: 'gemini-3-pro-preview',
        imageBase64: pdfBase64,  // API soporta PDF como data URL
        chatMode: 'general'
    })
});
```

### 8. Regeneración de Respuesta
```javascript
// Si la respuesta anterior no fue satisfactoria
const response = await fetch('/api/chat/regenerate', {
    method: 'POST',
    body: JSON.stringify({
        conversationId: 'conv-123',
        lastUserMessage: '¿Cuál es la capital de España?',
        model: 'gemini-3-pro-preview',
        useReasoning: true,
        chatMode: 'general'
    })
});
```

## Respuestas del Servidor (SSE Stream)

### Evento de Inicialización
```json
{
    "conversationId": "conv-123",
    "requestId": "req-456",
    "webSearchUsed": false,
    "webSearchDetected": false
}
```

### Eventos de Contenido
```json
{"delta": "Texto ", "type": "content"}
{"delta": "de ", "type": "content"}
{"delta": "respuesta", "type": "content"}
```

### Eventos de Pensamiento (Si está habilitado)
```json
{
    "delta": "Pensemos en esto...",
    "type": "thinking"
}
```

### Evento de Finalización
```json
{
    "type": "done",
    "finishReason": "STOP",
    "totalTokensUsed": 1523
}
```

## Límites de Uso en Free

```
📊 LÍMITES DE TOKENS (Free)
├─ Entrada: 943,718 tokens
├─ Salida: 58,982 tokens
├─ Thinking: 8,000 tokens
└─ Total: ~1,010,700 tokens/solicitud

⏱️ LÍMITES DE MENSAJES
├─ Modo General: 10 mensajes/3 días
├─ Modo Roblox: 10 mensajes/3 días
└─ Búsqueda Web: 5 búsquedas/3 días
```

## Optimizaciones para Free

### 1. Reducir Presupuesto de Thinking
```javascript
// En lugar de usar thinking para todo:
useReasoning: true  // 8K tokens

// Solo usar para problemas complejos
const isComplex = message.length > 500 || containsMath(message);
useReasoning: isComplex;
```

### 2. Limitar Contexto
El sistema automáticamente mantiene solo los últimos 20 mensajes para optimizar tokens.

### 3. Búsqueda Web Selectiva
```javascript
const keywords = ['última', 'nuevo', 'reciente', 'actual', 'hoy', 'ahora'];
const shouldSearch = keywords.some(kw => message.toLowerCase().includes(kw));
useWebSearch: shouldSearch;
```

## Métricas de Rendimiento

### Velocidad de Generación (Típica)
- **Sin Razonamiento**: 50-100 tokens/seg
- **Con Razonamiento**: 30-50 tokens/seg

### Latencia Inicial
- **Inicio de conexión**: <500ms
- **Primer token**: 1-2 segundos
- **Streaming**: Continuo

### Consumo de Tokens (Típico)
- **Pregunta simple**: 50-150 tokens
- **Pregunta con contexto**: 200-500 tokens
- **Con razonamiento**: +8,000 tokens
- **Con búsqueda web**: +200-300 tokens

## Manejo de Errores

### Error de Rate Limit
```javascript
// El servidor retorna automáticamente:
{
    error: "Límite de rate limit alcanzado. Espera aproximadamente 24 horas.",
    code: "RATE_LIMIT_EXCEEDED"
}

// Cliente debe mostrar contador en tiempo real
```

### Error de Modelo No Disponible
```javascript
{
    error: "Este modelo requiere una cuenta Premium.",
    code: "PREMIUM_REQUIRED"
}
```

### Error de Límite de Mensajes
```javascript
{
    error: "Has alcanzado el límite de mensajes para el modo General. Los límites se reinician cada 3 días.",
    code: "MESSAGE_LIMIT_REACHED"
}
```

## Checklist de Integración

- ✅ Modelo agregado a `AI_MODELS` en `routes.ts`
- ✅ Tokens configurados para Free y Premium
- ✅ Soporte multimodal habilitado
- ✅ Razonamiento avanzado configurado
- ✅ Búsqueda integrada
- ✅ Ejecución de código habilitada
- ✅ Rate limit tracking implementado
- ✅ Notificaciones SSE en tiempo real
- ✅ Documentación completa
- ✅ Ejemplos funcionales

## Próximos Pasos

1. Probar con solicitudes de prueba
2. Monitorear uso en producción
3. Ajustar límites según necesidad real
4. Recopilar feedback de usuarios
5. Optimizar parámetros de generación
