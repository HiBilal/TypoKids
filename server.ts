import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory database for demo purposes
  const users = new Map();
  const scores = new Map();

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/users", (req, res) => {
    const { username } = req.body;
    if (!users.has(username)) {
      users.set(username, { username, coins: 0, level: 1, streak: 0 });
    }
    res.json(users.get(username));
  });

  app.post("/api/scores", (req, res) => {
    const { username, game, wpm, accuracy, score } = req.body;
    if (!scores.has(username)) {
      scores.set(username, []);
    }
    const userScores = scores.get(username);
    userScores.push({ game, wpm, accuracy, score, date: new Date() });
    
    // Update user coins
    if (users.has(username)) {
      const user = users.get(username);
      user.coins += Math.floor(score / 10);
      users.set(username, user);
    }

    res.json({ success: true });
  });

  app.get("/api/scores/:username", (req, res) => {
    const { username } = req.params;
    res.json(scores.get(username) || []);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
