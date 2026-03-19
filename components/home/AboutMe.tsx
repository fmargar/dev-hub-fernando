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
      title: t.home.aboutMe.features[0].title,
      description: t.home.aboutMe.features[0].description
    },
    {
      icon: Rocket,
      title: t.home.aboutMe.features[1].title,
      description: t.home.aboutMe.features[1].description
    },
    {
      icon: BrainCircuit,
      title: t.home.aboutMe.features[2].title,
      description: t.home.aboutMe.features[2].description
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none hidden sm:block" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-end"
        >
          {/* Left: Text Content */}
          <motion.div variants={itemVariants} className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest">
                <User className="w-3 h-3" />
                {t.home.aboutMe.badge}
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                {t.home.aboutMe.heading}
              </h2>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t.home.description} {t.home.aboutMe.extra}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="space-y-2 sm:space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:border-orange-500/20 transition-colors">
                  <div className="p-2 w-fit rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500">
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-bold text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
          {/* Right: Enhanced Professional Terminal */}
          <motion.div
            variants={itemVariants}
            className="relative h-auto w-full max-w-2xl mx-auto lg:max-w-none group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-purple-600/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative w-full max-w-4xl mx-auto h-[50vh] sm:h-[55vh] lg:h-[60vh] rounded-2xl border border-white/10 bg-[#0A0A0B]/90 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden group/terminal">
               {/* Terminal Header */}
               <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
                  </div>

                  {/* CTRL + K Hint in Header */}
                  <div className="flex items-center gap-1 sm:gap-1.5 group/kb cursor-help scale-75 sm:scale-90 origin-right transition-all">
                    <span className="text-zinc-600 text-[8px] sm:text-[9px] font-bold tracking-widest uppercase hidden xs:inline">Quick Menu:</span>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <kbd className="px-0.5 sm:px-1 py-0.5 rounded border border-white/10 bg-white/5 text-[7px] sm:text-[8px] text-zinc-400 font-bold">CTRL</kbd>
                      <span className="text-zinc-700 text-[7px] sm:text-[8px]">+</span>
                      <kbd className="px-0.5 sm:px-1 py-0.5 rounded border border-white/10 bg-white/5 text-[7px] sm:text-[8px] text-zinc-400 font-bold">K</kbd>
                    </div>
                  </div>
                  <div className="text-zinc-500 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 sm:gap-2">
                     <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-500 animate-pulse" />
                     <span className="hidden sm:inline">Session:</span> fmargar<span className="hidden md:inline">@production</span>
                  </div>
               </div>

               {/* Content area */}
               <div className="flex-1 p-4 sm:p-6 font-mono text-[9px] sm:text-[10px] md:text-xs overflow-hidden scrollbar-hide whitespace-pre-wrap word-break-all selection:bg-orange-500/30">
                  <TerminalContent />
               </div>

               {/* Status Bar */}
               <div className="h-7 sm:h-8 border-t border-white/5 bg-black/40 px-3 sm:px-4 flex items-center justify-between text-[9px] sm:text-[10px] uppercase tracking-wider font-bold shrink-0 relative overflow-hidden">
                  <div className="flex gap-2 sm:gap-4">
                    <span className="text-zinc-500 flex items-center gap-1 sm:gap-1.5">
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-zinc-600" />
                      UTF-8
                    </span>
                    <span className="text-zinc-500 flex items-center gap-1 sm:gap-1.5 hidden xs:flex">
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-zinc-600" />
                      TS
                    </span>
                    <span className="text-zinc-500 flex items-center gap-1 sm:gap-1.5 hidden sm:flex">
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      NEXT.JS 15.1
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex gap-2 sm:gap-3 border-l border-white/5 pl-2 sm:pl-3">
                      <span className="text-orange-500/80">LN 42</span>
                      <span className="text-zinc-600 hidden sm:inline">MAIN</span>
                    </div>
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
  // 1. Build Production (User provided)
  [
    { text: "fmargar@overlord:~$ npm run build:prod --verbose --environment=production --no-cache --max-workers=12 --target=linux-amd64", color: "text-zinc-400", delay: 800 },
    { text: "> portfolio-v2@0.1.0 build:prod /home/fmargar/dev/web/frontend/portfolio-suite-2026-stable", color: "text-zinc-500", delay: 100 },
    { text: "▲ Next.js 15.1.0 [Production-Grade Build Engine - Webpack 5 + Turbopack Optimized Chunks]", color: "text-blue-400", delay: 100 },
    { text: "[1/4] Linting and type-checking all components in src/shared/components... [PASS - No warnings found]", color: "text-zinc-500", delay: 300 },
    { text: "[2/4] Transforming 482 TypeScript modules into high-performance optimized JavaScript bundles...", color: "text-zinc-500", delay: 400 },
    { text: "✔ Bundling completed successfully in 12.4s. Mean bundle size: 42.8 kB. Total JS transform: 8.42 MB.", color: "text-green-500", delay: 200 },
    { text: "[3/4] Collecting static page data for metadata-driven optimization... [========================] 100%", color: "text-zinc-500", delay: 600 },
    { text: "[4/4] Finalizing localized static site generation (ES/EN/DE) (42 dynamic routes) ... [Success]", color: "text-green-500", delay: 200 },
    { text: "Route (app router)                                        Size (Gzipped)  First Load JS", color: "text-zinc-400 underline", delay: 100 },
    { text: "├ ○ / (Home Landing Page)               124.52 kB           84.21 kB (LCP: 0.8s)        [Optimized]", color: "text-zinc-500", delay: 50 },
    { text: "├ ○ /experience (Career Timeline)       82.16 kB            76.48 kB (FCP: 1.2s)        [Optimized]", color: "text-zinc-500", delay: 50 },
    { text: "Build success. Deploying to production nodes...", color: "text-orange-500 font-bold", delay: 2000 },
  ],
  // 2. Neofetch (User provided)
  [
    { text: "fmargar@overlord:~$ neofetch --ascii_distro ubuntu --cpu_temp C --memory_percent --gpu_brand on --speed_type scaling --disk_show / --ip_host github.com", color: "text-zinc-400", delay: 800 },
    { text: ".---. OS: Ubuntu 24.04.1 LTS x86_64 [Kernel: 6.8.0-1012-aws-generic-v3-stable-prod]", color: "text-zinc-300", delay: 50 },
    { text: "/ \\ Host: AWS EC2 m6i.2xlarge Custom-Built (Optimized for High-Throughput Node.js)", color: "text-zinc-300", delay: 50 },
    { text: "\\ / Uptime: 147 days, 22 hours, 14 mins (SLO: 99.99% Availability confirmed)", color: "text-zinc-300", delay: 50 },
    { text: "'---' Packages: 1422 (dpkg), 12 (snap), 8 (docker), 154 (npm-global-stable)", color: "text-zinc-300", delay: 50 },
    { text: "Shell: zsh 5.9 (x86_64-pc-linux-gnu) [Theme: Powerlevel10k / Oh-My-Zsh]", color: "text-zinc-300", delay: 50 },
    { text: "Resolution: 3840x2160 (Dual 4K Setup), 1920x1080 (Remote Server Console)", color: "text-zinc-300", delay: 50 },
    { text: "CPU: Intel(R) Xeon(R) Platinum 8375C @ 2.90GHz (8 cores / 16 threads / AVX-512)", color: "text-zinc-300", delay: 50 },
    { text: "GPU: Virtual AWS Nitro Graphics Accelerator v4.2 [Backend: Vulkan/OpenGL]", color: "text-zinc-300", delay: 50 },
    { text: "", color: "text-zinc-500", delay: 2000 },
  ],
  // 3. PHP Artisan Serve (User provided)
  [
    { text: "fmargar@overlord:~$ php /var/www/api/artisan serve --port=8080 --host=0.0.0.0 --env=production --workers=4 --verbose", color: "text-zinc-400", delay: 800 },
    { text: "INFO Laravel 11.0.4 [Production] Server listening on [http_tcp://0.0.0.0:8080/v1/api].", color: "text-green-400", delay: 100 },
    { text: "DEBUG Hot Reload (HMR) for Controllers: ENABLED via Redis-Vite bridge at core-cluster-01.", color: "text-blue-400", delay: 100 },
    { text: "DEBUG Database Connection Pool: STABLE (Postgres-RDS-Cluster) | active_conns: 04 / 50", color: "text-blue-400", delay: 100 },
    { text: "", color: "text-zinc-500", delay: 2000 },
  ],
  // 4. PHP Artisan Route List (User provided)
  [
    { text: "fmargar@overlord:~$ php artisan route:list --path=api/v1 --except-vendor --columns=method,uri,name,action --sort=name", color: "text-zinc-400", delay: 800 },
    { text: "Method | URI                                    | Name                 | Action (Controller@Method Handler)", color: "text-zinc-500 font-bold", delay: 100 },
    { text: "GET    | api/v1/projects/v2/fetch-all-sorted     | api.v1.projects      | App\\Http\\Controllers\\V1\\ProjectController@index", color: "text-green-500", delay: 50 },
    { text: "POST   | api/v1/contact/submit/secure-channel    | api.v1.contact       | App\\Http\\Controllers\\V1\\ContactController@store", color: "text-green-500", delay: 50 },
    { text: "GET    | api/v1/system/dashboard/realtime-met    | api.v1.stats.realtime | App\\Http\\Controllers\\V1\\StatsController@show", color: "text-green-500", delay: 50 },
    { text: "PATCH  | api/v1/user/preferences/update-all      | api.v1.user          | App\\Http\\Controllers\\V1\\UserController@update", color: "text-green-500", delay: 50 },
    { text: "", color: "text-zinc-500", delay: 2500 },
  ],
  // 5. Docker Easter Egg
  [
    { text: "fmargar@overlord:~$ docker stats --no-stream --format \"table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}\"", color: "text-zinc-400", delay: 800 },
    { text: "NAME                CPU %               MEM USAGE / LIMIT", color: "text-zinc-500 font-bold", delay: 100 },
    { text: "portfolio-web-1     0.42%               154.2MiB / 2GiB", color: "text-green-400", delay: 100 },
    { text: "marbella-api-v2     0.15%               84.8MiB / 1GiB", color: "text-green-400", delay: 100 },
    { text: "System load: nominal. Performance optimized.", color: "text-orange-500 font-bold", delay: 2000 },
  ]
];

import { useState, useEffect, useRef } from "react";

function TerminalContent() {
  const [currentSequenceIdx, setCurrentSequenceIdx] = useState(0);
  const [currentLines, setCurrentLines] = useState<any[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the CUSTOM container ONLY, no page jumping
  useEffect(() => {
    if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentLines]);

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
      }, 3000);
      return () => clearTimeout(waitTimer);
    }
  }, [currentLineIdx, currentSequenceIdx]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      {currentLines.map((line, i) => (
        <motion.div
           key={`${currentSequenceIdx}-${i}`}
           initial={{ opacity: 0, x: -5 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.2 }}
           className={`mb-1 last:mb-0 ${line.color}`}
        >
          {line.text}
          {i === currentLines.length - 1 && currentLineIdx < sequences[currentSequenceIdx].length && (
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-4 bg-orange-500/50 inline-block align-middle ml-1"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
