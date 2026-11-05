import React, { createContext, useContext, useEffect, useState } from "react";
import { getRedirectResult, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { GOOGLE_REDIRECT_FLAG } from "../firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;

    async function listen() {
      if (sessionStorage.getItem(GOOGLE_REDIRECT_FLAG) === "1") {
        sessionStorage.removeItem(GOOGLE_REDIRECT_FLAG);
        try {
          await getRedirectResult(auth);
        } catch (error) {
          console.error("Authentication failed completely:", error);
        }
      }
      if (cancelled) return;
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
    }

    listen();
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Authentication failed completely:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
