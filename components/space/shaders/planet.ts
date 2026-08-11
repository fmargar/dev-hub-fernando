import { noiseGlsl } from "./noise";
import { cityLightsGlsl } from "./citylights";

/**
 * Planeta genérico procedural: fbm por semilla + iluminación direccional +
 * dos extras opcionales activados por uniform, sin variantes de shader
 * distintas por caso: particiones de zona (uZonePartitions, para los
 * "vados" — 4 zonas administrativas reales del caso) y luces de ciudad en
 * el lado nocturno (uCityLights, para Marbella Fácil). Cero texturas.
 */
export const planetVert = /* glsl */ `
  varying vec3 vNormalW;
  varying vec2 vUv;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const planetFrag = /* glsl */ `
  precision mediump float;
  varying vec3 vNormalW;
  varying vec2 vUv;

  uniform vec3 uColorDeep;
  uniform vec3 uColorSurface;
  uniform vec3 uColorHighlight;
  uniform vec3 uLightDir;
  uniform float uSeed;
  uniform float uZonePartitions;
  uniform float uCityLights;
  uniform vec3 uCityTint;

  ${noiseGlsl}
  ${cityLightsGlsl}

  void main() {
    vec3 n = normalize(vNormalW);
    vec3 p = n * 2.6 + vec3(uSeed);
    float terrain = fbm3(p, 4);

    vec3 surface = mix(uColorDeep, uColorSurface, smoothstep(0.35, 0.7, terrain));
    surface = mix(surface, uColorHighlight, smoothstep(0.74, 0.86, terrain));

    vec3 light = normalize(uLightDir);
    float lambert = max(dot(n, light), 0.0);
    float nightMask = smoothstep(0.1, -0.08, dot(n, light));

    vec3 color = surface * (0.16 + 0.84 * lambert);

    if (uZonePartitions > 0.5) {
      float angle = atan(n.z, n.x);
      float seg = fract(angle / 6.28318530718 * uZonePartitions);
      float line = smoothstep(0.0, 0.01, seg) - smoothstep(0.045, 0.055, seg);
      color += uColorHighlight * line * 0.55;
    }

    if (uCityLights > 0.5) {
      color += cityLights(vUv * vec2(9.0, 4.5), nightMask, uCityTint);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

/** Atmósfera: fresnel aditivo sobre una esfera algo mayor que el planeta. */
export const atmosphereVert = /* glsl */ `
  varying vec3 vNormalV;
  void main() {
    vNormalV = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const atmosphereFrag = /* glsl */ `
  precision mediump float;
  varying vec3 vNormalV;
  uniform vec3 uColor;
  uniform float uIntensity;
  void main() {
    float fresnel = pow(1.0 - max(dot(vNormalV, vec3(0.0, 0.0, 1.0)), 0.0), 2.5);
    gl_FragColor = vec4(uColor, fresnel * uIntensity);
  }
`;
