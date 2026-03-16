import Link from "next/link";
import { Github, Linkedin, Mail, Code2, Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 md:px-8 py-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">

                    {/* Brand col */}
                    <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-orange-600 p-1.5 shadow-lg shadow-orange-600/20">
                                <Code2 className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold tracking-tight">
                                Fernando <span className="text-orange-500">Máximo</span>
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                            Desarrollador Full Stack · DAW · Marbella, ES
                        </p>
                        <p className="text-xs text-muted-foreground/50 flex items-center gap-1">
                            Hecho con <Heart className="h-3 w-3 text-orange-500 inline" /> en Next.js 15 · self-hosted en Ubuntu
                        </p>
                    </div>

                    {/* Nav links */}
                    <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        {[
                            { href: "/projects", label: "Proyectos" },
                            { href: "/stack", label: "Stack" },
                            { href: "/experience", label: "Experiencia" },
                            { href: "/tools", label: "Laboratorio" },
                            { href: "/contact", label: "Contacto" },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="hover:text-orange-500 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Social + copyright */}
                    <div className="flex flex-col items-center md:items-end gap-3">
                        <div className="flex items-center space-x-3">
                            <a
                                href="https://github.com/fmargar"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                                className="p-2 rounded-lg bg-muted/50 hover:bg-orange-500/10 hover:text-orange-500 transition-all"
                            >
                                <Github className="h-4 w-4" />
                            </a>
                            <a
                                href="https://linkedin.com/in/fmargar"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                                className="p-2 rounded-lg bg-muted/50 hover:bg-orange-500/10 hover:text-orange-500 transition-all"
                            >
                                <Linkedin className="h-4 w-4" />
                            </a>
                            <Link
                                href="/contact"
                                aria-label="Contacto"
                                className="p-2 rounded-lg bg-muted/50 hover:bg-orange-500/10 hover:text-orange-500 transition-all"
                            >
                                <Mail className="h-4 w-4" />
                            </Link>
                        </div>
                        <p className="text-xs text-muted-foreground/50">
                            © {new Date().getFullYear()} Fernando Martínez · Todos los derechos reservados
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
