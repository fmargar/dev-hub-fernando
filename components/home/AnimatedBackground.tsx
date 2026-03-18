"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false }); // Optimization for background
    if (!ctx) return;

    let animationId: number;
    let mouseX = -9999;
    let mouseY = -9999;

    // Device detection for performance scaling
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 45 : 110;
    const CONNECTION_DISTANCE = isMobile ? 90 : 130;
    const MOUSE_RADIUS = isMobile ? 100 : 180;

    const colors = [
      "rgba(249, 115, 22,",   // orange-500
      "rgba(251, 146, 60,",   // orange-400
      "rgba(234, 88, 12,",    // orange-600
      "rgba(168, 85, 247,",   // purple-500
      "rgba(192, 132, 252,",  // purple-400
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const particles: Particle[] = [];

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
          vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
          size: Math.random() * (isMobile ? 1.5 : 2.5) + 1,
          alpha: Math.random() * 0.6 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const bgColor = typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--background') : '#000';

    const animate = () => {
      // Background fill instead of clear for better perf 
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections - Expensive O(n^2) operation, DISABLED ON MOBILE
      if (!isMobile) {
        ctx.lineWidth = 0.8;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            
            // Quick distance check before sqrt
            if (Math.abs(dx) < CONNECTION_DISTANCE && Math.abs(dy) < CONNECTION_DISTANCE) {
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < CONNECTION_DISTANCE) {
                const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(249, 115, 22, ${opacity})`;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
              }
            }
          }
        }
      }

      // Update and draw particles
      for (const p of particles) {
        // Mouse interaction
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distSq = dx * dx + dy * dy;

        if (distSq < MOUSE_RADIUS * MOUSE_RADIUS) {
          const dist = Math.sqrt(distSq);
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.vx += (dx / dist) * force * 0.08;
          p.vy += (dy / dist) * force * 0.08;
        }

        // Velocity dampening
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));

        // Draw particle 
        if (!isMobile) {
            // High quality radial gradients for desktop
            const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
            grd.addColorStop(0, `${p.color}${p.alpha})`);
            grd.addColorStop(1, `${p.color}0)`);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      }

      // Mouse glow effect (Desktop only)
      if (!isMobile && mouseX > 0 && mouseX < canvas.width) {
        const mouseGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 120);
        mouseGlow.addColorStop(0, "rgba(249, 115, 22, 0.04)");
        mouseGlow.addColorStop(1, "rgba(249, 115, 22, 0)");
        ctx.fillStyle = mouseGlow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    const handleResize = () => {
      resize();
      initParticles();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
