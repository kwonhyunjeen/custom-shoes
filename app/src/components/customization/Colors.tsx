import {
  COLOR_OPTIONS,
  useCustomization,
  type ColorOption,
} from "@/contexts/CustomizationContext";

export const Colors = () => {
  const { currentPartColor, changePartColor } = useCustomization();

  const handleColorSelect = (color: ColorOption) => {
    changePartColor(color.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent, color: ColorOption) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleColorSelect(color);
    }
  };

  return (
    <div className="backdrop-blur-md">
      <div
        className="grid grid-cols-4 gap-2 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2 scroll-smooth"
        role="group"
        aria-labelledby="color-selection-heading"
      >
        {COLOR_OPTIONS.map((color) => {
          const isSelected = currentPartColor.id === color.id;
          return (
            <button
              key={color.id}
              className={`
                relative group rounded-xl p-3 cursor-pointer transition-all duration-200 ease-out
                ${isSelected ? "" : "hover:scale-103"}
              `}
              onClick={() => handleColorSelect(color)}
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

      <div className="mt-4 text-center">
        <span className="text-sm font-medium text-gray-900">
          {currentPartColor.name}
        </span>
      </div>
    </div>
  );
};
