"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimate } from "framer-motion";
import dynamic from "next/dynamic";

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

const CRUMBS = Array.from({ length: 28 }, (_, i) => ({
  angle: (det(6, i * 2) * 360).toFixed(1),
  dist: (det(7, i * 2 + 1) * 220 + 80).toFixed(1),
  size: (det(8, i * 2) * 10 + 4).toFixed(1),
  dur: (det(9, i * 2 + 1) * 0.6 + 0.5).toFixed(2),
  color: i % 4 === 0 ? "#f97316" : i % 4 === 1 ? "#fbbf24" : i % 4 === 2 ? "#c8803a" : "#fde68a",
}));

const MESSAGES = [
  "Fueling the Churro Engine…",
  "Navigating the Caramel Nebula…",
  "Charging Galactic Thrusters…",
  "Entering Orbit…",
  "Launching Churroverse…",
];

/* ─── phases ───────────────────────────────────────────────────── */
type Phase = "drop" | "float" | "crack" | "shatter" | "reveal" | "done";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("drop");
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [showCrumbs, setShowCrumbs] = useState(false);
  const [showRing, setShowRing] = useState(false);
  const [scope, animate] = useAnimate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* progress ticker */
  useEffect(() => {
    const iv = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + Math.random() * 6 + 2, 100);
        setMsgIdx(Math.min(Math.floor((next / 100) * MESSAGES.length), MESSAGES.length - 1));
        if (next >= 100) clearInterval(iv);
        return next;
      });
    }, 90);
    return () => clearInterval(iv);
  }, []);

  /* phase sequencer: progress 100 → crack → shatter → reveal */
  useEffect(() => {
    if (progress >= 100 && phase === "float") {
      setPhase("crack");
      timerRef.current = setTimeout(() => {
        setShowCrumbs(true);
        setShowRing(true);
        setPhase("shatter");
        timerRef.current = setTimeout(() => {
          setPhase("reveal");
          timerRef.current = setTimeout(() => {
            setPhase("done");
            onComplete();
          }, 900);
        }, 1000);
      }, 700);
    }
  }, [progress, phase, onComplete]);

  /* transition drop → float */
  const handleDropEnd = () => {
    if (phase === "drop") setPhase("float");
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

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
          <div className="relative flex items-center justify-center" style={{ width: 340, height: 340 }}>

            {/* Orbit decoration rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: "1px dashed rgba(234,88,12,0.2)" }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute rounded-full pointer-events-none"
              style={{ inset: 20, border: "1px dashed rgba(251,191,36,0.12)" }}
            />

            {/* ── 3D Churro Canvas ───────────────────────────── */}
            <div className="absolute inset-0 z-10" style={{ filter: "drop-shadow(0 10px 30px rgba(234,88,12,0.3))" }}>
              <LoadingCanvas
                progress={progress}
                onBreakStart={() => setShowRing(true)}
                onDone={() => {
                  setPhase("reveal");
                  timerRef.current = setTimeout(() => {
                    setPhase("done");
                    onComplete();
                  }, 900);
                }}
              />
            </div>

            {/* ── Shockwave ring ─────────────────────────── */}
            <AnimatePresence>
              {showRing && phase !== "reveal" && (
                <motion.div
                  key="ring"
                  initial={{ scale: 0.2, opacity: 1 }}
                  animate={{ scale: 4.5, opacity: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 100,
                    height: 100,
                    border: "3px solid rgba(251,191,36,0.9)",
                    boxShadow: "0 0 40px rgba(234,88,12,0.6)",
                    zIndex: 30,
                  }}
                />
              )}
            </AnimatePresence>

            {/* ── Crumb particles ────────────────────────── */}
            <AnimatePresence>
              {showCrumbs && phase === "shatter" && (
                <>
                  {CRUMBS.map((c, i) => {
                    const rad = (Number(c.angle) * Math.PI) / 180;
                    const tx = Math.cos(rad) * Number(c.dist);
                    const ty = Math.sin(rad) * Number(c.dist);
                    return (
                      <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                        animate={{ x: tx, y: ty, scale: 0, opacity: 0 }}
                        transition={{ duration: Number(c.dur), ease: "easeOut", delay: i * 0.01 }}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                          width: `${c.size}px`,
                          height: `${c.size}px`,
                          background: c.color,
                          boxShadow: `0 0 ${Number(c.size) * 1.5}px ${c.color}`,
                          zIndex: 25,
                        }}
                      />
                    );
                  })}
                </>
              )}
            </AnimatePresence>

            {/* ── Floating sparkle dots ──────────────────── */}
            {(phase === "float" || phase === "crack") && [0, 1, 2, 3].map(i => (
              <motion.div
                key={`spark-${i}`}
                className="absolute rounded-full pointer-events-none"
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
            {(phase === "drop" || phase === "float" || phase === "crack") && (
              <motion.div
                key="brand"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative z-10 flex flex-col items-center gap-5 mt-10"
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
            {phase === "shatter" && (
              <motion.div
                key="flash"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 pointer-events-none z-[50]"
                style={{ background: "radial-gradient(circle, rgba(251,191,36,0.6) 0%, transparent 70%)" }}
              />
            )}
          </AnimatePresence>

          {/* ── Curtain reveal wipe ────────────────────────── */}
          <AnimatePresence>
            {phase === "reveal" && (
              <>
                {/* Top curtain flying up */}
                <motion.div
                  key="curtain-top"
                  initial={{ y: 0 }}
                  animate={{ y: "-100%" }}
                  transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute top-0 left-0 w-full z-[60]"
                  style={{
                    height: "50vh",
                    background: "linear-gradient(180deg, #020010 70%, rgba(2,0,16,0))",
                  }}
                />
                {/* Bottom curtain flying down */}
                <motion.div
                  key="curtain-bot"
                  initial={{ y: 0 }}
                  animate={{ y: "100%" }}
                  transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute bottom-0 left-0 w-full z-[60]"
                  style={{
                    height: "50vh",
                    background: "linear-gradient(0deg, #020010 70%, rgba(2,0,16,0))",
                  }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
