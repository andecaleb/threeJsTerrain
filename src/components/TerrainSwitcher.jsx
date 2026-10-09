import React from "react";
import { useTerrain } from "../context/TerrainContext";
import { TERRAINS } from "../terrains";

export default function TerrainSwitcher() {
  const { terrainId, setTerrainId } = useTerrain();

  return (
    <div
      style={{
        position: "absolute",
        top: 18,
        left: 18,
        padding: "10px 12px",
        borderRadius: 8,
        background: "rgba(20, 28, 25, 0.72)",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
        fontSize: 13,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 180,
      }}
    >
      <strong style={{ opacity: 0.9 }}>Terrain</strong>
      <select
        value={terrainId}
        onChange={(e) => setTerrainId(e.target.value)}
        style={{
          padding: "6px 8px",
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(0,0,0,0.35)",
          color: "#fff",
          fontSize: 13,
          outline: "none",
        }}
      >
        {TERRAINS.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}
