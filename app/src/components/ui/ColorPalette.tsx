import type { ColorOption } from "@/types/customization";
import { cn } from "@/utils/className";

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
  const handleKeyDown = (event: React.KeyboardEvent, color: ColorOption) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onChange?.(color);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4 items-center", className)}>
      <div
        className="overflow-y-auto grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2 scroll-smooth"
        role="group"
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
                onKeyDown={(e) => handleKeyDown(e, color)}
                aria-label={`Select ${color.name} color`}
                aria-pressed={isSelected}
                role="radio"
                aria-checked={isSelected}
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
                </div>

                {isSelected && (
                  <div className="absolute inset-0 rounded-xl pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-sm font-medium text-gray-900">{value.name}</div>
    </div>
  );
};
