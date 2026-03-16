"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, Heart, Code2 } from "lucide-react";
import { motion } from "framer-motion";

const navLinks = [
    { href: "/projects", label: "Proyectos" },
    { href: "/stack", label: "Stack" },
    { href: "/experience", label: "Experiencia" },
    { href: "/tools", label: "Laboratorio" },
    { href: "/contact", label: "Contacto" },
];

const socials = [
    { href: "https://github.com/fmargar", icon: Github, label: "GitHub" },
    { href: "https://linkedin.com/in/fmargar", icon: Linkedin, label: "LinkedIn" },
    { href: "/contact", icon: Mail, label: "Contacto", internal: true },
];

export function Footer() {
    return (
        <footer className="relative border-t border-white/8 overflow-hidden">
            {/* Subtle top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">

                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center md:items-start gap-2 text-center md:text-left"
                    >
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <Code2 className="h-4 w-4 text-orange-500" />
                            </div>
                            <span className="font-bold tracking-tight">
                                Fernando <span className="text-orange-500">Máximo</span>
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
                            Full Stack Developer · DAW · Marbella, ES
                        </p>
                        <p className="text-xs text-muted-foreground/40 flex items-center gap-1.5">
                            Hecho con <Heart className="h-3 w-3 text-orange-500" /> en Next.js · self-hosted Ubuntu
                        </p>
                    </motion.div>

                    {/* Nav */}
                    <motion.nav
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="hover:text-orange-500 transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </motion.nav>

                    {/* Social + copyright */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center md:items-end gap-3"
                    >
                        <div className="flex items-center gap-2">
                            {socials.map(({ href, icon: Icon, label, internal }) =>
                                internal ? (
                                    <Link
                                        key={label}
                                        href={href}
                                        aria-label={label}
                                        className="p-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-orange-500/10 hover:border-orange-500/30 hover:text-orange-500 transition-all duration-200"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </Link>
                                ) : (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={label}
                                        className="p-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-orange-500/10 hover:border-orange-500/30 hover:text-orange-500 transition-all duration-200"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </a>
                                )
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground/40">
                            © {new Date().getFullYear()} Fernando Martínez · Todos los derechos reservados
                        </p>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
}
