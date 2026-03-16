"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Server, Database, Layout, ShieldCheck, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";

interface TechItem {
  name: string;
  icon: string;
  lightIcon?: string;
  darkIcon?: string;
  category: string;
}

const techStack: TechItem[] = [
  // Backend & Frameworks
  { name: "PHP", icon: "/php.svg", category: "Backend" },
  { name: "Laravel", icon: "/laravel.svg", category: "Backend" },
  { name: "Symfony", icon: "/symfonyblanco.svg", lightIcon: "/symfonynegro.svg", darkIcon: "/symfonyblanco.svg", category: "Backend" },
  { name: "Java", icon: "/java.svg", category: "Backend" },
  { name: "WordPress", icon: "/wordpressblanco.svg", lightIcon: "/wordpressnegro.svg", darkIcon: "/wordpressblanco.svg", category: "CMS" },
  
  // Frontend
  { name: "React", icon: "/react.svg", category: "Frontend" },
  { name: "Next.js", icon: "/nextblanco.svg", lightIcon: "/nextnegro.svg", darkIcon: "/nextblanco.svg", category: "Frontend" },
  { name: "TypeScript", icon: "/typescript.svg", category: "Frontend" },
  { name: "JavaScript", icon: "/javascript.svg", category: "Frontend" },
  { name: "HTML5", icon: "/html5.svg", category: "Frontend" },
  { name: "CSS3", icon: "/css3.svg", category: "Frontend" },
  { name: "Tailwind CSS", icon: "/tailwind.svg", category: "Frontend" },
  { name: "Bootstrap", icon: "/bootstrap.svg", category: "Frontend" },

  // Databases
  { name: "PostgreSQL", icon: "/postgresql.svg", category: "Database" },
  { name: "MySQL", icon: "/mysql.svg", category: "Database" },
  { name: "MariaDB", icon: "/mariadb.svg", category: "Database" },
  { name: "Supabase", icon: "/supabase.svg", category: "Database" },

  // Server & DevOps
  { name: "Docker", icon: "/docker.svg", category: "DevOps" },
  { name: "Portainer", icon: "/portainer.svg", category: "DevOps" },
  { name: "Ubuntu", icon: "/ubuntu.svg", category: "Server" },
  { name: "Apache", icon: "/apache.svg", category: "Server" },
  { name: "Nginx", icon: "/nginx.svg", category: "Server" },
  { name: "Cloudflare", icon: "/cloudflare.svg", category: "DevOps" },
  { name: "Vercel", icon: "/vercelblanco.svg", lightIcon: "/vercelnegro.svg", darkIcon: "/vercelblanco.svg", category: "DevOps" },
  { name: "AWS", icon: "/awsblanco.svg", lightIcon: "/awsnegro.svg", darkIcon: "/awsblanco.svg", category: "DevOps" },
  { name: "Git", icon: "/git.svg", category: "Tools" },
  { name: "GitHub", icon: "/githubblanco.svg", lightIcon: "/githubnegro.svg", darkIcon: "/githubblanco.svg", category: "Tools" },
];

const categories = [
  { name: "Backend & Core", icon: <Server className="w-5 h-5" />, items: techStack.filter(t => t.category === "Backend" || t.category === "CMS") },
  { name: "Frontend & UI", icon: <Layout className="w-5 h-5" />, items: techStack.filter(t => t.category === "Frontend") },
  { name: "Infrastructure & Tools", icon: <Zap className="w-5 h-5" />, items: techStack.filter(t => t.category === "DevOps" || t.category === "Server" || t.category === "Tools") },
  { name: "Databases", icon: <Database className="w-5 h-5" />, items: techStack.filter(t => t.category === "Database") },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

export default function StackPage() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getIcon = (tech: TechItem) => {
    if (!mounted) return tech.icon;
    const currentTheme = resolvedTheme || theme;
    if (currentTheme === "dark") {
      return tech.darkIcon || tech.icon;
    }
    return tech.lightIcon || tech.icon;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center md:text-left"
      >
        <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
          <div className="p-2 bg-orange-500/10 rounded-xl">
            <Code2 className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Tech Stack</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Un ecosistema de herramientas y lenguajes seleccionados para construir software robusto, escalable y seguro.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-12">
        {categories.map((cat, idx) => (
          <section key={cat.name} className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1 bg-gradient-to-b from-orange-600 to-amber-500 rounded-full" />
              <div className="flex items-center gap-2">
                <span className="text-orange-600 dark:text-orange-400">{cat.icon}</span>
                <h2 className="font-bold tracking-widest uppercase text-sm mt-1 text-foreground/70">{cat.name}</h2>
              </div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {cat.items.map((tech) => (
                <motion.div key={tech.name} variants={itemVariants}>
                  <Card className="group relative overflow-hidden bg-slate-50/80 dark:bg-card/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 hover:border-orange-500/50 transition-all duration-500 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.2)] h-full">
                    <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                      <div className="relative w-14 h-14 transition-transform duration-500 group-hover:scale-110">
                        <img
                          src={getIcon(tech)}
                          alt={tech.name}
                          className="w-full h-full object-contain filter drop-shadow-md transition-all duration-300"
                        />
                      </div>
                      <span className="text-sm font-bold text-center text-muted-foreground group-hover:text-foreground transition-colors tracking-tight">
                        {tech.name}
                      </span>
                    </CardContent>
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </section>
        ))}
      </div>
      
      {/* Footer-like subtle section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-24 p-8 rounded-3xl bg-orange-500/5 border border-orange-500/10 text-center"
      >
        <p className="text-muted-foreground font-medium flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5 text-orange-600" />
          Foco constante en la arquitectura limpia, seguridad y rendimiento.
        </p>
      </motion.div>
    </div>
  );
}
