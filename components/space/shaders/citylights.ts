/**
 * Voronoi barato para las luces de neón del lado nocturno de un planeta
 * (petición explícita: Marbella Fácil como "Smart City"). Depende de
 * `hash13` de noise.ts — quien componga esto debe incluir noiseGlsl antes.
 */
export const cityLightsGlsl = /* glsl */ `
  float cityVoronoi(vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    float minDist = 1.0;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 point = vec2(
          hash13(vec3(ip + neighbor, 11.0)),
          hash13(vec3(ip + neighbor, 47.0))
        );
        vec2 diff = neighbor + point - fp;
        minDist = min(minDist, length(diff));
      }
    }
    return minDist;
  }

  vec3 cityLights(vec2 uv, float nightMask, vec3 tint) {
    float cells = cityVoronoi(uv);
    float glow = smoothstep(0.05, 0.0, cells);
    return tint * glow * nightMask;
  }
`;
