/**
 * Provider Rate Limit & Availability Tracking
 * Monitors API quotas across different providers and tracks when models become unavailable
 * Supports real-time updates via SSE with countdown to reset time
 */

interface ProviderLimitStatus {
    isAvailable: boolean;
    remainingTime: number; // En milisegundos
    resetTime: number; // Unix timestamp
    reason?: string; // Motivo de unavailability
    retryAfterSeconds?: number; // De los headers de respuesta
    headers?: {
        remaining: {
            requests?: number;
            tokens?: number;
        };
        reset: {
            requests?: string; // "2m59.56s"
            tokens?: string;   // "7.66s"
        };
    };
}

interface ModelRateLimitData {
    lastErrorTime: number;
    errorCount: number;
    backoffUntil: number; // Unix timestamp
    retryAfterSeconds?: number; // Tiempo exacto del provider
    providerHeaders?: Record<string, any>; // Headers del provider en la respuesta
}

// Almacena el estado de límites por proveedor
const providerLimitStatus = new Map<string, ProviderLimitStatus>();

// Almacena el historial de errores de rate limit por modelo
const modelRateLimits = new Map<string, ModelRateLimitData>();

// Configuración de backoff exponencial (en milisegundos)
const BACKOFF_CONFIG = {
    openrouter: {
        initialBackoff: 5 * 60 * 1000, // 5 minutos
        maxBackoff: 60 * 60 * 1000, // 1 hora
        multiplier: 2,
    },
    gemini: {
        initialBackoff: 10 * 60 * 1000, // 10 minutos
        maxBackoff: 2 * 60 * 60 * 1000, // 2 horas
        multiplier: 1.5,
    },
    groq: {
        initialBackoff: 5 * 60 * 1000, // 5 minutos
        maxBackoff: 30 * 60 * 1000, // 30 minutos
        multiplier: 2,
    },
};

type ApiProvider = "openrouter" | "gemini" | "groq";

/**
 * Parsea el header retry-after del provider
 * Puede ser un número (segundos) o una fecha HTTP
 */
function parseRetryAfterHeader(retryAfter: string | number): number {
    if (typeof retryAfter === 'number') {
        return retryAfter;
    }

    // Si es una fecha HTTP (RFC 7231 format)
    const dateTime = new Date(retryAfter);
    if (!isNaN(dateTime.getTime())) {
        return Math.ceil((dateTime.getTime() - Date.now()) / 1000);
    }

    // Si es un número como string
    const seconds = parseInt(retryAfter, 10);
    return isNaN(seconds) ? 60 : seconds; // Default 60s si no se puede parsear
}

/**
 * Extrae información de rate limit desde los headers de respuesta (Groq)
 * Según: https://console.groq.com/docs/rate-limits
 */
function extractGroqLimitInfo(headers: Record<string, any>) {
    return {
        remaining: {
            requests: parseInt(headers['x-ratelimit-remaining-requests'] || '0', 10),
            tokens: parseInt(headers['x-ratelimit-remaining-tokens'] || '0', 10),
        },
        reset: {
            requests: headers['x-ratelimit-reset-requests'], // "2m59.56s"
            tokens: headers['x-ratelimit-reset-tokens'],     // "7.66s"
        },
        limit: {
            requests: parseInt(headers['x-ratelimit-limit-requests'] || '0', 10),
            tokens: parseInt(headers['x-ratelimit-limit-tokens'] || '0', 10),
        },
    };
}

/**
 * Extrae información de rate limit desde los headers de respuesta (OpenAI/OpenRouter)
 * Según: https://platform.openai.com/docs/guides/rate-limits
 */
function extractOpenRouterLimitInfo(headers: Record<string, any>) {
    return {
        remaining: {
            requests: parseInt(headers['x-ratelimit-remaining-requests'] || '0', 10),
            tokens: parseInt(headers['x-ratelimit-remaining-tokens'] || '0', 10),
        },
        reset: {
            requests: headers['x-ratelimit-reset-requests'], // "1s", "6m0s"
            tokens: headers['x-ratelimit-reset-tokens'],
        },
        limit: {
            requests: parseInt(headers['x-ratelimit-limit-requests'] || '0', 10),
            tokens: parseInt(headers['x-ratelimit-limit-tokens'] || '0', 10),
        },
    };
}

/**
 * Registra un error de rate limit para un modelo con headers reales del provider
 * @param modelKey - La clave del modelo (ej: "qwen-coder")
 * @param apiProvider - El proveedor de API (ej: "openrouter")
 * @param responseHeaders - Headers de la respuesta HTTP del provider
 * @param retryAfterSeconds - Segundos de espera (desde el header retry-after)
 */
export function recordRateLimitError(
    modelKey: string,
    apiProvider: ApiProvider,
    responseHeaders?: Record<string, any>,
    retryAfterSeconds?: number
): void {
    const now = Date.now();
    let modelData = modelRateLimits.get(modelKey);

    // Parsear retry-after si existe en headers
    let finalRetryAfter = retryAfterSeconds;
    if (!finalRetryAfter && responseHeaders?.['retry-after']) {
        finalRetryAfter = parseRetryAfterHeader(responseHeaders['retry-after']);
    }

    // Usar el retry-after del provider si está disponible, sino usar backoff exponencial
    let backoffDuration: number;
    if (finalRetryAfter && finalRetryAfter > 0) {
        // Usar el tiempo exacto del servidor provider
        backoffDuration = finalRetryAfter * 1000;
    } else {
        // Usar backoff exponencial como fallback
        const config = BACKOFF_CONFIG[apiProvider];
        const errorCount = modelData ? modelData.errorCount + 1 : 1;
        backoffDuration = Math.min(
            config.initialBackoff * Math.pow(config.multiplier, errorCount - 1),
            config.maxBackoff
        );
    }

    if (!modelData) {
        modelData = {
            lastErrorTime: now,
            errorCount: 1,
            backoffUntil: now + backoffDuration,
            retryAfterSeconds: finalRetryAfter,
            providerHeaders: responseHeaders,
        };
    } else {
        modelData.lastErrorTime = now;
        modelData.errorCount += 1;
        modelData.backoffUntil = now + backoffDuration;
        modelData.retryAfterSeconds = finalRetryAfter;
        modelData.providerHeaders = responseHeaders;
    }

    modelRateLimits.set(modelKey, modelData);
}

/**
 * Obtiene el estado de disponibilidad de un modelo con información en tiempo real
 * @param modelKey - La clave del modelo
 * @returns Estado de disponibilidad e información de tiempo restante
 */
export function getModelAvailabilityStatus(modelKey: string): ProviderLimitStatus {
    const now = Date.now();
    const modelData = modelRateLimits.get(modelKey);

    // Si no hay datos de error registrados, el modelo está disponible
    if (!modelData) {
        return {
            isAvailable: true,
            remainingTime: 0,
            resetTime: 0,
        };
    }

    // Verificar si el modelo sigue en backoff
    if (modelData.backoffUntil > now) {
        const remainingTime = modelData.backoffUntil - now;
        
        // Extraer información de headers si está disponible
        let headers: ProviderLimitStatus['headers'] | undefined;
        if (modelData.providerHeaders) {
            // Determinar qué proveedor según los headers disponibles
            if (modelData.providerHeaders['x-ratelimit-reset-requests']) {
                // Groq format
                headers = {
                    remaining: {
                        requests: parseInt(modelData.providerHeaders['x-ratelimit-remaining-requests'] || '0', 10),
                        tokens: parseInt(modelData.providerHeaders['x-ratelimit-remaining-tokens'] || '0', 10),
                    },
                    reset: {
                        requests: modelData.providerHeaders['x-ratelimit-reset-requests'],
                        tokens: modelData.providerHeaders['x-ratelimit-reset-tokens'],
                    },
                };
            }
        }

        // Determinar mensaje según el tiempo restante
        let reason = "Límite de rate limit alcanzado. Intenta de nuevo pronto.";
        const remainingHours = remainingTime / (1000 * 60 * 60);
        
        // Si el tiempo restante es mayor a 23 horas, indica que hay que esperar aproximadamente 24h
        if (remainingHours > 23) {
            reason = "Límite de rate limit alcanzado. Tendrás que esperar aproximadamente 24 horas.";
        } else if (remainingHours > 1) {
            const hours = Math.floor(remainingHours);
            reason = `Límite de rate limit alcanzado. Espera ${hours}+ horas.`;
        }

        return {
            isAvailable: false,
            remainingTime,
            resetTime: modelData.backoffUntil,
            reason,
            retryAfterSeconds: modelData.retryAfterSeconds,
            headers,
        };
    }

    // El backoff ha expirado, resetear datos
    modelRateLimits.delete(modelKey);

    return {
        isAvailable: true,
        remainingTime: 0,
        resetTime: 0,
    };
}

/**
 * Formatea el tiempo restante en un formato legible
 * @param milliseconds - Milisegundos restantes
 * @returns String formateado (ej: "5m 30s")
 */
export function formatRemainingTime(milliseconds: number): string {
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

/**
 * Limpia los datos de rate limit después de un tiempo
 * Ejecutar periódicamente (ej: cada hora)
 */
export function cleanupOldLimitData(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas

    const keysToDelete: string[] = [];
    modelRateLimits.forEach((data, modelKey) => {
        if (now - data.lastErrorTime > maxAge) {
            keysToDelete.push(modelKey);
        }
    });
    
    keysToDelete.forEach(key => modelRateLimits.delete(key));
}

// Ejecutar limpieza cada hora
setInterval(cleanupOldLimitData, 60 * 60 * 1000);

/**
 * Obtiene información actualizada de límites para enviar al cliente
 * Se usa para actualizaciones en tiempo real vía SSE/WebSocket
 * @param modelKey - La clave del modelo
 * @returns Objeto con info de límites para enviar al cliente
 */
export function getRateLimitInfo(modelKey: string) {
    const status = getModelAvailabilityStatus(modelKey);
    
    if (!status.isAvailable) {
        // Calcular tiempo restante exacto en este momento
        const now = Date.now();
        const remainingMs = Math.max(0, status.resetTime - now);
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        
        return {
            available: false,
            modelKey,
            resetTime: status.resetTime,
            remainingMs,
            remainingSeconds,
            formattedTime: formatRemainingTime(remainingMs),
            reason: status.reason,
            headers: status.headers,
        };
    }

    return {
        available: true,
        modelKey,
        resetTime: 0,
        remainingMs: 0,
        remainingSeconds: 0,
        formattedTime: "",
    };
}

/**
 * Obtiene información de límites para todos los modelos actualmente limitados
 * @returns Array de información de límites para modelos no disponibles
 */
export function getAllRateLimitedModels() {
    const limited: any[] = [];
    const now = Date.now();

    modelRateLimits.forEach((data, modelKey) => {
        if (data.backoffUntil > now) {
            const remainingMs = data.backoffUntil - now;
            limited.push({
                modelKey,
                resetTime: data.backoffUntil,
                remainingMs,
                remainingSeconds: Math.ceil(remainingMs / 1000),
                formattedTime: formatRemainingTime(remainingMs),
                retryAfterSeconds: data.retryAfterSeconds,
                headers: data.providerHeaders ? {
                    remaining: {
                        requests: parseInt(data.providerHeaders['x-ratelimit-remaining-requests'] || '0', 10),
                        tokens: parseInt(data.providerHeaders['x-ratelimit-remaining-tokens'] || '0', 10),
                    },
                    reset: {
                        requests: data.providerHeaders['x-ratelimit-reset-requests'],
                        tokens: data.providerHeaders['x-ratelimit-reset-tokens'],
                    },
                } : undefined,
            });
        }
    });

    return limited;
}
