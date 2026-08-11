import { noiseGlsl } from "./noise";

/**
 * Skybox procedural: una esfera invertida grande, coloreada por fbm en la
 * dirección de vista. Nada de texturas — los tonos llegan como uniforms
 * desde palette.ts (los tokens reales de app/globals.css), así que si la
 * paleta cambia algún día, la nebulosa cambia sola. Luminancia recortada a
 * uMaxLuma: la garantía de que un panel de cristal (.glass) compuesto encima
 * nunca pierde el contraste AA calculado a mano en la fase 3.
 */
export const nebulaVert = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const nebulaFrag = /* glsl */ `
  precision mediump float;
  varying vec3 vDir;

  uniform float uTime;
  uniform vec3 uColorBg;
  uniform vec3 uColorCyan;
  uniform vec3 uColorMagenta;
  uniform vec3 uColorViolet;
  uniform float uMaxLuma;
  uniform float uIntensity;

  ${noiseGlsl}

  void main() {
    vec3 dir = normalize(vDir);

    float n1 = fbm3(dir * 1.6 + vec3(0.0, 0.0, uTime * 0.004), 4);
    float n2 = fbm3(dir * 2.3 - vec3(uTime * 0.003, 0.0, 0.0), 4);
    float n3 = fbm3(dir * 3.1 + vec3(0.0, uTime * 0.0025, 0.0), 3);

    float cyanMask = smoothstep(0.55, 0.85, n1);
    float magentaMask = smoothstep(0.6, 0.88, n2);
    float violetMask = smoothstep(0.5, 0.82, n3);

    vec3 color = uColorBg;
    color += uColorViolet * violetMask * 0.5 * uIntensity;
    color += uColorCyan * cyanMask * 0.4 * uIntensity;
    color += uColorMagenta * magentaMask * 0.35 * uIntensity;

    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    if (luma > uMaxLuma) {
      color *= uMaxLuma / max(luma, 0.0001);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;
