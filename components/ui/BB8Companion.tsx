"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useDragControls, useMotionValue, useSpring } from "framer-motion";

export function BB8Companion() {
    const controls = useAnimation();
    const dragControls = useDragControls();
    const [isIdle, setIsIdle] = useState(true);
    const [hasEntered, setHasEntered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isVisible, setIsVisible] = useState(false);
    const [isReturning, setIsReturning] = useState(false);

    // Helper for robust coordinate extraction across browsers/devices
    const getClientCoords = (e: any, info: any) => {
        if (e.clientX !== undefined) return { x: e.clientX, y: e.clientY };
        if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        return { x: info.point.x, y: info.point.y };
    };

    // Mouse/Pointer tracking for the eye
    const eyeX = useMotionValue(0);
    const eyeY = useMotionValue(0);
    // Smoother spring config for more natural look
    const springConfig = { damping: 25, stiffness: 120 };
    const springX = useSpring(eyeX, springConfig);
    const springY = useSpring(eyeY, springConfig);

    useEffect(() => {
        if (!isVisible || isReturning) {
            eyeX.set(0);
            eyeY.set(0);
            return;
        }

        let rafId: number;
        const handleInteraction = (e: MouseEvent | PointerEvent) => {
            if (rafId) cancelAnimationFrame(rafId);
            
            rafId = requestAnimationFrame(() => {
                const container = containerRef.current;
                if (!container) return;

                const rect = container.getBoundingClientRect();
                if (rect.width === 0) return;

                // Center point of the head relative to viewport
                const headCenterX = rect.left + (rect.width / 2);
                const headCenterY = rect.top + 32;

                const coords = getClientCoords(e, { point: { x: (e as any).clientX, y: (e as any).clientY } });
                const dx = coords.x - headCenterX;
                const dy = coords.y - headCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Max movement range within the socket (clamped to avoid disappearing)
                // Socket is ~10px inner, dot is 3px. Max radius is ~3.5px.
                const limit = 3.5; 

                if (distance > 1) {
                    // Re-introducing a subtle distance scaling so it's not always at the edge
                    const strength = Math.min(distance / 250, 1);
                    eyeX.set((dx / distance) * strength * limit);
                    eyeY.set((dy / distance) * strength * limit);
                } else {
                    eyeX.set(0);
                    eyeY.set(0);
                }
            });
        };

        window.addEventListener("pointermove", handleInteraction, { passive: true });
        window.addEventListener("mousemove", handleInteraction, { passive: true });
        
        return () => {
            window.removeEventListener("pointermove", handleInteraction);
            window.removeEventListener("mousemove", handleInteraction);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [isVisible, isReturning, eyeX, eyeY, springX, springY]);

    // 1. Initial Listeners
    useEffect(() => {
        const handleSummon = async () => {
            setHasEntered(false);
            setIsVisible(true);
            setIsReturning(false);

            // Force initial position and clear any previous state
            controls.set({ x: -500, y: 0, rotate: -1020, opacity: 1, scale: 1 });

            // Small delay to ensure browser acknowledges the set
            await new Promise(resolve => setTimeout(resolve, 100));

            await controls.start({
                x: 0,
                y: 0,
                rotate: 0,
                transition: { duration: 1.8, ease: "easeOut" }
            });

            setHasEntered(true);
        };

        window.addEventListener("summon-bb8", handleSummon);
        return () => window.removeEventListener("summon-bb8", handleSummon);
    }, [controls]);

    // 2. BB-8 Idle Animations (Heads up/down/rotate)
    const [idleJump, setIdleJump] = useState(0);

    useEffect(() => {
        if (!isVisible || !hasEntered || !isIdle || isReturning) return;

        let timeout: NodeJS.Timeout;
        const triggerRandomAnimation = async () => {
            const randomAction = Math.random();
            if (randomAction > 0.7) {
                // Head rotation only
                await controls.start({ rotate: [0, -15, 15, 0], transition: { duration: 1.5, ease: "easeInOut" } });
            } else if (randomAction > 0.4) {
                // Precise jump using local state so we don't overwrite main x/y position
                setIdleJump(-10);
                setTimeout(() => setIdleJump(0), 100);
                setTimeout(() => setIdleJump(-5), 200);
                setTimeout(() => setIdleJump(0), 300);
            } else {
                await controls.start({ rotate: [0, 5, 0], transition: { duration: 1, ease: "easeInOut" } });
            }
            timeout = setTimeout(triggerRandomAnimation, Math.random() * 5000 + 3000);
        };
        triggerRandomAnimation();
        return () => clearTimeout(timeout);
    }, [isVisible, hasEntered, isIdle, isReturning, controls]);

    const handleDragStart = () => {
        setIsIdle(false);
        controls.start({ scale: 1.1 });
    };

    const handleDragEnd = (event: any, info: any) => {
        setIsIdle(true);
        controls.start({ scale: 1 });

        const coords = getClientCoords(event, info);
        // Scroll-aware capture: check if point is near top-left of viewport
        const isNearTopLeft = coords.x < 150 && coords.y < 150;

        if (isNearTopLeft) {
            setIsReturning(true);
            controls.start({
                x: -500,
                rotate: -1020,
                opacity: 0,
                transition: { duration: 1, ease: "easeIn" }
            }).then(() => {
                setIsVisible(false);
                setIsReturning(false);
                setHasEntered(false);
                window.dispatchEvent(new CustomEvent("restore-bb8-logo"));
            });
        }
    };

    return (
        <motion.div
            ref={containerRef}
            drag
            dragControls={dragControls}
            dragElastic={0.1}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={controls}
            style={{
                visibility: isVisible ? "visible" : "hidden",
                pointerEvents: isVisible ? "auto" : "none",
                zIndex: 100
            }}
            className="fixed bottom-10 left-10 cursor-grab active:cursor-grabbing group touch-none"
            title="¡Arrastrame al logo para devolverme!"
        >
            {/* Inner wrapper for jumps to preserve dragged position */}
            <motion.div 
                animate={{ y: idleJump }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
            >
                <div className="relative w-16 h-24 filter drop-shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all duration-300 group-hover:drop-shadow-[0_0_25px_rgba(249,115,22,0.8)]">
                    {/* Antennas */}
                    <div className="absolute top-0 left-1/2 -translate-x-[60%] w-[1.5px] h-4 bg-zinc-300 rounded-t-full origin-bottom" />
                    <div className="absolute top-1 left-1/2 -translate-x-[20%] w-[1px] h-3 bg-zinc-400 rounded-t-full origin-bottom" />

                    {/* Head (Dome) */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[44px] h-[24px] bg-white rounded-t-full border-[1.5px] border-zinc-300 shadow-inner overflow-hidden z-20">
                        {/* Orange Stripes Dome */}
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-orange-500" />
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-full h-[6px] bg-zinc-200 border-y border-zinc-300" />

                        {/* Main Eye (Photoreceptor) */}
                        <div className="absolute top-2.5 left-1/2 -translate-x-[60%] w-[12px] h-[12px] bg-zinc-900 rounded-full border-[1.5px] border-zinc-400 flex items-center justify-center overflow-hidden">
                            <motion.div 
                                style={{ x: springX, y: springY }}
                                className="w-[3px] h-[3px] bg-red-500 rounded-full shadow-[0_0_6px_#ef4444]" 
                            />
                        </div>
                    </div>

                    {/* Neck Joint */}
                    <div className="absolute top-[26px] left-1/2 -translate-x-1/2 w-[34px] h-[4px] bg-zinc-400 rounded-full z-10" />

                    {/* Body (Sphere) */}
                    <motion.div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[56px] h-[56px] bg-white rounded-full border-[1.5px] border-zinc-300 overflow-hidden shadow-[inset_-6px_-6px_12px_rgba(0,0,0,0.1)] z-0"
                        animate={{ rotate: isIdle ? 0 : 360 }}
                        transition={{ repeat: isIdle ? 0 : Infinity, duration: 1.5, ease: "linear" }}
                    >
                        {/* Orange Circles Pattern */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36px] h-[36px] border-[5px] border-orange-500 rounded-full flex items-center justify-center">
                            <div className="w-[14px] h-[14px] bg-zinc-300 rounded-full border border-zinc-400" />
                        </div>
                        {/* Panel lines */}
                        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-zinc-200" />
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-200" />
                    </motion.div>
                </div>
                
                {/* Visual indicator pulse */}
                <motion.div
                    className="absolute inset-x-0 -bottom-4 h-2 bg-orange-500/30 blur-[6px] rounded-full mx-auto w-10"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                />
            </motion.div>
        </motion.div>
    );
}
