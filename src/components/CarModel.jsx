import React from "react";

export default function CarModel() {
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
