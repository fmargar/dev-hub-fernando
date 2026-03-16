"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useDragControls } from "framer-motion";

export function BB8Companion() {
    const controls = useAnimation();
    const dragControls = useDragControls();
    const [isIdle, setIsIdle] = useState(true);
    const [hasEntered, setHasEntered] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [isVisible, setIsVisible] = useState(false);
    const [isReturning, setIsReturning] = useState(false);

    // 1. Initial Listeners
    useEffect(() => {
        const handleSummon = async () => {
            setHasEntered(false); // Reset to block idle animations
            setIsVisible(true);
            setIsReturning(false);
            
            // CRITICAL: Reset position and clear any lingering drag offsets
            // We use y: 0 to ensure it's horizontal along its fixed bottom container
            controls.set({ x: -400, y: 0, rotate: -820, opacity: 1 });
            
            // Wait for state and CSS visibility to synchronize
            await new Promise(resolve => setTimeout(resolve, 60));
            
            // Execute smooth entrance roll (Synchronized x and rotate)
            await controls.start({
                x: 0,
                rotate: 0,
                transition: { 
                    duration: 1.5,
                    ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier for a natural roll
                }
            });
            
            setHasEntered(true);
        };

        window.addEventListener("summon-bb8", handleSummon);
        return () => window.removeEventListener("summon-bb8", handleSummon);
    }, [controls]);

    // 2. BB-8 Idle Animations
    useEffect(() => {
        if (!isVisible || !hasEntered || !isIdle || isReturning) return;
        
        let timeout: NodeJS.Timeout;
        const triggerRandomAnimation = async () => {
            const randomAction = Math.random();
            if (randomAction > 0.7) {
                await controls.start({ rotate: [0, -15, 15, 0], transition: { duration: 1.5, ease: "easeInOut" }});
            } else if (randomAction > 0.4) {
                await controls.start({ y: [0, -10, 0, -5, 0], transition: { duration: 0.6, ease: "easeOut" }});
            } else {
                await controls.start({ rotate: [0, 5, 0], transition: { duration: 1, ease: "easeInOut" }});
            }
            timeout = setTimeout(triggerRandomAnimation, Math.random() * 5000 + 3000);
        };
        triggerRandomAnimation();
        return () => clearTimeout(timeout);
    }, [isVisible, hasEntered, isIdle, isReturning, controls]);

    const handleDragStart = () => {
        setIsIdle(false);
        controls.start({ scale: 1.1, rotate: 10 });
    };

    const handleDragEnd = (event: any, info: any) => {
        setIsIdle(true);
        controls.start({ scale: 1, rotate: 0 });

        // Logic to check if dragged back to Top-Left corner (Return to Navbar)
        // info.point.x and info.point.y are absolute viewport coordinates
        const isNearTopLeft = info.point.x < 150 && info.point.y < 150;

        if (isNearTopLeft) {
            setIsReturning(true);
            // Roll away horizontally off screen (synchronize x and rotate)
            controls.start({
                x: -400,
                rotate: -820,
                opacity: 0,
                transition: { duration: 0.8, ease: "easeIn" }
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
                pointerEvents: isVisible ? "auto" : "none" 
            }}
            className="fixed bottom-10 left-10 z-[100] cursor-grab active:cursor-grabbing group touch-none"
            title="¡Arrastrame de vuelta arriba para devolverme al logo!"
        >
            <div className="relative w-16 h-24 filter drop-shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all duration-300 group-hover:drop-shadow-[0_0_25px_rgba(249,115,22,0.8)]">
                {/* Antennas */}
                <div className="absolute top-0 left-1/2 -translate-x-[60%] w-[1.5px] h-4 bg-zinc-300 rounded-t-full origin-bottom" />
                <div className="absolute top-1 left-1/2 -translate-x-[20%] w-[1px] h-3 bg-zinc-400 rounded-t-full origin-bottom" />

                {/* Head (Dome) */}
                <motion.div 
                    className="absolute top-3 left-1/2 -translate-x-1/2 w-[44px] h-[24px] bg-white rounded-t-full border-[1.5px] border-zinc-300 shadow-inner overflow-hidden z-20"
                    animate={{ rotate: isIdle ? 0 : [0, -5, 5, 0] }}
                    transition={{ repeat: isIdle ? 0 : Infinity, duration: 2 }}
                >
                    {/* Orange Stripes Dome */}
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-orange-500" />
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-full h-[6px] bg-zinc-200 border-y border-zinc-300" />
                    
                    {/* Main Eye (Photoreceptor) */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-[60%] w-[12px] h-[12px] bg-zinc-900 rounded-full border-[1.5px] border-zinc-400 flex items-center justify-center">
                        <div className="w-[3px] h-[3px] bg-red-500 rounded-full shadow-[0_0_4px_#ef4444]" />
                    </div>
                </motion.div>

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
            
            {/* Hologram/Force interaction hint pulse */}
            <motion.div 
                className="absolute inset-x-0 -bottom-4 h-2 bg-orange-500/30 blur-[6px] rounded-full mx-auto w-10"
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
            />
        </motion.div>
    );
}
