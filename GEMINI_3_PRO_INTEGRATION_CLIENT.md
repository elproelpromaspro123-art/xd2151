# Integración Gemini 3 Pro Preview - Cliente React

## Sincronización Automática

El modelo Gemini 3 Pro Preview se sincroniza automáticamente con el cliente a través del endpoint:

```
GET /api/models
```

**Response Ejemplo:**
```json
{
    "models": [
        {
            "key": "gemini-3-pro-preview",
            "id": "gemini-3-pro-preview",
            "name": "Gemini 3 Pro Preview",
            "description": "Google Gemini 3 Pro Preview - Modelo avanzado con...",
            "supportsImages": true,
            "supportsReasoning": true,
            "isPremiumOnly": false,
            "category": "general",
            "available": true,
            "isRateLimited": false,
            "remainingTime": 0,
            "resetTime": 0,
            "rateLimitInfo": null,
            "reason": null
        },
        // ... otros modelos
    ],
    "isPremium": false
}
```

## Dónde Aparece en la UI

### 1. Selector de Modelos (ChatInput.tsx)
- **Ubicación**: Esquina superior derecha del área de chat
- **Filtrado**: 
  - **Free**: Gemini 3 Pro Preview aparece en la sección "Modelos Gratis"
  - **Premium**: Gemini 3 Pro Preview aparece en ambas secciones

### 2. Badges de Características
El modelo Gemini 3 Pro Preview muestra:
```
Gemini 3 Pro Preview
├─ IMG  (Soporte de imágenes)
├─ R1   (Soporte de razonamiento)
└─ ⭐   (Modelo recomendado)
```

### 3. Indicadores de Rate Limit
Si se alcanza el límite:
```
⚠️ RATE LIMITED
├─ Tiempo restante: 23h 45m
├─ Reset: Mañana a las 10:00 AM
└─ Razón: Límite de rate limit alcanzado
```

## Flujo de Selección

```
ChatPage.tsx
    └─ selectedModel = "gemini-3-pro-preview"
    └─ useQuery('/api/models') → Obtiene lista
    └─ Renderiza ChatInput con:
        ├─ selectedModel: "gemini-3-pro-preview"
        ├─ models: [...]
        └─ onModelChange: (model) => setSelectedModel(model)
```

## Envío de Mensajes

Cuando el usuario selecciona Gemini 3 Pro Preview:

```javascript
// ChatPage.tsx - handleSendMessage()
const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
        conversationId,
        message: userMessage,
        model: 'gemini-3-pro-preview',        // Modelo seleccionado
        useReasoning: enableReasoning,         // Toggle de razonamiento
        useWebSearch: enableWebSearch,         // Toggle de búsqueda
        imageBase64: selectedImage,            // Si hay imagen adjunta
        chatMode: selectedChatMode             // 'roblox' o 'general'
    })
});
```

## Características Habilitadas

### Imágenes
El componente `ImageUploader` en ChatInput detecta automáticamente que el modelo soporta imágenes:

```typescript
// ChatInput.tsx
const canUploadImage = selectedModel?.supportsImages ?? false;

return (
    <>
        {canUploadImage && <ImageUploader />}
        <textarea placeholder="Escribe tu mensaje..." />
    </>
);
```

### Razonamiento
El toggle de razonamiento aparece solo si el modelo lo soporta:

```typescript
// ChatInput.tsx
const canUseReasoning = selectedModel?.supportsReasoning ?? false;

return (
    <>
        {canUseReasoning && (
            <button onClick={() => setUseReasoning(!useReasoning)}>
                {useReasoning ? '🧠 Razonamiento ON' : '🧠 Razonamiento OFF'}
            </button>
        )}
    </>
);
```

### Búsqueda Web
Se detecta automáticamente o puede ser forzada por el usuario:

```typescript
// El sistema detecta palabras clave automáticamente:
const WEB_SEARCH_KEYWORDS = ['busca', 'última', 'nuevo', 'reciente', ...];

// O se puede forzar con toggle
<button onClick={() => setUseWebSearch(!useWebSearch)}>
    {useWebSearch ? '🌐 Búsqueda ON' : '🌐 Búsqueda OFF'}
</button>
```

## Monitoreo en Tiempo Real

### Rate Limits (SSE)
El cliente se suscribe automáticamente a actualizaciones de rate limits:

```javascript
// RateLimitStream.ts
const eventSource = new EventSource('/api/rate-limits/stream');

eventSource.addEventListener('rate-limit-update', (event) => {
    const data = JSON.parse(event.data);
    // {
    //     modelKey: 'gemini-3-pro-preview',
    //     available: false,
    //     remainingTime: 86400000,
    //     resetTime: 1733414400000
    // }
    updateUIWithRateLimitInfo(data);
});
```

### RateLimitAlert Component
El componente `RateLimitAlert.tsx` muestra:

```
┌─────────────────────────────────────────┐
│ ⚠️ GEMINI 3 PRO PREVIEW LIMITADO       │
│                                         │
│ Tiempo restante: 23h 45m 32s           │
│ Se reinicia a las: 10:00 AM Mañana     │
│                                         │
│ Token restante: 0 / 1,000,000          │
│ Request restantes: 0 / 100             │
└─────────────────────────────────────────┘
```

## Almacenamiento de Conversación

Cuando se usa Gemini 3 Pro Preview, los mensajes se guardan con:

```json
{
    "id": "msg-123",
    "conversationId": "conv-123",
    "role": "user",
    "content": "¿Qué ves en esta imagen?",
    "model": "gemini-3-pro-preview",
    "imageBase64": "data:image/png;base64,...",  // Si aplica
    "timestamp": "2025-12-04T10:30:00Z",
    "isMultimodal": true
}
```

## Manejo de Errores en Cliente

### Modelo no disponible (Rate Limit)
```typescript
// ChatPage.tsx
if (response.status === 429) {
    const error = await response.json();
    showRateLimitAlert(error);
    // Mostrar: "Este modelo está limitado. Intenta con otro."
}
```

### Modelo no disponible para Free
```typescript
// ChatInput.tsx
if (model.isPremiumOnly && !isPremium) {
    disableModelOption(model.key);
    // Mostrar badge: "💎 PREMIUM"
}
```

### Imagen incompatible
```typescript
// ImageUploader.tsx
if (!selectedModel.supportsImages) {
    showWarning('Este modelo no soporta imágenes');
}
```

## Optimizaciones

### 1. Caching
Los modelos se cachean con TanStack Query:

```typescript
const { data: modelsData } = useQuery({
    queryKey: ['models'],
    queryFn: () => fetch('/api/models').then(r => r.json()),
    staleTime: 1000 * 60 * 5, // 5 minutos
});
```

### 2. Lazy Loading
Las características se cargan bajo demanda:

```typescript
// Solo cargar ImageUploader si supportsImages = true
const ImageUploader = lazy(() => import('./ImageUploader'));

return (
    <>
        {selectedModel?.supportsImages && <ImageUploader />}
    </>
);
```

### 3. Throttling de Búsquedas
La búsqueda web se limita a 5/3 días en free:

```typescript
const canSearch = usageStats.webSearchCount < 5 || isPremium;

if (!canSearch) {
    showWarning('Has usado tu límite de búsquedas. Próximo reset en 2 días.');
    disableSearchButton();
}
```

## Testing

### Verificar que aparece en selector
```javascript
// En developer tools
const models = document.querySelectorAll('[data-model-key]');
const gemini3 = Array.from(models).find(m => 
    m.getAttribute('data-model-key') === 'gemini-3-pro-preview'
);
console.log(gemini3?.textContent); // "Gemini 3 Pro Preview"
```

### Enviar un mensaje
```javascript
// Abrir consola de Network
// Ir al chat
// Seleccionar "Gemini 3 Pro Preview"
// Enviar: "Analiza esta imagen" con una imagen
// Ver POST a /api/chat
// Verificar: "model": "gemini-3-pro-preview"
```

### Monitorear Rate Limits
```javascript
// En la consola
const eventSource = new EventSource('/api/rate-limits/stream');
eventSource.addEventListener('rate-limit-update', (e) => {
    console.log('Rate limit update:', JSON.parse(e.data));
});
```

## Checklist de Verificación

- ✅ Modelo aparece en el selector de modelos
- ✅ Muestra badges correctos (IMG, R1, ⭐)
- ✅ Imagen se puede subir (supportsImages = true)
- ✅ Toggle de razonamiento disponible (supportsReasoning = true)
- ✅ Se puede enviar mensajes correctamente
- ✅ SSE stream funciona
- ✅ Rate limits se muestran en tiempo real
- ✅ Funciona en Free y Premium
- ✅ Historial se guarda correctamente
- ✅ Regeneración funciona

## Debugging

### Ver peticiones de API
```javascript
// Chrome DevTools > Network
// Filter: "chat"
// Verificar payload y response
```

### Ver logs del servidor
```bash
npm run dev
# Buscar logs que contengan:
# [streamGeminiCompletion] Starting with model: gemini-3-pro-preview
```

### Simular Rate Limit
```javascript
// Enviar muchos mensajes seguidos hasta alcanzar el límite
// Verificar que aparece el alerta
// Verificar que el contador es exacto
```
