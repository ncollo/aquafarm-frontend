import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type Role = "ADMIN" | "MANAGER" | "CUSTOMER";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (roles: (Role | "admin" | "manager" | "customer")[]) => boolean;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => ({ success: false }),
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
  hasRole: () => false,
});

const getInitials = (name: string): string => {
  if (!name) return "AF";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

function isTokenValid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("aquafarm-token");
      localStorage.removeItem("aquafarm-user");
    } catch {}
  }, []);

  // Restore session on mount & listen for 401 expiration events
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("aquafarm-token");
      const storedUser = localStorage.getItem("aquafarm-user");
      if (storedToken && storedUser && isTokenValid(storedToken)) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }

    const handleAuthExpired = () => {
      console.warn("[Auth] Session expired (401 / token expiry). Logging out.");
      logout();
    };

    window.addEventListener("auth:expired", handleAuthExpired);
    return () => window.removeEventListener("auth:expired", handleAuthExpired);
  }, [logout]);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        return {
          success: false,
          error: data.error || "Authentication failed. Please verify your credentials.",
        };
      }

      const normalizedRole = (data.user.role?.toUpperCase() || "MANAGER") as Role;
      const loggedUser: AuthUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: normalizedRole,
        phone: data.user.phone,
        avatar: getInitials(data.user.name),
      };

      setToken(data.token);
      setUser(loggedUser);

      try {
        localStorage.setItem("aquafarm-token", data.token);
        localStorage.setItem("aquafarm-user", JSON.stringify(loggedUser));
      } catch {}

      return { success: true };
    } catch (err: any) {
      console.error("[Auth] Connection error during login:", err);
      // Fallback for offline demo accounts
      if (email.toLowerCase().includes("admin") && password === "admin123") {
        const mockAdmin: AuthUser = {
          id: "admin-1",
          name: "John Mwangi",
          email: "admin@aquafarm.co.ke",
          role: "ADMIN",
          avatar: "JM",
        };
        const mockToken = "mock-admin-token";
        setUser(mockAdmin);
        setToken(mockToken);
        localStorage.setItem("aquafarm-token", mockToken);
        localStorage.setItem("aquafarm-user", JSON.stringify(mockAdmin));
        return { success: true };
      } else if (email.toLowerCase().includes("manager") && password === "manager123") {
        const mockManager: AuthUser = {
          id: "mgr-1",
          name: "Grace Wanjiku",
          email: "manager@aquafarm.co.ke",
          role: "MANAGER",
          avatar: "GW",
        };
        const mockToken = "mock-manager-token";
        setUser(mockManager);
        setToken(mockToken);
        localStorage.setItem("aquafarm-token", mockToken);
        localStorage.setItem("aquafarm-user", JSON.stringify(mockManager));
        return { success: true };
      }
      return { success: false, error: "Unable to connect to server. Please try again." };
    }
  };

  const hasRole = (roles: (Role | "admin" | "manager" | "customer")[]): boolean => {
    if (!user) return false;
    const userRole = user.role.toUpperCase();
    return roles.some((r) => r.toUpperCase() === userRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
        isLoading,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
