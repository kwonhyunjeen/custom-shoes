import { useState, useRef, useCallback, useMemo, useLayoutEffect } from "react";
import { cn } from "@/utils/className";

interface ScrollPickerProps<T> {
  keyExtractor?: (item: T) => string;
  items: T[];
  selectedItem?: T;
  onSelectionChange?: (item: T, index: number) => void;
  disabled?: boolean;
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  height: number;
  itemHeight: number;
  snapToCenter?: boolean;
  autoScrollDelay?: number;
}

export const ScrollPicker = <T,>({
  keyExtractor = (item) => String(item),
  items,
  selectedItem,
  onSelectionChange,
  disabled = false,
  renderItem = (item) => String(item),
  className,
  itemClassName,
  height,
  itemHeight,
  snapToCenter = true,
  autoScrollDelay = 150,
}: ScrollPickerProps<T>) => {
  const paddingY = (height - itemHeight) / 2;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollBasedIndex, setScrollBasedIndex] = useState(0); // 스크롤 위치 기반 인덱스
  const isInitializedRef = useRef(false);
  const scrollTimeoutRef = useRef<number>(undefined);
  // selectedItem에서 기본 인덱스 계산
  const selectedIndex = useMemo(() => {
    if (!selectedItem) return 0;
    const index = items.findIndex(
      (item) => keyExtractor(item) === keyExtractor(selectedItem),
    );
    return index !== -1 ? index : 0;
  }, [selectedItem, items, keyExtractor]);

  // 현재 중앙에 표시될 인덱스 (스크롤 중에는 scrollBasedIndex, 아니면 selectedIndex)
  const currentIndex = isScrolling ? scrollBasedIndex : selectedIndex;

  // 특정 인덱스로 스크롤 (부드러운 애니메이션)
  const scrollToIndex = useCallback(
    (index: number, smooth = true) => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const targetScrollTop = index * itemHeight;

      container.scrollTo({
        top: targetScrollTop,
        behavior: smooth ? "smooth" : "auto",
      });
    },
    [itemHeight],
  );

  // 초기화 및 selectedItem 변경 시 스크롤 (useLayoutEffect로 깜빡임 방지)
  useLayoutEffect(() => {
    if (containerRef.current && selectedIndex >= 0) {
      // 첫 렌더링 시에는 즉시 스크롤 (애니메이션 없음)
      if (!isInitializedRef.current) {
        scrollToIndex(selectedIndex, false);
        setScrollBasedIndex(selectedIndex);
        isInitializedRef.current = true;
      } else {
        // 이후 변경 시에는 부드럽게 스크롤
        scrollToIndex(selectedIndex, true);
        setScrollBasedIndex(selectedIndex);
      }
    }
  }, [selectedIndex, scrollToIndex]);

  // 스크롤 이벤트 핸들러 (실시간 중앙 아이템 하이라이트)
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (disabled) return event.preventDefault();

      const container = event.currentTarget;
      const scrollTop = container.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const clampedIndex = Math.max(0, Math.min(index, items.length - 1));

      // 스크롤 중 실시간으로 중앙 아이템 하이라이트 업데이트
      setScrollBasedIndex(clampedIndex);
      setIsScrolling(true);

      // 스크롤 종료 감지
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);

        // 스냅 효과
        if (snapToCenter) {
          scrollToIndex(clampedIndex, true);
        }

        // 선택 변경 콜백 (현재 선택과 다를 때만)
        if (
          onSelectionChange &&
          items[clampedIndex] &&
          clampedIndex !== selectedIndex
        ) {
          onSelectionChange(items[clampedIndex], clampedIndex);
        }
      }, autoScrollDelay);
    },
    [
      disabled,
      itemHeight,
      items,
      onSelectionChange,
      snapToCenter,
      scrollToIndex,
      autoScrollDelay,
      selectedIndex,
    ],
  );

  // 아이템 클릭 핸들러
  const handleItemClick = useCallback(
    (event: React.MouseEvent, item: T, index: number) => {
      if (disabled || index === selectedIndex) return event.preventDefault();
      onSelectionChange?.(item, index);
    },
    [disabled, selectedIndex, onSelectionChange],
  );

  // 키보드 네비게이션
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return event.preventDefault();

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          if (selectedIndex > 0) {
            const newIndex = selectedIndex - 1;
            onSelectionChange?.(items[newIndex], newIndex);
          }
          break;
        case "ArrowDown":
          event.preventDefault();
          if (selectedIndex < items.length - 1) {
            const newIndex = selectedIndex + 1;
            onSelectionChange?.(items[newIndex], newIndex);
          }
          break;
      }
    },
    [disabled, selectedIndex, items, onSelectionChange],
  );

  return (
    <div className={cn("relative", className)} style={{ height }}>
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-black/5 border border-black/10 rounded-xl pointer-events-none backdrop-blur-md"
        style={{
          height: itemHeight,
        }}
      />
      <div
        ref={containerRef}
        className={cn(
          "h-full overflow-hidden overflow-y-auto scrollbar-hide snap-y snap-mandatory overscroll-contain select-none",
          disabled && "pointer-events-none opacity-50",
        )}
        style={{ paddingTop: paddingY, paddingBottom: paddingY }}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        role="listbox"
        tabIndex={0}
      >
        {items.map((item, index) => {
          const isSelected = index === currentIndex;
          return (
            <div
              key={keyExtractor(item)}
              className={cn(
                "flex items-center justify-center snap-center text-xl cursor-pointer transition-all transform-3d",
                itemClassName,
                isSelected
                  ? "font-normal scale-105"
                  : "font-light hover:text-stone-500",
              )}
              style={{ height: itemHeight }}
              onClick={(event) => handleItemClick(event, item, index)}
              role="option"
              aria-selected={isSelected}
            >
              {renderItem(item, isSelected)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
