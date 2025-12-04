import { useState, useEffect, useCallback } from 'react';
import type { AIModel } from '@shared/schema';

const POLL_INTERVAL = 5000; // Revisar cada 5 segundos

export function useModelAvailability(models: AIModel[] | undefined) {
    const [updatedModels, setUpdatedModels] = useState<AIModel[]>(models || []);

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
        // Verificar si hay modelos rate limited
        const hasRateLimited = updatedModels.some(m => m.isRateLimited);

        if (hasRateLimited) {
            // Si hay modelos rate limited, hacer polling más frecuente
            const interval = setInterval(fetchModels, POLL_INTERVAL);
            return () => clearInterval(interval);
        }
    }, [updatedModels, fetchModels]);

    return updatedModels;
}
