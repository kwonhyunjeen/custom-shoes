import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { useLoader } from "@react-three/fiber";

export const Shoes: React.FC = () => {
  const obj = useLoader(OBJLoader, "./models/custom.obj");
  const fbx = useLoader(FBXLoader, "./models/custom.fbx");

  return (
    <mesh>
      <primitive object={obj} />
      <primitive object={fbx} />
    </mesh>
  );
};
