import React from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return <div className="p-8 text-center">Please login to view profile</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold text-primary mb-4">Profile & Achievements</h1>
      <div className="bg-white rounded-xl p-5 border text-center mb-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2" />
        <p className="font-medium">{user.displayName}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
      <div className="space-y-2">
        <div className="bg-white p-4 rounded-xl border">Game Achievements: Coming</div>
        <div className="bg-white p-4 rounded-xl border">Practice Rank: Coming</div>
        <div className="bg-white p-4 rounded-xl border">Daily Commit Streak: Coming</div>
        <div className="bg-white p-4 rounded-xl border">Contact Replies will appear here</div>
      </div>
      <button onClick={logout} className="mt-6 text-red-600 text-sm">Logout</button>
    </div>
  );
}