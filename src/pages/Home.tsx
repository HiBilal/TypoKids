import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useStore } from "@/src/store/useStore";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Keyboard, Rocket, Target, Brain, Medal } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  const { username, login } = useStore();
  const [nameInput, setNameInput] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      login(nameInput.trim());
    }
  };

  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full"
        >
          <Card className="p-8 border-4 border-sky-300 shadow-[0_8px_0_0_rgba(125,211,252,1)] text-center">
            <div className="bg-sky-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Keyboard className="w-12 h-12 text-sky-500" />
            </div>
            <h1 className="text-4xl font-black text-slate-800 mb-2">Welcome to TypoKids!</h1>
            <p className="text-slate-500 font-medium mb-8">The fun way to learn typing!</p>
            
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="What's your name?"
                className="text-xl p-4 rounded-xl border-4 border-slate-200 focus:border-sky-400 focus:outline-none font-bold text-center"
                required
              />
              <Button size="lg" className="w-full text-xl h-16 bg-emerald-500 hover:bg-emerald-600 shadow-[0_6px_0_0_rgba(5,150,105,1)] hover:shadow-[0_2px_0_0_rgba(5,150,105,1)] hover:translate-y-[4px]">
                Let's Play! 🚀
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    );
  }

  const games = [
    {
      title: "Basic Practice",
      desc: "Learn the keys step by step",
      icon: <Keyboard className="w-10 h-10 text-blue-500" />,
      color: "bg-blue-100 border-blue-300",
      path: "/basic",
    },
    {
      title: "Speed Challenge",
      desc: "Type as fast as you can!",
      icon: <Rocket className="w-10 h-10 text-orange-500" />,
      color: "bg-orange-100 border-orange-300",
      path: "/speed",
    },
    {
      title: "Balloon Pop",
      desc: "Pop balloons by typing words",
      icon: <Target className="w-10 h-10 text-rose-500" />,
      color: "bg-rose-100 border-rose-300",
      path: "/balloon",
    },
    {
      title: "Space Shooter",
      desc: "Type to shoot alien ships!",
      icon: <Rocket className="w-10 h-10 text-indigo-500" />,
      color: "bg-indigo-100 border-indigo-300",
      path: "/space",
    },
    {
      title: "Memory Match",
      desc: "Remember the word and type it",
      icon: <Brain className="w-10 h-10 text-fuchsia-500" />,
      color: "bg-fuchsia-100 border-fuchsia-300",
      path: "/memory",
    },
    {
      title: "Dashboard",
      desc: "See your progress and rewards",
      icon: <Medal className="w-10 h-10 text-amber-500" />,
      color: "bg-amber-100 border-amber-300",
      path: "/dashboard",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-slate-800">Hi, {username}! 👋</h1>
        <p className="text-xl text-slate-600 font-medium">What do you want to play today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game, i) => (
          <motion.div
            key={game.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card 
              className={`p-6 border-4 cursor-pointer hover:scale-105 transition-transform ${game.color} shadow-[0_6px_0_0_rgba(0,0,0,0.1)]`}
              onClick={() => navigate(game.path)}
            >
              <div className="flex items-center gap-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  {game.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{game.title}</h2>
                  <p className="text-slate-600 font-medium">{game.desc}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
