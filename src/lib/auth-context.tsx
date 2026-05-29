"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, getToken, setToken } from "@/lib/api";
import type { User } from "@/lib/types";

type LoginInput = { email?: string; phone?: string; password: string };
type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  role?: "customer" | "driver" | "fleet_owner";
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthResponse = { user: User; token: string; message: string };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get<{ data: User }>("v1/me");
      setUser(res.data);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback<AuthContextValue["login"]>(async (input) => {
    const res = await api.post<AuthResponse>("v1/login", input);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback<AuthContextValue["register"]>(async (input) => {
    const res = await api.post<AuthResponse>("v1/register", input);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("v1/logout");
    } catch {
      // ignore — invalidate locally regardless
    }
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
