import { rollingHills } from "./rollingHills";
import { desertDunes } from "./desertDunes";
import { alpineRidges } from "./alpineRidges";
import { archipelago } from "./archipelago";

export const TERRAINS = [rollingHills, desertDunes, alpineRidges, archipelago];

export const DEFAULT_TERRAIN_ID = rollingHills.id;

export function getTerrainById(id) {
  return TERRAINS.find((t) => t.id === id) ?? rollingHills;
}
