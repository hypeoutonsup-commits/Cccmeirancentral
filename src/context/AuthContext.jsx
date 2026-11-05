import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase/config";
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";

const AuthContext = createContext();
const REDIRECT_FLAG = "ccc-google-redirect";

const POPUP_FALLBACK_CODES = new Set([
  "auth/popup-blocked",
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
  "auth/operation-not-supported-in-this-environment",
]);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;

    async function listen() {
      if (sessionStorage.getItem(REDIRECT_FLAG) === "1") {
        sessionStorage.removeItem(REDIRECT_FLAG);
        try {
          await getRedirectResult(auth);
        } catch (error) {
          console.error("Google redirect sign-in failed", error);
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

  const loginWithGoogle = async () => {
    if (signingIn) return;
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (popupError) {
      console.error("Google popup sign-in failed", popupError);
      if (!POPUP_FALLBACK_CODES.has(popupError?.code)) return;
      try {
        sessionStorage.setItem(REDIRECT_FLAG, "1");
        await signInWithRedirect(auth, googleProvider);
      } catch (redirectError) {
        sessionStorage.removeItem(REDIRECT_FLAG);
        console.error("Google redirect sign-in failed", redirectError);
      }
    } finally {
      setSigningIn(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-out failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signingIn, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
