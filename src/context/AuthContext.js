// src/context/AuthContext.js
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getStoredUser,
  isLoggedIn,
  logout as apiLogout,
} from "../services/api";
import { setSignOutHandler } from "../services/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        const storedUser = await getStoredUser();
        setUser(storedUser);
      }
      setLoading(false);
    })();
  }, []);

  const signIn = (userData) => setUser(userData);

  const signOut = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  // Daftarkan signOut ke central handler agar 401 bisa auto-redirect ke login
  useEffect(() => {
    setSignOutHandler(signOut);
  }, [signOut]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
