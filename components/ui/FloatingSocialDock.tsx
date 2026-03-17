"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, ChevronUp } from "lucide-react";
import Link from "next/link";

const socials = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/fmargar",
    external: true,
    color: "hover:bg-white/10 hover:border-white/30",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/fmargar",
    external: true,
    color: "hover:bg-orange-500/20 hover:border-orange-400/40",
  },
  {
    icon: Mail,
    label: "Contacto",
    href: "/contact",
    external: false,
    color: "hover:bg-orange-500/20 hover:border-orange-400/40",
  },
];

export function FloatingSocialDock() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
      <AnimatePresence>
        {expanded &&
          socials.map((s, i) => {
            const Icon = s.icon;
            const inner = (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: (socials.length - 1 - i) * 0.06, type: "spring", stiffness: 300, damping: 24 }}
                title={s.label}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center bg-background/95 backdrop-blur-xl border border-border text-foreground/60 transition-all duration-200 cursor-pointer ${s.color} hover:text-foreground hover:scale-110 shadow-lg`}
              >
                <Icon className="w-4 h-4" />
              </motion.div>
            );

            return s.external ? (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {inner}
              </a>
            ) : (
              <Link key={s.label} href={s.href}>
                {inner}
              </Link>
            );
          })}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setExpanded((e) => !e)}
        className="w-12 h-12 rounded-2xl flex items-center justify-center bg-orange-500 text-white shadow-lg shadow-orange-500/40 hover:bg-orange-400 hover:scale-110 transition-all duration-200"
        whileTap={{ scale: 0.9 }}
        title="Links"
      >
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          <ChevronUp className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </div>
  );
}
