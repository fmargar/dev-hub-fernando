"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { TOOLS } from "@/content/tools";

/** Región del universo donde vive /tools. */
export const STATION_BAY_ORIGIN: [number, number, number] = [0, -6, -70];

const COLS = 6;
const SPACING = 0.55;
const BAY_TINTS = ["#5ee7ff", "#ff6bd6", "#a98bff"];

/** Bahía de carga de la estación: un panel plano con una luz por
 * herramienta real (content/tools.ts, 33 en este momento — si se añade
 * una herramienta, la bahía gana una luz sola). Las 33 herramientas por
 * dentro no se tocan: esto es solo el frente de la consola. */
export function StationBay() {
  const count = TOOLS.length;
  const rows = Math.ceil(count / COLS);

  const bays = useMemo(() => {
    return TOOLS.map((tool, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      return {
        key: tool.slug,
        x: (col - (COLS - 1) / 2) * SPACING,
        y: (rows - 1 - row - (rows - 1) / 2) * SPACING,
        color: BAY_TINTS[i % BAY_TINTS.length],
      };
    });
  }, [rows]);

  const panelColor = useMemo(() => new THREE.Color("#111528"), []);

  return (
    <group position={STATION_BAY_ORIGIN}>
      <mesh>
        <planeGeometry args={[COLS * SPACING + 0.7, rows * SPACING + 0.7]} />
        <meshBasicMaterial color={panelColor} />
      </mesh>
      {bays.map((bay) => (
        <mesh key={bay.key} position={[bay.x, bay.y, 0.02]}>
          <planeGeometry args={[SPACING * 0.76, SPACING * 0.76]} />
          <meshBasicMaterial color={bay.color} />
        </mesh>
      ))}
    </group>
  );
}
