/**
 * Ruido de valor 3D + fbm, en GLSL puro. Hash barato (sin permutation
 * tables, sin texturas) — de sobra para nebulosas y superficies
 * planetarias, y no cuesta un solo byte de asset.
 */
export const noiseGlsl = /* glsl */ `
  float hash13(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float valueNoise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float n000 = hash13(i + vec3(0.0, 0.0, 0.0));
    float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash13(i + vec3(1.0, 1.0, 1.0));

    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);
    float nxy0 = mix(nx00, nx10, f.y);
    float nxy1 = mix(nx01, nx11, f.y);
    return mix(nxy0, nxy1, f.z);
  }

  float fbm3(vec3 p, int octaves) {
    float sum = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 8; i++) {
      if (i >= octaves) break;
      sum += valueNoise3(p * freq) * amp;
      freq *= 2.02;
      amp *= 0.5;
    }
    return sum;
  }

  /* Deforma el dominio con su propio ruido de baja frecuencia antes de
     muestrear el fbm principal — sin esto, el fbm de valor da manchas
     redondeadas reconocibles; deformado, las costas y continentes salen
     orgánicos e irregulares en vez de "ruido con nombre de terreno". */
  vec3 domainWarp3(vec3 p) {
    float wx = fbm3(p + vec3(5.2, 1.3, 7.1), 3);
    float wy = fbm3(p + vec3(1.7, 9.2, 3.3), 3);
    float wz = fbm3(p + vec3(8.3, 2.8, 4.1), 3);
    return p + (vec3(wx, wy, wz) - 0.5) * 1.1;
  }
`;
