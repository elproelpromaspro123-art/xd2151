# ⚡ Quick Start - Sistema Integrado en Tiempo Real

## 🎯 En 3 pasos

### 1️⃣ Verificar tipos
```bash
npm run check
```

### 2️⃣ Iniciar servidor
```bash
npm run dev
```

### 3️⃣ Probar
```bash
# En otra terminal
npx ts-node test-integration.ts
```

---

## 📍 Archivos Principales

### Backend
| Archivo | Función |
|---------|---------|
| `server/webhook-logs.ts` | 🎯 Discord logging |
| `server/rate-limit-tracker.ts` | 🔐 Rate limiting |
| `server/message-timer.ts` | ⏱️ Contador 3 días |
| `server/referral-system.ts` | 🎁 Sistema de invitaciones |
| `server/realtime-updates.ts` | 🔄 Actualizaciones SSE |
| `server/routes-realtime.ts` | 🔌 Endpoints nuevos |
| `server/integrated-systems.ts` | 🎛️ Orquestador |

### Frontend
| Archivo | Función |
|---------|---------|
| `client/src/hooks/useRealtimeUpdates.ts` | 🪝 Hook SSE |
| `client/src/components/RateLimitDisplay.tsx` | 📊 UI rate limit |
| `client/src/components/MessageResetTimer.tsx` | ⏳ UI contador |
| `client/src/components/ReferralDisplay.tsx` | 🎯 UI referrals |

---

## 🔌 Endpoints

```
GET  /api/realtime?userId=XXX
POST /api/chat/log
POST /api/rate-limit/check
GET  /api/user/message-reset-info?userId=XXX
GET  /api/user/referral-stats?userId=XXX
```

---

## 🎨 Componentes React

### Usar en tu página
```tsx
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { RateLimitDisplay } from "@/components/RateLimitDisplay";
import { MessageResetTimer } from "@/components/MessageResetTimer";
import { ReferralDisplay } from "@/components/ReferralDisplay";

export function Dashboard() {
  const userId = useAuthStore(state => state.user?.id);
  const { messageResetInfo, rateLimitStatus, referralStats } = 
    useRealtimeUpdates(userId);

  return (
    <>
      <MessageResetTimer resetInfo={messageResetInfo} />
      <RateLimitDisplay 
        modelKey="gemini-2.5-flash" 
        status={rateLimitStatus["gemini-2.5-flash"]} 
      />
      <ReferralDisplay stats={referralStats} />
    </>
  );
}
```

---

## 🚀 Funcionalidades

### 1. Discord Webhook
```typescript
await logChatToDiscord(
  userId,
  userEmail,
  conversationId,
  chatName,
  userMessage,
  botResponse,
  model
);
// → Mensaje aparece en Discord inmediatamente
```

### 2. Rate Limiting
```typescript
const result = validateModelRequest("gemini-2.5-flash");
if (!result.allowed) {
  console.error(result.message); // "Límite diario alcanzado..."
}
// → Bloquea si alcanza límite
```

### 3. Contador de Mensajes
```typescript
const resetInfo = getMessageResetInfo(userId);
console.log(resetInfo.remainingDays); // 2.5 días
// → Reinicia automáticamente cada 3 días
```

### 4. Referrals
```typescript
const stats = getReferralStats(userId);
console.log(stats.referralCode); // "REF_ABC123_DEF456"
console.log(stats.successfulReferrals); // 15 / 30
// → Premium otorgado a los 30 referrals
```

### 5. SSE (Tiempo Real)
```typescript
// Hook se conecta automáticamente
const { isConnected } = useRealtimeUpdates(userId);
if (!isConnected) console.log("Conectando...");
// → Actualizaciones sin recargar la página
```

---

## 📋 Discord Webhook

**URL**: `https://discord.com/api/webhooks/1446553036062462013/JypHWo3-g9h_7kM7e_vHkWQE23P11x7sSnZkuE1oqliiy-aARQP7IrlCgGUdsMNJGgsc`

**Mostrará**: Nombre del chat, usuario, correo, pregunta, respuesta, modelo, hora

---

## ⚙️ Configuración

| Parámetro | Gemini 2.5 Flash | Gemini 2.0 Flash | Gemini 2.5 Pro |
|-----------|-----------------|-----------------|----------------|
| **RPM** (Requests/Min) | 10 | 15 | 2 |
| **RPD** (Requests/Día) | 250 | 200 | 50 |
| **TPM** (Tokens/Min) | 250,000 | 1,000,000 | 250,000 |

| Parámetro | Valor |
|-----------|-------|
| Mensaje refresco (Free) | 3 días |
| Referrals para premium | 30 usuarios |
| Duración premium | 3 días |
| Máximo por IP | 2 cuentas |

---

## 🧪 Testing

```bash
# Ver estado de todos los endpoints
npx ts-node test-integration.ts
```

**Pruebas incluidas**:
✅ Discord webhook
✅ Rate limit check
✅ Message reset info
✅ Referral stats
✅ SSE connection

---

## 🔗 Links útiles

- 📖 Documentación completa: `INTEGRACION_SISTEMAS.md`
- 📝 Guía de implementación: `PASOS_SIGUIENTES.md`
- 📊 Resumen ejecutivo: `RESUMEN_IMPLEMENTACION.md`

---

## ❓ FAQ

**P: ¿Se actualizan los datos sin F5?**
R: ✅ Sí, por SSE en tiempo real

**P: ¿Dónde se guardan los datos?**
R: PostgreSQL + backup en JSON

**P: ¿Funciona en producción?**
R: ✅ Sí, está listo

**P: ¿Cómo prevenir abuso en referrals?**
R: Máximo 2 cuentas por IP, validadas automáticamente

**P: ¿Qué pasa si Discord falla?**
R: Se guarda localmente y reintenta cada 5 min

---

## 📞 Soporte

Si algo no funciona, revisa:

1. `npm run check` - ¿Hay errores de tipos?
2. `npm run dev` - ¿El servidor inicia?
3. Consola del navegador - ¿Errores JavaScript?
4. `data/` - ¿Se crean los archivos?
5. Discord - ¿Llegan los mensajes?

---

**¡Listo para usar!** 🎉
