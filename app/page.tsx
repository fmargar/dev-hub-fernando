"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code, Wrench, MapPin, Award, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/home/TypewriterText";
import { AnimatedBackground } from "@/components/home/AnimatedBackground";
import { BentoDashboard } from "@/components/home/BentoDashboard";
import { AboutMe } from "@/components/home/AboutMe";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { ExperienceHighlights } from "@/components/home/ExperienceHighlights";
import { CertificationsTeaser } from "@/components/home/CertificationsTeaser";
import { useI18n } from "@/i18n";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 80, damping: 18 },
  },
};

export default function Home() {
  const { t } = useI18n();

  const badges = [
    { icon: Code, label: t.home.badges.role },
    { icon: MapPin, label: t.home.badges.location },
    { icon: Globe, label: t.home.badges.cert1 },
    { icon: Award, label: t.home.badges.cert2 },
  ];

  return (
    <div className="flex flex-col relative">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-16">
        {/* Animated particle canvas */}
        <AnimatedBackground />

        {/* Radial spotlight gradient */}
        <div className="absolute inset-0 pointer-events-none z-[1]">
          <div className="hero-spotlight" />
        </div>

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] z-[1] noise-texture pointer-events-none" />

        {/* Content */}
        <motion.div
          className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Availability badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-green-500/10 border border-green-500/25 text-green-400 text-xs sm:text-sm font-semibold">
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-green-500" />
              </span>
              Disponible para nuevos proyectos
            </div>
          </motion.div>

          {/* Badge row */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2">
            {badges.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="hero-badge"
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {label}
              </span>
            ))}
          </motion.div>

          {/* Main title */}
          <motion.div variants={itemVariants} className="space-y-3">
            <p className="text-sm font-semibold tracking-[0.3em] uppercase text-orange-500/70 mb-4">
              {t.home.subtitle}
            </p>
            <h1 className="hero-title">
              Fernando{" "}
              <span className="hero-title-accent">
                Máximo
              </span>
            </h1>
          </motion.div>

          {/* Typewriter subtitle */}
          <motion.div variants={itemVariants}>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center gap-2">
              <TypewriterText
                phrases={t.home.typewriter}
                className="text-foreground/90 font-semibold"
              />
            </p>
            <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed px-4 sm:px-0">
              {t.home.description}
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2"
          >
            <Link href="/projects">
              <Button
                size="lg"
                className="cta-primary group lightsaber-orange w-full sm:w-auto"
              >
                <Code className="w-4 h-4 sm:w-5 sm:h-5" />
                {t.home.cta.projects}
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="cta-secondary group lightsaber-orange w-full sm:w-auto"
              >
                <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 group-hover:rotate-12 transition-transform" />
                {t.home.cta.contact}
              </Button>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-2 pt-4 text-muted-foreground/50"
          >
            <span className="text-xs tracking-widest uppercase font-medium">{t.home.scroll}</span>
            <motion.div
              className="w-px h-10 bg-gradient-to-b from-orange-500/50 to-transparent rounded-full"
              animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* --- ABOUT ME --- */}
      <AboutMe />

      {/* --- BENTO DASHBOARD --- */}
      <BentoDashboard />

      {/* --- FEATURED PROJECTS --- */}
      <FeaturedProjects />

      {/* --- EXPERIENCE HIGHLIGHTS --- */}
      <ExperienceHighlights />

      {/* --- CERTIFICATIONS --- */}
      <CertificationsTeaser />

      {/* Spacer and final CTA */}
      <section className="py-16 sm:py-20 md:py-24 px-4 text-center space-y-6 sm:space-y-8 bg-gradient-to-t from-orange-500/5 to-transparent">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight px-4">¿Listo para construir algo <span className="text-orange-500">increíble</span>?</h2>
        <Link href="/contact">
          <Button size="lg" className="cta-primary lightsaber-orange px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg h-auto">
             Empecemos ahora
             <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
