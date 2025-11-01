import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";

interface SceneProps {
  children: ReactNode;
  isPanelCollapsed?: boolean;
}

// 카메라 FOV 애니메이션
const CameraController = ({
  isPanelCollapsed,
}: {
  isPanelCollapsed: boolean;
}) => {
  const targetFovRef = useRef(12);
  const currentFovRef = useRef(12);

  useEffect(() => {
    targetFovRef.current = isPanelCollapsed ? 10 : 12;
  }, [isPanelCollapsed]);

  useFrame(({ camera }) => {
    if (camera instanceof THREE.PerspectiveCamera) {
      const diff = targetFovRef.current - currentFovRef.current;
      if (Math.abs(diff) > 0.01) {
        currentFovRef.current += diff * 0.1;
        camera.fov = currentFovRef.current;
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
};

export const Scene = ({ children, isPanelCollapsed = false }: SceneProps) => {
  return (
    <Canvas
      camera={{ position: [4, 3, 5], fov: 12 }}
      shadows
      gl={{ antialias: true }}
    >
      <hemisphereLight args={["#f6f6ff", "#aaaab0", 1]} />

      <ambientLight intensity={0.25} />

      <directionalLight
        position={[0, 1, 0]}
        intensity={3}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0001}
      />

      <directionalLight
        position={[1, -1, 0]}
        intensity={0.25}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0001}
      />

      <directionalLight
        position={[0, -1, -1]}
        intensity={0.25}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0001}
      />

      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
      >
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.15} />
      </mesh>

      <CameraController isPanelCollapsed={isPanelCollapsed} />
      {children}
    </Canvas>
  );
};
