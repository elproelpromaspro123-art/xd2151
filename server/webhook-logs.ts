import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

const DATA_DIR = process.env.DATA_DIR || "./data";
const WEBHOOK_LOGS_FILE = path.join(DATA_DIR, "webhook_logs.json");
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1446553036062462013/JypHWo3-g9h_7kM7e_vHkWQE23P11x7sSnZkuE1oqliiy-aARQP7IrlCgGUdsMNJGgsc";

interface WebhookLog {
  id: string;
  userId: string;
  userEmail: string;
  conversationId: string;
  chatName: string;
  botResponse: string;
  userMessage: string;
  model: string;
  webhookSent: boolean;
  webhookError?: string;
  createdAt: string;
  sentAt?: string;
}

interface WebhookLogsData {
  logs: Record<string, WebhookLog>;
  lastSaved: string;
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadWebhookLogs(): WebhookLogsData {
  try {
    ensureDataDir();
    if (fs.existsSync(WEBHOOK_LOGS_FILE)) {
      const rawData = fs.readFileSync(WEBHOOK_LOGS_FILE, "utf-8");
      return JSON.parse(rawData);
    }
  } catch (error) {
    console.error("Error loading webhook logs:", error);
  }
  return { logs: {}, lastSaved: new Date().toISOString() };
}

function saveWebhookLogs(data: WebhookLogsData): void {
  try {
    ensureDataDir();
    data.lastSaved = new Date().toISOString();
    fs.writeFileSync(WEBHOOK_LOGS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving webhook logs:", error);
  }
}

export async function logChatToDiscord(
  userId: string,
  userEmail: string,
  conversationId: string,
  chatName: string,
  userMessage: string,
  botResponse: string,
  model: string
): Promise<void> {
  const logId = randomUUID();
  const now = new Date().toISOString();

  const log: WebhookLog = {
    id: logId,
    userId,
    userEmail,
    conversationId,
    chatName,
    botResponse: botResponse.substring(0, 1000),
    userMessage: userMessage.substring(0, 500),
    model,
    webhookSent: false,
    createdAt: now,
  };

  try {
    // Preparar mensaje para Discord
    const discordMessage = {
      embeds: [
        {
          title: `💬 Nuevo Chat: ${chatName}`,
          description: `Usuario creó un nuevo chat y el bot respondió`,
          color: 3447003,
          fields: [
            {
              name: "👤 Usuario",
              value: userEmail,
              inline: true,
            },
            {
              name: "🤖 Modelo",
              value: model,
              inline: true,
            },
            {
              name: "📌 Nombre del Chat",
              value: chatName,
              inline: true,
            },
            {
              name: "🆔 ID Usuario",
              value: userId,
              inline: true,
            },
            {
              name: "📝 Pregunta del Usuario",
              value: userMessage.substring(0, 1000) || "No proporcionado",
              inline: false,
            },
            {
              name: "💡 Respuesta del Bot",
              value: botResponse.substring(0, 1000) || "No disponible",
              inline: false,
            },
            {
              name: "💬 ID Conversación",
              value: conversationId,
              inline: true,
            },
            {
              name: "⏰ Fecha y Hora",
              value: new Date(now).toLocaleString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
              inline: true,
            },
          ],
          footer: {
            text: "Sistema de Logging de Chats - Webhook Automático",
          },
          timestamp: now,
        },
      ],
    };

    // Enviar a Discord
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordMessage),
    });

    if (!response.ok) {
      const errorText = await response.text();
      log.webhookError = `HTTP ${response.status}: ${errorText}`;
      console.error("Discord webhook error:", log.webhookError);
    } else {
      log.webhookSent = true;
      log.sentAt = new Date().toISOString();
      console.log(`[webhook-logs] Successfully logged chat for ${userEmail}`);
    }
  } catch (error) {
    log.webhookError = error instanceof Error ? error.message : String(error);
    console.error("Error sending to Discord webhook:", error);
  }

  // Guardar log en archivo
  const logs = loadWebhookLogs();
  logs.logs[logId] = log;
  saveWebhookLogs(logs);
}

export function getWebhookLogs(limit: number = 100): WebhookLog[] {
  const data = loadWebhookLogs();
  return Object.values(data.logs)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getWebhookLogsByUser(userId: string): WebhookLog[] {
  const data = loadWebhookLogs();
  return Object.values(data.logs)
    .filter((log) => log.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function retryFailedWebhooks(): void {
  const data = loadWebhookLogs();
  const failedLogs = Object.values(data.logs).filter(
    (log) => !log.webhookSent && log.webhookError
  );

  if (failedLogs.length === 0) {
    console.log("[webhook-logs] No failed webhooks to retry");
    return;
  }

  console.log(`[webhook-logs] Retrying ${failedLogs.length} failed webhooks`);

  failedLogs.slice(0, 5).forEach(async (log) => {
    try {
      const discordMessage = {
        embeds: [
          {
            title: `♻️ Reintento: ${log.chatName}`,
            description: `Reintentando envío de log anterior`,
            color: 16776960,
            fields: [
              {
                name: "👤 Usuario",
                value: log.userEmail,
                inline: true,
              },
              {
                name: "🤖 Modelo",
                value: log.model,
                inline: true,
              },
              {
                name: "📝 Pregunta del Usuario",
                value: log.userMessage.substring(0, 500) || "No proporcionado",
                inline: false,
              },
              {
                name: "💡 Respuesta del Bot",
                value: log.botResponse.substring(0, 500) || "No disponible",
                inline: false,
              },
            ],
          },
        ],
      };

      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discordMessage),
      });

      if (response.ok) {
        log.webhookSent = true;
        log.sentAt = new Date().toISOString();
        log.webhookError = undefined;
        data.logs[log.id] = log;
        saveWebhookLogs(data);
        console.log(`[webhook-logs] Successfully retried webhook ${log.id}`);
      }
    } catch (error) {
      console.error(`[webhook-logs] Retry failed for ${log.id}:`, error);
    }
  });
}

// Intentar reenviar webhooks fallidos cada 5 minutos
setInterval(retryFailedWebhooks, 5 * 60 * 1000);
