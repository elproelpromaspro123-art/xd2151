/**
 * Real-time Rate Limit Streaming via Server-Sent Events (SSE)
 * Envía actualizaciones de countdown del rate limit al cliente en tiempo real
 */

import type { Response } from "express";
import { getRateLimitInfo, getAllRateLimitedModels } from "./providerLimits";

interface RateLimitSubscriber {
    res: Response;
    modelKey?: string; // Si es undefined, suscribirse a todos
    lastUpdate: number;
}

// Store de suscriptores activos
const subscribers = new Set<RateLimitSubscriber>();

// Almacena el último estado enviado para cada modelo (evita envíos duplicados)
const lastSentState = new Map<string, any>();

// Intervalo de actualización en milisegundos (cada 1 hora = 3600000ms)
// Reset de rate limits: cada 24 horas
const UPDATE_INTERVAL_MS = 3600000; // 1 hora - para evitar spam de actualizaciones
const RATE_LIMIT_RESET_HOURS = 24; // Reset cada 24 horas

/**
 * Crea una suscripción SSE para actualizaciones de rate limit en tiempo real
 * @param res - Response object de Express
 * @param modelKey - (Opcional) Modelo específico a monitorear. Si no se proporciona, monitorea todos
 */
export function subscribeToRateLimits(res: Response, modelKey?: string) {
    // Headers SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const subscriber: RateLimitSubscriber = {
        res,
        modelKey,
        lastUpdate: Date.now(),
    };

    subscribers.add(subscriber);

    // Enviar info inicial
    if (modelKey) {
        const info = getRateLimitInfo(modelKey);
        sendSSEMessage(res, "rate-limit-update", info);
    } else {
        const allLimited = getAllRateLimitedModels();
        sendSSEMessage(res, "rate-limits-update", { models: allLimited });
    }

    // Limpiar suscriptor cuando se desconecte
    res.on("close", () => {
        subscribers.delete(subscriber);
    });

    res.on("error", () => {
        subscribers.delete(subscriber);
    });
}

/**
 * Envía un mensaje SSE formateado
 * @param res - Response object
 * @param eventType - Tipo de evento
 * @param data - Datos a enviar
 */
export function sendSSEMessage(res: Response, eventType: string, data: any) {
    try {
        if (!res.writable) return;

        const message = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
        res.write(message);
    } catch (error) {
        console.error("[SSE] Error sending message:", error);
    }
}

/**
 * Notifica a todos los suscriptores sobre una actualización de rate limit
 * Se llama cuando se registra un error de rate limit
 * @param modelKey - Modelo que alcanzó rate limit
 */
export function notifyRateLimitUpdate(modelKey: string) {
    const info = getRateLimitInfo(modelKey);

    subscribers.forEach((subscriber) => {
        // Enviar si suscribió a este modelo específico o a todos
        if (!subscriber.modelKey || subscriber.modelKey === modelKey) {
            sendSSEMessage(subscriber.res, "rate-limit-update", info);
        }
    });
}

/**
 * Inicia el broadcasting periódico de actualizaciones de countdown
 * Se ejecuta cada 30 segundos (configurable) para actualizar los tiempos restantes
 * Solo envía si el estado ha cambiado (evita spam de mensajes)
 */
export function startRateLimitBroadcaster() {
    setInterval(() => {
        if (subscribers.size === 0) return;

        subscribers.forEach((subscriber) => {
            try {
                if (!subscriber.res.writable) return;

                // Obtener data actualizada
                let updateData;
                let cacheKey: string;
                
                if (subscriber.modelKey) {
                    updateData = getRateLimitInfo(subscriber.modelKey);
                    cacheKey = `model_${subscriber.modelKey}`;
                } else {
                    updateData = getAllRateLimitedModels();
                    cacheKey = 'all_models';
                }

                // Comparar con el último estado enviado
                const lastState = lastSentState.get(cacheKey);
                const newStateStr = JSON.stringify(updateData);
                const lastStateStr = lastState ? JSON.stringify(lastState) : null;

                // Solo enviar si cambió
                if (newStateStr !== lastStateStr) {
                    lastSentState.set(cacheKey, updateData);

                    // Enviar actualización
                    if (subscriber.modelKey) {
                        sendSSEMessage(subscriber.res, "rate-limit-tick", updateData);
                    } else {
                        sendSSEMessage(subscriber.res, "rate-limits-tick", { models: updateData });
                    }
                }
            } catch (error) {
                console.error("[SSE] Error in broadcaster:", error);
                subscribers.delete(subscriber);
            }
        });
    }, UPDATE_INTERVAL_MS); // Actualizar cada 30 segundos (configurable)
}

/**
 * Obtiene el número de suscriptores activos (para debugging)
 */
export function getSubscriberCount(): number {
    return subscribers.size;
}

/**
 * Limpia todos los suscriptores (para shutdown)
 */
export function clearAllSubscribers() {
    subscribers.forEach((subscriber) => {
        try {
            subscriber.res.end();
        } catch (error) {
            console.error("[SSE] Error closing connection:", error);
        }
    });
    subscribers.clear();
}
