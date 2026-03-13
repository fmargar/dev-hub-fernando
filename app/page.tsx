"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code, Wrench, Sparkles, TerminalSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
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

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="flex-1 flex flex-col items-center justify-center relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        {/* Background gradient effects */}
        <div className="absolute inset-0 z-0 bg-background/50 dark:bg-background/90" />
        <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl opacity-50 mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl opacity-50 mix-blend-multiply animate-pulse" style={{ animationDelay: "2s" }} />

        <motion.div
          className="z-10 w-full max-w-4xl mx-auto text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex justify-center gap-3 flex-wrap">
            <Badge variant="secondary" className="px-4 py-1 text-sm bg-orange-500/10 text-orange-600 dark:text-orange-400 border-none rounded-full flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Full Stack Developer (DAW)</span>
            </Badge>
            <Badge variant="outline" className="px-4 py-1 text-sm border-orange-500/20 text-muted-foreground rounded-full flex items-center gap-2">
               <span>Marbella, ES</span>
            </Badge>
            <Badge variant="outline" className="px-4 py-1 text-sm border-orange-500/20 text-muted-foreground rounded-full flex items-center gap-2">
               <span>Carnet B + Coche Propio</span>
            </Badge>
            <Badge variant="outline" className="px-4 py-1 text-sm border-orange-500/20 text-muted-foreground rounded-full flex items-center gap-2">
               <span>English B2 (Cambridge)</span>
            </Badge>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-foreground leading-[1.1]">
              Fernando <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-400">
                Máximo
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium">
              Arquitecturas modernas, desarrollo empresarial y diseño de interfaces de alto impacto. 
              Formado en el <span className="text-orange-600 dark:text-orange-400 font-semibold">IES Salduba</span>, 
              me especializo en el ciclo completo de software con foco en la integridad y el rendimiento.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <Link href="/projects">
              <Button size="lg" className="w-full sm:w-auto gap-2 group text-lg h-14 px-10 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl shadow-lg shadow-orange-600/20 transition-all hover:scale-105">
                <Code className="w-5 h-5" />
                Ver Proyectos
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/tools">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-lg h-14 px-10 bg-background/50 backdrop-blur-xl border-orange-500/20 rounded-2xl hover:bg-orange-500/5 transition-all">
                <Wrench className="w-5 h-5 text-orange-600" />
                Laboratorio
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50 border-t relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">Arquitectura de Alto Rendimiento</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Construido con las últimas tecnologías para garantizar velocidad, interactividad y una experiencia de usuario de primer nivel.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<TerminalSquare className="w-8 h-8 text-orange-500" />}
              title="Full Stack Stack"
              description="Java (Spring Boot) & PHP para backend. React & Next.js para interfaces dinámicas de alto rendimiento."
              delay={0}
            />
            <FeatureCard
              icon={<Wrench className="w-8 h-8 text-amber-500" />}
              title="Cloud & Seguridad"
              description="AWS Cloud Practitioner & Cybersecurity Essentials. Enfoque en infraestructuras resilientes y seguras."
              delay={0.2}
            />
            <FeatureCard
              icon={<Code className="w-8 h-8 text-orange-400" />}
              title="Bases de Datos SQL"
              description="Diseño experto en PostgreSQL y MySQL con foco en normalización, integridad y auditoría de datos."
              delay={0.4}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full bg-background/50 backdrop-blur-sm border-muted-foreground/10 hover:border-primary/20 transition-colors">
        <CardContent className="p-8 space-y-4">
          <div className="p-3 bg-muted rounded-xl w-fit inline-block mb-2">
            {icon}
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}