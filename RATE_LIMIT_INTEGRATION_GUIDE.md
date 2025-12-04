# Guía de Integración: Sistema de Rate Limit en Tiempo Real

## ¿Qué se implementó?

Un sistema completo que:
1. **Captura headers reales** de los providers (Groq, OpenRouter, Gemini)
2. **Registra el tiempo exacto** cuando un modelo alcanza rate limit
3. **Envía actualizaciones cada segundo** vía SSE (Server-Sent Events)
4. **Muestra countdown en vivo** del tiempo de reinicio en la UI

## Archivos Creados/Modificados

### Backend
- ✅ `server/providerLimits.ts` - Actualizado con parseo de headers y funciones nuevas
- ✅ `server/rateLimitStream.ts` - **Nuevo**: Sistema de SSE y broadcasting
- ✅ `server/routes.ts` - Actualizado: captura headers en errores 429, nuevos endpoints

### Frontend
- ✅ `client/src/hooks/useRateLimitStream.ts` - **Nuevo**: Hook para SSE
- ✅ `client/src/components/RateLimitAlert.tsx` - **Nuevo**: Componente UI de alerta

### Documentación
- ✅ `RATE_LIMIT_REAL_TIME.md` - Documentación técnica completa
- ✅ `RATE_LIMIT_INTEGRATION_GUIDE.md` - Este archivo

## Pasos para Usar

### 1. En tu componente principal (ChatPage)

```tsx
import { RateLimitAlert } from '@/components/RateLimitAlert';
import { AI_MODELS } from '@/lib/models'; // o donde tengas la definición

export function ChatPage() {
    const [selectedModel, setSelectedModel] = useState('llama-3.3-70b');
    
    return (
        <div>
            {/* Mostrar alerta si el modelo está limitado */}
            <RateLimitAlert 
                modelKey={selectedModel}
                modelName={AI_MODELS[selectedModel]?.name || selectedModel}
                onAvailable={() => {
                    // Opcional: hacer algo cuando se reinicia
                    console.log('Modelo disponible de nuevo');
                }}
            />
            
            {/* Botón deshabilitado si hay rate limit */}
            <button 
                disabled={/* verificar si hay rate limit */}
            >
                Enviar Mensaje
            </button>
        </div>
    );
}
```

### 2. Para acceso más granular, usa el hook directamente

```tsx
import { useRateLimitStream } from '@/hooks/useRateLimitStream';

export function MyComponent() {
    const [isDisabled, setIsDisabled] = useState(false);
    
    const { limitInfo, isConnected } = useRateLimitStream({
        modelKey: 'llama-3.3-70b',
        onUpdate: (info) => {
            if (!Array.isArray(info)) {
                setIsDisabled(!info.available);
                if (!info.available) {
                    console.log(`Esperando ${info.formattedTime}`);
                }
            }
        }
    });
    
    return (
        <button disabled={isDisabled}>
            {isDisabled ? `Espera ${limitInfo?.formattedTime}` : 'Enviar'}
        </button>
    );
}
```

### 3. Para obtener info de rate limit una sola vez

```tsx
import { useRateLimitInfo } from '@/hooks/useRateLimitStream';

export function ModelStatus() {
    const { info, loading, error } = useRateLimitInfo('llama-3.3-70b');
    
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
        <div>
            {info?.available ? (
                <span>✅ Disponible</span>
            ) : (
                <span>⏳ Reinicia en {info?.formattedTime}</span>
            )}
        </div>
    );
}
```

## Cómo Funciona Internamente

### Cuando ocurre un error 429:

1. **Backend captura headers** (línea ~920 en routes.ts)
   ```typescript
   const responseHeaders = {};
   ['retry-after', 'x-ratelimit-*'].forEach(name => {
       const value = response.headers.get(name);
       if (value) responseHeaders[name] = value;
   });
   ```

2. **Registra el error** con información exacta
   ```typescript
   recordRateLimitError(model, "groq", responseHeaders, retryAfterSeconds);
   ```

3. **Notifica a clientes suscriptos**
   ```typescript
   notifyRateLimitUpdate(model);
   ```

4. **Servidor inicia broadcasting cada segundo** (gracias a `startRateLimitBroadcaster()`)

5. **Cliente recibe eventos SSE** con tiempo actualizado cada 1000ms

6. **UI muestra countdown decreciente**: "2m 59s" → "2m 58s" → ... → "0s"

## Información que Envía el Servidor

### Evento inicial (rate-limit-update):
```json
{
    "available": false,
    "modelKey": "llama-3.3-70b",
    "resetTime": 1733333333000,
    "remainingMs": 179000,
    "remainingSeconds": 179,
    "formattedTime": "2m 59s",
    "reason": "Límite de rate limit alcanzado. Intenta de nuevo pronto.",
    "headers": {
        "remaining": {
            "requests": 0,
            "tokens": 0
        },
        "reset": {
            "requests": "2m59.56s",
            "tokens": "7.66s"
        }
    }
}
```

### Eventos cada segundo (rate-limit-tick):
```json
{
    "available": false,
    "modelKey": "llama-3.3-70b",
    "remainingMs": 178000,
    "remainingSeconds": 178,
    "formattedTime": "2m 58s",
    "headers": {...}
}
```

## Testing Manual

### Test 1: Verificar que se captura el header
1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Intenta usar un modelo que está limitado
4. Busca log: `[Rate Limit] llama-3.3-70b limited for 179s. Headers: {...}`

### Test 2: Verificar que SSE funciona
1. DevTools → Network
2. Filtra por "stream"
3. Deberías ver una conexión a `/api/rate-limits/stream`
4. En la pestaña "Messages" verás eventos llegando cada segundo

### Test 3: Verificar el countdown en UI
1. Usa un modelo limitado
2. La alerta debe mostrar tiempo decreciente
3. Verifica que el formato es correcto: "2m 30s", "45s", etc.

## Notas de Seguridad

- ✅ El tiempo viene del servidor (no se puede manipular desde cliente)
- ✅ Cada modelo tiene su propio estado de rate limit
- ✅ Se limpia automáticamente después de 24 horas sin actividad
- ✅ SSE reconecta automáticamente si hay desconexión

## Troubleshooting

### "No veo actualizaciones cada segundo"
- Verifica que `startRateLimitBroadcaster()` está llamado en routes.ts
- Busca en logs: `[Rate Limit Broadcaster] Starting real-time...`

### "El tiempo no disminuye"
- Verifica que el cliente se conectó correctamente a `/api/rate-limits/stream`
- Comprueba que hay clientes suscriptos: mira `getSubscriberCount()` en rateLimitStream.ts

### "El modelo no se marca como disponible después"
- El timestamp debe expirar
- Verifica que `resetTime` es correcto (no en el futuro lejano)

## Headers Específicos por Provider

### Groq
Cuando error 429:
```
retry-after: 179
x-ratelimit-limit-requests: 14400
x-ratelimit-limit-tokens: 18000
x-ratelimit-remaining-requests: 0
x-ratelimit-remaining-tokens: 0
x-ratelimit-reset-requests: 2m59.56s
x-ratelimit-reset-tokens: 7.66s
```

### OpenRouter (OpenAI compatible)
```
x-ratelimit-limit-requests: 60
x-ratelimit-limit-tokens: 150000
x-ratelimit-remaining-requests: 0
x-ratelimit-remaining-tokens: 0
x-ratelimit-reset-requests: 1s
x-ratelimit-reset-tokens: 6m0s
```

### Gemini
```
retry-after: 60
```

## Performance

- ✅ SSE es eficiente (consume menos ancho que polling)
- ✅ Broadcasting usa un intervalo de 1 segundo (configurable)
- ✅ Memoria: ~100 bytes por suscriptor activo
- ✅ Headers se parsean solo en error (overhead mínimo)

## Próximas mejoras posibles

- Integrar con persistencia de BD
- Agregar historial de rate limits
- Predicción basada en patrones históricos
- Alertas preemptivas al 80% del límite
- Dashboard de estadísticas de uso
