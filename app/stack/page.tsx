"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Server, Database, Layout, Zap, CheckCircle2, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { useI18n } from "@/i18n";

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

export default function StackPage() {
  const { t } = useI18n();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const getIcon = (tech: TechItem) => {
    if (!mounted) return tech.icon;
    const themeValue = resolvedTheme || theme;
    return themeValue === "dark" ? tech.darkIcon || tech.icon : tech.lightIcon || tech.icon;
  };

  const categories = [
    {
      name: t.stack.categories.backend,
      icon: <Server className="w-4 h-4" />,
      color: "from-orange-500/20 to-amber-500/10",
      items: techStack.filter((tech) => tech.category === "Backend" || tech.category === "CMS"),
    },
    {
      name: t.stack.categories.frontend,
      icon: <Layout className="w-4 h-4" />,
      color: "from-blue-500/20 to-cyan-500/10",
      items: techStack.filter((tech) => tech.category === "Frontend"),
    },
    {
      name: t.stack.categories.infra,
      icon: <Zap className="w-4 h-4" />,
      color: "from-green-500/20 to-teal-500/10",
      items: techStack.filter((tech) => ["DevOps", "Server", "Tools"].includes(tech.category)),
    },
    {
      name: t.stack.categories.database,
      icon: <Database className="w-4 h-4" />,
      color: "from-purple-500/20 to-violet-500/10",
      items: techStack.filter((tech) => tech.category === "Database"),
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Tech-focused background with subtle code-like pattern */}
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-muted/3 to-background" />

      {/* Multiple tech-themed gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.01] via-blue-500/[0.015] via-purple-500/[0.01] to-orange-500/[0.01]" />

      {/* Code pattern overlay */}
      <div className="absolute inset-0 opacity-[0.006] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI0ZGRiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] bg-[size:40px_40px]" />

      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-14 md:py-16 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 sm:mb-18 md:mb-20"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-orange-500/60 mb-3">
            {t.stack.badge}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 sm:mb-6 px-4">
            {t.stack.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            {t.stack.description}
          </p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-12 sm:space-y-14 md:space-y-16">
          {categories.map((cat, catIdx) => (
            <motion.section
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: catIdx * 0.1 }}
            >
              {/* Category header */}
              <div className="flex items-center gap-2.5 sm:gap-3 mb-5 sm:mb-6">
                <div className={`p-1.5 sm:p-2 rounded-xl bg-gradient-to-br ${cat.color} border border-white/10`}>
                  <span className="text-orange-400">{cat.icon}</span>
                </div>
                <h2 className="font-bold tracking-widest uppercase text-xs sm:text-sm text-foreground/60">
                  {cat.name}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                <span className="text-[10px] sm:text-xs text-muted-foreground/50 font-mono">{cat.items.length} {t.stack.techs}</span>
              </div>

              {/* Tech grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 sm:gap-2.5 md:gap-3">
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
                    <div className="flex flex-col items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/8 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all duration-300 cursor-default shadow-sm hover:shadow-orange-500/10">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center">
                        <img
                          src={getIcon(tech)}
                          alt={tech.name}
                          className="w-full h-full object-contain drop-shadow-md group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.4)] transition-all duration-300"
                        />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-center text-muted-foreground group-hover:text-foreground transition-colors tracking-tight leading-tight">
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
          className="mt-16 sm:mt-18 md:mt-20 p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-orange-500/6 to-transparent border border-orange-500/12 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-5">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <h3 className="font-bold text-sm sm:text-base text-foreground/80">{t.stack.principles.title}</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 md:gap-3">
            {t.stack.principles.list.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/8 text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:border-orange-500/20 transition-all"
              >
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500 flex-shrink-0" />
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
