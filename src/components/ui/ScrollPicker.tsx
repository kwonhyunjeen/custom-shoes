import { cn } from "@/utils/className";

interface ScrollPickerProps<T> {
  items?: T[];
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  selectedItem: T;
  renderItem?: (item: T) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  selectedItemClassName?: string;
  unselectedItemClassName?: string;
  height?: string;
  itemHeight?: string;
  width?: string;
  keyExtractor?: (item: T) => string;
  onItemClick?: (item: T) => void;
}

export const ScrollPicker = <T,>({
  items,
  onScroll,
  selectedItem,
  renderItem = (item) => String(item),
  className,
  itemClassName,
  selectedItemClassName,
  unselectedItemClassName,
  height = "200px",
  itemHeight = "40px",
  width = "w-40",
  keyExtractor = (item) => String(item),
  onItemClick,
}: ScrollPickerProps<T>) => {
  return (
    <div className={cn("relative", width, className)} style={{ height }}>
      <div
        className={cn(
          "h-full overflow-auto scrollbar-hide snap-y snap-mandatory overscroll-contain py-[80px]",
        )}
        onScroll={onScroll}
      >
        {items?.map((item) => (
          <div
            key={keyExtractor(item)}
            className={cn(
              "flex items-center justify-center snap-center text-2xl cursor-pointer transition-colors",
              itemClassName,
              selectedItem === item
                ? cn("text-white/70 font-semibold", selectedItemClassName)
                : cn("text-stone-700", unselectedItemClassName),
            )}
            style={{ height: itemHeight }}
            onClick={() => onItemClick?.(item)}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
};
