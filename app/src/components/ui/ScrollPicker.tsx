import { useState, useRef, useCallback, useMemo, useLayoutEffect } from "react";
import { cn } from "@/utils/className";

interface ScrollPickerProps<T> {
  items: T[];
  selectedItem?: T;
  onSelectionChange?: (item: T, index: number) => void;
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  selectedItemClassName?: string;
  unselectedItemClassName?: string;
  height?: number;
  itemHeight?: number;
  width?: string;
  keyExtractor?: (item: T) => string;
  disabled?: boolean;
  snapToCenter?: boolean;
  autoScrollDelay?: number;
}

export const ScrollPicker = <T,>({
  items,
  selectedItem,
  onSelectionChange,
  renderItem = (item) => String(item),
  className,
  itemClassName,
  selectedItemClassName,
  unselectedItemClassName,
  height = 200,
  itemHeight = 40,
  width = "w-full",
  keyExtractor = (item) => String(item),
  disabled = false,
  snapToCenter = true,
  autoScrollDelay = 150,
}: ScrollPickerProps<T>) => {
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
      if (disabled) return;

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
    (item: T, index: number) => {
      if (disabled || index === selectedIndex) return;

      onSelectionChange?.(item, index);
    },
    [disabled, selectedIndex, onSelectionChange],
  );

  // 키보드 네비게이션
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

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

  const paddingSize = (height - itemHeight) / 2;

  return (
    <div className={cn("relative", width, className)} style={{ height }}>
      {/* 중앙 하이라이트 영역 */}
      <div
        className="absolute left-0 right-0 bg-white/10 border border-white/20 rounded-lg pointer-events-none z-10 transition-opacity duration-200"
        style={{
          top: paddingSize,
          height: itemHeight,
          opacity: isScrolling ? 0.5 : 1,
        }}
      />

      <div
        ref={containerRef}
        className={cn(
          "h-full overflow-auto overflow-x-hidden scrollbar-hide snap-y snap-mandatory overscroll-contain",
          disabled && "pointer-events-none opacity-50",
        )}
        style={{ paddingTop: paddingSize, paddingBottom: paddingSize }}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="listbox"
        aria-label="스크롤 선택기"
      >
        {items.map((item, index) => {
          const isSelected = index === currentIndex;
          return (
            <div
              key={keyExtractor(item)}
              className={cn(
                "flex items-center justify-center snap-center text-2xl cursor-pointer transition-all duration-300 ease-out",
                itemClassName,
                isSelected
                  ? cn(
                      "text-white/90 font-semibold transform scale-105",
                      selectedItemClassName,
                    )
                  : cn(
                      "text-stone-600 hover:text-stone-500",
                      unselectedItemClassName,
                    ),
              )}
              style={{
                height: itemHeight,
                // 깜빡임 방지를 위한 transform3d 사용 (GPU 가속)
                transform: isSelected
                  ? "translate3d(0, 0, 0) scale(1.05)"
                  : "translate3d(0, 0, 0) scale(1)",
                willChange: "transform, color",
              }}
              onClick={() => handleItemClick(item, index)}
              role="option"
              aria-selected={isSelected}
              aria-label={`${keyExtractor(item)} ${isSelected ? "선택됨" : ""}`}
            >
              {renderItem(item, isSelected)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
