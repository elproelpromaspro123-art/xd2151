/**
 * Gemini-specific Rate Limiting
 * Implements per-minute and per-day limits for Gemini models based on official API quotas
 */

interface GeminiRateLimitData {
  requestsThisMinute: number;
  requestsToday: number;
  minuteStart: number; // Unix timestamp when current minute started
  dayStart: number; // Unix timestamp when current day started
  lastRequestTime: number;
}

interface GeminiModelLimits {
  requestsPerMinute: number;
  requestsPerDay: number;
}

// Official Gemini API limits (as of December 2025)
const GEMINI_LIMITS: Record<string, GeminiModelLimits> = {
  "gemini-2.5-pro": {
    requestsPerMinute: 2,
    requestsPerDay: 50,
  },
  "gemini-2.5-flash": {
    requestsPerMinute: 15,
    requestsPerDay: 1500,
  },
  "gemini-flash-2": { // Gemini 2.0 Flash
    requestsPerMinute: 15,
    requestsPerDay: 1500,
  },
};

// In-memory storage for rate limit data (per user per model)
const rateLimitData = new Map<string, GeminiRateLimitData>();

function getRateLimitKey(userId: string, model: string): string {
  return `${userId}:${model}`;
}

function getCurrentMinuteStart(): number {
  const now = Date.now();
  return Math.floor(now / 60000) * 60000; // Round down to nearest minute
}

function getCurrentDayStart(): number {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return startOfDay.getTime();
}

function getModelLimits(model: string): GeminiModelLimits {
  return GEMINI_LIMITS[model] || GEMINI_LIMITS["gemini-2.5-flash"]; // Default to Flash limits
}

export function checkGeminiRateLimit(userId: string, model: string): {
  allowed: boolean;
  reason?: string;
  resetTime?: number;
  limits?: {
    requestsPerMinute: number;
    requestsPerDay: number;
    usedThisMinute: number;
    usedToday: number;
    remainingThisMinute: number;
    remainingToday: number;
  };
} {
  const key = getRateLimitKey(userId, model);
  const limits = getModelLimits(model);
  const now = Date.now();
  const currentMinuteStart = getCurrentMinuteStart();
  const currentDayStart = getCurrentDayStart();

  let data = rateLimitData.get(key);

  // Initialize or reset data if needed
  if (!data) {
    data = {
      requestsThisMinute: 0,
      requestsToday: 0,
      minuteStart: currentMinuteStart,
      dayStart: currentDayStart,
      lastRequestTime: 0,
    };
    rateLimitData.set(key, data);
  }

  // Reset minute counter if minute has changed
  if (data.minuteStart !== currentMinuteStart) {
    data.requestsThisMinute = 0;
    data.minuteStart = currentMinuteStart;
  }

  // Reset day counter if day has changed
  if (data.dayStart !== currentDayStart) {
    data.requestsToday = 0;
    data.dayStart = currentDayStart;
  }

  const remainingThisMinute = Math.max(0, limits.requestsPerMinute - data.requestsThisMinute);
  const remainingToday = Math.max(0, limits.requestsPerDay - data.requestsToday);

  // Check if limit exceeded
  if (data.requestsThisMinute >= limits.requestsPerMinute) {
    const resetTime = data.minuteStart + 60000; // Next minute
    return {
      allowed: false,
      reason: `Límite de ${limits.requestsPerMinute} solicitudes por minuto alcanzado. Espera hasta ${new Date(resetTime).toLocaleTimeString()}.`,
      resetTime,
      limits: {
        requestsPerMinute: limits.requestsPerMinute,
        requestsPerDay: limits.requestsPerDay,
        usedThisMinute: data.requestsThisMinute,
        usedToday: data.requestsToday,
        remainingThisMinute,
        remainingToday,
      },
    };
  }

  if (data.requestsToday >= limits.requestsPerDay) {
    const resetTime = currentDayStart + 24 * 60 * 60 * 1000; // Next day
    return {
      allowed: false,
      reason: `Límite de ${limits.requestsPerDay} solicitudes por día alcanzado. Espera hasta mañana.`,
      resetTime,
      limits: {
        requestsPerMinute: limits.requestsPerMinute,
        requestsPerDay: limits.requestsPerDay,
        usedThisMinute: data.requestsThisMinute,
        usedToday: data.requestsToday,
        remainingThisMinute,
        remainingToday,
      },
    };
  }

  return {
    allowed: true,
    limits: {
      requestsPerMinute: limits.requestsPerMinute,
      requestsPerDay: limits.requestsPerDay,
      usedThisMinute: data.requestsThisMinute,
      usedToday: data.requestsToday,
      remainingThisMinute,
      remainingToday,
    },
  };
}

export function recordGeminiRequest(userId: string, model: string): void {
  const key = getRateLimitKey(userId, model);
  const now = Date.now();
  const currentMinuteStart = getCurrentMinuteStart();
  const currentDayStart = getCurrentDayStart();

  let data = rateLimitData.get(key);

  if (!data) {
    data = {
      requestsThisMinute: 0,
      requestsToday: 0,
      minuteStart: currentMinuteStart,
      dayStart: currentDayStart,
      lastRequestTime: 0,
    };
  }

  // Reset counters if needed
  if (data.minuteStart !== currentMinuteStart) {
    data.requestsThisMinute = 0;
    data.minuteStart = currentMinuteStart;
  }

  if (data.dayStart !== currentDayStart) {
    data.requestsToday = 0;
    data.dayStart = currentDayStart;
  }

  // Increment counters
  data.requestsThisMinute++;
  data.requestsToday++;
  data.lastRequestTime = now;

  rateLimitData.set(key, data);
}

export function getGeminiRateLimitStatus(userId: string, model: string) {
  return checkGeminiRateLimit(userId, model);
}

// Cleanup old data periodically
setInterval(() => {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  for (const [key, data] of rateLimitData.entries()) {
    if (data.lastRequestTime < oneDayAgo) {
      rateLimitData.delete(key);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour