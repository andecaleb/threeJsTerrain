import React, { useMemo } from "react";
import { OrbitControls } from "@react-three/drei";
import { createRoadCurve } from "../utils/createRoadCurve";
import Terrain from "./Terrain";
import Road from "./Road";
import Scenery from "./Scenery";
import AnimatedCar from "./AnimatedCar";

export default function Scene() {
  const curve = useMemo(() => createRoadCurve(), []);

  return (
    <>
      <color attach="background" args={["#b9d1df"]} />
      <fog attach="fog" args={["#b9d1df", 65, 145]} />

      <ambientLight intensity={0.72} />
      <directionalLight
        position={[25, 38, 15]}
        intensity={2.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight args={["#dbeeff", "#63784b", 0.5]} />

      <Terrain />
      <Road curve={curve} />
      <Scenery />
      <AnimatedCar curve={curve} />

      {/* Ground plane far below to catch the fog. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#50634a" roughness={1} />
      </mesh>

      <OrbitControls
        makeDefault
        target={[0, 1, 0]}
        minDistance={18}
        maxDistance={100}
        maxPolarAngle={Math.PI / 2.05}
      />
    </>
  );
}
