import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CAR_SPEED, SLOPE_SAMPLE_DISTANCE } from "../constants";
import { terrainHeight } from "../utils/terrainHeight";
import CarModel from "./CarModel";

export default function AnimatedCar({ curve, speed = CAR_SPEED }) {
  const car = useRef();
  const wheelSpin = useRef(0);

  useFrame((state, delta) => {
    if (!car.current) return;

    // Delta-based animation keeps movement consistent across frame rates.
    const t = (state.clock.elapsedTime * speed) % 1;
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();

    // --- Compute slope along the direction of travel ---
    const flatTangent = new THREE.Vector3(tangent.x, 0, tangent.z).normalize();

    const aheadX = point.x + flatTangent.x * SLOPE_SAMPLE_DISTANCE;
    const aheadZ = point.z + flatTangent.z * SLOPE_SAMPLE_DISTANCE;
    const behindX = point.x - flatTangent.x * SLOPE_SAMPLE_DISTANCE;
    const behindZ = point.z - flatTangent.z * SLOPE_SAMPLE_DISTANCE;

    const aheadY = terrainHeight(aheadX, aheadZ);
    const behindY = terrainHeight(behindX, behindZ);

    const rise = aheadY - behindY;
    const run = SLOPE_SAMPLE_DISTANCE * 2;

    // Model faces local +Z, so +X rotation dips the nose. Negate so climbing
    // tilts the nose up and descending tilts it down.
    const pitch = -Math.atan2(rise, run);

    // --- Position ---
    car.current.position.set(
      point.x,
      terrainHeight(point.x, point.z) + 0.58,
      point.z,
    );

    // --- Orientation: yaw first, then pitch around the car's local X ---
    const yaw = Math.atan2(tangent.x, tangent.z);
    car.current.rotation.set(pitch, yaw, 0, "YXZ");

    // Subtle suspension wobble.
    car.current.position.y += Math.sin(state.clock.elapsedTime * 11) * 0.035;
    wheelSpin.current -= delta * 7;
  });

  return (
    <group ref={car}>
      <CarModel />
    </group>
  );
}
