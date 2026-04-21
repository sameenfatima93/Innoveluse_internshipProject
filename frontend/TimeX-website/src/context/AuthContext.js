import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function normalizeApiBase(rawBaseUrl) {
  const trimmedBase = String(rawBaseUrl || "").trim().replace(/\/+$/, "");
  if (!trimmedBase) {
    return "http://localhost:5001/api";
  }
  return trimmedBase.endsWith("/api") ? trimmedBase : `${trimmedBase}/api`;
}

export const API_BASE = normalizeApiBase(process.env.REACT_APP_API_BASE_URL || "http://localhost:5001");
export const ADMIN_APP_URL = (process.env.REACT_APP_ADMIN_APP_URL || "http://localhost:5173").trim();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("chronostore_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  }); // null = guest
  const [showAuth, setShowAuth] = useState(false);
  const [afterLoginRoute, setAfterLoginRoute] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("chronostore_user", JSON.stringify(userData));
    setShowAuth(false);
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: user?.role || "user" }),
      });
    } catch {
      // Local logout should still complete even if backend is unavailable.
    } finally {
      setUser(null);
      localStorage.removeItem("chronostore_user");
      localStorage.removeItem("chronostore_admin_token");
    }
  };

  const requireLogin = (route) => {
    if (user) return true;
    if (typeof route === "string") {
      setAfterLoginRoute({ pathname: route });
    } else if (route && typeof route === "object" && typeof route.pathname === "string") {
      setAfterLoginRoute(route);
    } else {
      setAfterLoginRoute({ pathname: "/" });
    }
    setShowAuth(true);
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, showAuth, setShowAuth, afterLoginRoute, setAfterLoginRoute, requireLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
