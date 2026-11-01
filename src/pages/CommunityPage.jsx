import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, increment, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { Heart, ThumbsUp, ThumbsDown, Flag, Send } from "lucide-react";
import HymnsPage from "../components/HymnsPage";
import VideosPage from "../components/VideosPage";

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [activeTab, setActiveTab] = useState("Posts");

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    });
    return unsubscribe;
  }, []);

  const handlePost = async () => {
    if (!user || !newPost.trim()) return;
    await addDoc(collection(db, "posts"), {
      text: newPost,
      authorId: user.uid,
      authorName: user.displayName || "Member",
      authorPhoto: user.photoURL || "",
      createdAt: new Date(),
      loves: 0,
      likes: 0,
      dislikes: 0,
      reports: 0,
      lovedBy: [],
      likedBy: [],
      dislikedBy: [],
      reportedBy: []
    });
    setNewPost("");
  };

  const handleReaction = async (postId, type) => {
    if (!user) return alert("Please login to react");
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    const data = postSnap.data();

    const field = type + "s";
    const arrayField = type + "By";

    const alreadyReacted = data[arrayField]?.includes(user.uid);

    if (alreadyReacted) {
      await updateDoc(postRef, {
        [field]: increment(-1),
        [arrayField]: arrayRemove(user.uid)
      });
    } else {
      const updates = { [field]: increment(1), [arrayField]: arrayUnion(user.uid) };
      if (type !== "love" && data.lovedBy?.includes(user.uid)) {
        updates.loves = increment(-1);
        updates.lovedBy = arrayRemove(user.uid);
      }
      if (type !== "like" && data.likedBy?.includes(user.uid)) {
        updates.likes = increment(-1);
        updates.likedBy = arrayRemove(user.uid);
      }
      if (type !== "dislike" && data.dislikedBy?.includes(user.uid)) {
        updates.dislikes = increment(-1);
        updates.dislikedBy = arrayRemove(user.uid);
      }
      await updateDoc(postRef, updates);
    }
  };

  const handleReport = async (postId) => {
    if (!user) return alert("Please login to report");
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    const data = postSnap.data();

    if (data.reportedBy?.includes(user.uid)) return alert("Already reported");

    const newReports = (data.reports || 0) + 1;
    await updateDoc(postRef, {
      reports: newReports,
      reportedBy: arrayUnion(user.uid)
    });

    if (newReports >= 100) {
      alert("Post has reached 100 reports and will be reviewed/deleted.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-4 bg-white border-b">
        <h1 className="text-xl font-bold text-primary">Community</h1>
      </div>

      <div className="p-4 bg-white border-b">
        <p className="text-xs text-accent font-semibold mb-2">Featured Video (24h highest Love)</p>
        <div className="bg-gray-200 aspect-video rounded-lg flex items-center justify-center text-gray-500">
          Tap to play featured video
        </div>
      </div>

      <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50 border-b">
        {["Posts", "Events", "Prayer", "Hymns", "Videos"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${activeTab === tab ? "bg-primary text-white" : "bg-white border"}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Posts" && (
        <>
          {user && (
            <div className="p-4 bg-white border-b flex gap-2">
              <input value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Share something..." className="flex-1 border rounded-full px-4 py-2 text-sm" />
              <button onClick={handlePost} className="bg-primary text-white p-2 rounded-full"><Send size={18} /></button>
            </div>
          )}

          <div className="divide-y">
            {posts.map(post => (
              <div key={post.id} className="p-4 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full" />
                  <div>
                    <p className="font-medium text-sm">{post.authorName}</p>
                    <p className="text-xs text-gray-400">{post.createdAt?.toDate?.().toLocaleString() || "Just now"}</p>
                  </div>
                </div>
                <p className="text-sm mb-3">{post.text}</p>
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <button onClick={() => handleReaction(post.id, "love")} className="flex items-center gap-1">
                    <Heart size={16} className={post.lovedBy?.includes(user?.uid) ? "fill-red-500 text-red-500" : ""} />
                    {post.loves || 0}
                  </button>
                  <button onClick={() => handleReaction(post.id, "like")} className="flex items-center gap-1"><ThumbsUp size={16} />{post.likes || 0}</button>
                  <button onClick={() => handleReaction(post.id, "dislike")} className="flex items-center gap-1"><ThumbsDown size={16} />{post.dislikes || 0}</button>
                  <button onClick={() => handleReport(post.id)} className="flex items-center gap-1 ml-auto"><Flag size={16} /> Report</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "Hymns" && <HymnsPage />}
      {activeTab === "Videos" && <VideosPage />}
      {activeTab === "Events" && <div className="p-8 text-center text-gray-500">Events section ready for admin posts</div>}
      {activeTab === "Prayer" && <div className="p-8 text-center text-gray-500">Prayer Requests section ready</div>}
    </div>
  );
}