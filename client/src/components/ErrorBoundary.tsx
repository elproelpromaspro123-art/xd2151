import React, { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Error Boundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-background flex items-center justify-center p-3 sm:p-4">
            <div className="max-w-md w-full animate-fade-scale">
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-destructive/10 mx-auto mb-4 sm:mb-6">
                <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-destructive" />
              </div>
              <h1 className="text-center text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">Algo salió mal</h1>
              <p className="text-center text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                {this.state.error?.message || 'Se produjo un error inesperado. Por favor, intenta recargar la página.'}
              </p>

              {/* Error details in development */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-4 sm:mb-6 p-3 sm:p-4 bg-muted/50 rounded-lg border border-border/50">
                  <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Detalles técnicos (desarrollo)
                  </summary>
                  <pre className="mt-2 text-xs text-muted-foreground overflow-auto max-h-32">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 active:bg-primary/80 transition-colors touch-manipulation font-medium text-sm sm:text-base"
                >
                  Recargar página
                </button>
                <button
                  onClick={() => this.setState({ hasError: false, error: undefined })}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 active:bg-secondary/70 transition-colors touch-manipulation font-medium text-sm sm:text-base"
                >
                  Intentar de nuevo
                </button>
              </div>

              <p className="text-center text-xs text-muted-foreground/70 mt-4 sm:mt-6">
                Si el problema persiste, contacta al soporte técnico.
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
