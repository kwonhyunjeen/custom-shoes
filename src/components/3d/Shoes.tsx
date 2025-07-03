import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader } from "@react-three/fiber";

export const Shoes: React.FC = () => {
  const gltf = useLoader(GLTFLoader, "/models/custom.gltf");

  return (
    <mesh>
      <primitive object={gltf.scene} />
    </mesh>
  );
};
