"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/portfolio";
import { useI18n } from "@/i18n";

const projectData = [
  {
    id: "1",
    github_url: "https://github.com/fmargar",
    live_url: null as string | null,
    emoji: "🌆",
    accentFrom: "#f97316",
    accentTo: "#fb923c",
    gradientClass: "from-orange-600/25 via-amber-500/15 to-rose-600/15",
  },
  {
    id: "2",
    github_url: null as string | null,
    live_url: null as string | null,
    emoji: "🏛️",
    accentFrom: "#3b82f6",
    accentTo: "#06b6d4",
    gradientClass: "from-blue-600/25 via-cyan-500/15 to-teal-600/15",
  },
  {
    id: "3",
    github_url: "https://github.com/fmargar/dev-hub-fernando",
    live_url: null as string | null,
    emoji: "⚡",
    accentFrom: "#a855f7",
    accentTo: "#6366f1",
    gradientClass: "from-violet-600/25 via-purple-500/15 to-indigo-600/15",
  },
];

export default function ProjectsPage() {
  const { t } = useI18n();
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <div className="relative min-h-screen">
      {/* Professional gradient background for projects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-muted/10" />

      {/* Multi-color subtle gradient accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.01] via-transparent via-purple-500/[0.01] to-orange-500/[0.02]" />

      {/* Subtle dot pattern overlay */}
      <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-14 md:py-16 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 sm:mb-18 md:mb-20 text-center"
        >
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-orange-500/60 mb-3">
            {t.projects.badge}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 sm:mb-6 px-4">
            {t.projects.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            {t.projects.description}
          </p>
        </motion.div>

        {/* Project Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {projectData.map((data, index) => {
            const tr = t.projects.list[index];
            const project: Project = {
              id: data.id,
              title: tr.title,
              description: tr.description,
              image_url: null,
              tech_stack: tr.tech,
              github_url: data.github_url,
              live_url: data.live_url,
              created_at: new Date().toISOString(),
            };
            const meta = {
              ...data,
              label: t.projects.meta[index].label,
            };
            return <TiltProjectCard key={data.id} project={project} meta={meta} />;
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <a
            href="https://github.com/fmargar"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-orange-500/10 text-muted-foreground hover:text-white transition-all duration-300 font-medium lightsaber-orange group"
          >
            <Github className="w-4 h-4" />
            {t.projects.cta}
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}

function TiltProjectCard({
  project,
  meta,
}: {
  project: Project;
  meta: typeof projectData[0] & { label: string };
}) {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // 🛡️ Disable 3D Tilt on mobile/touch devices for smooth scrolling
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
        return;
    }
    
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="group relative h-full"
    >
      {/* Card */}
      <div className="h-full flex flex-col rounded-[1.5rem] sm:rounded-[1.75rem] bg-background/30 backdrop-blur-xl border border-white/8 overflow-hidden transition-all duration-300 hover:border-white/20 shadow-xl hover:shadow-2xl">
        {/* Visual header */}
        <div className={`relative h-40 sm:h-48 lg:h-52 bg-gradient-to-br ${meta.gradientClass} flex flex-col items-center justify-center border-b border-white/6`}>
          {/* Glow orb */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 60%, ${meta.accentFrom}, transparent)`,
            }}
          />
          <motion.span
            className="text-5xl sm:text-6xl lg:text-7xl select-none relative z-10 drop-shadow-2xl"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          >
            {meta.emoji}
          </motion.span>
          <span className="mt-2 sm:mt-3 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/40 relative z-10">
            {meta.label}
          </span>
          {/* Top-right lock icon for private projects */}
          {!project.github_url && (
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-1.5 text-white/30 text-xs font-medium">
              <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">{t.projects.buttons.privateLabel}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
            {project.description}
          </p>

          {/* Tech stack pills */}
          <div className="flex flex-wrap gap-1.5 mb-4 sm:mb-5">
            {project.tech_stack.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-white/5 border border-white/10 hover:border-orange-500/40 transition-colors font-medium"
              >
                {tech}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 sm:gap-3 border-t border-white/6 pt-3.5 sm:pt-4">
            {project.github_url ? (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-3 sm:px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-xs sm:text-sm font-semibold transition-all"
              >
                <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {t.projects.buttons.github}
              </a>
            ) : (
              <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-3 sm:px-4 rounded-xl bg-white/[0.02] border border-white/6 text-xs sm:text-sm font-medium text-muted-foreground/40 cursor-default select-none">
                <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {t.projects.buttons.private}
              </div>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 sm:gap-2 py-2 px-3 sm:px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-orange-500/30"
              >
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {t.projects.buttons.demo}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
