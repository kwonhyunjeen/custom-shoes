import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { CameraControls } from "@react-three/drei";
import {
  useCustomization,
  COLOR_OPTIONS,
} from "@/contexts/CustomizationContext";
import { useEffect, useRef } from "react";

// 각 파트별 최적 카메라 위치 정의 (타겟은 신발 정중앙으로 고정)
const CAMERA_POSITIONS: Record<
  string,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  collar: { position: [2, 4, 4], target: [0, 0, 0] },
  eyestay: { position: [5, 2, 3], target: [0, 0, 0] },
  heel_counter: { position: [-4, 2, -2], target: [0, 0, 0] },
  insole: { position: [0, 6, 2], target: [0, 0, 0] },
  laces: { position: [4, 3, 4], target: [0, 0, 0] },
  logo: { position: [-3, 2, 4], target: [0, 0, 0] },
  midsole: { position: [4, 0, 4], target: [0, 0, 0] },
  mudguard: { position: [5, 1, 3], target: [0, 0, 0] },
  outsole: { position: [2, -3, 5], target: [0, 0, 0] },
  quarter: { position: [-4, 2, 3], target: [0, 0, 0] },
  toe: { position: [6, 1, 2], target: [0, 0, 0] },
  tongue: { position: [3, 4, 5], target: [0, 0, 0] },
  vamp: { position: [5, 1.5, 4], target: [0, 0, 0] },
};

export const Shoes = () => {
  const { currentPart, shoesColors } = useCustomization();
  const gltf = useLoader(GLTFLoader, "/models/shoes.glb");
  const meshMaterialsRef = useRef<Map<string, THREE.MeshStandardMaterial>>(
    new Map(),
  );
  const cameraControlsRef = useRef<CameraControls>(null);

  // 3D 모델의 메시들을 파트별로 매핑
  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          const meshName = child.name;
          const clonedMaterial = child.material.clone();
          child.material = clonedMaterial;
          meshMaterialsRef.current.set(meshName, clonedMaterial);
        }
      });
    }
  }, [gltf.scene]);

  // 파트가 변경될 때 카메라 이동 및 깜빡임 애니메이션
  useEffect(() => {
    if (currentPart && meshMaterialsRef.current.size > 0) {
      const partName = currentPart.name;
      const leftMeshName = `${partName}_Left`;
      const rightMeshName = `${partName}_Right`;

      const leftMaterial = meshMaterialsRef.current.get(leftMeshName);
      const rightMaterial = meshMaterialsRef.current.get(rightMeshName);

      // 카메라 이동 애니메이션
      const cameraPosition = CAMERA_POSITIONS[currentPart.id];
      if (cameraPosition && cameraControlsRef.current) {
        void cameraControlsRef.current.setLookAt(
          ...cameraPosition.position,
          ...cameraPosition.target,
          true, // 애니메이션 활성화
        );
      }

      // 깜빡임 애니메이션 (검정색으로 1초간)
      const animateBlink = () => {
        if (leftMaterial) leftMaterial.color = new THREE.Color("black");
        if (rightMaterial) rightMaterial.color = new THREE.Color("black");

        setTimeout(() => {
          // 원본 색상 복원
          const currentColorId = shoesColors[currentPart.id];
          if (currentColorId) {
            const colorOption = COLOR_OPTIONS.find(
              (option) => option.id === currentColorId,
            );
            if (colorOption) {
              if (leftMaterial)
                leftMaterial.color = new THREE.Color(colorOption.color);
              if (rightMaterial)
                rightMaterial.color = new THREE.Color(colorOption.color);
            }
          }
        }, 1000);
      };

      animateBlink();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPart]);

  // 모든 파츠 색상 적용
  useEffect(() => {
    if (meshMaterialsRef.current.size > 0) {
      Object.entries(shoesColors).forEach(([partId, colorId]) => {
        if (colorId) {
          const partName = partId
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join("_");

          const leftMeshName = `${partName}_Left`;
          const rightMeshName = `${partName}_Right`;

          const leftMaterial = meshMaterialsRef.current.get(leftMeshName);
          const rightMaterial = meshMaterialsRef.current.get(rightMeshName);

          const colorOption = COLOR_OPTIONS.find(
            (option) => option.id === colorId,
          );
          if (colorOption) {
            if (leftMaterial) {
              leftMaterial.color = new THREE.Color(colorOption.color);
            }
            if (rightMaterial) {
              rightMaterial.color = new THREE.Color(colorOption.color);
            }
          }
        }
      });
    }
  }, [shoesColors]);

  const shoesClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    // 추후 3D 모델 클릭으로 파트 선택 기능 구현 예정
  };

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
