import { Outlet, Link } from "react-router";
import { useStore } from "@/src/store/useStore";
import { Keyboard, Trophy, User, Star, Volume2, VolumeX } from "lucide-react";

export default function Layout() {
  const { username, coins, level, streak, isMuted, toggleMute } = useStore();

  return (
    <div className="min-h-screen bg-sky-50 font-sans text-slate-800">
      <header className="bg-white border-b-4 border-sky-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black text-sky-500 hover:scale-105 transition-transform">
            <Keyboard className="w-8 h-8" />
            <span>TypoKids</span>
          </Link>

          {username && (
            <div className="flex items-center gap-4 sm:gap-6 font-bold">
              <button 
                onClick={toggleMute}
                className="p-2 text-slate-400 hover:text-sky-500 transition-colors rounded-full hover:bg-sky-50"
                title={isMuted ? "Unmute sounds" : "Mute sounds"}
              >
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              
              <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-3 py-1 rounded-full border-2 border-amber-200">
                <Star className="w-5 h-5 fill-current" />
                <span>{coins}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full border-2 border-emerald-200">
                <Trophy className="w-5 h-5" />
                <span>Lvl {level}</span>
              </div>
              <div className="hidden md:flex items-center gap-1 text-orange-500 bg-orange-50 px-3 py-1 rounded-full border-2 border-orange-200">
                <span>🔥 {streak} Day Streak</span>
              </div>
              <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-sky-500 transition-colors">
                <User className="w-6 h-6" />
                <span className="hidden sm:inline">{username}</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
