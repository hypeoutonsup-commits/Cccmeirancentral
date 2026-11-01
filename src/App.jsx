import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { Home, Users, Trophy, Heart, MoreHorizontal } from "lucide-react";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import CommunityPage from "./pages/CommunityPage";
import GamePage from "./pages/GamePage";
import DonatePage from "./pages/DonatePage";
import MorePage from "./pages/MorePage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import DailyCommitPage from "./pages/DailyCommitPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/more" element={<MorePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/daily" element={<DailyCommitPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>

          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-50">
            <NavLink to="/" className={({isActive}) => `flex flex-col items-center text-xs px-2 ${isActive ? "text-primary font-medium" : "text-gray-500"}`}>
              <Home size={22} /> Home
            </NavLink>
            <NavLink to="/community" className={({isActive}) => `flex flex-col items-center text-xs px-2 ${isActive ? "text-primary font-medium" : "text-gray-500"}`}>
              <Users size={22} /> Community
            </NavLink>
            <NavLink to="/game" className={({isActive}) => `flex flex-col items-center text-xs px-2 ${isActive ? "text-primary font-medium" : "text-gray-500"}`}>
              <Trophy size={22} /> Game
            </NavLink>
            <NavLink to="/donate" className={({isActive}) => `flex flex-col items-center text-xs px-2 ${isActive ? "text-primary font-medium" : "text-gray-500"}`}>
              <Heart size={22} /> Donate
            </NavLink>
            <NavLink to="/more" className={({isActive}) => `flex flex-col items-center text-xs px-2 ${isActive ? "text-primary font-medium" : "text-gray-500"}`}>
              <MoreHorizontal size={22} /> More
            </NavLink>
          </nav>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;