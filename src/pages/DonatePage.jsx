import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

export default function DonatePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Offering");
  const [needs, setNeeds] = useState([]);
  const [newNeed, setNewNeed] = useState({ title: "", description: "", goal: "" });

  useEffect(() => {
    const q = query(collection(db, "needs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setNeeds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const createNeed = async () => {
    if (!user || !newNeed.title) return;
    await addDoc(collection(db, "needs"), {
      ...newNeed,
      createdAt: new Date(),
      raised: 0,
      createdBy: user.uid
    });
    setNewNeed({ title: "", description: "", goal: "" });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-4 bg-white border-b">
        <h1 className="text-xl font-bold text-primary">Donate</h1>
      </div>

      <div className="flex gap-2 p-3 bg-gray-50 border-b">
        {["Offering", "Tithe", "Needs"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-sm ${activeTab === tab ? "bg-primary text-white" : "bg-white border"}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Offering" && (
        <div className="p-6 text-center">
          <p className="mb-4">General freewill offering</p>
          <button className="bg-primary text-white px-8 py-3 rounded-full">Give Offering</button>
        </div>
      )}

      {activeTab === "Tithe" && (
        <div className="p-6 text-center">
          <p className="mb-4">Tithe giving</p>
          <button className="bg-primary text-white px-8 py-3 rounded-full">Give Tithe</button>
        </div>
      )}

      {activeTab === "Needs" && (
        <div className="p-4">
          {user?.email === "istobasam23@gmail.com" && (
            <div className="bg-white p-4 rounded-xl border mb-4">
              <p className="font-medium text-sm mb-2">Create Need (Admin)</p>
              <input placeholder="Title" value={newNeed.title} onChange={e => setNewNeed({...newNeed, title: e.target.value})} className="w-full border rounded px-3 py-2 mb-2 text-sm" />
              <textarea placeholder="Description" value={newNeed.description} onChange={e => setNewNeed({...newNeed, description: e.target.value})} className="w-full border rounded px-3 py-2 mb-2 text-sm" />
              <input placeholder="Goal amount" value={newNeed.goal} onChange={e => setNewNeed({...newNeed, goal: e.target.value})} className="w-full border rounded px-3 py-2 mb-2 text-sm" />
              <button onClick={createNeed} className="bg-primary text-white px-4 py-2 rounded-full text-sm">Create</button>
            </div>
          )}

          <div className="space-y-3">
            {needs.map(need => (
              <div key={need.id} className="bg-white p-4 rounded-xl border">
                <p className="font-medium">{need.title}</p>
                <p className="text-sm text-gray-600 mt-1">{need.description}</p>
                <p className="text-xs mt-2">Goal: {need.goal || "Open"}</p>
                <button className="mt-2 bg-primary text-white px-4 py-1.5 rounded-full text-sm">Give</button>
              </div>
            ))}
            {needs.length === 0 && <p className="text-gray-500 text-sm text-center">No active needs yet</p>}
          </div>
        </div>
      )}
    </div>
  );
}