// 카메라 각도(azimuth, elevation)를 3D 좌표(x, y, z)로 변환
export const sphericalToCartesian = (
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
