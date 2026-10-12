import * as THREE from 'three'
import { extend } from '@react-three/fiber'

// Breath-of-the-Wild-style cel shading:
//  - two soft light bands instead of smooth falloff
//  - shadows tinted cool blue instead of going grey
//  - a warm rim light that outlines silhouettes
// Use it in JSX as <toonMaterial color="..." rim={0.4} />.

// Two tones with a short linear blend between them, so band edges stay painterly rather than razor-sharp.
const gradientMap = (() => {
  const tex = new THREE.DataTexture(new Uint8Array([105, 105, 105, 255, 255, 255]), 6, 1, THREE.RedFormat)
  tex.minFilter = tex.magFilter = THREE.LinearFilter
  tex.generateMipmaps = false
  tex.needsUpdate = true
  return tex
})()

export class ToonMaterial extends THREE.MeshToonMaterial {
  constructor(params) {
    super({ gradientMap, ...params })
    this.uniforms = {
      uRim: { value: 0.45 },
      uRimColor: { value: new THREE.Color('#fff4d6') },
      uShadowTint: { value: new THREE.Color(0.72, 0.84, 1.3) },
    }
    this.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms)
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
          uniform float uRim;
          uniform vec3 uRimColor;
          uniform vec3 uShadowTint;`,
        )
        .replace(
          '#include <opaque_fragment>',
          `{
            // How lit is this pixel relative to its albedo? Low = in shadow.
            vec3 W = vec3(0.299, 0.587, 0.114);
            float lit = dot(outgoingLight, W) / max(dot(diffuseColor.rgb, W), 1e-3);
            float shade = 1.0 - smoothstep(0.45, 0.9, lit);
            outgoingLight = mix(outgoingLight, outgoingLight * uShadowTint, shade * 0.65);

            // Fresnel rim, kept to a thin band so it reads as an outline glow.
            float ndv = max(dot(normalize(normal), normalize(vViewPosition)), 0.0);
            float rim = smoothstep(0.62, 0.8, 1.0 - ndv);
            outgoingLight += uRimColor * diffuseColor.rgb * rim * uRim;
          }
          #include <opaque_fragment>`,
        )
    }
  }
  get rim() {
    return this.uniforms.uRim.value
  }
  set rim(v) {
    this.uniforms.uRim.value = v
  }
}

extend({ ToonMaterial })
