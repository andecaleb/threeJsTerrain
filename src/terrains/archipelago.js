export const archipelago = {
  id: "archipelago",
  name: "Archipelago",
  background: "#a8c8d8",
  fog: { color: "#a8c8d8", near: 45, far: 115 },
  groundPlaneColor: "#2a5a72", // water color for the far plane
  palette: {
    // Blue-ish for submerged lows, sandy mid, green high.
    high: "#7ba05b",
    low: "#4a7c8c",
    mid: "#d9c48a",
    highThreshold: 2.0,
    lowThreshold: 0.2,
  },
  tree: {
    trunk: "#5a4127",
    foliageA: "#2e5f3e",
    foliageB: "#3f7a4c",
    density: 70,
    avoidCenter: { x: 11, z: 11 },
  },
  // Islands rising from a seabed. Negative areas read as water.
  height: (x, z) => {
    const island = (cx, cz, r, h) => {
      const d = Math.hypot(x - cx, z - cz);
      const t = Math.max(0, 1 - d / r);
      return h * t * t * (3 - 2 * t); // smoothstep falloff
    };
    return (
      island(-28, -18, 14, 5.5) +
      island(10, -22, 16, 6.5) +
      island(-6, 12, 15, 5.0) +
      island(26, 18, 13, 4.5) +
      island(30, -8, 11, 3.5) -
      1.6 // sea floor offset
    );
  },
  roadPointsXZ: [
    // Loops around and between the islands.
    [-30, -20],
    [-20, -30],
    [-4, -28],
    [10, -30],
    [22, -26],
    [32, -18],
    [34, -4],
    [24, 2],
    [32, 14],
    [22, 28],
    [8, 32],
    [-6, 24],
    [-18, 32],
    [-30, 22],
    [-34, 6],
    [-26, -4],
    [-34, -14],
  ],
};
