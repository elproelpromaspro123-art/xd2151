import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ChatPage from "@/pages/ChatPage";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/not-found";
import {
    isAuthenticated,
    getUser,
    setToken,
    setUser,
    logout,
    refreshUser,
    type User
} from "@/lib/auth";

function initializeTheme() {
    // Se initializará en ChatPage con modo + tono
    // Por defecto aplicamos dark al inicio
    const root = document.documentElement;
    root.classList.add("dark");
    root.style.colorScheme = "dark";
}

initializeTheme();

function Router() {
    const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
    const [user, setUserState] = useState<User | null>(getUser());
    const [isLoading, setIsLoading] = useState(true);
    const [, setLocation] = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated()) {
                const currentUser = await refreshUser();
                if (currentUser) {
                    setUserState(currentUser);
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                    setUserState(null);
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const handleLoginSuccess = (token: string, userData: User) => {
        setToken(token);
        setUser(userData);
        setUserState(userData);
        setIsLoggedIn(true);
        queryClient.invalidateQueries();
        setLocation("/");
    };

    const handleLogout = () => {
        logout();
        setIsLoggedIn(false);
        setUserState(null);
        queryClient.clear();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-8 h-8 text-primary animate-spin"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                            />
                        </svg>
                    </div>
                    <p className="text-muted-foreground">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <Switch>
            <Route path="/">
                {isLoggedIn ? (
                    <ChatPage user={user} onLogout={handleLogout} />
                ) : (
                    <AuthPage onLoginSuccess={handleLoginSuccess} />
                )}
            </Route>
            <Route path="/login">
                <AuthPage onLoginSuccess={handleLoginSuccess} />
            </Route>
            <Route component={NotFound} />
        </Switch>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <Toaster />
                    <Router />
                </TooltipProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}

export default App;
