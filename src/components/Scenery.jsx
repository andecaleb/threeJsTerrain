import React, { useMemo } from "react";
import { terrainHeight } from "../utils/terrainHeight";

export default function Scenery() {
  const trees = useMemo(() => {
    const items = [];
    // Deterministic pseudo-random scatter; keep a clear margin around the road.
    let seed = 9182;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < 95; i++) {
      const x = (random() - 0.5) * 88;
      const z = (random() - 0.5) * 88;
      if (Math.abs(x) < 12 && Math.abs(z) < 12) continue;
      items.push({ x, z, scale: 0.65 + random() * 0.8 });
    }
    return items;
  }, []);

  return (
    <group>
      {trees.map((tree, i) => {
        const y = terrainHeight(tree.x, tree.z);
        return (
          <group key={i} position={[tree.x, y, tree.z]} scale={tree.scale}>
            <mesh castShadow position={[0, 0.8, 0]}>
              <cylinderGeometry args={[0.13, 0.22, 1.6, 7]} />
              <meshStandardMaterial color="#59452e" roughness={1} />
            </mesh>
            <mesh castShadow position={[0, 2.0, 0]}>
              <coneGeometry args={[0.9, 2.4, 7]} />
              <meshStandardMaterial
                color={i % 3 === 0 ? "#345b38" : "#426c3c"}
                roughness={1}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
