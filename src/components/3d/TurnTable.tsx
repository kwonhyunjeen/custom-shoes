import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TurnTableProps {
  radius?: number;
  height?: number;
  rotationSpeed?: number;
}

export const TurnTable = ({
  radius = 0.8,
  height = 0.02,
  rotationSpeed = 0.002,
}: TurnTableProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const crossRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
    if (crossRef.current) {
      crossRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group position={[0, -0.15, 0]}>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[radius, radius, height, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.02}
          roughness={0.05}
          transmission={0.95}
          thickness={0.3}
          ior={1.5}
          clearcoat={0.3}
          clearcoatRoughness={0.1}
          transparent={true}
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};
