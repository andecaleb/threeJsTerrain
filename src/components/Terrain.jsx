import React, { useMemo } from "react";
import * as THREE from "three";
import { TERRAIN_SIZE, TERRAIN_SEGMENTS } from "../constants";
import { terrainHeight } from "../utils/terrainHeight";

export default function Terrain() {
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
      position.setY(i, terrainHeight(x, z));
    }
    position.needsUpdate = true;
    geo.computeVertexNormals();

    const colors = [];
    const color = new THREE.Color();
    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i);
      if (y > 3.2) color.set("#6d8150");
      else if (y < -2.2) color.set("#496747");
      else color.set("#78945a");
      colors.push(color.r, color.g, color.b);
    }
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} />
    </mesh>
  );
}