import { Search } from "lucide-react";
import LoginButton from "../components/LoginButton";

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <header className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs">CCC</div>
          <div>
            <h1 className="font-bold text-lg text-primary">CCC Meiran Central Parish</h1>
            <p className="text-xs text-gray-500">Celestial Church of Christ</p>
          </div>
        </div>
        <LoginButton />
      </header>

      <div className="p-4 bg-blue-50 text-center">
        <p className="text-sm italic text-primary">“I was glad when they said unto me, Let us go into the house of the Lord.” — Psalm 122:1</p>
        <p className="mt-2 text-sm">Welcome to the house of God. The love and light of the glory of God is our watchword.</p>
        <p className="text-xs mt-1 text-gray-600">22 Along Ajasa Command Rd, off Abule Egba, Lagos State, Nigeria</p>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input type="text" placeholder="Search posts..." className="w-full pl-10 pr-4 py-2.5 border rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
        </div>
      </div>

      <div className="mx-4 mb-4 p-4 bg-white rounded-xl shadow-sm border">
        <p className="text-xs text-accent font-semibold">Highest Love (24h)</p>
        <p className="mt-1 text-sm">Featured post will appear here</p>
      </div>

      <div className="px-4 space-y-3 pb-6">
        <h2 className="font-semibold text-primary">News Feed</h2>
        <div className="p-4 bg-white rounded-xl shadow-sm border cursor-pointer">
          <p className="font-medium">Admin Announcement</p>
          <p className="text-sm text-gray-600 mt-1">Tap to read full message...</p>
        </div>
      </div>
    </div>
  );
}