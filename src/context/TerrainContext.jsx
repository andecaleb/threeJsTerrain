import React, { createContext, useContext, useMemo, useState } from "react";
import { DEFAULT_TERRAIN_ID, getTerrainById } from "../terrains";

const TerrainContext = createContext(null);

export function TerrainProvider({ children }) {
  const [terrainId, setTerrainId] = useState(DEFAULT_TERRAIN_ID);
  const terrain = useMemo(() => getTerrainById(terrainId), [terrainId]);

  const value = useMemo(
    () => ({ terrain, terrainId, setTerrainId }),
    [terrain, terrainId],
  );

  return (
    <TerrainContext.Provider value={value}>{children}</TerrainContext.Provider>
  );
}

export function useTerrain() {
  const ctx = useContext(TerrainContext);
  if (!ctx) throw new Error("useTerrain must be used inside <TerrainProvider>");
  return ctx;
}
