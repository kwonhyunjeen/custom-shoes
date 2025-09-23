import { Canvas } from "@react-three/fiber";
import { Shoes } from "./Shoes";

export const Scene: React.FC = () => {
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

      <Shoes />
    </Canvas>
  );
};
