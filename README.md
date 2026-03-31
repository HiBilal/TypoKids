# ⌨️ TypoKids - Fun Typing Master for Kids

TypoKids is a colorful, interactive, and powerful full-stack web application designed to help children (ages 6–14) learn and master typing skills through engaging games, challenges, and a rewarding gamification system.

## 🎮 Demo
https://typokids.netlify.app/


![TypoKids Banner](https://picsum.photos/seed/typing/1200/400)

## 🎯 Goal

The primary goal of TypoKids is to improve typing speed (WPM) and accuracy in a fun, non-intimidating environment. By turning practice into play, kids stay motivated and excited to learn.

---

## 🎮 Game Modes

### 1. ⌨️ Basic Practice
Learn the fundamentals of typing step-by-step. Starting from the home row (asdf jkl;) and moving to full sentences. Includes an on-screen keyboard visualizer to guide finger placement.

### 2. 🚀 Speed Challenge
A high-energy, 60-second race! Type as many words as you can to climb the leaderboard and earn massive coin rewards.

### 3. 🎈 Balloon Pop
A playful arcade game where words float up in colorful balloons. Pop them by typing the word correctly before they fly away!

### 4. 🛸 Space Shooter
Defend the galaxy! Alien ships (words) are descending. Type the words to fire your laser and save the planet.

### 5. 🧠 Memory Match
A brain-teasing challenge. Memorize a word that flashes on the screen, then type it correctly from memory. The memorization time gets shorter as you level up!

---

## ✨ Key Features

- **🌈 Kid-Friendly UI:** Bright colors, large buttons, and smooth animations powered by Framer Motion.
- **🏆 Gamification:** Earn **Stars**, **Coins**, and **Badges**. Track your **Daily Streak** and level up from Beginner to Pro.
- **📊 Progress Dashboard:** Detailed statistics including Words Per Minute (WPM), Accuracy percentage, and a history of recent games.
- **🎵 Interactive Sound Effects:** Cheerful audio feedback for correct/incorrect typing, game starts, and rewards. Includes a mute toggle for quiet study time.
- **📱 Responsive Design:** Works great on desktops and tablets.
- **🔒 Simple Auth:** Easy-to-use profile system to save progress across sessions.

---

## 🛠️ Tech Stack

**Frontend:**
- **React 19** (Vite)
- **Tailwind CSS 4** (Styling)
- **Framer Motion** (Animations)
- **Zustand** (State Management)
- **Lucide React** (Icons)
- **Canvas Confetti** (Celebrations)

**Backend:**
- **Node.js & Express**
- **In-Memory Data Store** (Easily extensible to MongoDB/Firebase)
- **REST API** for scores and user profiles

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/typokids.git
   cd typokids
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Navigate to `http://localhost:3000`

---

## 📁 Project Structure

```text
├── src/
│   ├── components/     # Reusable UI components (Button, Card, Layout)
│   ├── lib/            # Utilities (cn helper, sound manager)
│   ├── pages/          # Game modes and dashboard views
│   ├── store/          # Zustand state management
│   ├── App.tsx         # Main routing and app structure
│   └── main.tsx        # Entry point
├── server.ts           # Express backend server
├── package.json        # Dependencies and scripts
└── README.md           # You are here!
```

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for new games or features:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ for the next generation of typists.
