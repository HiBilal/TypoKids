import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@/src/store/useStore";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "motion/react";
import { Rocket } from "lucide-react";
import { sounds } from "@/src/lib/sounds";

const WORDS = ["alien", "planet", "star", "comet", "meteor", "galaxy", "orbit", "moon", "earth", "mars", "venus", "pluto", "space", "ship", "laser", "nebula", "cosmos", "apollo", "rocket", "ufo"];

interface Enemy {
  id: number;
  word: string;
  x: number;
  speed: number;
}

export default function SpaceShooter() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  const { username, addCoins } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const enemyIdRef = useRef(0);
  const scoreRef = useRef(0);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    let spawnTimer: NodeJS.Timeout;
    let moveTimer: NodeJS.Timeout;

    if (isPlaying) {
      spawnTimer = setInterval(() => {
        setEnemies(prev => {
          if (prev.length < 4) {
            const newEnemy: Enemy = {
              id: enemyIdRef.current++,
              word: WORDS[Math.floor(Math.random() * WORDS.length)],
              x: Math.random() * 80 + 10, // 10% to 90%
              speed: Math.random() * 0.5 + 0.8, // 0.8 to 1.3
            };
            return [...prev, newEnemy];
          }
          return prev;
        });
      }, 2500);

      moveTimer = setInterval(() => {
        setEnemies(prev => {
          const remaining = prev.filter(e => e.id > enemyIdRef.current - 8); // Enemies live for ~15-20s max
          if (remaining.length < prev.length) {
            setLives(l => {
              const newLives = l - (prev.length - remaining.length);
              if (newLives <= 0) endGame(scoreRef.current);
              return newLives;
            });
          }
          return remaining;
        });
      }, 6000);
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
    setEnemies([]);
    setInput("");
    enemyIdRef.current = 0;
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const endGame = (finalScore: number) => {
    sounds.playEnd();
    setIsPlaying(false);
    setIsFinished(true);
    setEnemies([]);
    
    const earnedCoins = Math.floor(finalScore / 10);
    addCoins(earnedCoins);

    fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        game: 'Space Shooter',
        wpm: 0,
        accuracy: 100,
        score: finalScore
      })
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    
    if (val.length > input.length) {
      sounds.playCorrect(); // Laser typing sound
    }

    setInput(val);

    const matchedIndex = enemies.findIndex(enemy => enemy.word === val);
    if (matchedIndex !== -1) {
      sounds.playReward(); // Explosion sound
      const enemy = enemies[matchedIndex];
      
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { x: enemy.x / 100, y: 0.3 },
        colors: ['#a855f7', '#3b82f6', '#ec4899']
      });

      setEnemies(prev => prev.filter((_, i) => i !== matchedIndex));
      setScore(s => s + enemy.word.length * 15);
      setInput("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-800">Space Shooter 🚀</h1>
        <div className="flex gap-4">
          <div className="text-2xl font-bold bg-indigo-100 text-indigo-600 px-4 py-2 rounded-xl border-2 border-indigo-200">
            🛡️ {lives}
          </div>
          <div className="text-2xl font-bold bg-fuchsia-100 text-fuchsia-600 px-4 py-2 rounded-xl border-2 border-fuchsia-200">
            Score: {score}
          </div>
        </div>
      </div>

      <Card className="relative overflow-hidden border-4 border-indigo-900 bg-slate-900 shadow-[0_8px_0_0_rgba(49,46,129,1)] h-[600px] flex flex-col items-center justify-center">
        {/* Starry background effect */}
        <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        {!isPlaying && !isFinished ? (
          <div className="text-center space-y-6 z-10 bg-slate-800/90 p-8 rounded-3xl backdrop-blur-sm border-4 border-indigo-500">
            <h2 className="text-2xl font-bold text-indigo-100">Type the words to shoot down the alien ships!</h2>
            <Button size="lg" onClick={startGame} className="bg-indigo-500 hover:bg-indigo-600 shadow-[0_4px_0_0_rgba(79,70,229,1)] text-xl h-16 px-12 text-white">
              Start Mission
            </Button>
          </div>
        ) : isPlaying ? (
          <>
            <AnimatePresence>
              {enemies.map(enemy => (
                <motion.div
                  key={enemy.id}
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 600, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 12 / enemy.speed, ease: "linear" }}
                  className="absolute flex flex-col items-center justify-center"
                  style={{ left: `${enemy.x}%` }}
                >
                  <div className="bg-fuchsia-500 w-16 h-16 rounded-full flex items-center justify-center border-4 border-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.8)] mb-2">
                    <span className="text-2xl">👾</span>
                  </div>
                  <span className="bg-slate-800 text-white font-black text-lg px-3 py-1 rounded-lg border-2 border-indigo-400 shadow-lg z-10">
                    {enemy.word}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="absolute bottom-6 w-full px-8 z-20 flex flex-col items-center">
              <Rocket className="w-16 h-16 text-indigo-400 mb-4 drop-shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleChange}
                className="w-full max-w-md mx-auto block text-2xl p-4 rounded-2xl border-4 border-indigo-400 bg-slate-800 text-white focus:border-fuchsia-400 focus:outline-none text-center font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                placeholder="Aim here..."
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
            className="text-center space-y-6 z-10 bg-slate-800/90 p-8 rounded-3xl backdrop-blur-sm border-4 border-indigo-500 shadow-xl"
          >
            <h2 className="text-4xl font-black text-fuchsia-400">Mission Failed! 💥</h2>
            <div className="flex justify-center gap-8 bg-slate-900 p-6 rounded-2xl border-2 border-indigo-500/50">
              <div>
                <p className="text-indigo-300 font-bold uppercase text-sm">Final Score</p>
                <p className="text-4xl font-black text-white">{score}</p>
              </div>
              <div>
                <p className="text-indigo-300 font-bold uppercase text-sm">Coins Earned</p>
                <p className="text-4xl font-black text-amber-400">+{Math.floor(score / 10)}</p>
              </div>
            </div>
            <Button size="lg" onClick={startGame} className="bg-indigo-500 hover:bg-indigo-600 shadow-[0_4px_0_0_rgba(79,70,229,1)] text-white">
              Try Again 🔄
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
