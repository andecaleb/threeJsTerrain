import React, { useMemo } from "react";
import * as THREE from "three";
import { TERRAIN_SIZE, TERRAIN_SEGMENTS } from "../constants";
import { useTerrain } from "../context/TerrainContext";

/**
 * Falloff mask: 1 in the center, smoothly to 0 at the edge of the terrain.
 * Uses a smoothstep so the slope into the mask is gentle.
 */
function edgeMask(x, z, halfSize, innerRatio = 0.65) {
  const ax = Math.abs(x) / halfSize;
  const az = Math.abs(z) / halfSize;
  const a = Math.max(ax, az); // square falloff; use Math.hypot for radial
  const inner = innerRatio;
  if (a <= inner) return 1;
  if (a >= 1) return 0;
  const t = (a - inner) / (1 - inner);
  // Smoothstep
  return 1 - t * t * (3 - 2 * t);
}

export default function Terrain() {
  const { terrain } = useTerrain();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      TERRAIN_SIZE,
      TERRAIN_SIZE,
      TERRAIN_SEGMENTS,
      TERRAIN_SEGMENTS,
    );
    geo.rotateX(-Math.PI / 2);

    const halfSize = TERRAIN_SIZE / 2;
    const position = geo.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);
      const d = Math.hypot(x, z) / halfSize; // 0 at center, 1 at edge
      const inner = 0.7;
      const t = Math.max(0, Math.min(1, (d - inner) / (1 - inner)));
      const mask = 1 - t * t * (3 - 2 * t); // smoothstep falloff
      position.setY(i, terrain.height(x, z) * mask);
    }

    position.needsUpdate = true;
    geo.computeVertexNormals();

    const { palette } = terrain;
    const colors = [];
    const color = new THREE.Color();
    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i);
      if (y > palette.highThreshold) color.set(palette.high);
      else if (y < palette.lowThreshold) color.set(palette.low);
      else color.set(palette.mid);
      colors.push(color.r, color.g, color.b);
    }
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, [terrain]);

  return (
    <mesh key={terrain.id} geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} />
    </mesh>
  );
}
