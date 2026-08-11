import { noiseGlsl } from "./noise";
import { cityLightsGlsl } from "./citylights";

/**
 * Planeta genérico procedural: continentes con dominio deformado (no manchas
 * de fbm reconocibles), bandas de elevación (océano/costa/tierra/montaña),
 * casquetes polares, especular en el agua, terminador día/noche, y dos
 * extras opcionales por uniform: particiones de zona (vados, 4 zonas
 * administrativas reales) y luces de ciudad nocturnas (Marbella Fácil).
 * Cero texturas — todo el detalle sale de ruido, no de un asset descargado.
 */
export const planetVert = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vWorldPos;
  varying vec2 vUv;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const planetFrag = /* glsl */ `
  precision mediump float;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;
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
    vec3 p = domainWarp3(n * 2.2 + vec3(uSeed));
    float terrain = fbm3(p, 5);

    // Bandas de elevación: océano profundo → costa → tierra → montaña.
    // Cuatro paradas en vez de dos, para que no lea como "dos colores
    // planos con un degradado en medio".
    vec3 surface = uColorDeep;
    surface = mix(surface, uColorDeep * 1.4, smoothstep(0.28, 0.38, terrain));
    surface = mix(surface, uColorSurface, smoothstep(0.38, 0.5, terrain));
    surface = mix(surface, uColorSurface * 1.15, smoothstep(0.58, 0.7, terrain));
    surface = mix(surface, uColorHighlight, smoothstep(0.74, 0.88, terrain));

    // Casquetes polares: independientes del terreno, por latitud.
    float polar = smoothstep(0.78, 0.94, abs(n.y));
    surface = mix(surface, vec3(0.92, 0.95, 1.0), polar * 0.85);

    vec3 light = normalize(uLightDir);
    float lambert = max(dot(n, light), 0.0);
    float nightMask = smoothstep(0.1, -0.08, dot(n, light));

    vec3 color = surface * (0.16 + 0.84 * lambert);

    // Especular suave sobre el "agua" (banda baja de terreno, sin casquete).
    float oceanMask = (1.0 - smoothstep(0.36, 0.46, terrain)) * (1.0 - polar);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 halfDir = normalize(light + viewDir);
    float spec = pow(max(dot(n, halfDir), 0.0), 40.0) * oceanMask * lambert;
    color += spec * 0.6;

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

/** Capa de nubes: esfera algo mayor que la superficie, alfa por fbm propio,
 * gira a un ritmo distinto del planeta (uniform aparte, ver CaseBody) para
 * que el clima se lea como algo vivo, no pegado a la corteza. */
export const cloudsVert = /* glsl */ `
  varying vec3 vNormalW;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const cloudsFrag = /* glsl */ `
  precision mediump float;
  varying vec3 vNormalW;

  uniform vec3 uLightDir;
  uniform float uSeed;
  uniform float uSpin;

  ${noiseGlsl}

  void main() {
    vec3 n = normalize(vNormalW);
    float angle = uSpin;
    float ca = cos(angle);
    float sa = sin(angle);
    vec3 rotated = vec3(n.x * ca - n.z * sa, n.y, n.x * sa + n.z * ca);

    float density = fbm3(domainWarp3(rotated * 1.8 + vec3(uSeed + 40.0)), 4);
    float mask = smoothstep(0.64, 0.82, density);

    float lambert = max(dot(n, normalize(uLightDir)), 0.0);
    vec3 color = vec3(1.0) * (0.35 + 0.65 * lambert);

    gl_FragColor = vec4(color, mask * 0.4);
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
