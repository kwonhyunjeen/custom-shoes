import { SHOE_PARTS } from "@/data/shoeParts";
import type { ShoePart } from "@/types/customization";
import {
  BufferGeometry,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Color,
} from "three";

const VALID_SHOE_PART_IDS = SHOE_PARTS.map((part) => part.id);

export const getValidShoePartIds = (): ShoePart["id"][] => {
  return VALID_SHOE_PART_IDS;
};

// 파트 ID -> Mesh 이름으로 변환
export const convertPartIdToMeshNames = (partId: ShoePart["id"]): string[] => {
  const pascalCasePartName = partId
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("_");

  return [`${pascalCasePartName}_Right`, `${pascalCasePartName}_Left`];
};

export const getPartIdFromMeshName = (
  meshName: string,
): ShoePart["id"] | null => {
  if (!meshName) return null;

  const baseName = meshName.replace(/_(?:Right|Left)$/, "");

  const snakeCaseName = baseName
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "")
    .replace(/_+/g, "_");

  // 파트 검증
  const validPartIds = getValidShoePartIds();
  if (validPartIds.includes(snakeCaseName as ShoePart["id"])) {
    return snakeCaseName as ShoePart["id"];
  }

  return null;
};

export const findPartMeshes = (
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

export const applyColorToMeshes = (
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
