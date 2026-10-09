import React, { useMemo } from "react";
import { OrbitControls } from "@react-three/drei";
import { useTerrain } from "../context/TerrainContext";
import { createRoadCurve } from "../utils/createRoadCurve";
import Terrain from "./Terrain";
import Road from "./Road";
import Scenery from "./Scenery";
import AnimatedCar from "./AnimatedCar";
import Sky from "./Sky";

export default function Scene() {
  const { terrain } = useTerrain();
  const curve = useMemo(() => createRoadCurve(terrain), [terrain]);

  return (
    <group key={terrain.id}>
      {/* No <color attach="background"> needed – the sky dome covers it. */}
      <fog
        attach="fog"
        args={[terrain.fog.color, terrain.fog.near, terrain.fog.far]}
      />

      <ambientLight intensity={0.72} />
      <directionalLight
        position={[25, 38, 15]}
        intensity={2.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight args={["#dbeeff", "#63784b", 0.5]} />

      <Sky horizonColor={terrain.fog.color} topColor={terrain.skyTop} />

      <Terrain />
      <Road curve={curve} />
      <Scenery />
      <AnimatedCar curve={curve} />

      {/* Big ground plane, well past the fog far distance. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} receiveShadow>
        <planeGeometry args={[4000, 4000]} />
        <meshStandardMaterial color={terrain.groundPlaneColor} roughness={1} />
      </mesh>

      <OrbitControls
        makeDefault
        target={[0, 1, 0]}
        minDistance={18}
        maxDistance={100}
        maxPolarAngle={Math.PI / 2.05}
      />
    </group>
  );
}
