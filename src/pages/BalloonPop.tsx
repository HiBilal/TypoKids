import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@/src/store/useStore";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "motion/react";
import { sounds } from "@/src/lib/sounds";

const WORDS = ["cat", "dog", "sun", "moon", "star", "fish", "bird", "tree", "book", "pen", "car", "bus", "train", "ship", "plane", "apple", "milk", "cake", "ball", "doll"];

interface Balloon {
  id: number;
  word: string;
  x: number;
  color: string;
  speed: number;
}

const COLORS = ["bg-rose-400", "bg-blue-400", "bg-emerald-400", "bg-amber-400", "bg-purple-400"];

export default function BalloonPop() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  const { username, addCoins } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const balloonIdRef = useRef(0);

  const scoreRef = useRef(0);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    let spawnTimer: NodeJS.Timeout;
    let moveTimer: NodeJS.Timeout;

    if (isPlaying) {
      spawnTimer = setInterval(() => {
        setBalloons(prev => {
          if (prev.length < 5) {
            const newBalloon: Balloon = {
              id: balloonIdRef.current++,
              word: WORDS[Math.floor(Math.random() * WORDS.length)],
              x: Math.random() * 80 + 10, // 10% to 90%
              color: COLORS[Math.floor(Math.random() * COLORS.length)],
              speed: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
            };
            return [...prev, newBalloon];
          }
          return prev;
        });
      }, 2000);

      moveTimer = setInterval(() => {
        setBalloons(prev => {
          const remaining = prev.filter(b => b.id > balloonIdRef.current - 10);
          if (remaining.length < prev.length) {
            setLives(l => {
              const newLives = l - (prev.length - remaining.length);
              if (newLives <= 0) endGame(scoreRef.current);
              return newLives;
            });
          }
          return remaining;
        });
      }, 5000);
    }

    return () => {
      clearInterval(spawnTimer);
      clearInterval(moveTimer);
    };
  }, [isPlaying]);

  const startGame = () => {
    sounds.playStart();
    setIsPlaying(true);
    setIsFinished(false);
    setScore(0);
    scoreRef.current = 0;
    setLives(3);
    setBalloons([]);
    setInput("");
    balloonIdRef.current = 0;
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const endGame = (finalScore: number) => {
    sounds.playEnd();
    setIsPlaying(false);
    setIsFinished(true);
    setBalloons([]);
    
    const earnedCoins = Math.floor(finalScore / 10);
    addCoins(earnedCoins);

    fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        game: 'Balloon Pop',
        wpm: 0,
        accuracy: 100,
        score: finalScore
      })
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    
    if (val.length > input.length) {
      sounds.playCorrect(); // Just a typing sound
    }

    setInput(val);

    // Check if input matches any balloon
    const matchedIndex = balloons.findIndex(b => b.word === val);
    if (matchedIndex !== -1) {
      // Pop balloon
      sounds.playReward();
      const balloon = balloons[matchedIndex];
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: balloon.x / 100, y: 0.5 },
        colors: [balloon.color.replace('bg-', '').replace('-400', '')] // rough color match
      });

      setBalloons(prev => prev.filter((_, i) => i !== matchedIndex));
      setScore(s => s + balloon.word.length * 10);
      setInput("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-800">Balloon Pop 🎈</h1>
        <div className="flex gap-4">
          <div className="text-2xl font-bold bg-rose-100 text-rose-600 px-4 py-2 rounded-xl border-2 border-rose-200">
            ❤️ {lives}
          </div>
          <div className="text-2xl font-bold bg-amber-100 text-amber-600 px-4 py-2 rounded-xl border-2 border-amber-200">
            Score: {score}
          </div>
        </div>
      </div>

      <Card className="relative overflow-hidden border-4 border-sky-200 bg-sky-50 shadow-[0_8px_0_0_rgba(186,230,253,1)] h-[500px] flex flex-col items-center justify-center">
        {!isPlaying && !isFinished ? (
          <div className="text-center space-y-6 z-10 bg-white/80 p-8 rounded-3xl backdrop-blur-sm border-4 border-white">
            <h2 className="text-2xl font-bold text-slate-600">Type the words to pop the balloons before they fly away!</h2>
            <Button size="lg" onClick={startGame} className="bg-rose-500 hover:bg-rose-600 shadow-[0_4px_0_0_rgba(225,29,72,1)] text-xl h-16 px-12">
              Start Game
            </Button>
          </div>
        ) : isPlaying ? (
          <>
            <AnimatePresence>
              {balloons.map(balloon => (
                <motion.div
                  key={balloon.id}
                  initial={{ y: 500, opacity: 0 }}
                  animate={{ y: -100, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 10 / balloon.speed, ease: "linear" }}
                  className={`absolute flex flex-col items-center justify-center w-24 h-32 rounded-[50%] ${balloon.color} shadow-lg border-4 border-white/50`}
                  style={{ left: `${balloon.x}%` }}
                >
                  <span className="text-white font-black text-lg drop-shadow-md z-10">{balloon.word}</span>
                  {/* Balloon string */}
                  <div className="absolute -bottom-8 w-1 h-10 bg-white/50"></div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="absolute bottom-8 w-full px-8 z-20">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleChange}
                className="w-full max-w-md mx-auto block text-2xl p-4 rounded-2xl border-4 border-slate-200 focus:border-sky-400 focus:outline-none text-center font-bold shadow-lg"
                placeholder="Type here..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                autoFocus
              />
            </div>
          </>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-6 z-10 bg-white/90 p-8 rounded-3xl backdrop-blur-sm border-4 border-white shadow-xl"
          >
            <h2 className="text-4xl font-black text-rose-500">Game Over! 💥</h2>
            <div className="flex justify-center gap-8 bg-rose-50 p-6 rounded-2xl border-2 border-rose-200">
              <div>
                <p className="text-slate-500 font-bold uppercase text-sm">Final Score</p>
                <p className="text-4xl font-black text-slate-800">{score}</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold uppercase text-sm">Coins Earned</p>
                <p className="text-4xl font-black text-amber-500">+{Math.floor(score / 10)}</p>
              </div>
            </div>
            <Button size="lg" onClick={startGame} className="bg-rose-500 hover:bg-rose-600 shadow-[0_4px_0_0_rgba(225,29,72,1)]">
              Play Again 🔄
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
