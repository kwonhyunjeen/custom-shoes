import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Shoes } from "./Shoes";

export const Scene3D: React.FC = () => {
  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <Canvas camera={{ position: [5, 2, 5], fov: 50 }}>
        <axesHelper args={[5]} />
        <gridHelper />
        <OrbitControls />
        <directionalLight position={[3, 3, 3]} />
        <Shoes />
      </Canvas>
    </div>
  );
};
