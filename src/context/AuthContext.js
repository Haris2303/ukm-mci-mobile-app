// src/context/AuthContext.js
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { getStoredUser, isLoggedIn, logout as apiLogout } from '../services/api';
import { setSignOutHandler } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        const storedUser = await getStoredUser();
        setUser(storedUser);
        if (storedUser?.avatar) setAvatar(storedUser.avatar);
      }
      setLoading(false);
    })();
  }, []);

  const signIn = (userData) => {
    setUser(userData);
    if (userData?.avatar) setAvatar(userData.avatar);
  };

  const updateAvatar = useCallback((avatarStr) => {
    setAvatar(avatarStr ?? null);
  }, []);

  const signOut = useCallback(async () => {
    await apiLogout();
    setUser(null);
    setAvatar(null);
  }, []);

  // Daftarkan signOut ke central handler agar 401 bisa auto-redirect ke login
  useEffect(() => {
    setSignOutHandler(signOut);
  }, [signOut]);

  return (
    <AuthContext.Provider value={{ user, avatar, loading, signIn, signOut, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
