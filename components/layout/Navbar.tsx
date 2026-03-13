"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Code2, Github, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "/projects", label: "Showcase" },
        { href: "/stack", label: "Stack" },
        { href: "/experience", label: "Experiencia" },
        { href: "/tools", label: "Laboratorio" },
        { href: "/contact", label: "Contacto" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md bg-background/80">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                {/* Logo Section */}
                <div className="flex-1 flex justify-start">
                    <Link href="/" className="flex items-center space-x-2">
                        <motion.div
                            initial={{ rotate: -15, scale: 0.9 }}
                            animate={{ rotate: 0, scale: 1 }}
                            className="rounded-lg bg-orange-600 p-1.5 shadow-lg shadow-orange-600/20"
                        >
                            <Code2 className="h-5 w-5 text-white" />
                        </motion.div>
                        <span className="text-xl font-bold tracking-tighter">
                            Fernando <span className="text-orange-500">Máximo</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Center Navigation */}
                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`transition-colors hover:text-foreground/80 ${pathname === link.href ? "text-foreground" : "text-foreground/60"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions Section */}
                <div className="flex-1 flex justify-end items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-4">
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

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t bg-background overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-lg font-semibold transition-colors ${pathname === link.href ? "text-orange-500" : "text-foreground/60"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <span className="text-sm text-foreground/60 font-medium">Tema & Perfil</span>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                                        className="p-2 rounded-lg bg-muted"
                                    >
                                        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                    </button>
                                    <a
                                        href="https://github.com/fmargar"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 rounded-lg bg-muted"
                                    >
                                        <Github className="h-5 w-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
