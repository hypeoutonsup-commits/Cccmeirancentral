import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase/config";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function HymnsPage() {
  const { user } = useAuth();
  const [hymns, setHymns] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "hymns"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => setHymns(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  const uploadHymn = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    if (file.size > 50 * 1024 * 1024) return alert("Max 50MB");
    setUploading(true);
    const storageRef = ref(storage, `hymns/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await addDoc(collection(db, "hymns"), {
      title: file.name.replace(/\.[^/.]+$/, ""),
      url,
      createdAt: new Date(),
      uploadedBy: user.uid
    });
    setUploading(false);
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-primary mb-3">Hymns</h2>
      {user && (
        <label className="block mb-4 text-sm bg-primary text-white text-center py-2 rounded-full cursor-pointer">
          {uploading ? "Uploading..." : "Upload Hymn (Admin)"}
          <input type="file" accept="audio/*" onChange={uploadHymn} className="hidden" />
        </label>
      )}
      <div className="space-y-3">
        {hymns.map(h => (
          <div key={h.id} className="bg-white p-3 rounded-xl border flex justify-between items-center">
            <div>
              <p className="font-medium text-sm">{h.title}</p>
              <audio controls src={h.url} className="mt-1 w-full max-w-xs" />
            </div>
            {user && <a href={h.url} download className="text-primary text-sm">Download</a>}
          </div>
        ))}
      </div>
    </div>
  );
}