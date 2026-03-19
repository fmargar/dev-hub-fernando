"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n";
import { ExternalLink, Github, Code, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FeaturedProjects() {
  const { t } = useI18n();
  
  // Showcase top 3 projects from translations
  const projects = t.projects.list.slice(0, 3);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden px-4 sm:px-6 lg:px-8 bg-slate-50/50 dark:bg-transparent">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-14 md:space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest">
              <Code className="w-3 h-3" />
              {t.home.featuredProjects.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              {t.home.featuredProjects.heading} <span className="text-orange-500">{t.home.featuredProjects.headingAccent}</span>
            </h2>
          </div>
          <Link href="/projects">
            <Button variant="ghost" className="group text-orange-500 hover:text-orange-600 hover:bg-orange-500/5 font-bold text-sm sm:text-base">
              {t.home.featuredProjects.cta}
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-7 lg:gap-8"
        >
          {projects.map((project: any, index: number) => (
            <motion.div
              key={index}
              variants={item}
              className="group relative flex flex-col h-full p-6 sm:p-7 lg:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/10 hover:border-orange-500/30 transition-all duration-500 shadow-xl hover:shadow-orange-500/5"
            >
              {/* Project ID/Index decoration */}
              <div className="absolute top-6 sm:top-8 right-6 sm:right-8 text-3xl sm:text-4xl font-black text-black/[0.03] dark:text-white/[0.03] select-none group-hover:text-orange-500/10 transition-colors">
                0{index + 1}
              </div>

              <div className="flex-grow space-y-4 sm:space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-orange-500 transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-4 italic">
                  "{project.description}"
                </p>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
                  {project.tech.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg bg-orange-500/5 dark:bg-white/5 border border-orange-500/10 dark:border-white/5 text-[9px] sm:text-[10px] font-bold text-orange-500/80 dark:text-orange-400/80 uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-black/5 dark:border-white/5 mt-6 sm:mt-8">
                <Button variant="outline" size="sm" className="rounded-xl flex-1 text-[10px] sm:text-xs font-bold gap-1.5 sm:gap-2 h-9 sm:h-10">
                  <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {t.projects.buttons.demo}
                </Button>
                <div className="p-2 sm:p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-orange-500/20 transition-colors cursor-pointer group/github">
                  <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground group-hover/github:text-orange-500 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
