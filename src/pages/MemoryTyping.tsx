import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@/src/store/useStore";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { Brain } from "lucide-react";
import { sounds } from "@/src/lib/sounds";

const WORDS = ["puzzle", "memory", "brain", "smart", "think", "logic", "focus", "mind", "genius", "clever", "learn", "study", "recall", "vision", "dream", "idea", "solve", "quick", "bright", "sharp"];

type Phase = "idle" | "memorize" | "type" | "finished";

export default function MemoryTyping() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  
  const { username, addCoins } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === "memorize") {
      // Show word for less time as level increases
      const displayTime = Math.max(500, 2500 - (level * 150));
      timer = setTimeout(() => {
        setPhase("type");
      }, displayTime);
    } else if (phase === "type") {
      inputRef.current?.focus();
    }
    return () => clearTimeout(timer);
  }, [phase, level]);

  const startGame = () => {
    sounds.playStart();
    setScore(0);
    setLives(3);
    setLevel(1);
    nextRound();
  };

  const nextRound = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(randomWord);
    setInput("");
    setPhase("memorize");
  };

  const endGame = () => {
    sounds.playEnd();
    setPhase("finished");
    const earnedCoins = Math.floor(score / 10);
    addCoins(earnedCoins);

    fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        game: 'Memory Match',
        wpm: 0,
        accuracy: 100,
        score
      })
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phase !== "type") return;

    if (input.toLowerCase() === currentWord.toLowerCase()) {
      // Correct
      sounds.playReward();
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899']
      });
      setScore(s => s + currentWord.length * 20);
      setLevel(l => l + 1);
      nextRound();
    } else {
      // Incorrect
      sounds.playIncorrect();
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        endGame();
      } else {
        nextRound();
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-800">Memory Match 🧠</h1>
        <div className="flex gap-4">
          <div className="text-2xl font-bold bg-rose-100 text-rose-600 px-4 py-2 rounded-xl border-2 border-rose-200">
            ❤️ {lives}
          </div>
          <div className="text-2xl font-bold bg-fuchsia-100 text-fuchsia-600 px-4 py-2 rounded-xl border-2 border-fuchsia-200">
            Score: {score}
          </div>
        </div>
      </div>

      <Card className="p-8 border-4 border-fuchsia-200 bg-white shadow-[0_8px_0_0_rgba(245,208,254,1)] min-h-[400px] flex flex-col items-center justify-center text-center">
        {phase === "idle" ? (
          <div className="space-y-6">
            <Brain className="w-20 h-20 text-fuchsia-500 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-600">Memorize the word, then type it from memory!</h2>
            <Button size="lg" onClick={startGame} className="bg-fuchsia-500 hover:bg-fuchsia-600 shadow-[0_4px_0_0_rgba(217,70,239,1)] text-xl h-16 px-12">
              Start Game
            </Button>
          </div>
        ) : phase === "memorize" ? (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="space-y-4"
          >
            <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">Remember this word:</p>
            <h2 className="text-7xl font-black text-fuchsia-500 tracking-wider">{currentWord}</h2>
          </motion.div>
        ) : phase === "type" ? (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-8 w-full max-w-md"
          >
            <p className="text-2xl font-bold text-slate-600">What was the word?</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full text-4xl p-4 rounded-2xl border-4 border-slate-200 focus:border-fuchsia-400 focus:outline-none text-center font-black text-slate-800"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
              <Button type="submit" size="lg" className="bg-fuchsia-500 hover:bg-fuchsia-600 shadow-[0_4px_0_0_rgba(217,70,239,1)] text-xl h-14">
                Submit
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-black text-rose-500">Game Over! 🧠</h2>
            <p className="text-xl font-bold text-slate-500">The last word was: <span className="text-fuchsia-500">{currentWord}</span></p>
            <div className="flex justify-center gap-8 bg-fuchsia-50 p-6 rounded-2xl border-2 border-fuchsia-200">
              <div>
                <p className="text-slate-500 font-bold uppercase text-sm">Level Reached</p>
                <p className="text-4xl font-black text-slate-800">{level}</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold uppercase text-sm">Final Score</p>
                <p className="text-4xl font-black text-slate-800">{score}</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold uppercase text-sm">Coins Earned</p>
                <p className="text-4xl font-black text-amber-500">+{Math.floor(score / 10)}</p>
              </div>
            </div>
            <Button size="lg" onClick={startGame} className="bg-fuchsia-500 hover:bg-fuchsia-600 shadow-[0_4px_0_0_rgba(217,70,239,1)]">
              Play Again 🔄
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
