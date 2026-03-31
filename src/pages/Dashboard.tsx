import { useState, useEffect } from "react";
import { useStore } from "@/src/store/useStore";
import { Card } from "@/src/components/ui/Card";
import { Trophy, Star, Target, Zap } from "lucide-react";

interface Score {
  game: string;
  wpm: number;
  accuracy: number;
  score: number;
  date: string;
}

export default function Dashboard() {
  const { username, coins, level, streak } = useStore();
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    if (username) {
      fetch(`/api/scores/${username}`)
        .then(res => res.json())
        .then(data => setScores(data.reverse())); // newest first
    }
  }, [username]);

  const bestWpm = Math.max(0, ...scores.map(s => s.wpm));
  const avgAccuracy = scores.length > 0 
    ? Math.round(scores.reduce((acc, s) => acc + s.accuracy, 0) / scores.length) 
    : 0;
  const totalScore = scores.reduce((acc, s) => acc + s.score, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-black text-slate-800">Your Dashboard 🏆</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border-4 border-amber-200 bg-amber-50 flex flex-col items-center justify-center text-center">
          <Star className="w-10 h-10 text-amber-500 mb-2 fill-current" />
          <p className="text-slate-500 font-bold uppercase text-sm">Total Coins</p>
          <p className="text-3xl font-black text-slate-800">{coins}</p>
        </Card>
        <Card className="p-6 border-4 border-emerald-200 bg-emerald-50 flex flex-col items-center justify-center text-center">
          <Zap className="w-10 h-10 text-emerald-500 mb-2" />
          <p className="text-slate-500 font-bold uppercase text-sm">Best WPM</p>
          <p className="text-3xl font-black text-slate-800">{bestWpm}</p>
        </Card>
        <Card className="p-6 border-4 border-blue-200 bg-blue-50 flex flex-col items-center justify-center text-center">
          <Target className="w-10 h-10 text-blue-500 mb-2" />
          <p className="text-slate-500 font-bold uppercase text-sm">Avg Accuracy</p>
          <p className="text-3xl font-black text-slate-800">{avgAccuracy}%</p>
        </Card>
        <Card className="p-6 border-4 border-purple-200 bg-purple-50 flex flex-col items-center justify-center text-center">
          <Trophy className="w-10 h-10 text-purple-500 mb-2" />
          <p className="text-slate-500 font-bold uppercase text-sm">Total Score</p>
          <p className="text-3xl font-black text-slate-800">{totalScore}</p>
        </Card>
      </div>

      <Card className="p-6 border-4 border-slate-200 bg-white">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Games</h2>
        
        {scores.length === 0 ? (
          <p className="text-slate-500 text-center py-8 font-medium">No games played yet. Go play some games! 🎮</p>
        ) : (
          <div className="space-y-4">
            {scores.slice(0, 10).map((score, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border-2 border-slate-100">
                <div>
                  <p className="font-bold text-slate-800 text-lg">{score.game}</p>
                  <p className="text-sm text-slate-500">{new Date(score.date).toLocaleDateString()} at {new Date(score.date).toLocaleTimeString()}</p>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">WPM</p>
                    <p className="font-black text-slate-700">{score.wpm}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Accuracy</p>
                    <p className="font-black text-slate-700">{score.accuracy}%</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Score</p>
                    <p className="font-black text-sky-500">{score.score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
