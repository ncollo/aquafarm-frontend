import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager";
  avatar: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => ({ success: false }),
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
});

// Mock credentials (in production, this would be validated on the server)
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@aquafarm.co.ke",
    password: "admin123",
    name: "John Mwangi",
    role: "admin" as const,
    avatar: "JM",
  },
  {
    id: "2",
    email: "manager@aquafarm.co.ke",
    password: "manager123",
    name: "Grace Wanjiku",
    role: "manager" as const,
    avatar: "GW",
  },
];

/** Generates a mock JWT-like token with an expiry embedded in the payload */
function generateToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({ sub: userId, iat: Date.now(), exp: Date.now() + 8 * 3600 * 1000 })
  );
  const sig = btoa(`${userId}-aquafarm-${Date.now()}`);
  return `${header}.${payload}.${sig}`;
}

function isTokenValid(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("aquafarm-token");
      const storedUser = localStorage.getItem("aquafarm-user");
      if (storedToken && storedUser && isTokenValid(storedToken)) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("aquafarm-token");
        localStorage.removeItem("aquafarm-user");
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 900));
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { success: false, error: "Invalid email or password. Please try again." };

    const { password: _pw, ...safeUser } = found;
    const newToken = generateToken(found.id);
    setUser(safeUser);
    setToken(newToken);
    try {
      localStorage.setItem("aquafarm-token", newToken);
      localStorage.setItem("aquafarm-user", JSON.stringify(safeUser));
    } catch {}
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("aquafarm-token");
      localStorage.removeItem("aquafarm-user");
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!user && !!token, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
