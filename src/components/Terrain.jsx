import React, { useMemo } from "react";
import * as THREE from "three";
import { TERRAIN_SIZE, TERRAIN_SEGMENTS } from "../constants";
import { useTerrain } from "../context/TerrainContext";

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

    const position = geo.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);
      position.setY(i, terrain.height(x, z));
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
    // Rebuild when terrain changes.
  }, [terrain]);

  return (
    <mesh key={terrain.id} geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} />
    </mesh>
  );
}
