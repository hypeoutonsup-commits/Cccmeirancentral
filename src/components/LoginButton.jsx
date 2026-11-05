import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { handleGoogleLogin } from "../firebase/auth";
import { LogIn, LogOut } from "lucide-react";

const touchTarget =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto";

export default function LoginButton() {
  const { user, logout } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  const onGoogleLogin = async () => {
    if (signingIn) return;
    setSigningIn(true);
    try {
      await handleGoogleLogin();
    } finally {
      setSigningIn(false);
    }
  };

  if (user) {
    return (
      <button type="button" onClick={logout} className={`${touchTarget} border border-red-200 bg-white text-red-600 focus-visible:outline-red-600`}>
        <LogOut size={18} aria-hidden="true" /> Logout
      </button>
    );
  }

  return (
    <div className="flex w-full flex-col items-stretch gap-2 sm:items-end">
      <button
        type="button"
        onClick={onGoogleLogin}
        disabled={signingIn}
        className={`${touchTarget} bg-primary text-white focus-visible:outline-primary disabled:opacity-70`}
      >
        <LogIn size={18} aria-hidden="true" />
        {signingIn ? "Opening Google…" : "Google Login"}
      </button>
    </div>
  );
}
