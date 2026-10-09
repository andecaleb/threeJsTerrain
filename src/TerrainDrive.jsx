import React from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import TerrainSwitcher from "./components/TerrainSwitcher";
import { TerrainProvider } from "./context/TerrainContext";
import { containerStyle, overlayStyle } from "./styles/overlay";

export default function TerrainDrive() {
  return (
    <TerrainProvider>
      <div style={containerStyle}>
        <Canvas
          shadows
          camera={{ position: [58, 48, 62], fov: 42, near: 0.1, far: 500 }}
          dpr={[1, 2]}
        >
          <Scene />
        </Canvas>

        <TerrainSwitcher />

        <div style={overlayStyle}>
          <strong>Terrain Drive</strong>
          <div style={{ opacity: 0.82, marginTop: 3 }}>
            Car is driving automatically · Drag to orbit · Scroll to zoom
          </div>
        </div>
      </div>
    </TerrainProvider>
  );
}
