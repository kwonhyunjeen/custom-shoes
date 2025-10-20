import type { PointEventType } from "@/types/interaction";

export const getClientPosition = (event: PointEventType) => {
  const clientX =
    event.clientX || (event.touches && event.touches[0]?.clientX) || 0;
  const clientY =
    event.clientY || (event.touches && event.touches[0]?.clientY) || 0;
  return { x: clientX, y: clientY };
};
