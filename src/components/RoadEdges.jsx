import React, { useMemo } from "react";
import * as THREE from "three";
import { ROAD_WIDTH, ROAD_EDGE_SAMPLES } from "../constants";
import { terrainHeight } from "../utils/terrainHeight";

export default function RoadEdges({ curve }) {
  const edgeGeometry = useMemo(() => {
    const vertices = [];
    const indices = [];
    const edgeOffset = ROAD_WIDTH * 0.47;

    for (let i = 0; i <= ROAD_EDGE_SAMPLES; i++) {
      const t = i / ROAD_EDGE_SAMPLES;
      const p = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      for (const sign of [-1, 1]) {
        const x = p.x + side.x * edgeOffset * sign;
        const z = p.z + side.z * edgeOffset * sign;
        vertices.push(x, terrainHeight(x, z) + 0.48, z);
      }
      if (i < ROAD_EDGE_SAMPLES) {
        const a = i * 2;
        indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [curve]);

  return (
    <mesh geometry={edgeGeometry}>
      <meshBasicMaterial color="#d6d0b8" side={THREE.DoubleSide} />
    </mesh>
  );
}
