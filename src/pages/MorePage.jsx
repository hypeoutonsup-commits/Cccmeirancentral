import { Link } from "react-router-dom";

export default function MorePage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold text-primary mb-4">More</h1>
      <div className="space-y-2">
        <Link to="/daily" className="block bg-white p-4 rounded-xl shadow-sm border">Daily Commit</Link>
        <Link to="/profile" className="block bg-white p-4 rounded-xl shadow-sm border">Profile & Achievements</Link>
        <Link to="/contact" className="block bg-white p-4 rounded-xl shadow-sm border">Contact Us</Link>
        <Link to="/admin" className="block bg-white p-4 rounded-xl shadow-sm border">Admin Panel</Link>
      </div>
    </div>
  );
}