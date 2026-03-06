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
        <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl opacity-50 mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl opacity-50 mix-blend-multiply animate-pulse" style={{ animationDelay: "2s" }} />

        <motion.div
          className="z-10 w-full max-w-4xl mx-auto text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex justify-center">
            <Badge variant="secondary" className="px-4 py-1 text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none rounded-full flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Estudiante de DAW @ IES Salduba</span>
            </Badge>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground">
              Fernando <br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                DevHub
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Desarrollador Full Stack construyendo experiencias web modernas y herramientas potentes.
              Explora mi portfolio y utilidades impulsadas por la potencia del cliente.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/projects">
              <Button size="lg" className="w-full sm:w-auto gap-2 group text-base h-12 px-8">
                <Code className="w-5 h-5" />
                Explorar Proyectos
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/tools">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-base h-12 px-8 bg-background/50 backdrop-blur-sm">
                <Wrench className="w-5 h-5" />
                Ir al Laboratorio
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
              icon={<TerminalSquare className="w-8 h-8 text-blue-500" />}
              title="Next.js 15 & React"
              description="Server Components para cargas instantáneas y Client Components para interacciones fluidas."
              delay={0}
            />
            <FeatureCard
              icon={<Wrench className="w-8 h-8 text-purple-500" />}
              title="Procesamiento en el Cliente"
              description="Herramientas basadas en WebAssembly que procesan imágenes y videos usando la potencia de tu navegador."
              delay={0.2}
            />
            <FeatureCard
              icon={<Code className="w-8 h-8 text-emerald-500" />}
              title="Diseño Premium"
              description="Aesthetic minimalista impulsado por Tailwind CSS, Shadcn/UI y animaciones de Framer Motion."
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