import { create } from 'zustand';
import { sounds } from '@/src/lib/sounds';

interface UserState {
  username: string | null;
  coins: number;
  level: number;
  streak: number;
  isMuted: boolean;
  login: (username: string) => void;
  logout: () => void;
  addCoins: (amount: number) => void;
  levelUp: () => void;
  toggleMute: () => void;
}

export const useStore = create<UserState>((set) => ({
  username: null,
  coins: 0,
  level: 1,
  streak: 0,
  isMuted: false,
  login: async (username) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      set({ username: data.username, coins: data.coins, level: data.level, streak: data.streak });
    } catch (e) {
      console.error("Failed to login", e);
      set({ username });
    }
  },
  logout: () => set({ username: null, coins: 0, level: 1, streak: 0 }),
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  levelUp: () => set((state) => ({ level: state.level + 1 })),
  toggleMute: () => set((state) => {
    const newMuted = !state.isMuted;
    sounds.isMuted = newMuted;
    return { isMuted: newMuted };
  }),
}));
