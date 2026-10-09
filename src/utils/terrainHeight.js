/**
 * Smooth, rolling hills with a few stronger ridges and dips.
 * Pure function – deterministic for a given (x, z).
 */
export function terrainHeight(x, z) {
  return (
    Math.sin(x * 0.105) * 2.7 +
    Math.cos(z * 0.09) * 2.1 +
    Math.sin((x + z) * 0.065) * 2.4 +
    Math.cos((x - z) * 0.12) * 0.9 +
    Math.sin(x * 0.23 + Math.cos(z * 0.1)) * 0.45
  );
}