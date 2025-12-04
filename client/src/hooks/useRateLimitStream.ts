/**
 * Hook para suscribirse a actualizaciones de rate limit en tiempo real
 * Se conecta vía SSE para recibir actualizaciones de countdown
 */

import { useEffect, useState, useCallback, useRef } from 'react';

export interface RateLimitInfo {
    available: boolean;
    modelKey: string;
    resetTime: number;
    remainingMs: number;
    remainingSeconds: number;
    formattedTime: string;
    reason?: string;
    headers?: {
        remaining: {
            requests?: number;
            tokens?: number;
        };
        reset: {
            requests?: string;
            tokens?: string;
        };
    };
}

interface UseRateLimitStreamOptions {
    modelKey?: string; // Si se proporciona, monitorea solo este modelo
    onUpdate?: (info: RateLimitInfo | RateLimitInfo[]) => void;
    autoRetry?: boolean;
}

export function useRateLimitStream(options: UseRateLimitStreamOptions = {}) {
    const { modelKey, onUpdate, autoRetry = true } = options;
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [limitInfo, setLimitInfo] = useState<RateLimitInfo | RateLimitInfo[] | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        try {
            // Construir URL con parámetro de modelo si es necesario
            const url = modelKey 
                ? `/api/rate-limits/stream?model=${encodeURIComponent(modelKey)}`
                : '/api/rate-limits/stream';

            const eventSource = new EventSource(url);

            eventSource.addEventListener('rate-limit-update', (event: Event) => {
                try {
                    const customEvent = event as MessageEvent;
                    const data = JSON.parse(customEvent.data) as RateLimitInfo;
                    setLimitInfo(data);
                    setError(null);
                    onUpdate?.(data);
                } catch (err) {
                    console.error('[useRateLimitStream] Error parsing rate-limit-update:', err);
                }
            });

            eventSource.addEventListener('rate-limit-tick', (event: Event) => {
                try {
                    const customEvent = event as MessageEvent;
                    const data = JSON.parse(customEvent.data) as RateLimitInfo;
                    setLimitInfo(data);
                    onUpdate?.(data);
                } catch (err) {
                    console.error('[useRateLimitStream] Error parsing rate-limit-tick:', err);
                }
            });

            eventSource.addEventListener('rate-limits-update', (event: Event) => {
                try {
                    const customEvent = event as MessageEvent;
                    const data = JSON.parse(customEvent.data);
                    setLimitInfo(data.models);
                    setError(null);
                    onUpdate?.(data.models);
                } catch (err) {
                    console.error('[useRateLimitStream] Error parsing rate-limits-update:', err);
                }
            });

            eventSource.addEventListener('rate-limits-tick', (event: Event) => {
                try {
                    const customEvent = event as MessageEvent;
                    const data = JSON.parse(customEvent.data);
                    setLimitInfo(data.models);
                    onUpdate?.(data.models);
                } catch (err) {
                    console.error('[useRateLimitStream] Error parsing rate-limits-tick:', err);
                }
            });

            eventSource.onerror = (err) => {
                console.error('[useRateLimitStream] EventSource error:', err);
                eventSource.close();
                setIsConnected(false);

                // Intentar reconectar si está habilitado
                if (autoRetry) {
                    setError('Reconectando...');
                    reconnectTimeoutRef.current = setTimeout(connect, 3000);
                }
            };

            eventSourceRef.current = eventSource;
            setIsConnected(true);
            setError(null);
        } catch (err) {
            const errMsg = err instanceof Error ? err.message : 'Error desconocido';
            console.error('[useRateLimitStream] Connection error:', errMsg);
            setError(errMsg);
            setIsConnected(false);
        }
    }, [modelKey, onUpdate, autoRetry]);

    const disconnect = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        setIsConnected(false);
    }, []);

    useEffect(() => {
        // Solo conectar si modelKey cambió, no en cada render
        // Usar un ref para evitar reconexiones innecesarias
        let shouldConnect = true;

        if (shouldConnect) {
            connect();
        }

        return () => {
            shouldConnect = false;
            disconnect();
        };
    }, [modelKey]); // Solo depender de modelKey, no de connect/disconnect

    return {
        isConnected,
        error,
        limitInfo,
        reconnect: connect,
        disconnect,
    };
}

/**
 * Hook para obtener información actual de rate limits (una sola vez)
 */
export function useRateLimitInfo(modelKey?: string) {
    const [info, setInfo] = useState<RateLimitInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const url = modelKey
                    ? `/api/rate-limits?model=${encodeURIComponent(modelKey)}`
                    : '/api/rate-limits';

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                setInfo(data);
                setError(null);
            } catch (err) {
                const errMsg = err instanceof Error ? err.message : 'Error desconocido';
                console.error('[useRateLimitInfo] Fetch error:', errMsg);
                setError(errMsg);
                setInfo(null);
            } finally {
                setLoading(false);
            }
        };

        fetchInfo();
    }, [modelKey]);

    return { info, loading, error };
}
