import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/**
 * TerrainDrive.jsx
 *
 * Drop this component into a React + Vite app with:
 *   npm install three @react-three/fiber @react-three/drei
 *
 * Then render <TerrainDrive />.
 *
 * The car follows a closed, irregular spline road, including hills and dips.
 * Drag to orbit the scene and scroll to zoom.
 */

const TERRAIN_SIZE = 100;
const TERRAIN_SEGMENTS = 180;
const ROAD_WIDTH = 4.2;
const ROAD_SAMPLES = 900;

function terrainHeight(x, z) {
  // Smooth, rolling hills with a few stronger ridges and dips.
  return (
    Math.sin(x * 0.105) * 2.7 +
    Math.cos(z * 0.09) * 2.1 +
    Math.sin((x + z) * 0.065) * 2.4 +
    Math.cos((x - z) * 0.12) * 0.9 +
    Math.sin(x * 0.23 + Math.cos(z * 0.1)) * 0.45
  );
}

function createRoadCurve() {
  // An intentionally irregular loop. The terrain height is applied below.
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

function Terrain() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      TERRAIN_SIZE,
      TERRAIN_SIZE,
      TERRAIN_SEGMENTS,
      TERRAIN_SEGMENTS,
    );
    geo.rotateX(-Math.PI / 2);

    const position = geo.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);
      position.setY(i, terrainHeight(x, z));
    }
    position.needsUpdate = true;
    geo.computeVertexNormals();

    const colors = [];
    const color = new THREE.Color();
    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i);
      if (y > 3.2) color.set("#6d8150");
      else if (y < -2.2) color.set("#496747");
      else color.set("#78945a");
      colors.push(color.r, color.g, color.b);
    }
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} />
    </mesh>
  );
}

function Road({ curve }) {
  const geometry = useMemo(() => {
    const vertices = [];
    const indices = [];
    const uv = [];

    for (let i = 0; i <= ROAD_SAMPLES; i++) {
      const t = i / ROAD_SAMPLES;
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      // Keep the road seated on the terrain and make its edges follow the hill.
      for (const edge of [-1, 1]) {
        const x = point.x + side.x * ROAD_WIDTH * 0.5 * edge;
        const z = point.z + side.z * ROAD_WIDTH * 0.5 * edge;
        vertices.push(x, terrainHeight(x, z) + 0.42, z);
        uv.push(edge === -1 ? 0 : 1, t * 24);
      }

      if (i < ROAD_SAMPLES) {
        const a = i * 2;
        indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [curve]);

  return (
    <group>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial
          color="#34383a"
          roughness={0.94}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Thin pale edge strips make the winding road easier to read. */}
      <RoadEdges curve={curve} />
    </group>
  );
}

function RoadEdges({ curve }) {
  const edgeGeometry = useMemo(() => {
    const vertices = [];
    const indices = [];
    const samples = 900;
    const edgeOffset = ROAD_WIDTH * 0.47;
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const p = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const side = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      for (const sign of [-1, 1]) {
        const x = p.x + side.x * edgeOffset * sign;
        const z = p.z + side.z * edgeOffset * sign;
        vertices.push(x, terrainHeight(x, z) + 0.48, z);
      }
      if (i < samples) {
        const a = i * 2;
        indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [curve]);

  return (
    <mesh geometry={edgeGeometry}>
      <meshBasicMaterial color="#d6d0b8" side={THREE.DoubleSide} />
    </mesh>
  );
}

function CarModel() {
  return (
    <group>
      {/* Main body */}
      <mesh castShadow position={[0, 0.58, 0]}>
        <boxGeometry args={[1.55, 0.48, 2.7]} />
        <meshStandardMaterial
          color="#d94b31"
          metalness={0.22}
          roughness={0.36}
        />
      </mesh>
      {/* Cabin */}
      <mesh castShadow position={[0, 0.99, -0.18]}>
        <boxGeometry args={[1.15, 0.55, 1.3]} />
        <meshStandardMaterial
          color="#263b47"
          metalness={0.25}
          roughness={0.25}
        />
      </mesh>
      {/* Windscreen / roof highlight */}
      <mesh position={[0, 1.275, -0.18]}>
        <boxGeometry args={[1.03, 0.035, 1.13]} />
        <meshStandardMaterial
          color="#9fc5d0"
          metalness={0.25}
          roughness={0.18}
        />
      </mesh>
      {/* Bumpers */}
      <mesh position={[0, 0.43, 1.39]}>
        <boxGeometry args={[1.45, 0.16, 0.12]} />
        <meshStandardMaterial color="#25282b" metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.43, -1.39]}>
        <boxGeometry args={[1.45, 0.16, 0.12]} />
        <meshStandardMaterial color="#25282b" metalness={0.2} />
      </mesh>
      {/* Wheels: car faces local +Z */}
      {[-1, 1].map((x) =>
        [-0.88, 0.88].map((z) => (
          <group key={`${x}-${z}`} position={[x * 0.82, 0.36, z]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.34, 0.34, 0.22, 20]} />
              <meshStandardMaterial color="#17191b" roughness={0.9} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} position={[x * 0.11, 0, 0]}>
              <cylinderGeometry args={[0.17, 0.17, 0.025, 16]} />
              <meshStandardMaterial
                color="#aeb6b8"
                metalness={0.75}
                roughness={0.28}
              />
            </mesh>
          </group>
        )),
      )}
      {/* Headlights */}
      {[-0.48, 0.48].map((x) => (
        <mesh key={x} position={[x, 0.63, 1.37]}>
          <boxGeometry args={[0.28, 0.13, 0.035]} />
          <meshStandardMaterial
            color="#fff2c4"
            emissive="#ffd783"
            emissiveIntensity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

function AnimatedCar({ curve, speed = 0.022 }) {
  const car = useRef();
  const wheelSpin = useRef(0);

  useFrame((state, delta) => {
    if (!car.current) return;

    // Delta-based animation keeps movement consistent across frame rates.
    const t = (state.clock.elapsedTime * speed) % 1;
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();

    const x = point.x;
    const z = point.z;
    car.current.position.set(x, terrainHeight(x, z) + 0.58, z);

    // The model's front points along +Z, so rotate its nose along the spline.
    car.current.rotation.y = Math.atan2(tangent.x, tangent.z);

    // Small body movement gives the car a subtle suspension effect.
    car.current.position.y += Math.sin(state.clock.elapsedTime * 11) * 0.035;
    wheelSpin.current -= delta * 7;
  });

  return (
    <group ref={car}>
      <CarModel />
    </group>
  );
}

function Scenery() {
  const trees = useMemo(() => {
    const items = [];
    // Deterministic pseudo-random scatter; keep a clear margin around the road.
    let seed = 9182;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < 95; i++) {
      const x = (random() - 0.5) * 88;
      const z = (random() - 0.5) * 88;
      // The winding road occupies the central area; avoid clutter right beside it.
      if (Math.abs(x) < 12 && Math.abs(z) < 12) continue;
      items.push({ x, z, scale: 0.65 + random() * 0.8 });
    }
    return items;
  }, []);

  return (
    <group>
      {trees.map((tree, i) => {
        const y = terrainHeight(tree.x, tree.z);
        return (
          <group key={i} position={[tree.x, y, tree.z]} scale={tree.scale}>
            <mesh castShadow position={[0, 0.8, 0]}>
              <cylinderGeometry args={[0.13, 0.22, 1.6, 7]} />
              <meshStandardMaterial color="#59452e" roughness={1} />
            </mesh>
            <mesh castShadow position={[0, 2.0, 0]}>
              <coneGeometry args={[0.9, 2.4, 7]} />
              <meshStandardMaterial
                color={i % 3 === 0 ? "#345b38" : "#426c3c"}
                roughness={1}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Scene() {
  const curve = useMemo(() => createRoadCurve(), []);

  return (
    <>
      <color attach="background" args={["#b9d1df"]} />
      <fog attach="fog" args={["#b9d1df", 65, 145]} />
      <ambientLight intensity={0.72} />
      <directionalLight
        position={[25, 38, 15]}
        intensity={2.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight args={["#dbeeff", "#63784b", 0.5]} />

      <Terrain />
      <Road curve={curve} />
      <Scenery />
      <AnimatedCar curve={curve} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#50634a" roughness={1} />
      </mesh>

      <OrbitControls
        makeDefault
        target={[0, 1, 0]}
        minDistance={18}
        maxDistance={100}
        maxPolarAngle={Math.PI / 2.05}
      />
    </>
  );
}

export default function TDrive() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#b9d1df",
      }}
    >
      <Canvas
        shadows
        camera={{ position: [58, 48, 62], fov: 42, near: 0.1, far: 500 }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>

      <div
        style={{
          position: "absolute",
          left: 18,
          bottom: 18,
          padding: "10px 13px",
          borderRadius: 8,
          background: "rgba(20, 28, 25, 0.72)",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          fontSize: 13,
          pointerEvents: "none",
        }}
      >
        <strong>Terrain Drive</strong>
        <div style={{ opacity: 0.82, marginTop: 3 }}>
          Car is driving automatically · Drag to orbit · Scroll to zoom
        </div>
      </div>
    </div>
  );
}
