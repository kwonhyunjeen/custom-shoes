import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { CameraControls } from "@react-three/drei";

export const Shoes = () => {
  const { raycaster } = useThree();

  const gltf = useLoader(GLTFLoader, "/models/shoes.glb");

  const shoesClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();

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
    <>
      <CameraControls
        enabled={true}
        dollyToCursor={true}
        minDistance={0.5}
        maxDistance={10}
      />

      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 8, -5]} intensity={0.8} />
      <directionalLight position={[0, -3, 0]} intensity={0.6} />
      <pointLight position={[2, 4, 2]} intensity={0.5} />
      <pointLight position={[-2, 4, -2]} intensity={0.5} />
      <ambientLight intensity={0.2} />

      <hemisphereLight args={["#ffffff", "#8ec5ff", 0.4]} />

      <primitive object={gltf.scene} onClick={shoesClick} />
    </>
  );
};
