import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(20));
    const unsub = onSnapshot(q, snap => setLeaders(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  return (
    <div className="p-4">
      <h2 className="font-bold text-primary mb-3">Leaderboard</h2>
      <div className="space-y-2">
        {leaders.map((l, i) => (
          <div key={l.id} className="bg-white p-3 rounded-xl border flex justify-between">
            <span className="font-medium">{i + 1}. {l.name || "Member"}</span>
            <span>{l.score} pts</span>
          </div>
        ))}
        {leaders.length === 0 && <p className="text-gray-500 text-sm">No scores yet</p>}
      </div>
    </div>
  );
}