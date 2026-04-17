import { createContext, useContext, useState, useCallback } from "react";

/**
 * AuthContext
 *
 * Provides global authentication state to the entire app.
 * - user   : { id, username, email } or null
 * - token  : JWT string or null
 * - login  : (userData, token) => void  — called after successful API login
 * - logout : () => void                 — clears state + localStorage
 */
const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  // Hydrate from localStorage on first render
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Called by Login page on successful API response
  const login = useCallback((userData, jwtToken) => {
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
  }, []);

  // Clears all auth state
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, token, isLoggedIn: !!token, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
