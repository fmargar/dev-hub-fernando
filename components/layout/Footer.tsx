import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4 md:px-8">
                <div className="flex flex-col items-center gap-4 md:items-start md:gap-2 text-center md:text-left">
                    <p className="text-sm leading-loose text-muted-foreground">
                        Construido por{" "}
                        <span className="font-semibold text-foreground">
                            Fernando Máximo Martínez García
                        </span>
                        . Estudiante de DAW en IES Salduba.
                    </p>
                </div>
                <div className="flex items-center space-x-4 text-muted-foreground">
                    <a href="https://github.com/fmargar" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors">
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                    </a>
                    <a href="https://linkedin.com/in/fmargar" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors">
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                    </a>
                    <a href="mailto:fernandomaximomartinezgarcia@gmail.com" className="hover:text-orange-500 transition-colors">
                        <Mail className="h-5 w-5" />
                        <span className="sr-only">Email</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
