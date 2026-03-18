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
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end"
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
            className="relative h-[450px] w-full max-w-2xl mx-auto lg:max-w-none group"
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
  // 1. Neofetch / System Info (Super Extended)
  [
    { text: "fmargar@overlord:~$ neofetch --ascii_distro ubuntu --cpu_temp C --memory_percent --gpu_brand on --speed_type scaling --disk_show / --ip_host github.com", color: "text-zinc-300", delay: 800 },
    { text: "       .---.        OS: Ubuntu 24.04.1 LTS x86_64 [Kernel: 6.8.0-1012-aws-generic-v3-stable-prod]", color: "text-orange-500", delay: 100 },
    { text: "      /     \\       Host: AWS EC2 m6i.2xlarge Custom-Built (Optimized for High-Throughput Node.js)", color: "text-orange-500", delay: 50 },
    { text: "      \\     /       Uptime: 147 days, 22 hours, 14 mins (SLO: 99.99% Availability confirmed)", color: "text-orange-500", delay: 50 },
    { text: "       '---'        Packages: 1422 (dpkg), 12 (snap), 8 (docker), 154 (npm-global-stable)", color: "text-orange-500", delay: 50 },
    { text: "                    Shell: zsh 5.9 (x86_64-pc-linux-gnu) [Theme: Powerlevel10k / Oh-My-Zsh]", color: "text-orange-500", delay: 50 },
    { text: "                    Resolution: 3840x2160 (Dual 4K Setup), 1920x1080 (Remote Server Console)", color: "text-orange-500", delay: 50 },
    { text: "                    CPU: Intel(R) Xeon(R) Platinum 8375C @ 2.90GHz (8 cores / 16 threads / AVX-512)", color: "text-orange-500", delay: 50 },
    { text: "                    GPU: Virtual AWS Nitro Graphics Accelerator v4.2 [Backend: Vulkan/OpenGL]", color: "text-orange-500", delay: 50 },
    { text: "                    Memory: 32.42 GiB / 64.00 GiB (Resident: 50.14% / Cache: 12.45 GiB)", color: "text-orange-500", delay: 50 },
    { text: "                    Disk (/): 142G / 500G (28%) [NVMe SSD - IOPS Optimized Path: /dev/nvme0n1p2]", color: "text-orange-500", delay: 50 },
    { text: "                    Local IP: 172.31.14.82 (eth0) | Public IP: 54.12.84.142 (AWS-Region: eu-west-1)", color: "text-orange-500", delay: 50 },
    { text: "", color: "text-zinc-500", delay: 2000 },
  ],
  // 2. Docker Status (Maximum Detail Table)
  [
    { text: "fmargar@overlord:~$ docker ps --all --format \"table {{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}\\t{{.Size}}\" --no-trunc", color: "text-zinc-300", delay: 800 },
    { text: "NAMES               IMAGE                           STATUS                          PORTS (IPV4/IPV6)                                     SIZE", color: "text-zinc-400 font-bold", delay: 200 },
    { text: "portfolio-web-1     fmargar/nextjs-prod:15.1.0-gold Up 42 days (healthy)            0.0.0.0:3000->3000/tcp, :::3000->3000/tcp             1.24 GB", color: "text-green-400", delay: 150 },
    { text: "marbella-api-v2     fmargar/laravel-api:v1.2.4-stable Up 12 days (healthy)            127.0.0.1:8080->80/tcp (internal proxy bridge)        842 MB", color: "text-green-400", delay: 150 },
    { text: "postgres-db-core    postgres:16.4-alpine-3.20      Up 147 days                     0.0.0.0:5432->5432/tcp (encrypted tunneling active)    412 MB", color: "text-green-400", delay: 150 },
    { text: "redis-cache-layer   redis:7.2.5-cluster-node-01    Up 147 days                     127.0.0.1:6379->6379/tcp (private local subnet)       124 MB", color: "text-green-400", delay: 150 },
    { text: "nginx-proxy-edge    nginx:1.27-alpine-slim-rtmp    Up 42 days                      0.0.0.0:80->80, 0.0.0.0:443->443 (HTTP/3-QUIC)         22 MB", color: "text-green-400", delay: 150 },
    { text: "uptime-kuma-mon     louislam/uptime-kuma:latest    Up 147 days (healthy)            0.0.0.0:3001->3001/tcp (SSL enabled)                  215 MB", color: "text-green-400", delay: 150 },
    { text: "", color: "text-zinc-500", delay: 2500 },
  ],
  // 3. Git Activity (Full Hashes & Decoration)
  [
    { text: "fmargar@overlord:~$ git log --graph --oneline --decorate --all --stat --max-count=5 --pretty=format:\"%C(yellow)%h%Creset %C(green)%ad%Creset %C(blue)%an%Creset %s\"", color: "text-zinc-300", delay: 800 },
    { text: "* a3b2c1d7e8f 2026-03-18 Fernando feat: integrated extreme wide-scale terminal with realistic production sequences and easter-eggs", color: "text-orange-400", delay: 200 },
    { text: "* f4e5d6c8b9a 2026-03-17 Fernando fix: optimized high-performance canvas particle system for ultra-high refresh rate desktop displays", color: "text-zinc-400", delay: 150 },
    { text: "* b1a2c3d4e5f 2026-03-16 Fernando docs: updated technical micro-architecture overview and standardized multi-cloud deployment workflows", color: "text-zinc-400", delay: 150 },
    { text: "* h8g7f6e5d4c 2026-03-15 Fernando feat: integrated full i18n multi-language support (ES/EN/DE) across all core homepage interactive sections", color: "text-zinc-400", delay: 150 },
    { text: "* k2j1i0h9g8f 2026-03-14 Fernando setup: initialized nextjs v15.1 production environment with secure vault-based environment variables", color: "text-zinc-400", delay: 150 },
    { text: "", color: "text-zinc-500", delay: 2000 },
  ],
  // 4. Build Sequence (Ultra Verbose)
  [
    { text: "fmargar@overlord:~$ npm run build:prod --verbose --environment=production --no-cache --max-workers=12 --target=linux-amd64", color: "text-zinc-300", delay: 800 },
    { text: "> portfolio-v2@0.1.0 build:prod /home/fmargar/dev/web/frontend/portfolio-suite-2026-stable", color: "text-zinc-500", delay: 200 },
    { text: "▲ Next.js 15.1.0 [Production-Grade Build Engine - Webpack 5 + Turbopack Optimized Chunks]", color: "text-zinc-300", delay: 200 },
    { text: "[1/4] Linting and type-checking all components in src/shared/components... [PASS - No warnings found]", color: "text-zinc-400", delay: 500 },
    { text: "[2/4] Transforming 482 TypeScript modules into high-performance optimized JavaScript bundles...", color: "text-zinc-400", delay: 500 },
    { text: "✔ Bundling completed successfully in 12.4s. Mean bundle size: 42.8 kB. Total JS transform: 8.42 MB.", color: "text-green-400", delay: 1000 },
    { text: "[3/4] Collecting static page data for metadata-driven optimization... [========================] 100%", color: "text-zinc-500", delay: 800 },
    { text: "[4/4] Finalizing localized static site generation (ES/EN/DE) (42 dynamic routes) ... [Success]", color: "text-zinc-500", delay: 800 },
    { text: "Route (app router)                       Size (Gzipped)      First Load JS (Shared)      Status", color: "text-zinc-400 underline", delay: 200 },
    { text: "├ ○ / (Home Landing Page)               124.52 kB           84.21 kB (LCP: 0.8s)        [Optimized]", color: "text-zinc-500", delay: 100 },
    { text: "├ ○ /experience (Career Timeline)       82.16 kB            76.48 kB (FCP: 1.2s)        [Optimized]", color: "text-zinc-500", delay: 100 },
    { text: "└ ○ /projects/[slug] (Dynamic)          12.42 kB            88.14 kB (Static-ISR)       [Optimized]", color: "text-zinc-500", delay: 100 },
    { text: "Production-ready build artifacts generated in 14.2s. Deploying to edge cache nodes... ✨", color: "text-orange-400 font-bold", delay: 3000 },
  ],
  // 5. Laravel / Artisan (Extreme Detail)
  [
    { text: "fmargar@overlord:~$ php /var/www/api/artisan serve --port=8080 --host=0.0.0.0 --env=production --workers=4 --verbose", color: "text-zinc-300", delay: 800 },
    { text: "   INFO  Laravel 11.0.4 [Production] Server listening on [http_tcp://0.0.0.0:8080/v1/api].", color: "text-zinc-400", delay: 400 },
    { text: "   DEBUG Hot Reload (HMR) for Controllers: ENABLED via Redis-Vite bridge at core-cluster-01.", color: "text-zinc-500", delay: 300 },
    { text: "   DEBUG Database Connection Pool: STABLE (Postgres-RDS-Cluster) | active_conns: 04 / 50", color: "text-zinc-500", delay: 200 },
    { text: "", color: "text-zinc-300", delay: 1000 },
    { text: "fmargar@overlord:~$ php artisan route:list --path=api/v1 --except-vendor --columns=method,uri,name,action --sort=name", color: "text-zinc-300", delay: 800 },
    { text: "  Method | URI                                  | Name                   | Action (Controller@Method Handler)", color: "text-zinc-400 font-bold", delay: 200 },
    { text: "  GET    | api/v1/projects/v2/fetch-all-sorted  | api.v1.projects.index   | App\\Http\\Controllers\\V1\\ProjectController@index", color: "text-zinc-500", delay: 150 },
    { text: "  POST   | api/v1/contact/submit/secure-channel | api.v1.contact.store    | App\\Http\\Controllers\\V1\\ContactController@store", color: "text-zinc-500", delay: 150 },
    { text: "  GET    | api/v1/system/dashboard/realtime-met | api.v1.stats.realtime   | App\\Http\\Controllers\\V1\\StatsController@show", color: "text-zinc-500", delay: 150 },
    { text: "  PATCH  | api/v1/user/preferences/update-all   | api.v1.user.update      | App\\Http\\Controllers\\V1\\UserController@update", color: "text-zinc-500", delay: 150 },
    { text: "", color: "text-zinc-500", delay: 2500 },
  ],
  // 6. Security (Deep System Audit)
  [
    { text: "fmargar@overlord:~$ sudo /usr/local/bin/security-scanner --deep-scan --all-ports --log-path=/var/log/sysmonitor/audit.log", color: "text-zinc-300", delay: 800 },
    { text: "[*] Initializing deep production-grade security audit on high-priority interface: eth0 (vNIC: AWS-X-Nitro)...", color: "text-orange-500", delay: 400 },
    { text: "[+] Firewall status: ACTIVE & ENFORCED (iptables v1.8.8 & ufw v0.36 configured with zero-trust policies)", color: "text-green-500", delay: 200 },
    { text: "[+] SSL/TLS Integrity: VALID (fmargar.dev valid for 89 days, ECC-384 cipher suite: TLS_AES_256_GCM_SHA384)", color: "text-green-500", delay: 200 },
    { text: "[!] Scanning 65,535 TCP/UDP ports for unauthorized services and ghost listeners... [STATUS: 100% SECURE]", color: "text-yellow-500", delay: 600 },
    { text: "[OK] Verified SHA-256 integrity for 42,184 system files. No unauthorized modifications detected in /usr/bin.", color: "text-green-400 font-bold", delay: 1000 },
    { text: "[FINISH] Global Security Audit completed. System production environment is verified stable, secure, and ready.", color: "text-orange-400", delay: 2500 },
  ],
  // 7. Matrix Easter Egg (Cryptic Philosophy)
  [
    { text: "fmargar@overlord:~$ ssh -i ~/.ssh/oracle_key_ed25519 neo@the-matrix.system --secure-tunnel-mode --terminal-type=void", color: "text-zinc-300", delay: 1200 },
    { text: "Connecting to the-matrix.system [IP: 00.00.00.01]. Digital handshake completed. Decrypting reality...", color: "text-zinc-500", delay: 400 },
    { text: "Wake up, Fernando... The world you perceive is a binary construct of your own imagination and code.", color: "text-green-500 font-bold", delay: 1500 },
    { text: "The Matrix is a system, Fernando. That system is our enemy. But within it, you are the root user.", color: "text-green-500 font-bold", delay: 1000 },
    { text: "Follow the white rabbit through the deep-link in src/components/interactive/Terminal.tsx.🐇", color: "text-green-500 font-bold", delay: 1000 },
    { text: "Knock, knock, Fernando. I'm hot-patching your kernel with pure consciousness. Don't look back.", color: "text-green-500 font-bold", delay: 1500 },
    { text: "Connection terminated by The Oracle at 127.0.0.1:0000. Error Code: [REALITY_BREACH_DETECTED]", color: "text-red-500/70", delay: 2000 },
  ],
  // 8. Star Wars Easter Egg (Vader's Command)
  [
    { text: "fmargar@overlord:~$ mount /dev/sdn1 /mnt/death_star --user=vader --read-only --mount-id=99 --uuid=eb-01-f0", color: "text-zinc-300", delay: 800 },
    { text: "fmargar@overlord:~$ find /mnt/death_star/blueprints/top_secret/exhaust_port/ -name \"*layout*\" -ls", color: "text-zinc-300", delay: 800 },
    { text: "42104  1.2G drwxr-xr-x 2 vader empire  Mar 18 12:45 . (Restricted by High Imperial Command)", color: "text-zinc-500", delay: 100 },
    { text: "42105  8.4G -rw-r--r-- 1 vader empire  Mar 18 12:45 thermal_exhaust_port_v2_final_final.cad", color: "text-zinc-500", delay: 100 },
    { text: "[!] EMERGENCY ALERT: Unauthorized data transmission detected to hidden relay station at Yavin IV!", color: "text-red-500 font-bold", delay: 600 },
    { text: "[!] Grand Moff Tarkin initiated global system wipe... Purging history logs and cache buffers... Done.", color: "text-red-500", delay: 1000 },
    { text: "May the Source be with you, Fernando. Never underestimate the power of a well-documented API. ⚔️", color: "text-orange-400 font-bold", delay: 3000 },
  ],
  // 9. Kubernetes / DevOps (Production Inventory)
  [
    { text: "fmargar@overlord:~$ kubectl get pods --all-namespaces -l app.kubernetes.io/managed-by=fmargar-deploy-engine", color: "text-zinc-300", delay: 800 },
    { text: "NAMESPACE     NAME                                                READY   STATUS    RESTARTS   AGE (HRS)", color: "text-zinc-400 font-bold", delay: 200 },
    { text: "prod-euro-1   frontend-nextjs-v15-deployment-node-7f4c5b9d-2k8s   1/1     Running   0          1008h", color: "text-green-400", delay: 150 },
    { text: "prod-euro-1   api-laravel-v8-backend-service-pool-5d2f6g1h-3l9m   1/1     Running   1          288h", color: "text-green-400", delay: 150 },
    { text: "core-shared   postgres-main-auth-service-v2-active-4h3k2l1m-5n0   1/1     Running   0          3528h", color: "text-green-400", delay: 150 },
    { text: "monitoring    prometheus-grafana-metrics-collector-2j1i3k4l-6o8   1/1     Running   0          3528h", color: "text-green-400", delay: 150 },
    { text: "edge-proxy    nginx-ingress-controller-traefik-gold-5f1d4s2a-8h   1/1     Running   0          1008h", color: "text-green-400", delay: 150 },
    { text: "", color: "text-zinc-500", delay: 2000 },
  ],
  // 10. Coffee / Productivity (Technical Brew)
  [
    { text: "fmargar@overlord:~$ brew-coffee --type=double-espresso --strength=extreme --beans=\"Colombian Dark Roast / Single Origin\"", color: "text-zinc-300", delay: 800 },
    { text: "[*] Calibrating water-to-bean ratio (1:2.1 ratio) for maximum cognitive throughput and focus...", color: "text-zinc-400", delay: 400 },
    { text: "[*] Precision grinding 18.50g of high-altitude beans using titanium flat burrs... 100% [Done]", color: "text-zinc-400", delay: 400 },
    { text: "[*] PUCK PREP: Leveling, distribution, and 30lb calibrated tamping completed successfully.", color: "text-zinc-400", delay: 300 },
    { text: "[*] Extraction: 9.2 bars of pressure at 93.5°C [PID Stability: ±0.1°C]... 100% [Done - 36g out]", color: "text-zinc-400", delay: 600 },
    { text: "☕ Double Espresso is ready! Enjoy the biological caffeine boost for Fernando Margar's mind.", color: "text-orange-400 font-bold", delay: 1000 },
    { text: "➜ Biological Neuro-Energy levels restored to 125%. High-performance coding state: ENABLED.", color: "text-green-400", delay: 500 },
    { text: "➜ Neural-Subsystem synchronized. Ready to architect and build the next global industry disruptor.", color: "text-zinc-300", delay: 3000 },
  ],
  // 11. Advanced Vite Build (Deep Paths)
  [
    { text: "fmargar@overlord:~/dev/web/clients/interactive/fmargar-multiverse$ vite build --mode production --minify esbuild --emptyOutDir", color: "text-zinc-300", delay: 800 },
    { text: "vite v6.1.0 building for production target: [ESNext / Chrome 120 / Safari 17] ...", color: "text-zinc-400", delay: 400 },
    { text: "✓ 482 modules transformed, tree-shaken, and optimized via multi-threaded Rollup internal bridge.", color: "text-green-400 font-bold", delay: 1200 },
    { text: "dist/index.html (HTML5 SEO Optimized)                       0.45 kB │ gzip:  0.28 kB", color: "text-zinc-400", delay: 200 },
    { text: "dist/assets/main-logic-bundle-D7b4a2.js (App Core)          142.12 kB │ gzip: 44.50 kB", color: "text-zinc-400", delay: 150 },
    { text: "dist/assets/interactive-terminal-C5f2d1.js (UI Logic)        58.42 kB │ gzip: 14.12 kB", color: "text-zinc-400", delay: 150 },
    { text: "dist/assets/global-styles-neon-B9c1d0.css (CSS Variables)    24.40 kB │ gzip:  6.12 kB", color: "text-zinc-400", delay: 150 },
    { text: "✓ build success in 2.84s. Dist folder prepared for zero-downtime deployment to AWS-S3/CloudFront.", color: "text-green-400 font-bold", delay: 3000 },
  ],
  // 12. Redis Monitor (Cluster Log)
  [
    { text: "fmargar@overlord:~$ redis-cli -h cluster-01.internal -p 6379 -a ********** monitor | grep --line-buffered \"id:\"", color: "text-zinc-300", delay: 800 },
    { text: "OK - Real-time monitoring started across 3 master nodes and 6 slave replicas (Cluster Mode: ACTIVE)", color: "text-green-500", delay: 200 },
    { text: "1710756.14 [db0 10.0.4.12] \"GET\" \"fmargar:portfolio:v2:user:session:auth_token_secret_vault_id\"", color: "text-zinc-500", delay: 400 },
    { text: "1710756.16 [db0 10.0.4.15] \"SETEX\" \"cache:home:projects:v2:localized:es\" \"3600\" \"{json_payload_data...}\"", color: "text-zinc-400", delay: 500 },
    { text: "1710756.18 [db0 10.0.4.15] \"EXPIRE\" \"cache:home:projects:v2:localized:es\" \"3600\" [Result: 1 (Success)]", color: "text-zinc-500", delay: 300 },
    { text: "1710756.22 [db0 10.0.4.22] \"HINCRBY\" \"fmargar:stats:analytics:cumulative_views\" \"id:home_v2\" \"1\"", color: "text-orange-400", delay: 600 },
    { text: "^C (Manual process interrupt signal received. Shutting down monitor bridge gracefully...)", color: "text-zinc-300", delay: 1500 },
  ],
  // 13. SQL Query (Rich Output Table)
  [
    { text: 'fmargar@overlord:~$ psql -h db-cluster.aws.internal -U fmargar_admin -d production_db -c \"SELECT id, slug, status, build_date FROM active_projects;\"', color: "text-zinc-300", delay: 1000 },
    { text: " id  |      project_slug_id       |     deployment_status    | build_date_utc | server_region  ", color: "text-zinc-400 font-bold", delay: 300 },
    { text: "-----+----------------------------+--------------------------+----------------+----------------", color: "text-zinc-500", delay: 100 },
    { text: "  01 | portfolio-site-v2-stable   | ACTIVE / HEALTHY / LIVE  | 2026-03-18     | eu-west-1a     ", color: "text-zinc-400", delay: 200 },
    { text: "  02 | marbella-facil-edge-api   | DEPLOYED / STABLE / LIVE | 2026-03-12     | eu-central-1b  ", color: "text-zinc-400", delay: 200 },
    { text: "  03 | overlord-server-suite-dev  | BUILDING / TEST / CI     | 2026-03-15     | us-east-1      ", color: "text-zinc-400", delay: 200 },
    { text: "(3 rows returned in 2.42ms). Connection to Postgres-RDS-Multi-AZ-Cluster closed successfully.", color: "text-zinc-500", delay: 2500 },
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
