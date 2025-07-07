import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export const Shoes: React.FC = () => {
  const { raycaster } = useThree();
  const gltf = useLoader(GLTFLoader, "/models/custom.glb");

  const shoesClick = () => {
    const intersects = raycaster.intersectObjects(gltf.scene.children, true);
    if (intersects.length > 0) {
      const mesh = intersects[0].object as THREE.Mesh;
      const material = mesh.material as THREE.MeshStandardMaterial;

      const cloneMaterial = material.clone();
      mesh.material = cloneMaterial;
      cloneMaterial.color = new THREE.Color("blue");
    }
  };

  return (
    <mesh>
      <primitive object={gltf.scene} onClick={shoesClick} />
    </mesh>
  );
};
