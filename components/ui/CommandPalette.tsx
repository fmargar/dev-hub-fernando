"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, Briefcase, Code, Smartphone, Mail, Globe, Moon, Sun, Command, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n, Locale } from "@/i18n";
import { useTheme } from "next-themes";

interface Action {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onSelect: () => void;
  category: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { t, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();

  const actions: Action[] = [
    // Navigation
    { id: "nav-home", title: "Home", icon: <Home className="w-4 h-4" />, category: "Navigation", onSelect: () => router.push("/") },
    { id: "nav-experience", title: t.navbar.links.experience, icon: <Briefcase className="w-4 h-4" />, category: "Navigation", onSelect: () => router.push("/experience") },
    { id: "nav-projects", title: t.navbar.links.showcase, icon: <Code className="w-4 h-4" />, category: "Navigation", onSelect: () => router.push("/projects") },
    { id: "nav-stack", title: t.navbar.links.stack, icon: <Smartphone className="w-4 h-4" />, category: "Navigation", onSelect: () => router.push("/stack") },
    { id: "nav-contact", title: t.navbar.links.contact, icon: <Mail className="w-4 h-4" />, category: "Navigation", onSelect: () => router.push("/contact") },
    
    // Languages
    { id: "lang-es", title: "Español", subtitle: "Cambiar idioma a Español", icon: <Globe className="w-4 h-4" />, category: "Settings", onSelect: () => setLocale("es") },
    { id: "lang-en", title: "English", subtitle: "Switch language to English", icon: <Globe className="w-4 h-4" />, category: "Settings", onSelect: () => setLocale("en") },
    { id: "lang-de", title: "Deutsch", subtitle: "Sprache auf Deutsch umstellen", icon: <Globe className="w-4 h-4" />, category: "Settings", onSelect: () => setLocale("de") },
    
    // Theme
    { 
      id: "theme-toggle", 
      title: theme === "dark" ? "Light Mode" : "Dark Mode", 
      subtitle: "Toggle between light and dark themes",
      icon: theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />, 
      category: "Appearance", 
      onSelect: () => setTheme(theme === "dark" ? "light" : "dark") 
    },
  ];

  const filteredActions = actions.filter((action) =>
    action.title.toLowerCase().includes(query.toLowerCase()) ||
    action.category.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  if (!open && !query) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[2px]"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-xl p-4 sm:p-0"
          >
            <div className="w-full bg-[#0a0a0f]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              {/* Header / Search */}
              <div className="flex items-center px-4 py-3 border-b border-white/5">
                <Search className="w-5 h-5 text-zinc-400 mr-3" />
                <input
                  autoFocus
                  placeholder="Type a command or search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-zinc-200 placeholder-zinc-500 text-sm sm:text-base py-1"
                />
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 ml-2">
                  <span className="text-[10px] font-bold text-zinc-500">ESC</span>
                </div>
              </div>

              {/* Action List */}
              <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {filteredActions.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-zinc-500 text-sm">No results found for "{query}"</p>
                  </div>
                ) : (
                  <>
                    {Array.from(new Set(filteredActions.map(a => a.category))).map(category => (
                      <div key={category} className="space-y-1">
                        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-orange-500/50">
                          {category}
                        </div>
                        {filteredActions.filter(a => a.category === category).map((action) => (
                          <button
                            key={action.id}
                            onClick={() => {
                              action.onSelect();
                              setOpen(false);
                            }}
                            className="w-full flex items-center px-3 py-2.5 rounded-xl hover:bg-orange-500/10 hover:text-white text-zinc-400 transition-all duration-200 group text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center mr-3 group-hover:bg-orange-500/20 group-hover:border-orange-500/30 transition-colors">
                              {action.icon}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                                {action.title}
                              </div>
                              {action.subtitle && (
                                <div className="text-[11px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                                  {action.subtitle}
                                </div>
                              )}
                            </div>
                            <Command className="w-3 h-3 text-zinc-600 group-hover:text-orange-500/50 transition-colors" />
                          </button>
                        ))}
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-zinc-500">↑↓</kbd>
                      <span className="text-[10px] text-zinc-500">to navigate</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-zinc-500">⏎</kbd>
                      <span className="text-[10px] text-zinc-500">to select</span>
                   </div>
                </div>
                <div className="text-[10px] font-medium text-zinc-600">
                   FERNANDO-HUB v4.2
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
