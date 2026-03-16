"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const dotX = useSpring(cursorX, { damping: 40, stiffness: 600 });
  const dotY = useSpring(cursorY, { damping: 40, stiffness: 600 });
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setVisible(true);
    };

    const down = () => setClicking(true);
    const up = () => setClicking(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovering(
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") !== null ||
        target.closest("button") !== null ||
        target.className?.includes?.("cursor-pointer")
      );
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousemove", checkHover);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseleave", leave);
    window.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", checkHover);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseleave", leave);
      window.removeEventListener("mouseenter", enter);
    };
  }, [cursorX, cursorY]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null; // Don't show on touch devices
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="rounded-full border border-orange-500/70 -translate-x-1/2 -translate-y-1/2"
          animate={{
            width: hovering ? 48 : clicking ? 20 : 36,
            height: hovering ? 48 : clicking ? 20 : 36,
            opacity: visible ? 1 : 0,
            borderColor: hovering ? "rgba(251,146,60,0.9)" : "rgba(249,115,22,0.7)",
            backgroundColor: hovering ? "rgba(249,115,22,0.08)" : "transparent",
          }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
        />
      </motion.div>

      {/* Center dot */}
      <motion.div
        className="fixed top-0 left-0"
        style={{ x: dotX, y: dotY }}
      >
        <motion.div
          className="rounded-full bg-orange-500 -translate-x-1/2 -translate-y-1/2"
          animate={{
            width: clicking ? 6 : hovering ? 5 : 6,
            height: clicking ? 6 : hovering ? 5 : 6,
            opacity: visible ? 1 : 0,
          }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>
    </div>
  );
}
