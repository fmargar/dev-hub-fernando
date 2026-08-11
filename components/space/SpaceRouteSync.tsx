"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSpaceStore } from "@/lib/space/store";
import { resolvePoiId } from "@/lib/space/route-map";

const WARP_DURATION_MS = 600;

/**
 * pathname → POI. El router nunca espera a la cámara: <Link> sigue
 * navegando de forma nativa (prefetch, back/forward, hreflang, todo
 * intacto), esto solo escribe en el store para que CameraRig (fase 5) sepa
 * hacia dónde interpolar y WarpOverlay sepa cuándo lucir la transición.
 */
export function SpaceRouteSync() {
  const pathname = usePathname();
  const setPoi = useSpaceStore((s) => s.setPoi);
  const setWarping = useSpaceStore((s) => s.setWarping);
  const mounted = useRef(false);

  useEffect(() => {
    const nextPoi = resolvePoiId(pathname ?? "/");

    if (!mounted.current) {
      mounted.current = true;
      setPoi(nextPoi);
      return;
    }

    setWarping(true);
    setPoi(nextPoi);
    const timeout = setTimeout(() => setWarping(false), WARP_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [pathname, setPoi, setWarping]);

  return null;
}
