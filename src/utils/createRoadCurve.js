import * as THREE from "three";
import { terrainHeight } from "./terrainHeight";

/**
 * An intentionally irregular closed loop. Terrain height is applied to each
 * control point so the spline follows the hills.
 */
export function createRoadCurve() {
  const pointsXZ = [
    [-31, -23],
    [-21, -34],
    [-7, -32],
    [5, -27],
    [20, -31],
    [32, -22],
    [35, -9],
    [27, 2],
    [34, 15],
    [25, 29],
    [10, 34],
    [-4, 28],
    [-17, 34],
    [-31, 23],
    [-35, 8],
    [-27, -3],
    [-34, -13],
  ];

  const points = pointsXZ.map(
    ([x, z]) => new THREE.Vector3(x, terrainHeight(x, z) + 0.32, z),
  );

  return new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.42);
}
