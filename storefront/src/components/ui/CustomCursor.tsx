"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true); // Default true to prevent hydration mismatch flashes
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Detect if we have a fine pointer (mouse)
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsTouchDevice(false);
      
      // Inject cursor hiding styles
      document.documentElement.classList.add("hide-default-cursor");
    }

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[role='button']")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.classList.remove("hide-default-cursor");
    };
  }, [isVisible]);

  if (isTouchDevice) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-default-cursor, .hide-default-cursor * {
          cursor: none !important;
        }
      `}} />
      
      {/* Main tiny dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-orange-500 rounded-full pointer-events-none z-[99999] mix-blend-screen"
        animate={{
          x: mousePosition.x - 5,
          y: mousePosition.y - 5,
          scale: isHovering ? 0 : 1,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />
      
      {/* Outer ring/glow */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-orange-500/50 rounded-full pointer-events-none z-[99999] mix-blend-screen flex items-center justify-center backdrop-blur-[1px]"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? "rgba(234, 88, 12, 0.15)" : "transparent",
          opacity: isVisible ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.5 }}
      >
        {isHovering && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-1.5 h-1.5 bg-orange-400 rounded-full"
          />
        )}
      </motion.div>
    </>
  );
}
