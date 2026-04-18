import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("timex_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  }); // null = guest
  const [showAuth, setShowAuth] = useState(false);
  const [afterLoginRoute, setAfterLoginRoute] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("timex_user", JSON.stringify(userData));
    setShowAuth(false);
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: user?.role || "user" }),
      });
    } catch {
      // Local logout should still complete even if backend is unavailable.
    } finally {
      setUser(null);
      localStorage.removeItem("timex_user");
      localStorage.removeItem("timex_admin_token");
    }
  };

  const requireLogin = (route) => {
    if (user) return true;
    setAfterLoginRoute(route);
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
