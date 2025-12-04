import { useState, useEffect, useCallback, useRef } from 'react';
import type { AIModel } from '@shared/schema';

const POLL_INTERVAL = 30000; // Polling fallback cada 30 segundos

export function useModelAvailability(models: AIModel[] | undefined) {
    const [updatedModels, setUpdatedModels] = useState<AIModel[]>(models || []);
    const eventSourceRef = useRef<EventSource | null>(null);

    const fetchModels = useCallback(async () => {
        try {
            const response = await fetch('/api/models');
            if (response.ok) {
                const data = await response.json();
                setUpdatedModels(data.models);
            }
        } catch (error) {
            console.error('Error fetching updated models:', error);
        }
    }, []);

    useEffect(() => {
        // Actualizar modelos cuando cambian
        if (models) {
            setUpdatedModels(models);
        }
    }, [models]);

    useEffect(() => {
        // Suscribirse a actualizaciones de rate limit en tiempo real (todos los modelos)
        try {
            const eventSource = new EventSource('/api/rate-limits/stream');

            eventSource.addEventListener('rate-limits-update', (event: Event) => {
                // Cuando cambia la disponibilidad de algún modelo, refetchar la lista completa
                fetchModels();
            });

            eventSource.addEventListener('rate-limits-tick', (event: Event) => {
                // Actualización periódica de countdown
                fetchModels();
            });

            eventSource.onerror = () => {
                eventSource.close();
                // En caso de error, usar polling
                const interval = setInterval(fetchModels, POLL_INTERVAL);
                return () => clearInterval(interval);
            };

            eventSourceRef.current = eventSource;
        } catch (error) {
            console.error('[useModelAvailability] SSE connection error:', error);
            // Fallback a polling si SSE falla
            const interval = setInterval(fetchModels, POLL_INTERVAL);
            return () => clearInterval(interval);
        }

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, [fetchModels]);

    return updatedModels;
}
