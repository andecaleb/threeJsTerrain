export const alpineRidges = {
  id: "alpineRidges",
  name: "Alpine Ridges",
  background: "#cfe0ee",
  fog: { color: "#cfe0ee", near: 50, far: 120 },
  groundPlaneColor: "#3d4a3a",
  palette: {
    high: "#e9f0f5", // snowy peaks
    low: "#445239",
    mid: "#7d8c68",
    highThreshold: 5.0,
    lowThreshold: -1.0,
  },
  tree: {
    trunk: "#3e2f1e",
    foliageA: "#2c4a30",
    foliageB: "#3a5d3e",
    density: 120,
    avoidCenter: { x: 13, z: 13 },
  },
  // Sharper, taller terrain with pronounced ridges.
  height: (x, z) =>
    Math.sin(x * 0.16) * 4.2 +
    Math.cos(z * 0.14) * 3.7 +
    Math.sin((x + z) * 0.11) * 3.1 +
    Math.cos((x - z) * 0.18) * 1.4 +
    Math.sin(x * 0.31 + z * 0.22) * 0.9,
  roadPointsXZ: [
    [-30, -20],
    [-22, -33],
    [-6, -30],
    [7, -26],
    [21, -32],
    [33, -20],
    [36, -6],
    [26, 4],
    [33, 17],
    [24, 31],
    [8, 35],
    [-6, 27],
    [-18, 35],
    [-30, 22],
    [-34, 6],
    [-26, -4],
    [-33, -15],
  ],
};
