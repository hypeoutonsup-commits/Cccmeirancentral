import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const DAILY_VERSE = {
  reference: "Psalm 122:1",
  text: "I was glad when they said unto me, Let us go into the house of the Lord."
};

export default function DailyCommitPage() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [showBible, setShowBible] = useState(false);
  const [bibleBook, setBibleBook] = useState("Genesis");
  const [bibleChapter, setBibleChapter] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem("dailyStreak") || "0";
    setStreak(parseInt(saved));
  }, []);

  const markRead = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem("dailyStreak", newStreak.toString());
    alert("Daily Commit completed! Streak: " + newStreak);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold text-primary mb-4">Daily Commit</h1>

      {!showBible ? (
        <>
          <div className="bg-white rounded-xl p-5 shadow-sm border mb-4">
            <p className="text-xs text-accent font-semibold">Today’s Reference</p>
            <p className="font-medium mt-1">{DAILY_VERSE.reference}</p>
            <p className="mt-2 text-sm italic">“{DAILY_VERSE.text}”</p>
            <p className="text-xs text-gray-500 mt-3">Short explanation: This verse expresses joy in gathering to worship God.</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-4 text-center">
            <p className="text-sm">Current Streak</p>
            <p className="text-3xl font-bold text-primary">{streak} days</p>
          </div>

          <button onClick={markRead} className="w-full bg-primary text-white py-3 rounded-full mb-3">Mark as Read Today</button>
          <button onClick={() => setShowBible(true)} className="w-full border border-primary text-primary py-3 rounded-full">Open Full Bible</button>
        </>
      ) : (
        <BibleReader book={bibleBook} chapter={bibleChapter} onBack={() => setShowBible(false)} onChange={(b, c) => { setBibleBook(b); setBibleChapter(c); }} />
      )}
    </div>
  );
}

function BibleReader({ book, chapter, onBack, onChange }) {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://bible-api.com/${book}+${chapter}`)
      .then(res => res.json())
      .then(data => {
        setVerses(data.verses || []);
        setLoading(false);
      })
      .catch(() => {
        setVerses([{ verse: 1, text: "Unable to load. Please try again." }]);
        setLoading(false);
      });
  }, [book, chapter]);

  const books = ["Genesis", "Exodus", "Psalms", "Matthew", "John", "Romans", "Revelation"];

  return (
    <div>
      <button onClick={onBack} className="text-primary text-sm mb-3">← Back to Daily Commit</button>
      <div className="flex gap-2 mb-4">
        <select value={book} onChange={(e) => onChange(e.target.value, 1)} className="border rounded px-2 py-1 text-sm">
          {books.map(b => <option key={b}>{b}</option>)}
        </select>
        <input type="number" min="1" value={chapter} onChange={(e) => onChange(book, parseInt(e.target.value) || 1)} className="border rounded px-2 py-1 w-20 text-sm" />
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border max-h-[60vh] overflow-y-auto">
        <h2 className="font-bold mb-3">{book} {chapter}</h2>
        {loading ? <p className="text-gray-500">Loading...</p> : verses.map(v => (
          <p key={v.verse} className="mb-2 text-sm"><sup className="text-accent font-medium">{v.verse}</sup> {v.text}</p>
        ))}
      </div>
    </div>
  );
}