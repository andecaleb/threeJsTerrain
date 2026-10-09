export const rollingHills = {
  id: "rollingHills",
  name: "Rolling Hills",
  background: "#b9d1df",
  fog: { color: "#b9d1df", near: 65, far: 145 },
  groundPlaneColor: "#50634a",
  palette: {
    high: "#6d8150",
    low: "#496747",
    mid: "#78945a",
    highThreshold: 3.2,
    lowThreshold: -2.2,
  },
  tree: {
    trunk: "#59452e",
    foliageA: "#345b38",
    foliageB: "#426c3c",
    density: 95,
    avoidCenter: { x: 12, z: 12 },
  },
  height: (x, z) =>
    Math.sin(x * 0.105) * 2.7 +
    Math.cos(z * 0.09) * 2.1 +
    Math.sin((x + z) * 0.065) * 2.4 +
    Math.cos((x - z) * 0.12) * 0.9 +
    Math.sin(x * 0.23 + Math.cos(z * 0.1)) * 0.45,
  roadPointsXZ: [
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
  ],
};
