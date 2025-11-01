import type { ColorOption } from "@/types/customization";
import { cn } from "@/utils/className";
import { useCallback, useId, useRef } from "react";

interface ColorPaletteProps {
  className?: string;
  colors: ColorOption[];
  value: ColorOption;
  onChange?: (color: ColorOption) => void;
}

export const ColorPalette = ({
  className,
  colors,
  value,
  onChange,
}: ColorPaletteProps) => {
  const colorGroupRef = useRef<HTMLDivElement>(null);
  const groupId = useId();
  const lableId = useId();

  const currentIndex = colors.findIndex((color) => color.id === value.id);

  const focusColorAt = useCallback((index: number) => {
    const colorButtons =
      colorGroupRef.current?.querySelectorAll('[role="radio"]');
    if (colorButtons && colorButtons[index]) {
      (colorButtons[index] as HTMLElement).focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const { key } = event;
      let newIndex = currentIndex;

      switch (key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          newIndex = currentIndex < colors.length - 1 ? currentIndex + 1 : 0;
          onChange?.(colors[newIndex]);
          setTimeout(() => focusColorAt(newIndex), 0);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : colors.length - 1;
          onChange?.(colors[newIndex]);
          setTimeout(() => focusColorAt(newIndex), 0);
          break;
        case "Home":
          event.preventDefault();
          onChange?.(colors[0]);
          setTimeout(() => focusColorAt(0), 0);
          break;
        case "End":
          event.preventDefault();
          onChange?.(colors[colors.length - 1]);
          setTimeout(() => focusColorAt(colors.length - 1), 0);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          break;
      }
    },
    [currentIndex, colors, onChange, focusColorAt],
  );

  return (
    <div className={cn("flex flex-col gap-4 items-center", className)}>
      <div
        ref={colorGroupRef}
        className="overflow-y-auto grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2 scroll-smooth"
        role="radiogroup"
        aria-labelledby={lableId}
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-wrap w-fit">
          {colors.map((color) => {
            const isSelected = value.id === color.id;
            return (
              <button
                key={color.id}
                className={`
                relative group rounded-xl p-3 cursor-pointer transition-all duration-200 ease-out
                ${isSelected ? "" : "hover:scale-103"}
              `}
                onClick={() => onChange?.(color)}
                role="radio"
                aria-checked={isSelected}
                tabIndex={isSelected ? 0 : -1}
                aria-label={`Select ${color.name} color`}
                aria-describedby={`${groupId}-${color.id}-desc`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`
                    w-8 h-8 rounded-full border border-gray-300 relative transition-all duration-200 ease-out
                    ${
                      isSelected
                        ? "before:content-[''] before:absolute before:-inset-[1px] before:rounded-full before:border before:border-gray-300 before:w-10 before:h-10 before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2"
                        : ""
                    }
                  `}
                    style={{ backgroundColor: color.color }}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 rounded-xl pointer-events-none" />
                  )}
                </div>

                {/* 스크린 리더 */}
                <div id={`${groupId}-${color.id}-desc`} className="sr-only">
                  {isSelected ? "Currently selected" : "Not selected"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-sm font-medium text-gray-900">{value.name}</div>
    </div>
  );
};
