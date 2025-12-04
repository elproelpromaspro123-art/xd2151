# Sistema de Rate Limit en Tiempo Real

## Overview

Se ha implementado un sistema completo de **actualización en tiempo real** para los límites de uso (rate limits) de los modelos de IA. Cuando un modelo alcanza su límite, el cliente recibe actualizaciones vía **Server-Sent Events (SSE)** que muestran un countdown exacto del tiempo de reinicio.

## Características

✅ **Captura de headers reales del provider**
- Groq: `x-ratelimit-reset-requests/tokens`, `x-ratelimit-remaining-*`
- OpenRouter: Mismos headers (estándar OpenAI)
- Gemini: `retry-after` header

✅ **Tiempo de reinicio preciso**
- Usa el `retry-after` del provider (servidor autorizado)
- Fallback a backoff exponencial si no está disponible
- Se guarda el tiempo exacto de reinicio en timestamps Unix

✅ **Actualización en vivo cada segundo**
- Servidor envía ticks cada 1000ms vía SSE
- Cliente recibe el tiempo restante actualizado constantemente
- Formato legible: "2m 30s", "45s", "1h 5m"

✅ **Información detallada del provider**
- Requests restantes vs. límite total
- Tokens restantes vs. límite total
- Tiempo de reset para cada métrica

## Arquitectura

### Backend

#### 1. `server/providerLimits.ts` (Actualizado)
Módulo principal de gestión de rate limits:

```typescript
// Parsea retry-after (número o fecha HTTP)
parseRetryAfterHeader(retryAfter: string | number): number

// Registra error con headers del provider
recordRateLimitError(
    modelKey: string,
    apiProvider: ApiProvider,
    responseHeaders?: Record<string, any>,
    retryAfterSeconds?: number
): void

// Obtiene info en tiempo real de un modelo
getRateLimitInfo(modelKey: string): RateLimitInfo

// Obtiene todos los modelos limitados
getAllRateLimitedModels(): Array<ModelLimitInfo>
```

#### 2. `server/rateLimitStream.ts` (Nuevo)
Maneja SSE y broadcasts:

```typescript
// Suscribe al cliente a actualizaciones SSE
subscribeToRateLimits(res: Response, modelKey?: string): void

// Notifica a todos los suscriptores
notifyRateLimitUpdate(modelKey: string): void

// Inicia broadcaster que envía ticks cada segundo
startRateLimitBroadcaster(): void
```

#### 3. `server/routes.ts` (Actualizado)
Captura headers de respuesta:

```typescript
// Para Groq (línea ~920-960)
const responseHeaders = {};
['retry-after', 'x-ratelimit-*'].forEach(name => {
    const value = response.headers.get(name);
    if (value) responseHeaders[name] = value;
});

recordRateLimitError(model, "groq", responseHeaders, retryAfterSeconds);
notifyRateLimitUpdate(model);
```

**Nuevos endpoints:**
- `GET /api/rate-limits?model=llama-3.3-70b` - Info actual de un modelo
- `GET /api/rate-limits` - Info de todos los modelos limitados
- `GET /api/rate-limits/stream?model=llama-3.3-70b` - SSE para actualizaciones en vivo

### Cliente

#### 1. `client/src/hooks/useRateLimitStream.ts` (Nuevo)
Hook para suscribirse a SSE:

```typescript
const { limitInfo, isConnected, error, reconnect } = useRateLimitStream({
    modelKey: 'llama-3.3-70b',
    onUpdate: (info) => console.log('Tiempo restante:', info.formattedTime),
    autoRetry: true,
});
```

#### 2. `client/src/components/RateLimitAlert.tsx` (Nuevo)
Componente UI que muestra:
- Nombre del modelo no disponible
- **Countdown en vivo**: "Se reinicia en: 2m 45s"
- Headers detallados (requests/tokens restantes)
- Estado de conexión SSE

## Flujo Completo

### 1. Error 429 (Rate Limit Hit)

```
Groq API (429 Too Many Requests)
├── Header: retry-after = "2m59s"
├── Header: x-ratelimit-remaining-requests = 0
├── Header: x-ratelimit-reset-tokens = "2m59.56s"
└── ...
```

### 2. Servidor Captura

```typescript
recordRateLimitError("llama-3.3-70b", "groq", {
    "retry-after": "2m59s",
    "x-ratelimit-remaining-requests": "0",
    "x-ratelimit-reset-tokens": "2m59.56s"
}, 179 /* seconds */);

// Almacena resetTime = now + 179000ms
// Notifica a clientes suscriptos
notifyRateLimitUpdate("llama-3.3-70b");
```

### 3. Cliente Conecta

```typescript
// Abre SSE connection
const eventSource = new EventSource(
    '/api/rate-limits/stream?model=llama-3.3-70b'
);

// Escucha eventos
eventSource.addEventListener('rate-limit-update', (e) => {
    const { formattedTime, remainingSeconds, headers } = JSON.parse(e.data);
    // Mostrar: "Se reinicia en: 2m 59s"
    // + detalles de headers
});

eventSource.addEventListener('rate-limit-tick', (e) => {
    // Cada segundo: { formattedTime: "2m 58s", ... }
    // Countdown actualizado
});
```

### 4. UI Actualiza Cada Segundo

- **Segundo 0**: "Se reinicia en: 2m 59s"
- **Segundo 1**: "Se reinicia en: 2m 58s"
- **Segundo 2**: "Se reinicia en: 2m 57s"
- ...
- **Segundo 179**: "Se reinicia en: 0s" (Listo para intentar)

## Documentación Oficial Utilizada

### Groq
- https://console.groq.com/docs/rate-limits
- Headers: `x-ratelimit-reset-requests/tokens`, `retry-after` (solo en 429)
- Formato: "2m59.56s", "7.66s"

### OpenRouter
- https://platform.openai.com/docs/guides/rate-limits
- Headers: `x-ratelimit-reset-requests/tokens` (duración en formato "1s", "6m0s")
- `retry-after`: segundos (número)

### Retry-After HTTP Standard
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After
- Puede ser: número (segundos) o fecha HTTP (RFC 7231)

## Uso en Componentes

```tsx
import { RateLimitAlert } from '@/components/RateLimitAlert';

export function ChatInterface() {
    return (
        <div>
            <RateLimitAlert 
                modelKey="llama-3.3-70b"
                modelName="Llama 3.3 70B"
                onAvailable={() => console.log('Listo!')}
            />
            
            {/* Chat interface aquí */}
        </div>
    );
}
```

O usar el hook directamente:

```tsx
const { limitInfo, isConnected } = useRateLimitStream({
    modelKey: 'qwen-coder',
    onUpdate: (info) => {
        if (!Array.isArray(info) && !info.available) {
            console.log(`Esperando ${info.formattedTime}`);
        }
    }
});
```

## Testing

### Test 1: Verificar captura de headers
```bash
# Trigger 429 rate limit
# Verificar en console.log: "[Rate Limit] model limited for Xs. Headers: {...}"
```

### Test 2: Verificar SSE
```bash
# Abrir DevTools > Network
# Conectar a /api/rate-limits/stream?model=llama-3.3-70b
# Debe recibir eventos "rate-limit-update" y "rate-limit-tick" cada segundo
```

### Test 3: Verificar countdown
```bash
# RateLimitAlert debe mostrar tiempo decreciente
# Validar formato: "2m 30s" → "2m 29s" → ... → "0s"
```

## Mejoras Futuras

- [ ] Persistencia de rate limits en BD (para continuar después de restart)
- [ ] Agregación de límites por organización/usuario
- [ ] Alertas preemptivas (advertencia al 80% del límite)
- [ ] Rate limit predict basado en historicidad
- [ ] Estadísticas de uso por modelo/período

## Notas Importantes

1. **Tiempo del servidor es autoridad**: El `resetTime` viene del `retry-after` del provider, no del cliente
2. **SSE reconecta automáticamente**: El hook reintentar cada 3 segundos si pierde conexión
3. **Headers se guardan por modelo**: Cada modelo tiene su propio estado de límite
4. **Limpienza automática**: Datos de límite se limpian cada 24 horas
5. **Backoff exponencial de fallback**: Si provider no envía `retry-after`, usa backoff progresivo
