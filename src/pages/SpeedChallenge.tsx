import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@/src/store/useStore";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { sounds } from "@/src/lib/sounds";

const WORDS = ["apple", "banana", "orange", "grape", "melon", "strawberry", "kiwi", "mango", "peach", "pear", "cherry", "plum", "lemon", "lime", "coconut", "pineapple", "papaya", "watermelon", "blueberry", "raspberry"];

export default function SpeedChallenge() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  
  const { username, addCoins } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    sounds.playStart();
    setIsPlaying(true);
    setIsFinished(false);
    setTimeLeft(60);
    setScore(0);
    setCorrectWords(0);
    setInput("");
    nextWord();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const endGame = () => {
    sounds.playEnd();
    setIsPlaying(false);
    setIsFinished(true);
    
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 }
    });

    const wpm = correctWords; // Since it's 60 seconds
    const earnedCoins = Math.floor(score / 10);
    addCoins(earnedCoins);

    fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        game: 'Speed Challenge',
        wpm,
        accuracy: 100, // Simplified for this mode
        score
      })
    });
  };

  const nextWord = () => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(randomWord);
    setInput("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (val.length > input.length) {
      if (currentWord.startsWith(val)) {
        sounds.playCorrect();
      } else {
        sounds.playIncorrect();
      }
    }

    setInput(val);

    if (val === currentWord) {
      sounds.playReward();
      setScore(s => s + currentWord.length * 10);
      setCorrectWords(c => c + 1);
      nextWord();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-800">Speed Challenge 🚀</h1>
        <div className="text-2xl font-bold bg-orange-100 text-orange-600 px-4 py-2 rounded-xl border-2 border-orange-200">
          ⏱ {timeLeft}s
        </div>
      </div>

      <Card className="p-8 border-4 border-orange-200 bg-white shadow-[0_8px_0_0_rgba(253,186,116,1)] text-center min-h-[300px] flex flex-col items-center justify-center">
        {!isPlaying && !isFinished ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-600">Type as many words as you can in 60 seconds!</h2>
            <Button size="lg" onClick={startGame} className="bg-orange-500 hover:bg-orange-600 shadow-[0_4px_0_0_rgba(249,115,22,1)] text-xl h-16 px-12">
              Start Game
            </Button>
          </div>
        ) : isPlaying ? (
          <div className="space-y-8 w-full">
            <div className="text-6xl font-black text-slate-800 tracking-wider">
              {currentWord.split("").map((char, i) => (
                <span key={i} className={i < input.length ? (input[i] === char ? "text-emerald-500" : "text-rose-500") : "text-slate-800"}>
                  {char}
                </span>
              ))}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleChange}
              className="w-full max-w-md text-3xl p-4 rounded-2xl border-4 border-slate-200 focus:border-orange-400 focus:outline-none text-center font-bold"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              autoFocus
            />
            <div className="text-2xl font-bold text-slate-500">
              Score: <span className="text-orange-500">{score}</span>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-black text-orange-500">Time's Up! ⏰</h2>
            <div className="flex justify-center gap-8 bg-orange-50 p-6 rounded-2xl border-2 border-orange-200">
              <div>
                <p className="text-slate-500 font-bold uppercase text-sm">Words</p>
                <p className="text-4xl font-black text-slate-800">{correctWords}</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold uppercase text-sm">Score</p>
                <p className="text-4xl font-black text-slate-800">{score}</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold uppercase text-sm">Coins Earned</p>
                <p className="text-4xl font-black text-amber-500">+{Math.floor(score / 10)}</p>
              </div>
            </div>
            <Button size="lg" onClick={startGame} className="bg-orange-500 hover:bg-orange-600 shadow-[0_4px_0_0_rgba(249,115,22,1)]">
              Play Again 🔄
            </Button>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
