"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("idle");

  const refresh = async () => {
    setStatus("loading");
    try {
      const me = await api.get("/api/auth/me");
      setUser(me);
      setStatus("authenticated");
      return me;
    } catch (error) {
      if (error?.status === 401) {
        setUser(null);
        setStatus("unauthenticated");
        return null;
      }
      setStatus("error");
      throw error;
    }
  };

  const login = async (payload) => {
    const authenticatedUser = await api.post("/api/auth/login", payload);
    setUser(authenticatedUser);
    setStatus("authenticated");
    return authenticatedUser;
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  };

  useEffect(() => {
    refresh().catch(() => {
      setUser(null);
      setStatus("unauthenticated");
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      refresh,
      login,
      logout
    }),
    [user, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
