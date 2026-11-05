import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { auth, googleProvider } from "../firebase/config";
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";

const AuthContext = createContext();

function describeAuthError(error) {
  const code = error?.code || "";
  if (code === "auth/unauthorized-domain") {
    return "Google sign-in is not allowed on this domain yet. In Firebase, open Authentication, then Settings, then Authorized domains, and add this site's domain.";
  }
  if (code === "auth/popup-blocked") {
    return "The browser blocked the Google window. Tap Google Login again to continue on this page.";
  }
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
    return "Google closed before sign-in finished. Tap Google Login again.";
  }
  if (code === "auth/network-request-failed") {
    return "The network dropped while contacting Google. Check your connection and try again.";
  }
  return error?.message || "Google sign-in did not complete.";
}

function prefersRedirect() {
  const narrow = window.matchMedia("(max-width: 768px)").matches;
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  return narrow || mobile;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState("");
  const redirectInFlight = useRef(false);

  useEffect(() => {
    let unsubscribe = () => {};
    let cancelled = false;

    async function listen() {
      try {
        await getRedirectResult(auth);
      } catch (error) {
        if (!cancelled) setAuthError(describeAuthError(error));
      }
      if (cancelled) return;
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        setSigningIn(false);
        redirectInFlight.current = false;
      });
    }

    listen();
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    if (signingIn || redirectInFlight.current) return;
    setAuthError("");
    setSigningIn(true);

    const startRedirect = async () => {
      redirectInFlight.current = true;
      await signInWithRedirect(auth, googleProvider);
    };

    try {
      if (prefersRedirect()) {
        await startRedirect();
        return;
      }
      await signInWithPopup(auth, googleProvider);
      setSigningIn(false);
    } catch (error) {
      const code = error?.code || "";
      const popupFailed = code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment";
      if (popupFailed) {
        try {
          await startRedirect();
          return;
        } catch (redirectError) {
          redirectInFlight.current = false;
          setAuthError(describeAuthError(redirectError));
          setSigningIn(false);
          return;
        }
      }
      setAuthError(describeAuthError(error));
      setSigningIn(false);
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signingIn, authError, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
