import { useState, useRef, useCallback, useMemo, useLayoutEffect } from "react";
import { cn } from "@/utils/className";

interface ScrollPickerProps<T> {
  getKey?: (item: T) => string;
  items: T[];
  selectedItem?: T;
  onSelectionChange?: (item: T, index: number) => void;
  renderItem?: (item: T) => React.ReactNode;
  className?: string;
  itemHeight?: number;
  width?: number | string;
  height?: number | string;
  disabled?: boolean;
  snapToCenter?: boolean;
  autoScrollDelay?: number;
}

export const ScrollPicker = <T,>({
  getKey = (item) => String(item),
  items,
  selectedItem,
  onSelectionChange,
  renderItem = (item) => String(item),
  className,
  itemHeight = 40,
  width = 224,
  height = 200,
  disabled = false,
  snapToCenter = true,
  autoScrollDelay = 150,
}: ScrollPickerProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitializedRef = useRef(false);

  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollBasedIndex, setScrollBasedIndex] = useState(0);

  const selectedIndex = useMemo(() => {
    if (!selectedItem) return 0;
    const index = items.findIndex(
      (item) => getKey(item) === getKey(selectedItem),
    );
    return index !== -1 ? index : 0;
  }, [selectedItem, items, getKey]);

  // 현재 중앙에 표시될 인덱스 (스크롤 중에는 scrollBasedIndex, 아니면 selectedIndex)
  const currentIndex = isScrolling ? scrollBasedIndex : selectedIndex;

  const getCenterIndex = useCallback(
    (scrollTop: number): number => {
      const index = Math.round(scrollTop / itemHeight);
      return Math.max(0, Math.min(index, items.length - 1));
    },
    [itemHeight, items.length],
  );

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

  useLayoutEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (containerRef.current && selectedIndex >= 0) {
      if (!isInitializedRef.current) {
        scrollToIndex(selectedIndex, false);
        setScrollBasedIndex(selectedIndex);
        isInitializedRef.current = true;
      } else if (selectedIndex !== scrollBasedIndex && !isScrolling) {
        scrollToIndex(selectedIndex, true);
        setScrollBasedIndex(selectedIndex);
      }
    }
  }, [selectedIndex, scrollToIndex, scrollBasedIndex, isScrolling]);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (disabled) return;

      const container = event.currentTarget;
      const scrollTop = container.scrollTop;
      const centerIndex = getCenterIndex(scrollTop);

      // 스크롤 중 실시간으로 중앙 아이템 하이라이트 업데이트
      setScrollBasedIndex(centerIndex);
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);

        if (containerRef.current) {
          const finalScrollTop = containerRef.current.scrollTop;
          const finalIndex = getCenterIndex(finalScrollTop);

          if (snapToCenter) {
            const targetScrollTop = finalIndex * itemHeight;
            const diff = Math.abs(finalScrollTop - targetScrollTop);

            if (diff > 2) {
              scrollToIndex(finalIndex, true);
            }
          }

          if (
            onSelectionChange &&
            items[finalIndex] &&
            finalIndex !== selectedIndex
          ) {
            onSelectionChange(items[finalIndex], finalIndex);
          }
        }
      }, autoScrollDelay);
    },
    [
      disabled,
      getCenterIndex,
      snapToCenter,
      itemHeight,
      scrollToIndex,
      onSelectionChange,
      items,
      selectedIndex,
      autoScrollDelay,
    ],
  );

  const handleItemClick = useCallback(
    (item: T, index: number) => {
      if (disabled || index === selectedIndex) return;
      scrollToIndex(index, true);
      onSelectionChange?.(item, index);
    },
    [disabled, selectedIndex, onSelectionChange, scrollToIndex],
  );

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
        case "Home":
          event.preventDefault();
          if (selectedIndex !== 0) {
            onSelectionChange?.(items[0], 0);
          }
          break;
        case "End":
          event.preventDefault();
          if (selectedIndex !== items.length - 1) {
            const lastIndex = items.length - 1;
            onSelectionChange?.(items[lastIndex], lastIndex);
          }
          break;
      }
    },
    [disabled, selectedIndex, items, onSelectionChange],
  );

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ width, height }}
    >
      <div className="absolute top-0 left-0 right-0 bg-linear-to-b from-gray-100 from-20% to-transparent pointer-events-none z-10 h-20" />
      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-gray-100 from-20% to-transparent pointer-events-none z-10 h-20" />

      <div
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2 rounded-xl pointer-events-none backdrop-blur-md"
        style={{ height: itemHeight }}
      />

      <div
        ref={containerRef}
        className={cn(
          "h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide overscroll-contain select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          disabled && "pointer-events-none opacity-50",
          "before:h-[calc(50%-calc(var(--item-height)/2))] after:h-[calc(50%-calc(var(--item-height)/2))] before:block after:block",
        )}
        style={
          {
            "--item-height": `${itemHeight}px`,
          } as React.CSSProperties
        }
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        role="listbox"
        tabIndex={disabled ? -1 : 0}
      >
        {items.map((item, index) => {
          const isSelected = index === currentIndex;
          return (
            <div
              key={getKey(item)}
              className={cn(
                "flex items-center justify-center snap-center cursor-pointer transition-all",
                isSelected ? "font-semibold scale-110" : "opacity-60",
              )}
              style={{ height: itemHeight }}
              onClick={() => handleItemClick(item, index)}
              role="option"
              aria-selected={isSelected}
            >
              {renderItem(item)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
