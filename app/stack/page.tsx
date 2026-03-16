"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Server, Database, Layout, Zap, CheckCircle2, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatedBackground } from "@/components/home/AnimatedBackground";

interface TechItem {
  name: string;
  icon: string;
  lightIcon?: string;
  darkIcon?: string;
  category: string;
}

const techStack: TechItem[] = [
  { name: "PHP", icon: "/php.svg", category: "Backend" },
  { name: "Laravel", icon: "/laravel.svg", category: "Backend" },
  { name: "Symfony", icon: "/symfonyblanco.svg", lightIcon: "/symfonynegro.svg", darkIcon: "/symfonyblanco.svg", category: "Backend" },
  { name: "Java", icon: "/java.svg", category: "Backend" },
  { name: "WordPress", icon: "/wordpressblanco.svg", lightIcon: "/wordpressnegro.svg", darkIcon: "/wordpressblanco.svg", category: "CMS" },

  { name: "React", icon: "/react.svg", category: "Frontend" },
  { name: "Next.js", icon: "/nextblanco.svg", lightIcon: "/nextnegro.svg", darkIcon: "/nextblanco.svg", category: "Frontend" },
  { name: "TypeScript", icon: "/typescript.svg", category: "Frontend" },
  { name: "JavaScript", icon: "/javascript.svg", category: "Frontend" },
  { name: "HTML5", icon: "/html5.svg", category: "Frontend" },
  { name: "CSS3", icon: "/css3.svg", category: "Frontend" },
  { name: "Tailwind CSS", icon: "/tailwind.svg", category: "Frontend" },
  { name: "Bootstrap", icon: "/bootstrap.svg", category: "Frontend" },

  { name: "PostgreSQL", icon: "/postgresql.svg", category: "Database" },
  { name: "MySQL", icon: "/mysql.svg", category: "Database" },
  { name: "MariaDB", icon: "/mariadb.svg", category: "Database" },
  { name: "Supabase", icon: "/supabase.svg", category: "Database" },

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
  {
    name: "Backend & Core",
    icon: <Server className="w-4 h-4" />,
    color: "from-orange-500/20 to-amber-500/10",
    items: techStack.filter((t) => t.category === "Backend" || t.category === "CMS"),
  },
  {
    name: "Frontend & UI",
    icon: <Layout className="w-4 h-4" />,
    color: "from-blue-500/20 to-cyan-500/10",
    items: techStack.filter((t) => t.category === "Frontend"),
  },
  {
    name: "Infrastructure & DevOps",
    icon: <Zap className="w-4 h-4" />,
    color: "from-green-500/20 to-teal-500/10",
    items: techStack.filter((t) => ["DevOps", "Server", "Tools"].includes(t.category)),
  },
  {
    name: "Databases",
    icon: <Database className="w-4 h-4" />,
    color: "from-purple-500/20 to-violet-500/10",
    items: techStack.filter((t) => t.category === "Database"),
  },
];

const strengths = [
  "Arquitectura limpia y escalable",
  "Seguridad y control de acceso",
  "Rendimiento y optimización",
  "CI/CD y despliegue automatizado",
];

export default function StackPage() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const getIcon = (tech: TechItem) => {
    if (!mounted) return tech.icon;
    const t = resolvedTheme || theme;
    return t === "dark" ? tech.darkIcon || tech.icon : tech.lightIcon || tech.icon;
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-orange-500/60 mb-3">
            Ecosistema · Fernando Máximo
          </p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            Tech{" "}
            <span className="hero-title-accent">Stack</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Un ecosistema de herramientas cuidadosamente seleccionadas para construir software
            robusto, escalable y seguro.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-16">
          {categories.map((cat, catIdx) => (
            <motion.section
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: catIdx * 0.1 }}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${cat.color} border border-white/10`}>
                  <span className="text-orange-400">{cat.icon}</span>
                </div>
                <h2 className="font-bold tracking-widest uppercase text-sm text-foreground/60">
                  {cat.name}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                <span className="text-xs text-muted-foreground/50 font-mono">{cat.items.length} techs</span>
              </div>

              {/* Tech grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
                {cat.items.map((tech, i) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, type: "spring", stiffness: 200 }}
                    whileHover={{ y: -4, scale: 1.05 }}
                    className="group"
                  >
                    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all duration-300 cursor-default shadow-sm hover:shadow-orange-500/10">
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img
                          src={getIcon(tech)}
                          alt={tech.name}
                          className="w-full h-full object-contain drop-shadow-md group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.4)] transition-all duration-300"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-center text-muted-foreground group-hover:text-foreground transition-colors tracking-tight leading-tight">
                        {tech.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Bottom strengths banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-orange-500/6 to-transparent border border-orange-500/12 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-5">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-foreground/80">Principios fundamentales</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {strengths.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/8 text-sm text-muted-foreground hover:text-foreground hover:border-orange-500/20 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
