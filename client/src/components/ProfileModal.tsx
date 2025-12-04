import { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff, Loader2, Moon, Sun, Check, Palette, Crown, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { getToken } from "@/lib/auth";
import type { User as UserType } from "@/lib/auth";

interface ProfileModalProps {
  user: UserType;
  children: React.ReactNode;
  onUserUpdate?: (user: UserType) => void;
  chatMode?: "roblox" | "general";
}

interface ThemeSettings {
  robloxDark: boolean;
  generalDark: boolean;
}

function getThemeSettings(): ThemeSettings {
  if (typeof window === "undefined") return { robloxDark: true, generalDark: false };
  const stored = localStorage.getItem("themeSettings");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return { robloxDark: true, generalDark: false };
}

function saveThemeSettings(settings: ThemeSettings): void {
  localStorage.setItem("themeSettings", JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("themeSettingsChange", { detail: settings }));
}

export function ProfileModal({ user, children, onUserUpdate, chatMode = "roblox" }: ProfileModalProps) {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(getThemeSettings);
  const { toast } = useToast();

  const isCreatorAccount = user.email?.toLowerCase() === "uiuxchatbot@gmail.com";
  const isGoogleUser = (user as any).isGoogleUser;

  useEffect(() => {
    if (open) {
      setThemeSettings(getThemeSettings());
    }
  }, [open]);

  const handleRobloxThemeChange = (dark: boolean) => {
    const newSettings = { ...themeSettings, robloxDark: dark };
    setThemeSettings(newSettings);
    saveThemeSettings(newSettings);
    
    if (chatMode === "roblox") {
      applyTheme(dark);
    }
  };

  const handleGeneralThemeChange = (dark: boolean) => {
    const newSettings = { ...themeSettings, generalDark: dark };
    setThemeSettings(newSettings);
    saveThemeSettings(newSettings);
    
    if (chatMode === "general") {
      applyTheme(dark);
    }
  };

  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    if (dark) {
      root.classList.remove("light");
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.style.colorScheme = "light";
    }
    // Force repaint to ensure changes apply
    void root.offsetHeight;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = getToken();
    if (!token) {
      toast({
        title: "Sesión expirada",
        description: "Por favor, inicia sesión nuevamente",
        variant: "destructive",
      });
      setOpen(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas nuevas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La nueva contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al cambiar contraseña");
      }

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setOpen(false);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-background/95 backdrop-blur-xl border-border shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            Mi Cuenta
            {isCreatorAccount && (
              <span className="ml-auto flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full text-[10px] font-bold text-amber-500">
                <Sparkles className="h-3 w-3" />
                CREADOR
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Gestiona tu perfil, temas y contraseña
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Email section */}
          <div className="space-y-2">
            <Label className="text-muted-foreground ml-1 text-xs uppercase tracking-wider font-semibold">
              Correo electrónico
            </Label>
            <div className="flex items-center gap-3 p-3.5 bg-muted/30 border border-border/50 rounded-xl">
              <div className="p-2 rounded-full bg-background border border-border/50">
                <span className="text-xs font-bold text-muted-foreground">@</span>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium block">{user.email}</span>
                {isGoogleUser && (
                  <span className="flex items-center gap-1 text-[10px] text-green-500 font-medium mt-0.5">
                    <Check className="h-3 w-3" />
                    Verificado con Google
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Account status */}
          <div className="space-y-2">
            <Label className="text-muted-foreground ml-1 text-xs uppercase tracking-wider font-semibold">
              Estado de la cuenta
            </Label>
            <div className="flex items-center gap-3 p-3.5 bg-muted/30 border border-border/50 rounded-xl">
              {user.isPremium ? (
                <>
                  <div className="p-2 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <Crown className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <span className="flex items-center gap-2 text-sm text-amber-500 font-bold">
                      PREMIUM
                      <span className="px-2 py-0.5 bg-amber-500/10 rounded text-[10px] border border-amber-500/20">
                        ACTIVO
                      </span>
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Acceso a todas las funciones
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 rounded-full bg-muted border border-border/50">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium">Plan Gratuito</span>
                    <p className="text-xs text-muted-foreground mt-0.5">Funciones limitadas</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Theme settings */}
          <div className="space-y-3">
            <Label className="text-muted-foreground ml-1 text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
              <Palette className="h-3.5 w-3.5" />
              Configuración de Temas
            </Label>
            
            {/* Roblox theme */}
            <div 
              className="flex items-center justify-between p-3.5 bg-muted/30 border border-border/50 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => handleRobloxThemeChange(!themeSettings.robloxDark)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${themeSettings.robloxDark ? 'bg-violet-500/10 text-violet-400' : 'bg-orange-500/10 text-orange-500'}`}>
                  {themeSettings.robloxDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </div>
                <div>
                  <span className="text-sm font-medium">Modo Roblox</span>
                  <p className="text-xs text-muted-foreground">
                    {themeSettings.robloxDark ? "Oscuro" : "Claro"}
                  </p>
                </div>
              </div>
              <Switch
                checked={themeSettings.robloxDark}
                onCheckedChange={handleRobloxThemeChange}
                className="data-[state=checked]:bg-violet-500"
              />
            </div>

            {/* General theme */}
            <div 
              className="flex items-center justify-between p-3.5 bg-muted/30 border border-border/50 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => handleGeneralThemeChange(!themeSettings.generalDark)}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${themeSettings.generalDark ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-500'}`}>
                  {themeSettings.generalDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </div>
                <div>
                  <span className="text-sm font-medium">Modo General</span>
                  <p className="text-xs text-muted-foreground">
                    {themeSettings.generalDark ? "Oscuro" : "Claro"}
                  </p>
                </div>
              </div>
              <Switch
                checked={themeSettings.generalDark}
                onCheckedChange={handleGeneralThemeChange}
                className="data-[state=checked]:bg-blue-500"
              />
            </div>
          </div>

          {/* Change password - only for non-Google users */}
          {!isGoogleUser && (
            <div className="border-t border-border/50 pt-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Cambiar Contraseña
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="currentPassword" className="text-xs text-muted-foreground">
                    Contraseña actual
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="newPassword" className="text-xs text-muted-foreground">
                    Nueva contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmNewPassword" className="text-xs text-muted-foreground">
                    Confirmar nueva contraseña
                  </Label>
                  <Input
                    id="confirmNewPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !currentPassword || !newPassword || !confirmNewPassword}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cambiando...
                    </>
                  ) : (
                    "Cambiar Contraseña"
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
