import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, ShieldAlert } from "lucide-react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface AuthPageProps {
  onLoginSuccess: (token: string, user: any) => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState<string | null>(null);
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/auth/google-client-id")
      .then((res) => res.json())
      .then((data) => {
        if (data.clientId) {
          setGoogleClientId(data.clientId);
        }
      })
      .catch(console.error);

    fetch("/api/auth/turnstile-site-key")
      .then((res) => res.json())
      .then((data) => {
        if (data.siteKey) {
          setTurnstileSiteKey(data.siteKey);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Resetear token cuando cambia el modo
    setTurnstileToken(null);
  }, [mode]);

  useEffect(() => {
    // Cargar Cloudflare Turnstile
    if (turnstileSiteKey && mode === "register") {
      // Limpiar widget anterior si existe
      if (turnstileWidgetId && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId);
        setTurnstileWidgetId(null);
      }

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Esperar un momento para que el DOM esté listo
        setTimeout(() => {
          const widgetElement = document.getElementById("turnstile-widget");
          if (window.turnstile && turnstileSiteKey && widgetElement) {
            const widgetId = window.turnstile.render(widgetElement, {
              sitekey: turnstileSiteKey,
              theme: "dark",
              callback: (token: string) => {
                setTurnstileToken(token);
              },
              "error-callback": () => {
                setTurnstileToken(null);
              },
              "expired-callback": () => {
                setTurnstileToken(null);
              },
            });
            setTurnstileWidgetId(widgetId);
          }
        }, 100);
      };
      document.body.appendChild(script);

      return () => {
        if (turnstileWidgetId && window.turnstile) {
          window.turnstile.remove(turnstileWidgetId);
          setTurnstileWidgetId(null);
        }
        const existingScript = document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]');
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
  }, [turnstileSiteKey, mode]);

  useEffect(() => {
    if (googleClientId) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);

      return () => {
        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
  }, [googleClientId]);

  const initializeGoogleSignIn = () => {
    if (window.google && googleClientId) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCallback,
        auto_select: false,
      });
    }
  };

  const handleCustomGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  const handleGoogleCallback = async (response: { credential: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error en autenticación con Google");
      }

      toast({
        title: data.isNewUser ? "Cuenta creada" : "Bienvenido de vuelta",
        description: data.isNewUser 
          ? "Tu cuenta ha sido creada exitosamente con Google" 
          : "Has iniciado sesión correctamente",
      });

      onLoginSuccess(data.token, data.user);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    // Verificar token de Turnstile
    if (!turnstileToken) {
      toast({
        title: "Error",
        description: "Por favor completa la verificación de seguridad",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password,
          turnstileToken: turnstileToken,
          remember: rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar");
      }

      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada exitosamente",
        variant: "default",
      });

      // Iniciar sesión automáticamente
      onLoginSuccess(data.token, data.user);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      // Resetear Turnstile en caso de error
      if (turnstileWidgetId && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId);
        setTurnstileToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember: rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión correctamente",
      });

      onLoginSuccess(data.token, data.user);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Include remember option in register as well
  useEffect(() => {
    // noop - placeholder to keep linter happy about rememberMe usage elsewhere
  }, [rememberMe]);


  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl ring-1 ring-white/10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center mx-auto mb-6 animated-border-strong shadow-lg shadow-primary/5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-10 h-10 text-primary drop-shadow-md"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Roblox UI Designer Pro</h1>
            <p className="text-muted-foreground mt-3 text-base font-medium">
              {mode === "login" && "Bienvenido de nuevo, creador"}
              {mode === "register" && "Únete a la élite del diseño en Roblox"}
            </p>
          </div>

          <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="ml-1">Correo electrónico</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50 focus:bg-background transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password"className="ml-1">Contraseña</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-background/50 border-border/50 focus:bg-background transition-all duration-300"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-1">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-border/50 bg-background/50 text-primary focus:ring-primary"
                  />
                  <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">Recordarme</label>
                </div>

                {mode === "register" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <ShieldAlert className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-amber-200 font-medium">
                            Importante: Guarda tu contraseña
                          </p>
                          <p className="text-xs text-amber-300/70 mt-1">
                            Asegúrate de guardar tu contraseña en un lugar seguro. Si la olvidas, tendras que contactar soporte para recuperar tu cuenta.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {mode === "register" && (
                  <div className="flex justify-center">
                    <div id="turnstile-widget"></div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {mode === "login" ? "Iniciando sesión..." : "Registrando..."}
                    </>
                  ) : (
                    mode === "login" ? "Iniciar sesión" : "Crear cuenta"
                  )}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleCustomGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium">
                  {mode === "login" ? "Continuar con Google" : "Registrarse con Google"}
                </span>
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-6">
                {mode === "login" ? (
                  <>
                    ¿No tienes cuenta?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-primary hover:underline font-medium"
                    >
                      Regístrate
                    </button>
                  </>
                ) : (
                  <>
                    ¿Ya tienes cuenta?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-primary hover:underline font-medium"
                    >
                      Inicia sesión
                    </button>
                  </>
                )}
              </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Al registrarte, aceptas nuestros términos de servicio y política de privacidad.
        </p>
      </div>
    </div>
  );
}
