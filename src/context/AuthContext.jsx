import React, { createContext, useContext, useEffect, useState } from "react";
import { getRedirectResult, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { GOOGLE_REDIRECT_FLAG } from "../firebase/auth";
import { ensureOwnerRecord } from "../firebase/seedOwner";
import { isOwnerEmail, OWNER_PERMISSIONS } from "../firebase/roles";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

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
        const owner = isOwnerEmail(currentUser?.email);
        setRole(owner ? "owner" : null);
        setLoading(false);
        if (owner) {
          ensureOwnerRecord(currentUser).catch((error) => {
            console.error("Could not save owner record:", error);
          });
        }
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
    <AuthContext.Provider value={{ user, loading, logout, role, isOwner: role === "owner", permissions: role === "owner" ? OWNER_PERMISSIONS : {} }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
