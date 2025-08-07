import { Canvas } from "@react-three/fiber";
import { Shoes } from "./Shoes";

export const Scene3D: React.FC = () => {
  return (
    <div className="h-full">
      <Canvas camera={{ position: [5, 2, 5], fov: 20 }} shadows>
        <Shoes />
      </Canvas>
    </div>
  );
};
