import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

const DATA_DIR = process.env.DATA_DIR || "./data";
const RATE_LIMIT_FILE = path.join(DATA_DIR, "rate_limits.json");

interface ModelRateLimitData {
  modelKey: string;
  provider: "google" | "openrouter" | "groq";
  minuteRequestsRemaining: number;
  minuteRequestsLimit: number;
  dayRequestsRemaining: number;
  dayRequestsLimit: number;
  minuteResetTime: number;
  dayResetTime: number;
  isBlocked: boolean;
  blockedUntil?: number;
  lastUpdated: number;
}

interface RateLimitData {
  models: Record<string, ModelRateLimitData>;
  lastSaved: string;
}

/**
 * LÍMITES EXACTOS DEL FREE TIER DE GOOGLE GEMINI (2025-12-04)
 * Fuente: https://ai.google.dev/gemini-api/docs/rate-limits
 * 
 * Métrica: RPM (Requests Per Minute), RPD (Requests Per Day)
 * Nota: Estos límites son para el Free Tier. Los límites de TPM (Tokens Per Minute)
 * se mantienen en 250,000 TPM pero no son rastreados individualmente aquí.
 */
export const MODEL_LIMITS = {
  "gemini-2.5-flash": {
    provider: "google" as const,
    minuteLimit: 10,    // 10 RPM (Requests Per Minute) - Free Tier
    dayLimit: 250,      // 250 RPD (Requests Per Day) - Free Tier
  },
  "gemini-2.0-flash": {
    provider: "google" as const,
    minuteLimit: 15,    // 15 RPM - Free Tier (Flash 2.0 es más rápido)
    dayLimit: 200,      // 200 RPD - Free Tier
  },
  "gemini-2.5-pro": {
    provider: "google" as const,
    minuteLimit: 2,     // 2 RPM - Free Tier (más restrictivo, modelo más potente)
    dayLimit: 50,       // 50 RPD - Free Tier
  },
};

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadRateLimitData(): RateLimitData {
  try {
    ensureDataDir();
    if (fs.existsSync(RATE_LIMIT_FILE)) {
      const rawData = fs.readFileSync(RATE_LIMIT_FILE, "utf-8");
      return JSON.parse(rawData);
    }
  } catch (error) {
    console.error("Error loading rate limit data:", error);
  }
  return { models: {}, lastSaved: new Date().toISOString() };
}

function saveRateLimitData(data: RateLimitData): void {
  try {
    ensureDataDir();
    data.lastSaved = new Date().toISOString();
    fs.writeFileSync(RATE_LIMIT_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving rate limit data:", error);
  }
}

export function initializeModelRateLimit(
  modelKey: string,
  provider: "google" | "openrouter" | "groq"
): void {
  const data = loadRateLimitData();

  if (!data.models[modelKey]) {
    const config = MODEL_LIMITS[modelKey as keyof typeof MODEL_LIMITS];
    const now = Date.now();

    data.models[modelKey] = {
      modelKey,
      provider,
      minuteRequestsRemaining: config?.minuteLimit || 10,
      minuteRequestsLimit: config?.minuteLimit || 10,
      dayRequestsRemaining: config?.dayLimit || 250,
      dayRequestsLimit: config?.dayLimit || 250,
      minuteResetTime: now + 60 * 1000,
      dayResetTime: now + 24 * 60 * 60 * 1000,
      isBlocked: false,
      lastUpdated: now,
    };

    saveRateLimitData(data);
    console.log(`[rate-limit] Initialized ${modelKey}: ${config?.minuteLimit} RPM, ${config?.dayLimit} RPD`);
  }
}

export function recordRequest(modelKey: string): void {
  const data = loadRateLimitData();
  const model = data.models[modelKey];

  if (!model) {
    console.warn(`[rate-limit] Model ${modelKey} not initialized`);
    return;
  }

  const now = Date.now();

  // Reset por minuto si pasó el tiempo
  if (now >= model.minuteResetTime) {
    model.minuteRequestsRemaining = model.minuteRequestsLimit;
    model.minuteResetTime = now + 60 * 1000;
  }

  // Reset por día si pasó el tiempo
  if (now >= model.dayResetTime) {
    model.dayRequestsRemaining = model.dayRequestsLimit;
    model.dayResetTime = now + 24 * 60 * 60 * 1000;
  }

  // Decrementar contadores
  if (model.minuteRequestsRemaining > 0) {
    model.minuteRequestsRemaining--;
  }
  if (model.dayRequestsRemaining > 0) {
    model.dayRequestsRemaining--;
  }

  model.lastUpdated = now;

  saveRateLimitData(data);
}

export function checkRateLimit(modelKey: string): {
  allowed: boolean;
  minuteRemaining: number;
  dayRemaining: number;
  minuteResetTime: number;
  dayResetTime: number;
  blockedUntil?: number;
  message?: string;
} {
  const data = loadRateLimitData();
  const model = data.models[modelKey];

  if (!model) {
    initializeModelRateLimit(modelKey, "google");
    const config = MODEL_LIMITS[modelKey as keyof typeof MODEL_LIMITS];
    return {
      allowed: true,
      minuteRemaining: config?.minuteLimit || 10,
      dayRemaining: config?.dayLimit || 250,
      minuteResetTime: Date.now() + 60 * 1000,
      dayResetTime: Date.now() + 24 * 60 * 60 * 1000,
    };
  }

  const now = Date.now();

  // Verificar si está bloqueado por día
  if (model.dayRequestsRemaining <= 0) {
    model.isBlocked = true;
    model.blockedUntil = model.dayResetTime;

    return {
      allowed: false,
      minuteRemaining: model.minuteRequestsRemaining,
      dayRemaining: 0,
      minuteResetTime: model.minuteResetTime,
      dayResetTime: model.dayResetTime,
      blockedUntil: model.dayResetTime,
      message: `Límite diario alcanzado para ${modelKey}. Se reinicia en ${formatTimeRemaining(
        model.dayResetTime - now
      )}`,
    };
  }

  // Verificar si está bloqueado por minuto
  if (model.minuteRequestsRemaining <= 0) {
    return {
      allowed: false,
      minuteRemaining: 0,
      dayRemaining: model.dayRequestsRemaining,
      minuteResetTime: model.minuteResetTime,
      dayResetTime: model.dayResetTime,
      blockedUntil: model.minuteResetTime,
      message: `Límite por minuto alcanzado para ${modelKey}. Espera ${formatTimeRemaining(
        model.minuteResetTime - now
      )}`,
    };
  }

  // Modelo disponible
  return {
    allowed: true,
    minuteRemaining: model.minuteRequestsRemaining,
    dayRemaining: model.dayRequestsRemaining,
    minuteResetTime: model.minuteResetTime,
    dayResetTime: model.dayResetTime,
  };
}

export function getRateLimitStatus(modelKey: string): ModelRateLimitData | null {
  const data = loadRateLimitData();
  return data.models[modelKey] || null;
}

export function getAllRateLimitStatus(): Record<string, ModelRateLimitData> {
  const data = loadRateLimitData();
  return data.models;
}

function formatTimeRemaining(milliseconds: number): string {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }
  if (minutes < 60) {
    return `${minutes}m ${seconds}s`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

export function getFormattedRateLimitInfo(modelKey: string): {
  status: "available" | "blocked_minute" | "blocked_day";
  minuteRemaining: number;
  dayRemaining: number;
  minuteResetIn: string;
  dayResetIn: string;
  minuteResetTime: number;
  dayResetTime: number;
} {
  const check = checkRateLimit(modelKey);
  const now = Date.now();

  let status: "available" | "blocked_minute" | "blocked_day" = "available";

  if (check.minuteRemaining <= 0) {
    status = "blocked_minute";
  } else if (check.dayRemaining <= 0) {
    status = "blocked_day";
  }

  return {
    status,
    minuteRemaining: check.minuteRemaining,
    dayRemaining: check.dayRemaining,
    minuteResetIn: formatTimeRemaining(check.minuteResetTime - now),
    dayResetIn: formatTimeRemaining(check.dayResetTime - now),
    minuteResetTime: check.minuteResetTime,
    dayResetTime: check.dayResetTime,
  };
}

// Inicializar modelos conocidos
Object.keys(MODEL_LIMITS).forEach((modelKey) => {
  const config = MODEL_LIMITS[modelKey as keyof typeof MODEL_LIMITS];
  initializeModelRateLimit(modelKey, config.provider);
});

console.log("[rate-limit-tracker] Initialized with Gemini Free Tier limits (2025-12-04)");
console.log("[rate-limit-tracker] gemini-2.5-flash: 10 RPM, 250 RPD");
console.log("[rate-limit-tracker] gemini-2.0-flash: 15 RPM, 200 RPD");
console.log("[rate-limit-tracker] gemini-2.5-pro: 2 RPM, 50 RPD");
