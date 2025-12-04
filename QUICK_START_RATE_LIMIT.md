# Rate Limit en Tiempo Real - Guía Rápida

## ¿Qué cambió?

El sistema **automáticamente**:
1. ✅ Detecta cuando un modelo alcanza rate limit
2. ✅ Muestra una alerta con countdown exacto
3. ✅ Actualiza el countdown cada segundo
4. ✅ Deshabilita el botón hasta que se reinicia
5. ✅ Se habilita automáticamente cuando está listo

**Sin necesidad de reiniciar la página.**

## Archivos Nuevos

```
server/
├── rateLimitStream.ts (NUEVO - maneja SSE)
└── providerLimits.ts (ACTUALIZADO)

client/src/
├── hooks/useRateLimitStream.ts (NUEVO - hook SSE)
├── components/RateLimitAlert.tsx (NUEVO - componente UI)
└── pages/ChatPage.tsx (ACTUALIZADO - integración)
```

## Lo que Ves

Cuando un modelo alcanza límite:

```
┌──────────────────────────────────────────┐
│ ⚠️ Llama 3.3 70B no disponible           │
│                                          │
│ El modelo ha alcanzado su límite de uso. │
│                                          │
│ ⏱️  2m 45s                               │
│                                          │
│ Requests: 0 | Tokens: 0                 │
│ Reset (requests): 2m59.56s              │
│ Reset (tokens): 7.66s                   │
└──────────────────────────────────────────┘

BOTÓN "ENVIAR" = DESHABILITADO

(después 1 segundo)
⏱️  2m 44s

(continúa hasta 0s)
```

## Testing Rápido

### 1. Verificar captura de headers
```bash
# En console (F12)
# Busca este log cuando ocurra error 429:
[Rate Limit] llama-3.3-70b limited for 179s
```

### 2. Verificar SSE
```bash
# DevTools → Network → filter "stream"
# Deberías ver:
GET /api/rate-limits/stream?model=llama-3.3-70b
# Messages tab debe mostrar eventos cada 1 segundo
```

### 3. Verificar UI
```bash
# Cuando modelo está limitado:
1. Alerta roja aparece ✓
2. Botón está deshabilitado ✓
3. Countdown va: 2m 59s → 2m 58s → ... ✓
4. Alerta desaparece cuando se reinicia ✓
```

## Cómo Funciona (Técnico)

```
ERROR 429
    ↓
Backend captura headers
    ↓
recordRateLimitError() registra timestamp
    ↓
notifyRateLimitUpdate() notifica SSE
    ↓
Client recibe: { available: false, formattedTime: "2m 45s" }
    ↓
RateLimitAlert muestra alerta
ChatInput se deshabilita
    ↓
SSE broadcaster envía ticks cada 1 segundo
    ↓
formattedTime: "2m 45s" → "2m 44s" → ... → "0s"
    ↓
Cuando resetTime <= now → available: true
    ↓
RateLimitAlert desaparece
ChatInput se habilita
```

## Providers Soportados

### ✅ GROQ
- `llama-3.3-70b`
- `gpt-oss-120b`
- `qwen3-32b`

Headers capturados:
- `retry-after` (segundos o duración)
- `x-ratelimit-remaining-requests/tokens`
- `x-ratelimit-reset-requests/tokens`

### ✅ OPENROUTER
- `qwen-coder`
- `deepseek-r1t2`
- `gemma-3-27b`

Headers: similares a Groq/OpenAI

### ✅ GEMINI
- `gemini-2.5-flash`

Headers: `retry-after` (segundos)

## Información Mostrada

```json
{
  "available": false,
  "modelKey": "llama-3.3-70b",
  "resetTime": 1733333333000,        // Unix timestamp
  "remainingMs": 179000,              // Milisegundos
  "remainingSeconds": 179,            // Segundos
  "formattedTime": "2m 59s",          // ← Lo que ves en UI
  "reason": "Límite alcanzado...",
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

## Debugging

### Si no aparece alerta:
1. F12 → Console
2. Busca: `[Rate Limit]`
3. Si no está, error no fue capturado

### Si no actualiza countdown:
1. F12 → Network → filtra "stream"
2. Deberías ver eventos SSE
3. Si no, broadcaster no está corriendo

### Si botón no se habilita:
1. resetTime debe expirar
2. Verifica: `resetTime - now <= 0`
3. Check parsing de `retry-after`

## Código Referencia

### Usar en un componente:
```tsx
import { useRateLimitStream } from '@/hooks/useRateLimitStream';

const { limitInfo, isConnected } = useRateLimitStream({
    modelKey: 'llama-3.3-70b',
    onUpdate: (info) => {
        if (!Array.isArray(info) && !info.available) {
            console.log(`Espera ${info.formattedTime}`);
        }
    }
});
```

### O usar el componente:
```tsx
import { RateLimitAlert } from '@/components/RateLimitAlert';

<RateLimitAlert 
    modelKey="llama-3.3-70b"
    modelName="Llama 3.3 70B"
    onAvailable={() => console.log('Listo')}
/>
```

## Performance

- **SSE**: 1 evento/segundo por cliente
- **Memoria**: ~100 bytes por cliente
- **CPU**: Mínimo
- **Network**: ~500 bytes/segundo

Escala a cientos de clientes.

## Seguridad

✅ Tiempo viene del servidor (no manipulable)
✅ Headers se capturan en backend
✅ No se exponen secrets
✅ Rate limiting por modelo

## Archivos Documentación

- `RATE_LIMIT_REAL_TIME.md` - Documentación completa
- `RATE_LIMIT_INTEGRATION_GUIDE.md` - Guía paso a paso
- `RATE_LIMIT_READY_TO_USE.md` - Está listo para usar
- `NEW_FILES_MANIFEST.md` - Índice de archivos
- `QUICK_START_RATE_LIMIT.md` - Este archivo

---

**TL;DR**: Cuando error 429 → aparece alerta con countdown exacto → actualiza en vivo cada segundo → se desaparece automáticamente cuando está listo. Sin reiniciar página.
