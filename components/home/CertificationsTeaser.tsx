"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n";
import { Award, ShieldCheck, GraduationCap, ExternalLink } from "lucide-react";

export function CertificationsTeaser() {
  const { t } = useI18n();
  
  const certifications = t.experience.certifications;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { scale: 0.9, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  };

  return (
    <section className="py-24 relative overflow-hidden px-4 sm:px-6 lg:px-8 bg-slate-50/30 dark:bg-transparent">
       <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />
       
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest">
            <Award className="w-3 h-3" />
            Certificaciones
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Validados por <span className="text-orange-500">Líderes</span> de la Industria
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {certifications.map((cert: any, index: number) => (
            <motion.div
              key={cert.id}
              variants={item}
              className="p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/10 hover:border-orange-500/30 transition-all group flex flex-col gap-4 shadow-lg hover:shadow-orange-500/5"
            >
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
                  {index === 0 ? <GraduationCap className="w-6 h-6" /> : index === 1 ? <ShieldCheck className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                </div>
                <span className="text-[10px] font-bold text-muted-foreground/60 tracking-widest uppercase">{cert.date}</span>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-bold text-lg leading-tight group-hover:text-orange-500 transition-colors">{cert.title}</h3>
                <p className="text-sm font-medium text-orange-500/70">{cert.issuer}</p>
              </div>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                {cert.description}
              </p>
              
              <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] font-bold text-orange-500/60 uppercase tracking-widest cursor-pointer hover:text-orange-500 transition-colors">
                 Ver credencial <ExternalLink className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
