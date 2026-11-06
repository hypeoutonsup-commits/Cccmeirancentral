import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const PERMISSIONS = [
  { id: "uploadAudio", label: "Upload Audio (Hymns)" },
  { id: "uploadVideo", label: "Upload Videos" },
  { id: "createEvents", label: "Create / Write Events" },
  { id: "postNews", label: "Post in News Feed" },
  { id: "postCommunity", label: "Post in Community" },
  { id: "reportMember", label: "Report a Member" },
  { id: "blockMember", label: "Block a Member from Posting" },
  { id: "manageNeeds", label: "Create Fundraising Needs" },
  { id: "viewStats", label: "View Visitor / Member Stats" }
];

export default function AdminPage() {
  const { user, isOwner } = useAuth();
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [permissions, setPermissions] = useState({});

  const togglePermission = (permId) => {
    setPermissions(prev => ({ ...prev, [permId]: !prev[permId] }));
  };

  const savePermissions = () => {
    alert("Permissions saved for " + (selectedAdmin || "selected admin"));
  };

  if (!user) return <div className="p-8 text-center">Please login to access Admin</div>;
  if (!isOwner) return <div className="p-8 text-center text-gray-500">Only the owner can manage admin permissions</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold text-primary mb-4">Admin Panel</h1>
      <p className="text-sm text-gray-600 mb-4">Owner controls — assign permissions to other admins</p>
      <div className="mb-4">
        <label className="text-sm font-medium">Select Admin Email</label>
        <input type="email" placeholder="admin@example.com" value={selectedAdmin} onChange={(e) => setSelectedAdmin(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1 text-sm" />
      </div>
      <div className="bg-white rounded-xl border p-4 space-y-3">
        <p className="font-medium text-sm mb-2">Permissions</p>
        {PERMISSIONS.map(perm => (
          <label key={perm.id} className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={!!permissions[perm.id]} onChange={() => togglePermission(perm.id)} className="w-4 h-4" />
            <span className="text-sm">{perm.label}</span>
          </label>
        ))}
      </div>
      <button onClick={savePermissions} className="mt-4 bg-primary text-white px-6 py-2 rounded-full text-sm">Save Permissions</button>
      <div className="mt-8 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">Visitor & member counts will appear here for admins only.</div>
    </div>
  );
}