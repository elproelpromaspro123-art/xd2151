import { getUserById } from "./auth";

const WEBHOOK_URL = process.env.WEBHOOK_URL;

interface WebhookEmbed {
  title: string;
  description: string;
  color: number;
  fields: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  timestamp: string;
  footer?: {
    text: string;
  };
}

interface WebhookPayload {
  embeds: WebhookEmbed[];
  username?: string;
  avatar_url?: string;
}

export async function sendDiscordWebhook(embed: Omit<WebhookEmbed, 'timestamp'>): Promise<boolean> {
  if (!WEBHOOK_URL) {
    console.log("Discord webhook URL not configured");
    return false;
  }

  const payload: WebhookPayload = {
    embeds: [{
      ...embed,
      timestamp: new Date().toISOString(),
    }],
    username: "Chatbot Logger",
    avatar_url: "https://i.imgur.com/AfFp7pu.png", // Generic bot avatar
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Discord webhook failed:", response.status, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending Discord webhook:", error);
    return false;
  }
}

export async function logChatCreation(
  conversationId: string,
  title: string,
  userId: string | null,
  chatMode: "roblox" | "general",
  model: string
): Promise<void> {
  const user = userId ? await getUserById(userId) : null;

  const embed: Omit<WebhookEmbed, 'timestamp'> = {
    title: "🆕 Nueva Conversación Creada",
    description: `Se ha iniciado una nueva conversación en el chatbot.`,
    color: 0x00ff00, // Green
    fields: [
      {
        name: "📝 Nombre del Chat",
        value: title || "Sin título",
        inline: true,
      },
      {
        name: "👤 Usuario",
        value: user ? user.email : "Usuario anónimo",
        inline: true,
      },
      {
        name: "📧 Correo",
        value: user ? user.email : "N/A",
        inline: true,
      },
      {
        name: "🎮 Modo",
        value: chatMode === "roblox" ? "Roblox" : "General",
        inline: true,
      },
      {
        name: "🤖 Modelo",
        value: model,
        inline: true,
      },
      {
        name: "🆔 ID Conversación",
        value: conversationId,
        inline: true,
      },
    ],
    footer: {
      text: "Chatbot Activity Logger",
    },
  };

  await sendDiscordWebhook(embed);
}

export async function logChatMessage(
  conversationId: string,
  userId: string | null,
  role: "user" | "assistant",
  content: string,
  model: string,
  chatMode: "roblox" | "general"
): Promise<void> {
  const user = userId ? await getUserById(userId) : null;

  // Truncate content if too long for Discord embed
  const truncatedContent = content.length > 1000
    ? content.substring(0, 997) + "..."
    : content;

  const embed: Omit<WebhookEmbed, 'timestamp'> = {
    title: role === "user" ? "💬 Mensaje del Usuario" : "🤖 Respuesta del Bot",
    description: truncatedContent,
    color: role === "user" ? 0x0099ff : 0xff6b6b, // Blue for user, Red for assistant
    fields: [
      {
        name: "👤 Usuario",
        value: user ? user.email : "Usuario anónimo",
        inline: true,
      },
      {
        name: "📧 Correo",
        value: user ? user.email : "N/A",
        inline: true,
      },
      {
        name: "🎯 Rol",
        value: role === "user" ? "Usuario" : "Asistente",
        inline: true,
      },
      {
        name: "🎮 Modo",
        value: chatMode === "roblox" ? "Roblox" : "General",
        inline: true,
      },
      {
        name: "🤖 Modelo",
        value: model,
        inline: true,
      },
      {
        name: "🆔 ID Conversación",
        value: conversationId,
        inline: true,
      },
    ],
    footer: {
      text: "Chatbot Message Logger",
    },
  };

  await sendDiscordWebhook(embed);
}

export async function logUserRegistration(
  userId: string,
  email: string,
  ip: string,
  isPremium: boolean,
  referralCode?: string
): Promise<void> {
  const embed: Omit<WebhookEmbed, 'timestamp'> = {
    title: "👤 Nuevo Usuario Registrado",
    description: `Un nuevo usuario se ha registrado en la plataforma.`,
    color: 0x00ff00, // Green
    fields: [
      {
        name: "📧 Correo",
        value: email,
        inline: true,
      },
      {
        name: "🆔 User ID",
        value: userId,
        inline: true,
      },
      {
        name: "🌐 IP",
        value: ip,
        inline: true,
      },
      {
        name: "⭐ Premium",
        value: isPremium ? "Sí" : "No",
        inline: true,
      },
      {
        name: "🔗 Código de Referencia",
        value: referralCode || "Ninguno",
        inline: true,
      },
    ],
    footer: {
      text: "User Registration Logger",
    },
  };

  await sendDiscordWebhook(embed);
}

export async function logReferralSuccess(
  referrerUserId: string,
  newUserId: string,
  referralCode: string,
  inviteCount: number
): Promise<void> {
  const referrer = await getUserById(referrerUserId);
  const newUser = await getUserById(newUserId);

  const embed: Omit<WebhookEmbed, 'timestamp'> = {
    title: "🎉 Referencia Exitosa",
    description: `Un usuario ha sido referido exitosamente.`,
    color: 0xffd700, // Gold
    fields: [
      {
        name: "👤 Referidor",
        value: referrer ? referrer.email : "Desconocido",
        inline: true,
      },
      {
        name: "🆔 ID Referidor",
        value: referrerUserId,
        inline: true,
      },
      {
        name: "👥 Nuevo Usuario",
        value: newUser ? newUser.email : "Desconocido",
        inline: true,
      },
      {
        name: "🔗 Código Usado",
        value: referralCode,
        inline: true,
      },
      {
        name: "📊 Total Invitaciones",
        value: inviteCount.toString(),
        inline: true,
      },
      {
        name: "🏆 Estado Premium",
        value: inviteCount >= 30 ? "¡Premium Desbloqueado!" : `${inviteCount}/30 para Premium`,
        inline: true,
      },
    ],
    footer: {
      text: "Referral System Logger",
    },
  };

  await sendDiscordWebhook(embed);
}