import type { ShoePart } from "@/types/customization";

export const PART_CAMERA_ANGLES: Record<
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
  collar: {
    azimuth: Math.PI / 3,
    elevation: 1,
    distance: 8,
  },
  foxing: {
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
