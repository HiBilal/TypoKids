import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@/src/store/useStore";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { sounds } from "@/src/lib/sounds";

const LEVELS = [
  { text: "asdf jkl;", name: "Home Row Basics" },
  { text: "the quick brown fox", name: "Short Words" },
  { text: "jumps over the lazy dog", name: "More Words" },
  { text: "practice makes perfect", name: "Sentences" },
];

export default function BasicTyping() {
  const [levelIdx, setLevelIdx] = useState(0);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  
  const { username, addCoins } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const targetText = LEVELS[levelIdx].text;

  useEffect(() => {
    if (inputRef.current && !isFinished) {
      inputRef.current.focus();
    }
  }, [isFinished, levelIdx]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!startTime) setStartTime(Date.now());
    
    // Check if new character is correct
    if (val.length > input.length) {
      if (targetText.startsWith(val)) {
        sounds.playCorrect();
      } else {
        sounds.playIncorrect();
      }
    }

    setInput(val);

    if (val === targetText) {
      finishLevel(val);
    }
  };

  const finishLevel = (finalInput: string) => {
    setIsFinished(true);
    const timeTaken = (Date.now() - (startTime || Date.now())) / 1000 / 60; // in minutes
    const words = targetText.length / 5;
    const calculatedWpm = Math.round(words / timeTaken) || 0;
    
    let correctChars = 0;
    for (let i = 0; i < targetText.length; i++) {
      if (finalInput[i] === targetText[i]) correctChars++;
    }
    const calculatedAccuracy = Math.round((correctChars / targetText.length) * 100);

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);

    // Play sound & confetti
    sounds.playReward();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const score = calculatedWpm * calculatedAccuracy;
    
    // Save score
    fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        game: 'Basic Practice',
        wpm: calculatedWpm,
        accuracy: calculatedAccuracy,
        score
      })
    });

    addCoins(10);
  };

  const nextLevel = () => {
    if (levelIdx < LEVELS.length - 1) {
      setLevelIdx(l => l + 1);
      reset();
    }
  };

  const reset = () => {
    setInput("");
    setStartTime(null);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(0);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-800">Level {levelIdx + 1}: {LEVELS[levelIdx].name}</h1>
        <Button variant="outline" onClick={reset}>Restart</Button>
      </div>

      <Card className="p-8 border-4 border-blue-200 bg-white shadow-[0_8px_0_0_rgba(191,219,254,1)]">
        <div className="text-4xl font-mono tracking-widest leading-relaxed mb-8 select-none">
          {targetText.split("").map((char, i) => {
            let color = "text-slate-300";
            if (i < input.length) {
              color = input[i] === char ? "text-emerald-500 bg-emerald-100 rounded" : "text-rose-500 bg-rose-100 rounded";
            } else if (i === input.length) {
              color = "text-slate-800 border-b-4 border-blue-500 animate-pulse";
            }
            return (
              <span key={i} className={color}>
                {char}
              </span>
            );
          })}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          disabled={isFinished}
          className="opacity-0 absolute -z-10"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        {isFinished && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-blue-50 rounded-2xl p-6 text-center border-2 border-blue-200"
          >
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Great Job! 🎉</h2>
            <div className="flex justify-center gap-8 mb-6">
              <div>
                <p className="text-slate-500 font-bold uppercase text-sm">Speed</p>
                <p className="text-3xl font-black text-slate-800">{wpm} <span className="text-lg">WPM</span></p>
              </div>
              <div>
                <p className="text-slate-500 font-bold uppercase text-sm">Accuracy</p>
                <p className="text-3xl font-black text-slate-800">{accuracy}%</p>
              </div>
              <div>
                <p className="text-slate-500 font-bold uppercase text-sm">Reward</p>
                <p className="text-3xl font-black text-amber-500">+10 ⭐️</p>
              </div>
            </div>
            
            {levelIdx < LEVELS.length - 1 ? (
              <Button size="lg" onClick={nextLevel} className="bg-blue-500 hover:bg-blue-600 shadow-[0_4px_0_0_rgba(37,99,235,1)]">
                Next Level ➡️
              </Button>
            ) : (
              <Button size="lg" onClick={() => { setLevelIdx(0); reset(); }} className="bg-emerald-500 hover:bg-emerald-600 shadow-[0_4px_0_0_rgba(5,150,105,1)]">
                Play Again 🔄
              </Button>
            )}
          </motion.div>
        )}
      </Card>

      {/* Simple Keyboard Visualizer */}
      <Card className="p-6 border-4 border-slate-200 bg-slate-50">
        <div className="flex flex-col gap-2 items-center">
          {["qwertyuiop", "asdfghjkl", "zxcvbnm"].map((row, i) => (
            <div key={i} className={`flex gap-2 ${i === 1 ? 'ml-4' : i === 2 ? 'ml-12' : ''}`}>
              {row.split("").map(key => {
                const isNextKey = !isFinished && targetText[input.length]?.toLowerCase() === key;
                return (
                  <div 
                    key={key} 
                    className={`w-12 h-12 rounded-xl border-b-4 flex items-center justify-center font-bold text-lg uppercase transition-colors
                      ${isNextKey ? 'bg-blue-500 text-white border-blue-700 scale-110 shadow-lg' : 'bg-white text-slate-600 border-slate-300'}`}
                  >
                    {key}
                  </div>
                )
              })}
            </div>
          ))}
          <div className={`w-64 h-12 mt-2 rounded-xl border-b-4 flex items-center justify-center font-bold text-lg uppercase transition-colors
            ${!isFinished && targetText[input.length] === ' ' ? 'bg-blue-500 text-white border-blue-700 scale-105 shadow-lg' : 'bg-white text-slate-600 border-slate-300'}`}>
            SPACE
          </div>
        </div>
      </Card>
    </div>
  );
}
