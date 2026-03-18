"use client";

import { useScroll, useSpring, motion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  // Optimization: Disable spring physics on mobile to save CPU/Battery during momentum scroll
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const springConfig = { stiffness: 200, damping: 30 };
  const scaleX = useSpring(scrollYProgress, isMobile ? { stiffness: 1000, damping: 100 } : springConfig);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-600 via-amber-400 to-orange-500 origin-left z-[9998] shadow-[0_0_8px_rgba(249,115,22,0.8)] will-change-transform"
      style={{ scaleX }}
    />
  );
}
