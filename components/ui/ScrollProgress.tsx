"use client";

import { useScroll, useSpring, motion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-600 via-amber-400 to-orange-500 origin-left z-[9998] shadow-[0_0_8px_rgba(249,115,22,0.8)]"
      style={{ scaleX }}
    />
  );
}
