import type { PointEventType } from "@/types/interaction";
import type { ShoePart } from "@/types/customization";
import { getClientPosition } from "@/utils/event";
import { getPartIdFromMeshName } from "@/utils/mesh";
import { useCallback, useEffect, useState } from "react";

const CLICK_THRESHOLD = 5;

interface UseShoeInteractionProps {
  onPartSelect: (partId: ShoePart["id"]) => void;
}

export const useShoeInteraction = ({
  onPartSelect,
}: UseShoeInteractionProps) => {
  const [pointerStartPos, setPointerStartPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 시작점 저장
  const handlePointerDown = useCallback((event: PointEventType) => {
    const position = getClientPosition(event);

    setPointerStartPos(position);
    setIsDragging(false);
  }, []);

  // 드래그 감지
  const handlePointerMove = useCallback(
    (event: PointEventType) => {
      if (!pointerStartPos) return;

      const position = getClientPosition(event);

      const deltaX = position.x - pointerStartPos.x;
      const deltaY = position.y - pointerStartPos.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > CLICK_THRESHOLD) {
        setIsDragging(true);
      }
    },
    [pointerStartPos],
  );

  // 동작 종료
  const handlePointerUp = useCallback(
    (event: { stopPropagation: () => void; object: { name?: string } }) => {
      // 클릭 처리
      if (!isDragging && pointerStartPos) {
        event.stopPropagation();

        const clickedObject = event.object;
        if (clickedObject && clickedObject.name) {
          const partId = getPartIdFromMeshName(clickedObject.name);

          if (partId) {
            onPartSelect(partId);
          }
        }
      }

      setPointerStartPos(null);
      setIsDragging(false);
    },
    [isDragging, pointerStartPos, onPartSelect],
  );

  useEffect(() => {
    return () => {
      setPointerStartPos(null);
      setIsDragging(false);
    };
  }, []);

  // 윈도우 포커스 잃을 때 상태 초기화
  useEffect(() => {
    const handleBlur = () => {
      setPointerStartPos(null);
      setIsDragging(false);
    };

    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, []);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
};
