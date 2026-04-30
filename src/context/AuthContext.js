// src/context/AuthContext.js
// ─────────────────────────────────────────────────────────────
// Menyimpan status login secara global.
// Komponen manapun bisa tahu apakah user sudah login atau belum.
// ─────────────────────────────────────────────────────────────

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getStoredUser,
  isLoggedIn,
  logout as apiLogout,
} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // cek storage saat pertama buka app

  // Cek apakah user sudah pernah login sebelumnya
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

  const signOut = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook praktis: const { user, signOut } = useAuth();
export const useAuth = () => useContext(AuthContext);
