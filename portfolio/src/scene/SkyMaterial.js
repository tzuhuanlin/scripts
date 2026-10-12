import * as THREE from 'three'
import { extend } from '@react-three/fiber'

// The painted landscape outside the window: gradient sky, drifting clouds,
// and layered hills that fade into blue haze with distance (aerial perspective).
export class SkyMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: { uTime: { value: 0 }, uDay: { value: 1 } },
      toneMapped: false,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uDay;
        varying vec2 vUv;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
        }
        float fbm(vec2 p) {
          float v = 0.0, a = 0.5;
          for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
          return v;
        }
        // A rolling ridge line for a hill layer.
        float ridge(float x, float base, float amp, float freq, float seed) {
          return base + amp * (fbm(vec2(x * freq + seed, seed)) - 0.5) + 0.03 * sin(x * 6.0 + seed);
        }

        void main() {
          vec2 uv = vUv;
          // --- Sky ---
          vec3 dayTop = vec3(0.24, 0.55, 0.86), dayHorizon = vec3(0.86, 0.93, 0.92);
          vec3 nightTop = vec3(0.03, 0.04, 0.14), nightHorizon = vec3(0.16, 0.14, 0.36);
          vec3 top = mix(nightTop, dayTop, uDay), horizon = mix(nightHorizon, dayHorizon, uDay);
          vec3 col = mix(horizon, top, smoothstep(0.25, 1.0, uv.y));

          // Sun (day) or moon (night) with a soft glow; values > 1 feed the bloom pass.
          vec2 orb = mix(vec2(0.25, 0.78), vec2(0.74, 0.74), uDay);
          float d = length((uv - orb) * vec2(1.333, 1.0));
          vec3 orbCol = mix(vec3(1.6, 1.6, 1.8), vec3(3.0, 2.5, 1.6), uDay);
          col += orbCol * smoothstep(0.075, 0.065, d);
          col += mix(vec3(0.15, 0.15, 0.3), vec3(1.0, 0.8, 0.45), uDay) * exp(-d * 7.0) * 0.6;

          // Stars at night.
          vec2 sp = uv * vec2(160.0, 120.0);
          vec2 sg = floor(sp);
          float star = step(0.985, hash(sg)) * smoothstep(0.22, 0.0, length(fract(sp) - 0.5))
                     * (0.6 + 0.4 * sin(uTime * 2.0 + hash(sg + 3.0) * 6.28));
          col += vec3(star) * (1.0 - uDay) * smoothstep(0.35, 0.6, uv.y);

          // Drifting clouds, lit from above.
          vec2 cp = vec2(uv.x * 2.2 + uTime * 0.012, uv.y * 4.0);
          float c = smoothstep(0.5, 0.75, fbm(cp)) * smoothstep(0.45, 0.7, uv.y);
          float cShade = fbm(cp + vec2(0.0, -0.15));
          vec3 cloudCol = mix(mix(vec3(0.2, 0.2, 0.4), vec3(0.8, 0.85, 0.95), uDay), mix(vec3(0.35, 0.35, 0.55), vec3(1.0), uDay), cShade);
          col = mix(col, cloudCol, c * 0.85);

          // --- Hills: far to near, each layer less hazy and more saturated ---
          vec3 haze = horizon;
          vec3 farC  = mix(vec3(0.10, 0.12, 0.25), vec3(0.45, 0.62, 0.74), uDay);
          vec3 midC  = mix(vec3(0.07, 0.10, 0.18), vec3(0.42, 0.66, 0.42), uDay);
          vec3 nearC = mix(vec3(0.04, 0.06, 0.12), vec3(0.33, 0.58, 0.28), uDay);

          float far = ridge(uv.x, 0.42, 0.18, 2.5, 1.7);
          if (uv.y < far) col = mix(farC, haze, 0.35 + 0.3 * smoothstep(far - 0.15, far, uv.y));
          float mid = ridge(uv.x, 0.30, 0.12, 3.5, 9.2);
          if (uv.y < mid) col = mix(midC * (0.85 + 0.25 * smoothstep(mid - 0.08, mid, uv.y)), haze, 0.15);
          float near = ridge(uv.x, 0.16, 0.10, 4.0, 4.4);
          if (uv.y < near) {
            // Brush-like grass texture on the nearest hill.
            float g = fbm(vec2(uv.x * 40.0, uv.y * 12.0));
            col = nearC * (0.85 + 0.3 * g) * (0.9 + 0.2 * smoothstep(near - 0.06, near, uv.y));
          }
          gl_FragColor = vec4(col, 1.0);
        }`,
    })
  }
}

extend({ SkyMaterial })
