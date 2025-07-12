import { Canvas } from "@react-three/fiber";
import { Shoes } from "./Shoes";

export const Scene3D: React.FC = () => {
  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <Canvas camera={{ position: [5, 2, 5], fov: 50 }} shadows>
        <Shoes />
      </Canvas>
    </div>
  );
};
