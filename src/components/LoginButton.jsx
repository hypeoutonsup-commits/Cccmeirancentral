import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogIn, LogOut } from "lucide-react";

export default function LoginButton() {
  const { user, loginWithGoogle, logout } = useAuth();

  if (user) {
    return (
      <button onClick={logout} className="flex items-center gap-1 text-sm text-red-600">
        <LogOut size={16} /> Logout
      </button>
    );
  }

  return (
    <button onClick={loginWithGoogle} className="flex items-center gap-1 text-sm bg-primary text-white px-3 py-1.5 rounded-full">
      <LogIn size={16} /> Google Login
    </button>
  );
}