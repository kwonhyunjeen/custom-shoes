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

import { useRef, useEffect, useCallback } from "react";
import type { ShoePart } from "@/types/customization";
import { useCustomization } from "@/contexts/CustomizationContext";
import { COLOR_OPTIONS } from "@/data/colorOptions";
import { SHOE_PARTS } from "@/data/shoeParts";
import { PART_CAMERA_ANGLES } from "@/data/cameraAngles";

const ANIMATION_CONFIG = {
  TOTAL_DURATION: 1000,
  FADE_IN: 300,
  FADE_OUT: 300,
  FRAME_INTERVAL: 16, // ~60fps
} as const;

const HIGHLIGHT_COLOR = "#d5e9f7";

// 카메라 각도(azimuth, elevation)를 3D 좌표(x, y, z)로 변환
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

const getPartIdFromMeshName = (meshName: string): ShoePart["id"] | null => {
  if (!meshName) return null;

  const baseName = meshName.replace(/_(?:Right|Left)$/, "");

  const snakeCaseName = baseName
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "")
    .replace(/_+/g, "_");

  // 파트 검증
  const validPartIds = SHOE_PARTS.map((part) => part.id);
  if (validPartIds.includes(snakeCaseName as ShoePart["id"])) {
    return snakeCaseName as ShoePart["id"];
  }

  return null;
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

/**
 * t값(0~1)에 따라 color1에서 color2로 점진적 색상 변화
 * 두 색상 사이를 부드럽게 전환 (Linear interpolation)
 * @param color1 시작 색상 (hex)
 * @param color2 종료 색상 (hex)
 * @param t 보간 비율 (0.0 ~ 1.0)
 */
const lerpColor = (color1: string, color2: string, t: number): string => {
  const startColor = new Color(color1);
  const endColor = new Color(color2);
  const result = startColor.clone().lerp(endColor, t);
  return `#${result.getHexString()}`;
};

const highlightPartMeshes = (
  meshes: Mesh<BufferGeometry, Material | Material[]>[],
  originalColor: string,
  onComplete?: () => void,
): void => {
  if (meshes.length === 0) return;

  const holdDuration =
    ANIMATION_CONFIG.TOTAL_DURATION -
    ANIMATION_CONFIG.FADE_IN -
    ANIMATION_CONFIG.FADE_OUT;

  const fadeIn = (elapsed: number) => {
    const normalizedProgress = Math.min(elapsed / ANIMATION_CONFIG.FADE_IN, 1);
    const easedProgress = 1 - Math.pow(1 - normalizedProgress, 3);
    const currentColor = lerpColor(
      originalColor,
      HIGHLIGHT_COLOR,
      easedProgress,
    );
    applyColorToMeshes(meshes, currentColor);

    if (elapsed < ANIMATION_CONFIG.FADE_IN) {
      requestAnimationFrame(() =>
        fadeIn(elapsed + ANIMATION_CONFIG.FRAME_INTERVAL),
      );
    } else {
      setTimeout(() => {
        fadeOut(0);
      }, holdDuration);
    }
  };

  const fadeOut = (elapsed: number) => {
    const normalizedProgress = Math.min(elapsed / ANIMATION_CONFIG.FADE_OUT, 1);
    const easedProgress = Math.pow(normalizedProgress, 3);
    const currentColor = lerpColor(
      HIGHLIGHT_COLOR,
      originalColor,
      easedProgress,
    );
    applyColorToMeshes(meshes, currentColor);

    if (elapsed < ANIMATION_CONFIG.FADE_OUT) {
      requestAnimationFrame(() =>
        fadeOut(elapsed + ANIMATION_CONFIG.FRAME_INTERVAL),
      );
    } else {
      onComplete?.();
    }
  };

  // 애니메이션 시작
  fadeIn(0);
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

  void controls
    .normalizeRotations()
    .setLookAt(
      cameraPosition[0],
      cameraPosition[1],
      cameraPosition[2],
      shoeCenter[0],
      shoeCenter[1],
      shoeCenter[2],
      true,
    );
};

export const Shoes = () => {
  const gltf = useLoader(GLTFLoader, "/models/custom.glb");
  const { shoesColors, currentPart, selectPart } = useCustomization();

  const cameraControlsRef = useRef<CameraControls>(null);
  const previousPartRef = useRef<ShoePart["id"] | null>(null);

  const handleMeshClick = useCallback(
    (event: { stopPropagation: () => void; object: { name?: string } }) => {
      event.stopPropagation();

      const clickedObject = event.object;
      if (!clickedObject || !clickedObject.name) return;

      const partId = getPartIdFromMeshName(clickedObject.name);

      if (partId) {
        selectPart(partId);
      }
    },
    [selectPart],
  );

  useEffect(() => {
    const meshNames: string[] = [];
    gltf.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.name) {
          meshNames.push(child.name);
        }
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

  // 파트 선택 시 하이라이트 애니메이션 및 카메라 애니메이션
  useEffect(() => {
    if (!currentPart) return;

    const currentPartId = currentPart.id;
    const previousPartId = previousPartRef.current;

    if (previousPartId !== currentPartId) {
      const meshes = findPartMeshes(gltf.scene, currentPartId);

      if (meshes.length > 0) {
        const colorOption = COLOR_OPTIONS.find(
          (color) => color.id === shoesColors[currentPartId],
        );
        const originalColor = colorOption?.color || "#FFFFFF";

        highlightPartMeshes(meshes, originalColor);
      }

      if (cameraControlsRef.current) {
        animateCameraToPart(cameraControlsRef.current, currentPartId);
      }

      previousPartRef.current = currentPartId;
    }
  }, [currentPart, gltf.scene, shoesColors]);

  useEffect(() => {
    if (cameraControlsRef.current) {
      const controls = cameraControlsRef.current;
      controls.mouseButtons.wheel = 0;
    }
  }, []);

  return (
    <>
      <CameraControls ref={cameraControlsRef} enabled={true} smoothTime={0.5} />

      <primitive
        object={gltf.scene}
        onClick={handleMeshClick}
        onTouchStart={handleMeshClick}
      />
    </>
  );
};
