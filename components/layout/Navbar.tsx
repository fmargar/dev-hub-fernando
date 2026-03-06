"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, MonitorPlay, Github } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md bg-background/80">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                <Link href="/" className="flex items-center space-x-2">
                    <motion.div
                        initial={{ rotate: -15, scale: 0.9 }}
                        animate={{ rotate: 0, scale: 1 }}
                        className="rounded-lg bg-blue-600 p-1"
                    >
                        <MonitorPlay className="h-6 w-6 text-white" />
                    </motion.div>
                    <span className="text-xl font-bold tracking-tight">DevHub<span className="text-blue-500">Fernando</span></span>
                </Link>

                <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link
                        href="/projects"
                        className={`transition-colors hover:text-foreground/80 ${pathname === "/projects" ? "text-foreground" : "text-foreground/60"
                            }`}
                    >
                        Showcase
                    </Link>
                    <Link
                        href="/experience"
                        className={`transition-colors hover:text-foreground/80 ${pathname === "/experience" ? "text-foreground" : "text-foreground/60"
                            }`}
                    >
                        Experiencia
                    </Link>
                    <Link
                        href="/tools"
                        className={`transition-colors hover:text-foreground/80 ${pathname === "/tools" ? "text-foreground" : "text-foreground/60"
                            }`}
                    >
                        Laboratorio
                    </Link>
                </nav>

                <div className="flex items-center space-x-4">
                    <a
                        href="https://github.com/fmargar"
                        target="_blank"
                        rel="noreferrer"
                        className="text-foreground/60 hover:text-foreground transition-colors"
                    >
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                    </a>

                    <button
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="relative rounded-full p-2 hover:bg-muted transition-colors w-9 h-9 flex items-center justify-center"
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
