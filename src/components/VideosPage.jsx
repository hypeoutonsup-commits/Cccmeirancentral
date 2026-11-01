import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase/config";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function VideosPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, []);

  const uploadVideo = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    if (file.size > 50 * 1024 * 1024) return alert("Max 50MB");
    setUploading(true);
    const storageRef = ref(storage, `videos/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    await addDoc(collection(db, "videos"), {
      title: file.name.replace(/\.[^/.]+$/, ""),
      url,
      createdAt: new Date(),
      loves: 0,
      uploadedBy: user.uid
    });
    setUploading(false);
  };

  return (
    <div className="p-4">
      <h2 className="font-bold text-primary mb-3">Videos</h2>
      {user && (
        <label className="block mb-4 text-sm bg-primary text-white text-center py-2 rounded-full cursor-pointer">
          {uploading ? "Uploading..." : "Upload Video"}
          <input type="file" accept="video/*" onChange={uploadVideo} className="hidden" />
        </label>
      )}
      <div className="space-y-4">
        {videos.map(v => (
          <div key={v.id} className="bg-white rounded-xl border overflow-hidden">
            <video controls src={v.url} className="w-full aspect-video bg-black" />
            <p className="p-3 text-sm font-medium">{v.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}