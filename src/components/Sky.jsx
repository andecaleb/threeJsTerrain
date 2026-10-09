import React, { useMemo } from "react";
import * as THREE from "three";

/**
 * A giant inverted sphere with a vertical color gradient.
 * The bottom matches the fog / horizon color, the top is the sky.
 */
export default function Sky({ horizonColor, topColor }) {
  const geometry = useMemo(() => new THREE.SphereGeometry(2000, 32, 16), []);

  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uHorizon: { value: new THREE.Color(horizonColor) },
        uTop: { value: new THREE.Color(topColor) },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uHorizon;
        uniform vec3 uTop;
        varying vec3 vWorldPos;
        void main() {
          // Normalize the y-component so the gradient spans the dome.
          float h = normalize(vWorldPos).y;
          // Smoothstep keeps the horizon line soft.
          float t = smoothstep(-0.05, 0.6, h);
          vec3 col = mix(uHorizon, uTop, t);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    return mat;
  }, [horizonColor, topColor]);

  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}
