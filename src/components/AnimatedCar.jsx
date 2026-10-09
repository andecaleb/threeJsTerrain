import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CAR_SPEED, SLOPE_SAMPLE_DISTANCE } from "../constants";
import { useTerrain } from "../context/TerrainContext";
import CarModel from "./CarModel";

export default function AnimatedCar({ curve, speed = CAR_SPEED }) {
  const { terrain } = useTerrain();
  const car = useRef();

  useFrame((state) => {
    if (!car.current) return;

    const t = (state.clock.elapsedTime * speed) % 1;
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();

    // Slope sampling along the direction of travel.
    const flatTangent = new THREE.Vector3(tangent.x, 0, tangent.z).normalize();
    const aheadX = point.x + flatTangent.x * SLOPE_SAMPLE_DISTANCE;
    const aheadZ = point.z + flatTangent.z * SLOPE_SAMPLE_DISTANCE;
    const behindX = point.x - flatTangent.x * SLOPE_SAMPLE_DISTANCE;
    const behindZ = point.z - flatTangent.z * SLOPE_SAMPLE_DISTANCE;

    const rise =
      terrain.height(aheadX, aheadZ) - terrain.height(behindX, behindZ);
    const run = SLOPE_SAMPLE_DISTANCE * 2;
    const pitch = -Math.atan2(rise, run);

    car.current.position.set(
      point.x,
      terrain.height(point.x, point.z) + 0.58,
      point.z,
    );

    const yaw = Math.atan2(tangent.x, tangent.z);
    car.current.rotation.set(pitch, yaw, 0, "YXZ");

    car.current.position.y += Math.sin(state.clock.elapsedTime * 11) * 0.035;
  });

  return (
    <group ref={car}>
      <CarModel />
    </group>
  );
}
