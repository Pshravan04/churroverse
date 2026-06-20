"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimate } from "framer-motion";
import dynamic from "next/dynamic";
import { LoaderPhase } from "@/components/3d/ChurroLoader";

const LoadingCanvas = dynamic(() => import("@/components/3d/LoadingCanvas"), { ssr: false });

/* ─── deterministic particles (no hydration mismatch) ─────────── */
function det(seed: number, i: number) {
  const x = Math.sin(seed * 127.1 + i * 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

const STARS = Array.from({ length: 80 }, (_, i) => ({
  left: `${(det(1, i * 3) * 100).toFixed(2)}%`,
  top: `${(det(2, i * 3 + 1) * 100).toFixed(2)}%`,
  size: (det(3, i * 3 + 2) * 2 + 0.5).toFixed(2),
  dur: (det(4, i * 3 + 3) * 2.5 + 1).toFixed(2),
  delay: (det(5, i * 3 + 4) * 3).toFixed(2),
}));

const MESSAGES = [
  "Fueling the Churro Engine…",
  "Navigating the Caramel Nebula…",
  "Charging Galactic Thrusters…",
  "Entering Orbit…",
  "Launching Churroverse…",
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<LoaderPhase>("descend");
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [scope, animate] = useAnimate();

  /* progress ticker */
  useEffect(() => {
    const iv = setInterval(() => {
      setProgress(p => {
        // Slow down near 100 to let the cinematic play out
        const next = Math.min(p + (p > 80 ? 0.5 : Math.random() * 4 + 1), 100);
        setMsgIdx(Math.min(Math.floor((next / 100) * MESSAGES.length), MESSAGES.length - 1));
        if (next >= 100) clearInterval(iv);
        return next;
      });
    }, 90);
    return () => clearInterval(iv);
  }, []);

  const handlePhaseChange = (newPhase: LoaderPhase) => {
    setPhase(newPhase);
    if (newPhase === 'done') {
      onComplete();
    }
  };

  const isDone = phase === "done";

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="loader"
          ref={scope}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "radial-gradient(ellipse at 50% 30%, #0d0520 0%, #020010 60%)" }}
        >
          {/* ── Stars ─────────────────────────────────────── */}
          <div className="absolute inset-0 pointer-events-none">
            {STARS.map((s, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{ left: s.left, top: s.top, width: `${s.size}px`, height: `${s.size}px` }}
                animate={{ opacity: [0.15, 0.9, 0.15], scale: [1, 1.4, 1] }}
                transition={{ duration: Number(s.dur), repeat: Infinity, delay: Number(s.delay) }}
              />
            ))}
          </div>

          {/* ── Ambient glow rings ─────────────────────────── */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-[500px] h-[500px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(234,88,12,0.25) 0%, transparent 70%)" }}
            />
          </div>

          {/* ── Churro Wrapper ───────────────────────────── */}
          <div className="relative flex items-center justify-center" style={{ width: "100vw", height: "100vh" }}>
            
            {/* ── 3D Churro Canvas ───────────────────────────── */}
            <div className="absolute inset-0 z-10" style={{ filter: "drop-shadow(0 10px 30px rgba(234,88,12,0.3))" }}>
              <LoadingCanvas
                progress={progress}
                onPhaseChange={handlePhaseChange}
              />
            </div>

            {/* ── Floating sparkle dots ──────────────────── */}
            {(phase === "macro" || phase === "tremor") && [0, 1, 2, 3].map(i => (
              <motion.div
                key={`spark-${i}`}
                className="absolute rounded-full pointer-events-none z-20"
                style={{
                  width: 5, height: 5,
                  background: i % 2 === 0 ? "#fbbf24" : "#f97316",
                  left: `${25 + i * 18}%`, top: `${20 + (i % 2) * 60}%`,
                  boxShadow: "0 0 8px 2px rgba(251,191,36,0.7)",
                }}
                animate={{ y: [-8, 8, -8], opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.6 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
          </div>

          {/* ── Brand + progress ──────────────────────────── */}
          <AnimatePresence>
            {(phase === "descend" || phase === "macro" || phase === "tremor") && (
              <motion.div
                key="brand"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute bottom-10 z-10 flex flex-col items-center gap-5 pointer-events-none"
              >
                {/* Logo */}
                <div className="text-center">
                  <motion.h1
                    className="text-5xl md:text-6xl font-black tracking-tighter uppercase"
                    style={{
                      background: "linear-gradient(135deg, #fde68a, #f97316, #dc2626)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 20px rgba(234,88,12,0.6))",
                    }}
                  >
                    CHURROVERSE
                  </motion.h1>
                  <motion.p
                    key={msgIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-gray-400 font-mono text-xs tracking-widest mt-2"
                  >
                    {MESSAGES[msgIdx]}
                  </motion.p>
                </div>

                {/* Progress bar */}
                <div className="w-56 space-y-1.5">
                  <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(progress, 100)}%`,
                        background: "linear-gradient(90deg, #ea580c, #fbbf24)",
                        boxShadow: "0 0 10px rgba(234,88,12,0.8)",
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-500 font-mono text-[10px]">
                      {Math.min(Math.floor(progress), 100)}%
                    </span>
                    <span className="text-gray-600 font-mono text-[10px] tracking-widest uppercase">
                      Loading
                    </span>
                  </div>
                </div>

                {/* Animated dots */}
                <div className="flex gap-2">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-orange-500"
                      animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Full-screen flash on shatter ──────────────── */}
          <AnimatePresence>
            {phase === "snap" && (
              <motion.div
                key="flash"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 pointer-events-none z-[50]"
                style={{ background: "radial-gradient(circle, rgba(251,191,36,0.6) 0%, transparent 70%)" }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
