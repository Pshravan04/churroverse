"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Deterministic pseudo-random based on seed + index (matches SSR ↔ client)
function detRandom(seed: number, i: number): number {
  const x = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function makeParticles(count: number) {
  const seed = 42;
  return Array.from({ length: count }, (_, i) => ({
    left: `${detRandom(seed, i * 3) * 100}%`,
    top: `${detRandom(seed, i * 3 + 1) * 100}%`,
    opacity: detRandom(seed, i * 3 + 2) * 0.7 + 0.2,
    duration: detRandom(seed, i * 3 + 3) * 2 + 1,
    delay: detRandom(seed, i * 3 + 4) * 3,
  }));
}

const particles = makeParticles(60);

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "portal" | "done">("loading");

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase("portal"), 200);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === "portal") {
      // Hold portal animation then dismiss
      const t = setTimeout(() => {
        setPhase("done");
        setTimeout(onComplete, 600);
      }, 1400);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  const messages = [
    "Fueling the Churro Engine...",
    "Navigating the Caramel Nebula...",
    "Charging Galactic Thrusters...",
    "Entering Orbit...",
  ];

  const msgIndex = Math.floor((progress / 100) * messages.length);
  const currentMessage = messages[Math.min(msgIndex, messages.length - 1)];

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020010] overflow-hidden"
        >
          {/* Deep-space particle background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 rounded-full bg-white"
                style={{ left: p.left, top: p.top, opacity: p.opacity }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
              />
            ))}
          </div>

          {/* Portal ring */}
          <AnimatePresence>
            {phase === "portal" && (
              <motion.div
                key="portal"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 15], opacity: [0, 1, 0] }}
                transition={{ duration: 1.3, ease: "easeIn" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-40 h-40 rounded-full border-4 border-orange-500 shadow-[0_0_80px_rgba(234,88,12,0.8),inset_0_0_40px_rgba(234,88,12,0.4)]" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content */}
          <AnimatePresence>
            {phase === "loading" && (
              <motion.div
                key="content"
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 flex flex-col items-center gap-10"
              >
                {/* Churro planet spinner */}
                <div className="relative w-40 h-40">
                  {/* Outer glow ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-orange-500/30"
                    style={{
                      boxShadow: "0 0 20px rgba(234,88,12,0.3)",
                    }}
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 rounded-full border border-yellow-500/20"
                  />
                  {/* Churro planet orb */}
                  <div className="absolute inset-6 rounded-full bg-gradient-to-br from-yellow-500 via-orange-600 to-red-700 shadow-[0_0_40px_rgba(234,88,12,0.6)] flex items-center justify-center">
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-4xl"
                    >
                      🌀
                    </motion.span>
                  </div>
                  {/* Orbiting particle */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(234,88,12,1)]" />
                  </motion.div>
                </div>

                {/* Branding */}
                <div className="text-center">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 uppercase mb-2"
                  >
                    CHURROVERSE
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-400 font-mono text-sm tracking-widest"
                  >
                    {currentMessage}
                  </motion.p>
                </div>

                {/* Progress bar */}
                <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-600 to-yellow-500 rounded-full shadow-[0_0_8px_rgba(234,88,12,0.8)]"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-orange-500 font-mono text-xs tabular-nums">
                  {Math.min(Math.floor(progress), 100)}%
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
