import React from "react";
import { Search } from "lucide-react";
import LoginButton from "../components/LoginButton";

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="flex flex-col gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">CCC</div>
            <div className="min-w-0">
              <h1 className="text-base font-bold leading-snug text-primary">CCC Meiran Central Parish</h1>
              <p className="mt-0.5 text-xs text-gray-500">Celestial Church of Christ</p>
            </div>
          </div>
          <div className="flex justify-stretch sm:justify-end">
            <LoginButton />
          </div>
        </div>
      </header>

      <section className="bg-blue-50 px-5 py-6 text-center">
        <p className="text-sm italic leading-relaxed text-primary">“I was glad when they said unto me, Let us go into the house of the Lord.”</p>
        <p className="mt-3 text-xs font-medium tracking-wide text-primary">Psalm 122:1</p>
        <p className="mt-4 text-sm leading-relaxed text-gray-700">Welcome to the house of God. The love and light of the glory of God is our watchword.</p>
        <p className="mt-3 text-xs leading-relaxed text-gray-600">22 Along Ajasa Command Rd, off Abule Egba, Lagos State, Nigeria</p>
      </section>

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