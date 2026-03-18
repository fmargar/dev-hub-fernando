"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n";
import { User, Code2, Rocket, BrainCircuit } from "lucide-react";

export function AboutMe() {
  const { t } = useI18n();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const features = [
    {
      icon: Code2,
      title: "Clean Code",
      description: "Arquitecturas escalables y mantenibles."
    },
    {
      icon: Rocket,
      title: "Performance",
      description: "Optimización de carga y experiencia de usuario."
    },
    {
      icon: BrainCircuit,
      title: "Full Stack",
      description: "Domino desde la UI hasta la infraestructura."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
        >
          {/* Left: Text Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest">
                <User className="w-3 h-3" />
                Sobre mí
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Impulsando el futuro con <span className="text-orange-500">código</span> y creatividad.
              </h2>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t.home.description} Soy un apasionado de la tecnología que busca constantemente superar los límites de lo que es posible en la web. Mi enfoque se centra en crear experiencias digitales fluidas, seguras y visualmente impactantes que resuelvan problemas reales.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                  <div className="p-2 w-fit rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Enhanced Professional Terminal */}
          <motion.div 
            variants={itemVariants}
            className="relative h-[450px] w-full max-w-2xl mx-auto lg:max-w-none group lg:mt-20"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-purple-600/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative h-full w-full rounded-3xl border border-white/10 bg-[#0a0a0f] shadow-2xl overflow-hidden flex flex-col font-mono text-[11px] sm:text-xs">
               {/* Terminal Header */}
               <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                     Session: fmargar@production
                  </div>
               </div>

               {/* Terminal Content */}
               <div className="p-5 flex-grow overflow-hidden relative">
                  <TerminalContent />
               </div>

               {/* Terminal Footer Info */}
               <div className="px-4 py-2 bg-white/[0.02] border-t border-white/5 flex justify-between items-center text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">
                  <div className="flex gap-4">
                    <span>UTF-8</span>
                    <span>TypeScript</span>
                    <span>Next.js 15.1</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-orange-500/50">Ln 42, Col 1</span>
                    <span className="text-green-500/50">Main Branch</span>
                  </div>
               </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const sequences = [
  // 1. Neofetch / System Info
  [
    { text: "fmargar@overlord:~$ neofetch", color: "text-zinc-300", delay: 800 },
    { text: "       .---.        OS: Ubuntu 24.04 LTS x86_64", color: "text-orange-500", delay: 100 },
    { text: "      /     \\       Host: Custom Production Node", color: "text-orange-500", delay: 50 },
    { text: "      \\     /       Kernel: 6.8.0-1012-aws", color: "text-orange-500", delay: 50 },
    { text: "       '---'        Uptime: 147 days, 22 hours", color: "text-orange-500", delay: 50 },
    { text: "                    Shell: zsh 5.9", color: "text-orange-500", delay: 50 },
    { text: "                    CPU: Intel Xeon Platinum 8375C", color: "text-orange-500", delay: 50 },
    { text: "                    Memory: 32GB / 64GB (50%)", color: "text-orange-500", delay: 50 },
    { text: "", color: "text-zinc-500", delay: 2000 },
  ],
  // 2. Docker Status
  [
    { text: "fmargar@overlord:~$ docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'", color: "text-zinc-300", delay: 800 },
    { text: "NAMES               STATUS              PORTS", color: "text-zinc-400 font-bold", delay: 200 },
    { text: "portfolio-web-1     Up 42 days (healthy) 0.0.0.0:3000->3000/tcp", color: "text-green-400", delay: 150 },
    { text: "marbella-facil-api  Up 12 days (healthy) 127.0.0.1:8080->80", color: "text-green-400", delay: 150 },
    { text: "postgres-db-core    Up 147 days         5432/tcp", color: "text-green-400", delay: 150 },
    { text: "redis-cache-layer   Up 147 days         6379/tcp", color: "text-green-400", delay: 150 },
    { text: "nginx-reverse-proxy Up 42 days          0.0.0.0:80->80, 443->443", color: "text-green-400", delay: 150 },
    { text: "", color: "text-zinc-500", delay: 2500 },
  ],
  // 3. Git Activity
  [
    { text: "fmargar@overlord:~$ git log --oneline -n 5", color: "text-zinc-300", delay: 800 },
    { text: "a3b2c1d (HEAD -> main) feat: add extreme terminal to homepage", color: "text-orange-400", delay: 200 },
    { text: "f4e5d6c fix: optimized canvas particle system performance", color: "text-zinc-400", delay: 150 },
    { text: "b1a2c3d docs: updated technical architecture overview", color: "text-zinc-400", delay: 150 },
    { text: "h8g7f6e feat: integrated multi-language support (ES/EN/DE)", color: "text-zinc-400", delay: 150 },
    { text: "k2j1i0h setup: initialized nextjs production environment", color: "text-zinc-400", delay: 150 },
    { text: "", color: "text-zinc-500", delay: 2000 },
  ],
  // 4. Build Sequence
  [
    { text: "fmargar@overlord:~$ npm run build:prod", color: "text-zinc-300", delay: 800 },
    { text: "> portfolio@0.1.0 build", color: "text-zinc-500", delay: 200 },
    { text: "▲ Next.js 15.1.0", color: "text-zinc-300", delay: 200 },
    { text: "Creating an optimized production build...", color: "text-zinc-400", delay: 500 },
    { text: "✔ Compiled successfully", color: "text-green-400", delay: 1000 },
    { text: "Collecting page data... [========] 100%", color: "text-zinc-500", delay: 800 },
    { text: "Generating static pages (0/14) ...", color: "text-zinc-500", delay: 400 },
    { text: "✔ Finalizing page optimization", color: "text-green-400", delay: 600 },
    { text: "Page Size First Load JS", color: "text-zinc-400 underline", delay: 200 },
    { text: "├ ○ /                       124 kB          84.2 kB", color: "text-zinc-500", delay: 100 },
    { text: "└ ○ /experience             82 kB           76.4 kB", color: "text-zinc-500", delay: 100 },
    { text: "Build completed in 14.2s ✨", color: "text-orange-400 font-bold", delay: 3000 },
  ],
  // 5. Laravel / PHP Artisan
  [
    { text: "fmargar@overlord:~$ php artisan serve --port=8080", color: "text-zinc-300", delay: 800 },
    { text: "   INFO  Server running on [http://127.0.0.1:8080].", color: "text-zinc-400", delay: 400 },
    { text: "   Press Ctrl+C to stop the server", color: "text-zinc-500", delay: 200 },
    { text: "", color: "text-zinc-500", delay: 1000 },
    { text: "fmargar@overlord:~$ php artisan route:list --path=api", color: "text-zinc-300", delay: 800 },
    { text: "  Method | URI                    | Name             | Action", color: "text-zinc-400 font-bold", delay: 200 },
    { text: "  GET|HEAD | api/v1/projects      | projects.index   | App\\Http\\Controllers\\ProjectController@index", color: "text-zinc-500", delay: 150 },
    { text: "  POST     | api/v1/contact       | contact.store    | App\\Http\\Controllers\\ContactController@store", color: "text-zinc-500", delay: 150 },
    { text: "  GET|HEAD | api/v1/stats         | stats.dashboard  | App\\Http\\Controllers\\StatsController@show", color: "text-zinc-500", delay: 150 },
    { text: "", color: "text-zinc-500", delay: 2500 },
  ],
  // 6. Security & Environment
  [
    { text: "fmargar@overlord:~$ sudo scan_network --deep", color: "text-zinc-300", delay: 800 },
    { text: "[*] Initializing deep security audit...", color: "text-orange-500", delay: 400 },
    { text: "[+] Firewall status: ACTIVE", color: "text-green-500", delay: 200 },
    { text: "[+] SSL Certificates: VALID (expires in 89 days)", color: "text-green-500", delay: 200 },
    { text: "[!] Scanning for unauthorized access attempts...", color: "text-yellow-500", delay: 600 },
    { text: "[OK] 0 vulnerabilities found in 42,184 files.", color: "text-green-400 font-bold", delay: 1000 },
    { text: "Check completed. System production stable.", color: "text-orange-400", delay: 2500 },
  ],
  // 7. Development Flow
  [
    { text: "fmargar@overlord:~$ npm run dev", color: "text-zinc-300", delay: 800 },
    { text: "  VITE v6.1.0  ready in 452 ms", color: "text-green-400 font-bold", delay: 400 },
    { text: "", color: "text-zinc-500", delay: 100 },
    { text: "  ➜  Local:   http://localhost:5173/", color: "text-zinc-300", delay: 100 },
    { text: "  ➜  Network: use --host to expose", color: "text-zinc-500", delay: 100 },
    { text: "", color: "text-zinc-500", delay: 500 },
    { text: "  ➜  press h + enter to show help", color: "text-zinc-500", delay: 200 },
    { text: "12:54:32 [vite] hmr update /src/App.tsx", color: "text-orange-400", delay: 1500 },
    { text: "12:54:33 [vite] hmr update /src/components/Terminal.tsx", color: "text-orange-400", delay: 800 },
    { text: "", color: "text-zinc-500", delay: 2000 },
  ],
  // 8. Database & API
  [
    { text: "fmargar@overlord:~$ php artisan migrate --force", color: "text-zinc-300", delay: 800 },
    { text: "   INFO  Preparing database.", color: "text-zinc-400", delay: 400 },
    { text: "   INFO  Running migrations.", color: "text-zinc-400", delay: 200 },
    { text: "", color: "text-zinc-500", delay: 100 },
    { text: "  2026_03_18_000001_create_projects_table ...... 14.52ms DONE", color: "text-green-500", delay: 300 },
    { text: "  2026_03_18_000002_add_meta_to_experience ..... 8.12ms DONE", color: "text-green-500", delay: 250 },
    { text: "  2026_03_18_000003_create_contact_logs ........ 22.10ms DONE", color: "text-green-500", delay: 400 },
    { text: "", color: "text-zinc-500", delay: 1000 },
    { text: "fmargar@overlord:~$ curl -X GET http://api.fmargar.dev/v1/health", color: "text-zinc-300", delay: 800 },
    { text: '  {"status":"UP","database":"CONNECTED","cache":"SYNCED"}', color: "text-green-400", delay: 500 },
    { text: "", color: "text-zinc-500", delay: 3000 },
  ]
];

import { useState, useEffect } from "react";

function TerminalContent() {
  const [currentSequenceIdx, setCurrentSequenceIdx] = useState(0);
  const [currentLines, setCurrentLines] = useState<any[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);

  useEffect(() => {
    const sequence = sequences[currentSequenceIdx];
    
    if (currentLineIdx < sequence.length) {
      const timer = setTimeout(() => {
        setCurrentLines(prev => [...prev, sequence[currentLineIdx]]);
        setCurrentLineIdx(prev => prev + 1);
      }, sequence[currentLineIdx].delay);
      return () => clearTimeout(timer);
    } else {
      const waitTimer = setTimeout(() => {
        setCurrentLines([]);
        setCurrentLineIdx(0);
        setCurrentSequenceIdx(prev => (prev + 1) % sequences.length);
      }, 1500);
      return () => clearTimeout(waitTimer);
    }
  }, [currentLineIdx, currentSequenceIdx]);

  return (
    <div className="space-y-1.5 h-full overflow-hidden flex flex-col">
      {currentLines.map((line, i) => (
        <motion.div
           key={`${currentSequenceIdx}-${i}`}
           initial={{ opacity: 0, x: -5 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.2 }}
           className={line.color}
        >
          {line.text}
        </motion.div>
      ))}
      {currentLineIdx < sequences[currentSequenceIdx].length && (
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-2 h-4 bg-zinc-400 inline-block align-middle ml-1"
        />
      )}
    </div>
  );
}
