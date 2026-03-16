"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Code2, Github, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "/projects", label: "Showcase" },
        { href: "/stack", label: "Stack" },
        { href: "/experience", label: "Experiencia" },
        { href: "/tools", label: "Laboratorio" },
        { href: "/contact", label: "Contacto" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md bg-background/80">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
                {/* Logo Section */}
                <div className="flex-1 flex justify-start">
                    <Link href="/" className="flex items-center space-x-2">
                        <motion.div
                            initial={{ rotate: -15, scale: 0.9 }}
                            animate={{ rotate: 0, scale: 1 }}
                            className="mr-2 text-foreground"
                        >
                            <svg 
                                viewBox="0 0 2000 2000" 
                                className="h-8 w-8 transition-transform duration-300 group-hover:scale-110"
                                fill="currentColor"
                            >
                                <g>
                                    <ellipse transform="matrix(0.7071 -0.7071 0.7071 0.7071 -865.519 1133.8813)" cx="936" cy="1611.7" rx="28.5" ry="28.5"/><ellipse transform="matrix(0.7071 -0.7071 0.7071 0.7071 -948.479 1334.1227)" cx="1136.2" cy="1812" rx="28.5" ry="28.5"/><ellipse transform="matrix(0.9659 -0.2588 0.2588 0.9659 -374.1621 213.2589)" cx="622.9" cy="1527.7" rx="28.5" ry="28.5"/><ellipse transform="matrix(0.2588 -0.9659 0.9659 0.2588 -305.4015 1651.5352)" cx="923.4" cy="1024.8" rx="28.5" ry="28.5"/><ellipse transform="matrix(0.2588 -0.9659 0.9659 0.2588 -624 1783.5198)" cx="850.2" cy="1298.4" rx="28.5" ry="28.5"/><ellipse transform="matrix(0.9659 -0.2588 0.2588 0.9659 -167.2373 325.5316)" cx="1152.8" cy="797.9" rx="28.5" ry="28.5"/><path d="M1001,547.5c63.2,0,114.7-51.4,114.7-114.7s-51.4-114.7-114.7-114.7c-63.2,0-114.7,51.4-114.7,114.7 S937.8,547.5,1001,547.5z M1001,376.6c31,0,56.3,25.3,56.3,56.3s-25.3,56.3-56.3,56.3c-31,0-56.3-25.3-56.3-56.3 C944.7,401.8,970,376.6,1001,376.6z"/><circle cx="1223.3" cy="501.2" r="28.5"/><path d="M1522.2,921c-28.7-35.9-61.4-69-97-98.3c-28.5-23.5-59-44.6-90.9-63.1h32.6c6.6,0,12.9-3,17-8.2l75.8-94.7 c3.1-3.9,4.8-8.6,4.8-13.6v-5c0-255.5-207.9-463.4-463.4-463.4c-6.5,0-13.1,0.1-20.2,0.4V38.2c0-0.4,0-0.7,0-1c0-0.3,0-0.7,0-1 c0-19.9-16.2-36.1-36.1-36.1s-36.1,16.2-36.1,36.1c0,0.4,0,0.7,0,1c0,0.3,0,0.7,0,1v145.7c-13.3,2.7-26.8,6-40.2,10.1v-43.4 c0-0.2,0-0.4,0-0.6c0-0.2,0-0.4,0-0.6c0-19.9-16.2-36.1-36.1-36.1s-36.1,16.2-36.1,36.1c0,0.2,0,0.4,0,0.6c0,0.2,0,0.4,0,0.6v71.7 c-75.8,37.4-139.9,94.8-185.7,166.1c-47.8,74.5-73.1,160.9-73.1,249.6v5c0,4.9,1.7,9.7,4.8,13.6l75.8,94.7c4.1,5.2,10.4,8.2,17,8.2 h30.7c-31.9,18.5-62.4,39.6-90.9,63.1c-35.7,29.4-68.3,62.5-97,98.3c-94.3,117.8-146.3,266.1-146.3,417.5 c0,368.6,299.9,668.5,668.5,668.5s668.5-299.9,668.5-668.5C1668.5,1187,1616.5,1038.8,1522.2,921z M1381,879.6 c-7,1-14.2,2.1-21.3,3.4l-6.8-25.3C1362.3,864.7,1371.7,872,1381,879.6z M659.4,687.4L635,657h129.8c0,0,0,0,0,0 c19.9,0,36.1-16.2,36.1-36.1s-16.2-36.1-36.1-36.1H613.3C625.8,493.3,670.6,409,740,346.7c71.9-64.5,164.6-100,261-100 s189.1,35.5,261,100c69.4,62.2,114.2,146.6,126.7,238.1h-498v0c-19.9,0-36,16.2-36,36.1c0,19.9,16.1,36,36,36.1v0h0.1c0,0,0,0,0,0 s0,0,0,0H1367l-24.3,30.4H659.4z M721.9,810.8c42.7-22.6,87.8-39.9,134.2-51.3h287.6c0.4,0.1,0.7,0.2,1.1,0.3 c41.1,10.3,81,24.9,118.8,43.6l26.5,98.3c-59.4,21.6-114.2,56.5-158.9,101.2c-23.5,23.5-44.2,49.5-61.6,77.4 c-16.1,25.8-29.5,53.3-39.9,81.9L766,1091.4C783,995.2,767.5,896.1,721.9,810.8z M506.1,1003.9c3.3,47.9-14.3,95.3-48.6,129.7 c-7.7,7.7-16.1,14.6-25.1,20.7C449.5,1101.1,474.3,1050.7,506.1,1003.9z M403.5,1338.5c0-31.6,2.5-63.4,7.3-94.7 c36.7-11.5,70.4-31.9,97.5-59.1c66.4-66.4,87.8-165.1,55.1-252.7c29.4-31.4,61.9-59.4,96.8-83.6c16.8,32.3,28.6,67,35,103.1 c6.7,37.8,7.3,76.3,2,114.5c-5.4,38.3-16.7,75.2-33.7,109.8c-17.4,35.5-40.5,67.7-68.4,95.6c-45.1,45.1-101.2,77.5-162.4,93.8 c-9.4,2.5-18.8,4.6-28.1,6.2C403.8,1360.2,403.5,1349.3,403.5,1338.5z M450.2,1569.6c-0.1-0.3-0.3-0.7-0.4-1c0,0,0-0.1,0-0.1 c0,0,0,0,0-0.1c-16.9-40.2-29.2-82.2-36.9-125.4c1.1-0.2,2.1-0.4,3.2-0.6h3.6l37.2,138.4c0,0-4.3-6.3-6.7-11.5L450.2,1569.6z  M485.7,1424c28.9-10.3,56.7-23.8,82.9-40.1c28-17.5,54.1-38.2,77.5-61.6c23.7-23.7,44.6-50.1,62.1-78.7 c15.9-25.9,29.2-53.7,39.4-82.5L1011,1232c-4.6,25.8-7,51.9-7,77.9c0,52.7,9.3,104,27.5,152.7c17.5,46.6,42.7,89.5,75.1,127.6 L914.9,1782c-38.4-32.6-81.6-58-128.5-75.6c-48.4-18.1-99.2-27.3-151-27.3c-26.4,0-53,2.4-79.2,7.3L485.7,1424z M742.9,1876.5 c-62.7-30.1-119.2-70.5-168.1-120.2c20-3.4,40.4-5.1,60.6-5.1c0,0,0,0,0,0c47.2,0,93.3,9.1,136.9,27.1 c44.2,18.2,84,44.8,118.2,79.1c22.4,22.3,41.8,47.6,57.7,75.2C876.6,1926.4,807.6,1907.6,742.9,1876.5z M1361.3,1812.6 c-31.5,24.1-65.5,45-100.9,62.3c-36.1,17.6-74.1,31.5-112.9,41.5c-38.3,9.8-77.8,15.7-117.5,17.7c-16.5-36.5-38.1-70.5-64.1-101.1 l191.9-191.9c78.1,66.2,176.9,102.6,279.2,102.7C1413.8,1768.9,1388.4,1792,1361.3,1812.6z M1497.7,1666.8c-19.8,3.3-40,5-59.9,5 c-47.5,0-93.8-9.2-137.6-27.3c-44.2-18.2-83.9-44.8-117.9-78.8c-68.4-68.4-106-159.3-106-255.9s37.6-187.6,106-255.9 c44.7-44.7,100.4-77,161.1-93.4c30.7-8.3,62.5-12.5,94.5-12.5c4.4,0,8.9,0.1,13.4,0.2c5.3,6.2,10.2,12,14.8,17.8 c32.1,40.1,58.8,83.7,79.4,130c-33.1-16.6-69.9-25.3-107.4-25.3c-31.1,0-61.4,5.9-90.1,17.5c-29.7,12-56.3,29.7-79.1,52.5 c-45.2,45.2-70.1,105.3-70.1,169.3c0,63.9,24.9,124,70.1,169.3c22.8,22.8,49.4,40.4,79.1,52.4c28.7,11.6,59,17.5,90.1,17.5 c26.9,0,53.3-4.4,78.6-13.2c19.6-6.8,38-16,55.1-27.5C1555.1,1564.4,1530.2,1617.6,1497.7,1666.8z M1556.2,1428.2 c-15.9,15.9-34.5,28.3-55.3,36.7c-20,8.1-41.2,12.2-63,12.2c-21.7,0-42.9-4.1-63-12.2c-20.7-8.4-39.3-20.7-55.3-36.7 c-31.6-31.6-49-73.6-49-118.3c0-44.7,17.4-86.7,49-118.3c15.9-15.9,34.5-28.3,55.3-36.7c20-8.1,41.2-12.2,63-12.2 c21.7,0,42.9,4.1,63,12.2c20.7,8.4,39.3,20.7,55.3,36.7c0,0,0,0,0.1,0.1c12.7,12.6,23.3,27.2,31.3,43.4 c5.9,33.8,8.8,68.6,8.8,103.4c0,9.6-0.2,18.3-0.6,26.6C1587.5,1388.9,1574.2,1410.1,1556.2,1428.2z"/>
                                </g>
                            </svg>
                        </motion.div>
                        <span className="text-xl font-bold tracking-tighter">
                            Fernando <span className="text-orange-500">Máximo</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Center Navigation */}
                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative transition-colors hover:text-foreground pb-0.5 ${
                                pathname === link.href
                                    ? "text-orange-500 font-semibold"
                                    : "text-foreground/60"
                            }`}
                        >
                            {link.label}
                            {pathname === link.href && (
                                <motion.span
                                    layoutId="nav-underline"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-orange-500"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions Section */}
                <div className="flex-1 flex justify-end items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-4">
                        <a
                            href="https://github.com/fmargar"
                            target="_blank"
                            rel="noreferrer"
                            className="text-foreground/60 hover:text-foreground transition-colors"
                        >
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </a>

                        <button
                            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                            className="relative rounded-full p-2 hover:bg-muted transition-colors w-9 h-9 flex items-center justify-center"
                        >
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t bg-background overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`text-lg font-semibold transition-colors ${pathname === link.href ? "text-orange-500" : "text-foreground/60"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <span className="text-sm text-foreground/60 font-medium">Tema & Perfil</span>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                                        className="p-2 rounded-lg bg-muted"
                                    >
                                        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                    </button>
                                    <a
                                        href="https://github.com/fmargar"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 rounded-lg bg-muted"
                                    >
                                        <Github className="h-5 w-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
