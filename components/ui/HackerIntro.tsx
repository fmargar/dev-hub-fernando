"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const bootSequences = [
  { text: ">>> INITIALIZING OVERLORD CORE v4.2.0...", color: "text-zinc-500", delay: 100 },
  { text: ">>> LOADING KERNEL MODULES [OK]", color: "text-green-500", delay: 80 },
  { text: ">>> MOUNTING VIRTUAL FILE SYSTEMS... [DONE]", color: "text-zinc-400", delay: 50 },
  { text: ">>> ESTABLISHING SECURE UDP TUNNEL... [SUCCESS]", color: "text-green-400", delay: 100 },
  { text: ">>> CHECKING SYSTEM INTEGRITY... 100%", color: "text-zinc-400", delay: 150 },
  { text: ">>> WELCOME, FERNANDO MÁXIMO.", color: "text-orange-500 font-bold", delay: 400 },
  { text: ">>> ACCESS GRANTED. REDIRECTING TO MAIN HUB...", color: "text-orange-400", delay: 300 },
];

export function HackerIntro({ onComplete }: { onComplete?: () => void }) {
  const [show, setShow] = useState(false);
  const [currentLines, setCurrentLines] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setShow(true);
    let currentIdx = 0;
    let active = true;
    let timeoutId: NodeJS.Timeout;

    const runSequence = () => {
      if (!active) return;

      if (currentIdx < bootSequences.length) {
        const line = bootSequences[currentIdx];
        if (line) {
          setCurrentLines((prev) => [...prev, line.text]);
          timeoutId = setTimeout(runSequence, line.delay);
        }
        currentIdx++;
      } else {
        timeoutId = setTimeout(() => {
          if (!active) return;
          setShow(false);
          setIsComplete(true);
          onComplete?.();
        }, 800);
      }
    };

    timeoutId = setTimeout(runSequence, 500);
    
    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, []);

  if (isComplete) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center p-6 font-mono overflow-hidden"
        >
          <div className="max-w-2xl w-full">
            <div className="space-y-2">
              {currentLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`${bootSequences[i]?.color || "text-zinc-300"} text-sm sm:text-base`}
                >
                  {line}
                </motion.div>
              ))}
              {!isComplete && (
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-2.5 h-5 bg-orange-500 inline-block align-middle ml-1"
                />
              )}
            </div>
          </div>
          
          {/* Subtle background scanning effect */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="h-full w-full bg-[linear-gradient(transparent_0%,rgba(249,115,22,0.1)_50%,transparent_100%)] bg-[length:100%_4px]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
