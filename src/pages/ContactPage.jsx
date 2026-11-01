import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ContactPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Message to admin:", message, "from", user?.email || "guest");
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold text-primary mb-4">Contact Us</h1>
      <p className="text-sm text-gray-600 mb-4">Send a message to the church. Replies will appear in your Profile.</p>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message..." className="w-full border rounded-lg p-3 text-sm h-32 mb-3" />
      <button onClick={handleSend} className="bg-primary text-white px-6 py-2 rounded-full text-sm">Send Message</button>
      {sent && <p className="text-green-600 text-sm mt-2">Message sent successfully!</p>}
      <p className="text-xs text-gray-400 mt-4">Messages are sent to istobasam23@gmail.com</p>
    </div>
  );
}