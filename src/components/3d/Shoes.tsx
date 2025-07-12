import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import {} from "@react-three/fiber";
import * as THREE from "three";
import { CameraControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

export const Shoes = () => {
  const { raycaster } = useThree();
  const cameraControlsRef = useRef<CameraControls>(null!);
  const [isRotating, setIsRotating] = useState(true);

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

      cameraControlsRef.current.fitToBox(mesh, true).catch((error) => {
        console.error("카메라 이동 중 오류 발생:", error);
      });
    }
  };

  useEffect(() => {
    cameraControlsRef.current.setTarget(0, 0, 0, false).catch((error) => {
      console.error("카메라 타겟 설정 중 오류:", error);
    });

    cameraControlsRef.current.addEventListener("control", () => {
      setIsRotating(false);
    });
    cameraControlsRef.current.addEventListener("sleep", () => {
      setIsRotating(true);
    });
  });

  const angleRef = useRef(0);
  const distance = 1.5;
  useFrame(() => {
    if (isRotating) {
      cameraControlsRef.current
        .setPosition(
          distance * Math.sin(angleRef.current),
          0.7,
          distance * Math.cos(angleRef.current),
          true,
        )
        .catch((error) => {
          console.error("카메라 위치 설정 중 오류:", error);
        });
      angleRef.current += 0.01;
    }
  });

  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        enabled={true}
        dollyToCursor={true}
        minDistance={0.5}
        // maxDistance={10}
      />
      <directionalLight position={[3, 3, 3]} />
      <primitive object={gltf.scene} onClick={shoesClick} />
    </>
  );
};
