"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const bootSequences = [
  { text: ">>> INITIALIZING OVERLORD CORE v4.2.0...", delay: 100 },
  { text: ">>> LOADING KERNEL MODULES [OK]", delay: 80 },
  { text: ">>> MOUNTING VIRTUAL FILE SYSTEMS... [DONE]", delay: 50 },
  { text: ">>> ESTABLISHING SECURE UDP TUNNEL... [SUCCESS]", delay: 100 },
  { text: ">>> CHECKING SYSTEM INTEGRITY... 100%", delay: 150 },
  { text: ">>> WELCOME, FERNANDO MÁXIMO.", delay: 400, highlight: true },
  { text: ">>> ACCESS GRANTED. REDIRECTING TO MAIN HUB...", delay: 300 },
];

export function HackerIntro({ onComplete }: { onComplete?: () => void }) {
  const [show, setShow] = useState(false);
  const [currentLines, setCurrentLines] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Detectar el tema actual (considerando el tema del sistema si está habilitado)
  const currentTheme = mounted ? (theme === "system" ? systemTheme : theme) : "dark";
  const isLight = currentTheme === "light";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

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
  }, [mounted, onComplete]);

  if (isComplete) return null;

  // Función para obtener el color de cada línea según el tema
  const getLineColor = (index: number) => {
    const line = bootSequences[index];
    if (!line) return isLight ? "text-zinc-700" : "text-zinc-300";

    if (line.highlight) {
      return "text-orange-500 font-bold";
    }

    // Colores adaptativos para cada tipo de línea
    const darkColors = [
      "text-zinc-500",    // 0: INITIALIZING
      "text-green-500",   // 1: LOADING (OK)
      "text-zinc-400",    // 2: MOUNTING
      "text-green-400",   // 3: ESTABLISHING (SUCCESS)
      "text-zinc-400",    // 4: CHECKING
      "text-orange-500 font-bold", // 5: WELCOME (highlight)
      "text-orange-400",  // 6: ACCESS GRANTED
    ];

    const lightColors = [
      "text-zinc-600",    // 0: INITIALIZING
      "text-green-700",   // 1: LOADING (OK)
      "text-zinc-700",    // 2: MOUNTING
      "text-green-600",   // 3: ESTABLISHING (SUCCESS)
      "text-zinc-700",    // 4: CHECKING
      "text-orange-600 font-bold", // 5: WELCOME (highlight)
      "text-orange-600",  // 6: ACCESS GRANTED
    ];

    return isLight ? lightColors[index] : darkColors[index];
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={`fixed inset-0 z-[9999] flex items-center justify-center p-6 font-mono overflow-hidden ${
            isLight ? "bg-[#f8f8f8]" : "bg-[#050505]"
          }`}
        >
          <div className="max-w-2xl w-full">
            <div className="space-y-2">
              {currentLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`${getLineColor(i)} text-sm sm:text-base`}
                >
                  {line}
                </motion.div>
              ))}
              {!isComplete && (
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className={`w-2.5 h-5 inline-block align-middle ml-1 ${
                    isLight ? "bg-orange-600" : "bg-orange-500"
                  }`}
                />
              )}
            </div>
          </div>

          {/* Subtle background scanning effect */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className={`h-full w-full ${
              isLight
                ? "bg-[linear-gradient(transparent_0%,rgba(234,88,12,0.15)_50%,transparent_100%)]"
                : "bg-[linear-gradient(transparent_0%,rgba(249,115,22,0.1)_50%,transparent_100%)]"
            } bg-[length:100%_4px]`} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
