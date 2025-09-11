import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { Mesh } from "three";

import { useRef, useEffect } from "react";

export const Shoes = () => {
  const gltf = useLoader(GLTFLoader, "/models/custom.glb");

  const cameraControlsRef = useRef<CameraControls>(null);

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [gltf]);

  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        enabled={true}
        dollyToCursor={true}
        minDistance={0.5}
        maxDistance={10}
        smoothTime={0.5}
      />

      <primitive object={gltf.scene} />
    </>
  );
};
