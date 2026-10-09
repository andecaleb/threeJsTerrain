import React, { useMemo } from "react";
import * as THREE from "three";
import { ROAD_WIDTH, ROAD_SAMPLES } from "../constants";
import { useTerrain } from "../context/TerrainContext";
import RoadEdges from "./RoadEdges";

export default function Road({ curve }) {
  const { terrain } = useTerrain();

  const geometry = useMemo(() => {
    const vertices = [];
    const indices = [];
    const uv = [];

    for (let i = 0; i <= ROAD_SAMPLES; i++) {
      const t = i / ROAD_SAMPLES;
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      for (const edge of [-1, 1]) {
        const x = point.x + side.x * ROAD_WIDTH * 0.5 * edge;
        const z = point.z + side.z * ROAD_WIDTH * 0.5 * edge;
        vertices.push(x, terrain.height(x, z) + 0.42, z);
        uv.push(edge === -1 ? 0 : 1, t * 24);
      }

      if (i < ROAD_SAMPLES) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [curve, terrain]);

  return (
    <group>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial
          color="#34383a"
          roughness={0.94}
          side={THREE.DoubleSide}
        />
      </mesh>
      <RoadEdges curve={curve} />
    </group>
  );
}
