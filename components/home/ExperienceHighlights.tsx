"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n";
import { Briefcase, Calendar, Building2, Zap } from "lucide-react";
import Link from "next/link";

export function ExperienceHighlights() {
  const { t } = useI18n();
  
  const history = t.experience.timeline.filter((item: any) => !item.id.startsWith("3")); // Filter out academic/degree items
  const highlightedItems = history.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden px-4 sm:px-6 lg:px-8">
       <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-12 sm:space-y-14 md:space-y-16">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest">
            <Briefcase className="w-3 h-3" />
            {t.home.experienceHighlights.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight px-4">
            {t.home.experienceHighlights.heading} <span className="text-orange-500">{t.home.experienceHighlights.headingAccent}</span>
          </h2>
        </div>

        <div className="relative space-y-10 sm:space-y-12">
          {/* Vertical Line */}
          <div className="absolute left-0 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-500/30 to-transparent sm:-translate-x-1/2 hidden sm:block" />

          {highlightedItems.map((item: any, index: number) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
              >
                {/* Content Card */}
                <div className={`w-full sm:w-[48%] lg:w-[45%] p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:border-orange-500/30 transition-colors group shadow-xl ${isEven ? 'text-left' : 'sm:text-right'}`}>
                   <div className={`flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4 ${isEven ? '' : 'sm:flex-row-reverse'}`}>
                      <div className="p-2 sm:p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 group-hover:scale-110 transition-transform">
                         <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg leading-none">{item.company}</h3>
                        <p className="text-[10px] sm:text-xs text-orange-500/70 font-bold mt-1 uppercase tracking-wider">{item.role}</p>
                      </div>
                   </div>

                   <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                     {item.description}
                   </p>

                   <div className={`flex items-center gap-3 sm:gap-4 mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-white/5 ${isEven ? 'justify-start' : 'sm:justify-end justify-start'}`}>
                      <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                        <Calendar className="w-3 h-3" />
                        {item.start_date.split('-')[0]} — {item.current ? t.experience.current : item.end_date.split('-')[0]}
                      </div>
                   </div>
                </div>

                {/* Center Node */}
                <div className="absolute left-0 sm:left-1/2 top-6 sm:top-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 sm:-translate-x-1/2 sm:-translate-y-1/2 z-10 hidden sm:block">
                   <div className="w-full h-full rounded-full bg-orange-500 ring-4 ring-orange-500/20 animate-pulse" />
                </div>

                {/* Spacer for symmetrical layout on large screens */}
                <div className="hidden sm:block w-[48%] lg:w-[45%]" />
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center pt-6 sm:pt-8">
            <Link href="/experience" className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-orange-500/10 text-orange-500 text-sm sm:text-base font-bold hover:bg-orange-500 hover:text-white transition-all border border-orange-500/20 group">
                <Zap className="w-4 h-4 transition-transform group-hover:scale-110" />
                {t.home.experienceHighlights.cta}
            </Link>
        </div>
      </div>
    </section>
  );
}
