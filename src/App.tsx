import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import BasicTyping from "./pages/BasicTyping";
import SpeedChallenge from "./pages/SpeedChallenge";
import BalloonPop from "./pages/BalloonPop";
import SpaceShooter from "./pages/SpaceShooter";
import MemoryTyping from "./pages/MemoryTyping";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="basic" element={<BasicTyping />} />
          <Route path="speed" element={<SpeedChallenge />} />
          <Route path="balloon" element={<BalloonPop />} />
          <Route path="space" element={<SpaceShooter />} />
          <Route path="memory" element={<MemoryTyping />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
