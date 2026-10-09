import * as THREE from "three";

/**
 * Builds a closed Catmull-Rom curve using the given terrain's road points
 * and height function.
 */
export function createRoadCurve(terrain) {
  const points = terrain.roadPointsXZ.map(
    ([x, z]) => new THREE.Vector3(x, terrain.height(x, z) + 0.32, z),
  );
  return new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.42);
}
