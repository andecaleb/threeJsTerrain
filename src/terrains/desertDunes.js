export const desertDunes = {
  id: "desertDunes",
  name: "Desert Dunes",
  background: "#f2d9a6",
  fog: { color: "#f2d9a6", near: 55, far: 130 },
  groundPlaneColor: "#c9a86a",
  palette: {
    high: "#e8c07a",
    low: "#b98d4b",
    mid: "#d9a75b",
    highThreshold: 2.5,
    lowThreshold: -2.0,
  },
  tree: {
    // "Trees" become small cacti in the desert.
    trunk: "#4c6b3c",
    foliageA: "#6b8a4a",
    foliageB: "#7fa055",
    density: 55,
    avoidCenter: { x: 10, z: 10 },
  },
  height: (x, z) =>
    Math.sin(x * 0.06) * 3.2 +
    Math.cos(z * 0.05) * 2.8 +
    Math.sin((x - z) * 0.045) * 1.9 +
    Math.cos(x * 0.13 + z * 0.07) * 0.6,
  roadPointsXZ: [
    [-30, -25],
    [-18, -32],
    [-3, -30],
    [12, -26],
    [26, -30],
    [34, -18],
    [32, -4],
    [22, 4],
    [30, 16],
    [22, 30],
    [6, 34],
    [-8, 27],
    [-20, 33],
    [-32, 20],
    [-35, 4],
    [-28, -6],
    [-36, -14],
  ],
};
