/**
 * Componente para mostrar alertas de rate limit con countdown en tiempo real
 * Muestra información exacta del provider y actualización en vivo
 */

import React, { useEffect, useState } from 'react';
import { AlertCircle, Zap, Clock } from 'lucide-react';
import { useRateLimitStream, type RateLimitInfo } from '@/hooks/useRateLimitStream';

interface RateLimitAlertProps {
    modelKey: string;
    modelName: string;
    onAvailable?: () => void;
}

export function RateLimitAlert({ modelKey, modelName, onAvailable }: RateLimitAlertProps) {
    const [displayInfo, setDisplayInfo] = useState<RateLimitInfo | null>(null);
    const [shouldNotify, setShouldNotify] = useState(false);
    
    const { limitInfo, isConnected, error: streamError } = useRateLimitStream({
        modelKey,
        onUpdate: (info) => {
            if (Array.isArray(info)) {
                // Si viene un array, buscar la info de nuestro modelo
                const modelInfo = info.find(i => i.modelKey === modelKey);
                if (modelInfo) {
                    setDisplayInfo(modelInfo);
                    if (modelInfo.available && displayInfo && !displayInfo.available) {
                        // Transición de limitado a disponible
                        setShouldNotify(true);
                        setTimeout(() => onAvailable?.(), 100);
                    }
                }
            } else {
                // Info individual
                setDisplayInfo(info);
                if (info.available && displayInfo && !displayInfo.available) {
                    // Transición de limitado a disponible
                    setShouldNotify(true);
                    setTimeout(() => onAvailable?.(), 100);
                }
            }
        },
    });

    // Sincronizar con limitInfo del hook
    useEffect(() => {
        if (limitInfo) {
            if (Array.isArray(limitInfo)) {
                const modelInfo = limitInfo.find(i => i.modelKey === modelKey);
                if (modelInfo) {
                    setDisplayInfo(modelInfo);
                }
            } else if (!Array.isArray(limitInfo)) {
                setDisplayInfo(limitInfo);
            }
        }
    }, [limitInfo, modelKey]);

    // Si el modelo está disponible, no mostrar nada
    if (!displayInfo || displayInfo.available) {
        return null;
    }

    // Extraer información de headers para mostrar detalles
    const hasHeaderInfo = displayInfo.headers && (
        displayInfo.headers.remaining.requests !== undefined ||
        displayInfo.headers.remaining.tokens !== undefined
    );

    return (
        <div className="w-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                
                <div className="flex-1 space-y-2">
                    {/* Título */}
                    <h3 className="font-semibold text-red-900 dark:text-red-300">
                        {modelName} no disponible
                    </h3>

                    {/* Mensaje */}
                    <p className="text-sm text-red-700 dark:text-red-400">
                        {displayInfo.reason || 'El modelo ha alcanzado su límite de uso.'}
                    </p>

                    {/* Countdown principal - muy destacado */}
                    <div className="flex items-center gap-2 bg-white dark:bg-red-900/50 rounded px-3 py-2 border border-red-300 dark:border-red-700 w-fit">
                        <Clock className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                        <p className="text-sm font-mono font-bold text-red-800 dark:text-red-300">
                            {displayInfo.formattedTime}
                        </p>
                    </div>

                    {/* Información detallada de headers si está disponible */}
                    {hasHeaderInfo && (
                        <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-900/50 space-y-1">
                            <div className="flex items-center gap-4 text-xs text-red-700 dark:text-red-400">
                                {displayInfo.headers.remaining.requests !== undefined && (
                                    <div className="flex items-center gap-1">
                                        <Zap className="w-3 h-3" />
                                        <span>Requests: {displayInfo.headers.remaining.requests}</span>
                                    </div>
                                )}
                                {displayInfo.headers.remaining.tokens !== undefined && (
                                    <div className="flex items-center gap-1">
                                        <Zap className="w-3 h-3" />
                                        <span>Tokens: {displayInfo.headers.remaining.tokens}</span>
                                    </div>
                                )}
                            </div>

                            {/* Reset times si están disponibles */}
                            {(displayInfo.headers.reset.requests || displayInfo.headers.reset.tokens) && (
                                <div className="text-xs text-red-600 dark:text-red-500 space-y-0.5">
                                    {displayInfo.headers.reset.requests && (
                                        <p>Reset (requests): {displayInfo.headers.reset.requests}</p>
                                    )}
                                    {displayInfo.headers.reset.tokens && (
                                        <p>Reset (tokens): {displayInfo.headers.reset.tokens}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Estado de conexión SSE */}
                    {!isConnected && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                            {streamError ? `⚠ ${streamError}` : '⟳ Reconectando...'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
