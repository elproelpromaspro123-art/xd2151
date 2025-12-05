# Integración de Sistemas en Tiempo Real

## Descripción General

Se ha implementado un sistema completo de actualizaciones en tiempo real que integra:

1. **Discord Webhook Logging**: Registro automático de todos los chats en un canal de Discord
2. **Reinicio de Mensajes**: Contador de mensajes con reinicio automático cada 3 días
3. **Rate Limiting Gemini**: Control de límites por minuto y por día para modelos Google Gemini
4. **Sistema de Referrals**: Programa de invitaciones para obtener premium
5. **Server-Sent Events (SSE)**: Actualizaciones en tiempo real sin necesidad de reiniciar la página

---

## Componentes Implementados

### 1. Backend

#### `server/webhook-logs.ts`
- Envía datos de cada chat a Discord en tiempo real
- **Información registrada**:
  - Nombre del chat
  - Usuario (email)
  - ID de usuario
  - Pregunta del usuario
  - Respuesta del bot
  - Modelo utilizado
  - ID de conversación
  - Hora y fecha

#### `server/realtime-updates.ts`
- Gestiona conexiones SSE con clientes
- Envía actualizaciones en tiempo real sobre:
  - Reinicio de mensajes (conteo regresivo)
  - Estado de rate limits
  - Estadísticas de referrals

#### `server/rate-limit-tracker.ts`
- Controla límites por minuto y día de modelos Gemini
- **Configuración actual**:
  - `gemini-2.5-flash`: 10 req/min, 1000 req/día
  - `gemini-2.0-flash`: 10 req/min, 1000 req/día
  - `gemini-2.5-pro`: 10 req/min, 1000 req/día

#### `server/message-timer.ts`
- Gestiona reinicio de mensajes cada 3 días
- Almacena `messageResetTime` por usuario
- Reinicia automáticamente contadores

#### `server/referral-system.ts`
- Genera códigos de referral únicos
- Valida invitaciones (máximo 2 cuentas por IP)
- Otorga premium a los 30 referrals exitosos (3 días)
- Registra todas las invitaciones en BD

#### `server/routes-realtime.ts` ⭐ NUEVO
- Endpoint SSE: `GET /api/realtime?userId={userId}`
- Endpoints de validación:
  - `POST /api/chat/log`: Registrar chat en Discord
  - `POST /api/rate-limit/check`: Validar rate limit
  - `GET /api/user/message-reset-info`: Info de reinicio
  - `GET /api/user/referral-stats`: Estadísticas de referrals
  - `POST /api/realtime/broadcast-updates`: Forzar actualización

#### `server/integrated-systems.ts` ⭐ NUEVO
- Centraliza la lógica de integración
- Funciones principales:
  - `broadcastUserUpdates()`: Envía todas las actualizaciones
  - `registerNewChat()`: Registra chat en Discord
  - `validateModelRequest()`: Valida y registra request
  - `notifyUserRateLimit()`: Notifica cambios en rate limit
  - `checkMessageReset()`: Verifica reinicio de mensajes

### 2. Frontend

#### `client/src/hooks/useRealtimeUpdates.ts` ⭐ NUEVO
Hook React para conectarse a actualizaciones SSE:
```typescript
const { messageResetInfo, rateLimitStatus, referralStats, isConnected, error } = 
  useRealtimeUpdates(userId);
```

- **Propiedades disponibles**:
  - `messageResetInfo`: Información de reinicio (días, horas, minutos)
  - `rateLimitStatus`: Estado de cada modelo
  - `referralStats`: Código, contador, necesarios para premium
  - `isConnected`: Estado de la conexión
  - `error`: Errores de conexión

#### `client/src/components/RateLimitDisplay.tsx` ⭐ NUEVO
Componente para mostrar estado de rate limiting:
- Muestra requests restantes por minuto y día
- Alerta si se alcanzó límite por minuto (espera 1 minuto)
- Alerta si se alcanzó límite diario (espera 24 horas)
- Colores dinámicos: verde (ok), amarillo (minuto), rojo (día)

#### `client/src/components/MessageResetTimer.tsx` ⭐ NUEVO
Componente para contador de mensajes:
- Barra de progreso de uso
- Countdown en tiempo real
- Colores por porcentaje (verde <50%, amarillo 50-80%, rojo >80%)
- Alerta si resta menos de 5 minutos

#### `client/src/components/ReferralDisplay.tsx` ⭐ NUEVO
Componente para programa de referrals:
- Muestra código personalizado
- Barra de progreso hacia los 30 referrals
- Botón para copiar link (con feedback)
- Información sobre requisitos

---

## Flujo de Funcionamiento

### 1. Logging a Discord

```
Usuario crea chat
    ↓
Bot responde
    ↓
POST /api/chat/log (automático)
    ↓
logChatToDiscord() ejecuta
    ↓
Fetch a webhook de Discord
    ↓
Mensaje embebido llega a Discord
```

**Webhook URL**: `https://discord.com/api/webhooks/1446553036062462013/JypHWo3-...`

### 2. Rate Limiting en Tiempo Real

```
Usuario envía mensaje
    ↓
POST /api/rate-limit/check
    ↓
validateModelRequest(modelKey)
    ↓
¿Límite de minuto?
  ├─ NO → ¿Límite de día?
  │     ├─ NO → Permitir + recordRequest()
  │     └─ SÍ → Rechazar (429)
  └─ SÍ → Rechazar (429)
    ↓
sendRateLimitUpdate(userId) vía SSE
    ↓
Frontend actualiza sin recargar
```

### 3. Contador de Mensajes

```
Usuario registrado
    ↓
initializeMessageResetTime(userId)
    ↓
messageResetTime = now + 3 días
    ↓
Cada 5 minutos: verificar si pasó la fecha
    ↓
Si pasó: resetear contador + extender 3 días más
    ↓
sendMessageResetUpdate() actualiza cliente
```

### 4. Sistema de Referrals

```
Usuario A comparte link: https://tuapp.com?ref=REF_ABC123
    ↓
Usuario B se registra
    ↓
Sistema detecta referralCode en query params
    ↓
logReferral(A, B)
    ↓
¿Más de 2 cuentas desde la misma IP?
  ├─ SÍ → Marcar como "rejected"
  └─ NO → Marcar como "pending"
    ↓
Usuario B crea la cuenta correctamente
    ↓
completeReferral()
    ↓
A.successfulReferrals++
    ↓
¿== 30?
  ├─ SÍ → A.isPremium = true
  │     → A.premiumExpiresAt = now + 3 días
  └─ NO → Continuar
    ↓
sendReferralUpdate(A) actualiza frontend
```

### 5. Actualizaciones SSE

```
Browser: new EventSource('/api/realtime?userId=user123')
    ↓
Server: registerSSEClient(userId, response)
    ↓
Almacenar conexión en Map
    ↓
Cuando hay cambios:
  ├─ sendMessageResetUpdate()
  ├─ sendRateLimitUpdate()
  ├─ sendReferralUpdate()
  └─ broadcastRateLimitUpdate()
    ↓
res.write(`data: ${JSON.stringify(...)}\n\n`)
    ↓
Browser recibe evento
    ↓
useRealtimeUpdates Hook actualiza estado React
    ↓
UI se re-renderiza automáticamente
```

---

## Configuración

### Discord Webhook
```typescript
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1446553036062462013/JypHWo3-g9h_7kM7e_vHkWQE23P11x7sSnZkuE1oqliiy-aARQP7IrlCgGUdsMNJGgsc";
```

### Rate Limits (Google Gemini Free Tier - 2025-12-04)
Fuente oficial: https://ai.google.dev/gemini-api/docs/rate-limits

```typescript
export const MODEL_LIMITS = {
  // Gemini 2.5 Flash - Modelo equilibrado para uso general
  "gemini-2.5-flash": {
    minuteLimit: 10,    // 10 Requests Per Minute (RPM)
    dayLimit: 250,      // 250 Requests Per Day (RPD)
  },
  // Gemini 2.0 Flash - Modelo rápido optimizado para velocidad
  "gemini-2.0-flash": {
    minuteLimit: 15,    // 15 RPM (más rápido que 2.5)
    dayLimit: 200,      // 200 RPD
  },
  // Gemini 2.5 Pro - Modelo más potente para tareas complejas
  "gemini-2.5-pro": {
    minuteLimit: 2,     // 2 RPM (muy restrictivo por su poder)
    dayLimit: 50,       // 50 RPD
  },
};
```

**Importante**: 
- Estos límites son para el **Free Tier** de Google Gemini
- Los límites de TPM (Tokens Per Minute) se mantienen en **250,000 TPM** para todos los modelos
- Los límites se resetean cada minuto y cada 24 horas respectivamente
- Si se alcanza cualquier límite, la API retorna HTTP 429

### Reinicio de Mensajes
```typescript
const MESSAGE_RESET_DAYS = 3; // 3 días
const PLAN_LIMITS = {
  free: {
    aiUsagePerWeek: 50,
    // Otros límites...
  },
};
```

### Sistema de Referrals
```typescript
const SUCCESSFUL_REFERRALS_NEEDED = 30;
const PREMIUM_DURATION_DAYS = 3;
const MAX_ACCOUNTS_PER_IP = 2;
```

---

## Cómo Usar en la Aplicación

### 1. Conectar a Actualizaciones en Tiempo Real
```tsx
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { RateLimitDisplay } from "@/components/RateLimitDisplay";
import { MessageResetTimer } from "@/components/MessageResetTimer";
import { ReferralDisplay } from "@/components/ReferralDisplay";

export function ChatPage() {
  const userId = useAuthStore(state => state.user?.id);
  const { messageResetInfo, rateLimitStatus, referralStats } = useRealtimeUpdates(userId);

  return (
    <div>
      <MessageResetTimer resetInfo={messageResetInfo} messageCount={10} maxMessages={50} />
      <RateLimitDisplay modelKey="gemini-2.5-flash" status={rateLimitStatus["gemini-2.5-flash"]} />
      <ReferralDisplay stats={referralStats} />
    </div>
  );
}
```

### 2. Registrar un Chat
```typescript
await fetch("/api/chat/log", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId: "user123",
    userEmail: "user@example.com",
    conversationId: "conv456",
    chatName: "Mi pregunta de programación",
    userMessage: "¿Cómo hago un componente React?",
    botResponse: "Para hacer un componente React...",
    model: "gemini-2.5-flash",
  }),
});
```

### 3. Validar Rate Limit
```typescript
const response = await fetch("/api/rate-limit/check", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ modelKey: "gemini-2.5-flash" }),
});

if (!response.ok) {
  const error = await response.json();
  console.error("Rate limit alcanzado:", error.message);
  return;
}

const { minuteRemaining, dayRemaining } = await response.json();
console.log(`Aún puedes hacer ${minuteRemaining} requests este minuto`);
```

---

## Almacenamiento de Datos

### Archivo: `data/webhook_logs.json`
```json
{
  "logs": {
    "log-id-1": {
      "id": "log-id-1",
      "userId": "user123",
      "userEmail": "user@example.com",
      "conversationId": "conv456",
      "chatName": "Mi pregunta",
      "botResponse": "...",
      "userMessage": "...",
      "model": "gemini-2.5-flash",
      "webhookSent": true,
      "createdAt": "2025-01-15T10:30:00Z",
      "sentAt": "2025-01-15T10:30:02Z"
    }
  },
  "lastSaved": "2025-01-15T10:35:00Z"
}
```

### Archivo: `data/rate_limits.json`
```json
{
  "models": {
    "gemini-2.5-flash": {
      "modelKey": "gemini-2.5-flash",
      "provider": "google",
      "minuteRequestsRemaining": 9,
      "minuteRequestsLimit": 10,
      "dayRequestsRemaining": 995,
      "dayRequestsLimit": 1000,
      "minuteResetTime": 1705318200000,
      "dayResetTime": 1705404600000,
      "isBlocked": false,
      "lastUpdated": 1705314600000
    }
  }
}
```

### Base de Datos: Tablas (Drizzle ORM)
- `webhookLogs`: Historial de chats registrados
- `modelRateLimits`: Estado de rate limits
- `users`: Campo `messageResetTime` para reinicio
- `users`: Campos `referralCode`, `successfulReferrals`
- `referralLogs`: Historial de invitaciones

---

## Reintentos Automáticos

### Discord Webhook
- Si falla el envío, se intenta nuevamente cada 5 minutos
- Se guardan los logs localmente si hay error
- Máximo 5 reintentos por ciclo

### Rate Limits
- Se reinician automáticamente en el próximo minuto/día
- Estado se sincroniza a través de SSE cada cambio
- No hay reintentos, simplemente se bloquea hasta el reinicio

---

## Seguridad

✅ **Implementado**:
- Validación de userId en todas las rutas
- Rate limiting en validación de requisitos
- Máximo 2 cuentas por IP para referrals
- Hash de IP para comparación segura
- Datos sensibles no se exponen en logs de Discord
- Webhook URL no se expone en cliente

---

## Troubleshooting

### Los chats no aparecen en Discord
1. Verificar que el webhook URL es correcto
2. Revisar `data/webhook_logs.json` para ver errores
3. Confirmar que el usuario tiene permisos en el servidor Discord

### Rate limit no se actualiza en tiempo real
1. Verificar que `userId` se envía correctamente
2. Confirmar que SSE está conectado (`isConnected === true`)
3. Revisar consola del navegador para errores de conexión

### Contador de mensajes no reinicia
1. Confirmar que `messageResetTime` está configurado
2. Verificar que el intervalo de 5 minutos está ejecutándose
3. Revisar `data/users.json` para ver el `messageResetTime`

### Referrals no funcionan
1. Verificar que referralCode existe en la URL
2. Confirmar que ambos usuarios están registrados correctamente
3. Revisar que las IPs son diferentes (máximo 2 por IP)
4. Comprobar `data/referrals.json` para estado

---

## Próximas Mejoras

- [ ] Análisis detallado de chats en Dashboard
- [ ] Alertas en Discord cuando se alcanzan límites
- [ ] Sistema de bonificación de referrals
- [ ] Histórico de rate limits por usuario
- [ ] Exportación de datos de conversaciones
