import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import {} from "@react-three/fiber";
import * as THREE from "three";
import { CameraControls } from "@react-three/drei";
import { useRef } from "react";

export const Shoes: React.FC = () => {
  const { raycaster } = useThree();
  const cameraControlsRef = useRef<CameraControls>(null!);

  const gltf = useLoader(GLTFLoader, "/models/custom.glb");

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
        ref={cameraControlsRef}
        enabled={true}
        dollyToCursor={true}
        minDistance={0.5}
        maxDistance={10}
      />
      <directionalLight position={[3, 3, 3]} />
      <primitive object={gltf.scene} onClick={shoesClick} />
    </>
  );
};
