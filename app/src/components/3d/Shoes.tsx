import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import {
  Mesh,
  Object3D,
  BufferGeometry,
  Material,
  MeshStandardMaterial,
  Color,
} from "three";

import { useRef, useEffect } from "react";
import type { ShoePart } from "@/types/customization";
import { useCustomization } from "@/contexts/CustomizationContext";
import { COLOR_OPTIONS } from "@/data/colorOptions";

const PART_CAMERA_ANGLES: Record<
  ShoePart["id"],
  {
    azimuth: number; // 수평 회전 각도 (라디안)
    elevation: number; // 수직 각도 (라디안)
    distance: number; // 신발 중앙에서의 거리
  }
> = {
  toe: {
    azimuth: Math.PI / 6,
    elevation: 0.5,
    distance: 8,
  },
  vamp: {
    azimuth: 0,
    elevation: 0.4,
    distance: 8,
  },
  mudguard: {
    azimuth: Math.PI / 10,
    elevation: 0.3,
    distance: 8,
  },
  quarter: {
    azimuth: Math.PI / 2.4,
    elevation: 0.5,
    distance: 8,
  },
  eyestay: {
    azimuth: Math.PI / 3,
    elevation: 0.3,
    distance: 8,
  },
  collar: {
    azimuth: Math.PI / 3,
    elevation: 1,
    distance: 8,
  },
  heel_counter: {
    azimuth: Math.PI / 1.8,
    elevation: 0.2,
    distance: 8,
  },
  tongue: {
    azimuth: 0,
    elevation: 0.8,
    distance: 8,
  },
  laces: {
    azimuth: 0,
    elevation: 0.6,
    distance: 8,
  },
  outsole: {
    azimuth: 0,
    elevation: -0.8,
    distance: 8,
  },
  midsole: {
    azimuth: Math.PI / 5,
    elevation: 0.3,
    distance: 8,
  },
  insole: {
    azimuth: 0,
    elevation: 1.4,
    distance: 8,
  },
  logo: {
    azimuth: Math.PI / 2,
    elevation: 0.1,
    distance: 8,
  },
};

// 구면 좌표계를 직교 좌표계로 변환
const sphericalToCartesian = (
  azimuth: number,
  elevation: number,
  distance: number,
  center: [number, number, number] = [0, 0, 0],
): [number, number, number] => {
  const x = center[0] + distance * Math.cos(elevation) * Math.sin(azimuth);
  const y = center[1] + distance * Math.sin(elevation);
  const z = center[2] + distance * Math.cos(elevation) * Math.cos(azimuth);
  return [x, y, z];
};

const convertPartIdToMeshNames = (partId: ShoePart["id"]): string[] => {
  const pascalCasePartName = partId
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("_");

  return [`${pascalCasePartName}_Right`, `${pascalCasePartName}_Left`];
};

const findPartMeshes = (
  scene: Object3D,
  partId: ShoePart["id"],
): Mesh<BufferGeometry, Material | Material[]>[] => {
  const meshNames = convertPartIdToMeshNames(partId);
  const foundMeshes: Mesh<BufferGeometry, Material | Material[]>[] = [];

  scene.traverse((child) => {
    if (child instanceof Mesh && child.name && meshNames.includes(child.name)) {
      foundMeshes.push(child as Mesh<BufferGeometry, Material | Material[]>);
    }
  });

  return foundMeshes;
};

const applyColorToMeshes = (
  meshes: Mesh<BufferGeometry, Material | Material[]>[],
  hexColor: string,
): void => {
  meshes.forEach((mesh) => {
    if (mesh.material) {
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((material) => {
        if (material instanceof MeshStandardMaterial) {
          const newMaterial = material.clone();
          newMaterial.color = new Color(hexColor);

          if (!Array.isArray(mesh.material)) {
            mesh.material = newMaterial;
          } else {
            const materialIndex = materials.indexOf(material);
            mesh.material[materialIndex] = newMaterial;
          }
        }
      });
    }
  });
};

const animateCameraToPart = (
  controls: CameraControls | null,
  partId: ShoePart["id"],
): void => {
  if (!controls) return;

  const cameraConfig = PART_CAMERA_ANGLES[partId];
  if (!cameraConfig) return;

  const { azimuth, elevation, distance } = cameraConfig;

  const shoeCenter: [number, number, number] = [0, 0, 0];

  const cameraPosition = sphericalToCartesian(
    azimuth,
    elevation,
    distance,
    shoeCenter,
  );

  void controls.setLookAt(
    cameraPosition[0],
    cameraPosition[1],
    cameraPosition[2], // camera position
    shoeCenter[0],
    shoeCenter[1],
    shoeCenter[2], // target (신발 중앙)
    true, // enableTransition
  );
};

export const Shoes = () => {
  const gltf = useLoader(GLTFLoader, "/models/custom.glb");
  const { shoesColors, currentPart } = useCustomization();

  const cameraControlsRef = useRef<CameraControls>(null);

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [gltf]);

  useEffect(() => {
    Object.entries(shoesColors).forEach(([partId, colorId]) => {
      const meshes = findPartMeshes(gltf.scene, partId as ShoePart["id"]);
      const colorOption = COLOR_OPTIONS.find((color) => color.id === colorId);

      if (meshes.length > 0 && colorOption) {
        applyColorToMeshes(meshes, colorOption.color);
      }
    });
  }, [gltf, shoesColors]);

  // 파트 선택 시 카메라 애니메이션
  useEffect(() => {
    if (cameraControlsRef.current && currentPart) {
      animateCameraToPart(cameraControlsRef.current, currentPart.id);
    }
  }, [currentPart]);

  useEffect(() => {
    if (cameraControlsRef.current) {
      const controls = cameraControlsRef.current;
      controls.mouseButtons.wheel = 0;
    }
  }, []);

  return (
    <>
      <CameraControls ref={cameraControlsRef} enabled={true} smoothTime={0.5} />

      <primitive object={gltf.scene} />
    </>
  );
};
