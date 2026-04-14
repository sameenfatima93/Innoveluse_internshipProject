import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = guest
  const [showAuth, setShowAuth] = useState(false);
  const [afterLoginRoute, setAfterLoginRoute] = useState(null);

  const login = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  const logout = () => setUser(null);

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
