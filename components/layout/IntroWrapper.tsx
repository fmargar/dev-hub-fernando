"use client";

import React, { useState } from "react";
import { HackerIntro } from "@/components/ui/HackerIntro";

export function IntroWrapper({ children }: { children: React.ReactNode }) {
  const [isIntroActive, setIsIntroActive] = useState(true);

  return (
    <>
      <HackerIntro onComplete={() => setIsIntroActive(false)} />
      <div
        style={{
          opacity: isIntroActive ? 0 : 1,
          visibility: isIntroActive ? "hidden" : "visible",
          transition: "opacity 0.6s ease-in-out",
        }}
        className="flex-1 flex flex-col min-h-screen"
      >
        {children}
      </div>
    </>
  );
}
