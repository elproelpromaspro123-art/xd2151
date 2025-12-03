const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export interface User {
  id: string;
  email: string;
  isPremium: boolean;
  isEmailVerified: boolean;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getUser(): User | null {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function logout(): void {
  const token = getToken();
  if (token) {
    fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(console.error);
  }
  removeToken();
  removeUser();
}

export async function refreshUser(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      logout();
      return null;
    }

    const user = await res.json();
    setUser(user);
    return user;
  } catch {
    return null;
  }
}

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}
