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
 * Se ejecuta cada segundo para actualizar los tiempos restantes
 */
export function startRateLimitBroadcaster() {
    setInterval(() => {
        if (subscribers.size === 0) return;

        subscribers.forEach((subscriber) => {
            try {
                if (!subscriber.res.writable) return;

                // Obtener data actualizada
                let updateData;
                if (subscriber.modelKey) {
                    updateData = getRateLimitInfo(subscriber.modelKey);
                } else {
                    updateData = getAllRateLimitedModels();
                }

                // Enviar actualización
                if (subscriber.modelKey) {
                    sendSSEMessage(subscriber.res, "rate-limit-tick", updateData);
                } else {
                    sendSSEMessage(subscriber.res, "rate-limits-tick", { models: updateData });
                }
            } catch (error) {
                console.error("[SSE] Error in broadcaster:", error);
                subscribers.delete(subscriber);
            }
        });
    }, 1000); // Actualizar cada segundo
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
