import React, { useMemo } from "react";
import { useTerrain } from "../context/TerrainContext";

export default function Scenery() {
  const { terrain } = useTerrain();

  const trees = useMemo(() => {
    const items = [];
    let seed = 9182;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const { density, avoidCenter } = terrain.tree;
    for (let i = 0; i < density; i++) {
      const x = (random() - 0.5) * 88;
      const z = (random() - 0.5) * 88;
      if (Math.abs(x) < avoidCenter.x && Math.abs(z) < avoidCenter.z) continue;

      // Skip submerged spots (helps archipelago look right).
      const y = terrain.height(x, z);
      if (y < -0.2) continue;

      items.push({ x, z, y, scale: 0.65 + random() * 0.8 });
    }
    return items;
  }, [terrain]);

  const { trunk, foliageA, foliageB } = terrain.tree;

  return (
    <group key={terrain.id}>
      {trees.map((tree, i) => (
        <group key={i} position={[tree.x, tree.y, tree.z]} scale={tree.scale}>
          <mesh castShadow position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.13, 0.22, 1.6, 7]} />
            <meshStandardMaterial color={trunk} roughness={1} />
          </mesh>
          <mesh castShadow position={[0, 2.0, 0]}>
            <coneGeometry args={[0.9, 2.4, 7]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? foliageA : foliageB}
              roughness={1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
