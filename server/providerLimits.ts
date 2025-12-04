/**
 * Provider Rate Limit & Availability Tracking
 * Monitors API quotas across different providers and tracks when models become unavailable
 */

interface ProviderLimitStatus {
    isAvailable: boolean;
    remainingTime: number; // En milisegundos
    resetTime: number; // Unix timestamp
    reason?: string; // Motivo de unavailability
}

interface ModelRateLimitData {
    lastErrorTime: number;
    errorCount: number;
    backoffUntil: number; // Unix timestamp
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
 * Registra un error de rate limit para un modelo
 * @param modelKey - La clave del modelo (ej: "qwen-coder")
 * @param apiProvider - El proveedor de API (ej: "openrouter")
 */
export function recordRateLimitError(modelKey: string, apiProvider: ApiProvider): void {
    const now = Date.now();
    let modelData = modelRateLimits.get(modelKey);

    if (!modelData) {
        modelData = {
            lastErrorTime: now,
            errorCount: 1,
            backoffUntil: now + BACKOFF_CONFIG[apiProvider].initialBackoff,
        };
    } else {
        modelData.lastErrorTime = now;
        modelData.errorCount += 1;

        // Calcular backoff exponencial
        const config = BACKOFF_CONFIG[apiProvider];
        const backoffDuration = Math.min(
            config.initialBackoff * Math.pow(config.multiplier, modelData.errorCount - 1),
            config.maxBackoff
        );
        modelData.backoffUntil = now + backoffDuration;
    }

    modelRateLimits.set(modelKey, modelData);
}

/**
 * Obtiene el estado de disponibilidad de un modelo
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
        return {
            isAvailable: false,
            remainingTime,
            resetTime: modelData.backoffUntil,
            reason: "Límite de rate limit alcanzado. Intenta de nuevo pronto.",
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
