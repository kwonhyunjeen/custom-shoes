import {
  useCustomization,
  type ColorOption,
} from "@/contexts/CustomizationContext";

const colorList: ColorOption[] = [
  {
    id: "black",
    color: "#000000",
    name: "Black",
  },
  {
    id: "white",
    color: "#ffffff",
    name: "White",
  },
  {
    id: "cobblestone",
    color: "#979C98",
    name: "Cobblestone",
  },
  {
    id: "sport-red",
    color: "#9F072D",
    name: "Sport Red",
  },
  {
    id: "sail",
    color: "#D4CCC3",
    name: "Sail",
  },
  {
    id: "old-royal",
    color: "#151468",
    name: "Old Royal",
  },
  {
    id: "royal-tint",
    color: "#A0BBE0",
    name: "Royal Tint",
  },
  {
    id: "pink-foam",
    color: "#E8CED2",
    name: "Pink Foam",
  },
  {
    id: "kumquat",
    color: "#E48F3E",
    name: "Kumquat",
  },
  {
    id: "tour-yellow",
    color: "#FFD73D",
    name: "Tour Yellow",
  },
  {
    id: "light-bone",
    color: "#EDEBDE",
    name: "Light Bone",
  },
  {
    id: "malachite",
    color: "#316E55",
    name: "Malachite",
  },
];

export const Colors = () => {
  const { selectedColor, setSelectedColor } = useCustomization();

  const currentSelectedColor = selectedColor || colorList[0];

  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color);
  };

  const handleKeyDown = (event: React.KeyboardEvent, color: ColorOption) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleColorSelect(color);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200/50 h-fit">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Customize Your Shoes
        </h2>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Select Color
        </p>
      </div>

      <div
        className="grid grid-cols-4 gap-3"
        role="group"
        aria-labelledby="color-selection-heading"
      >
        {colorList.map((color) => {
          const isSelected = currentSelectedColor.id === color.id;
          return (
            <button
              key={color.id}
              className={`
                relative group rounded-xl p-3 transition-all duration-200 ease-out
                ${
                  isSelected
                    ? "ring-2 ring-stone-600 ring-offset-2 scale-105"
                    : "hover:scale-102 hover:shadow-md"
                }
              `}
              onClick={() => handleColorSelect(color)}
              onKeyDown={(e) => handleKeyDown(e, color)}
              aria-label={`Select ${color.name} color`}
              aria-pressed={isSelected}
              role="radio"
              aria-checked={isSelected}
            >
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`
                    w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm
                    transition-all duration-200 ease-out
                    ${
                      isSelected
                        ? "shadow-lg transform scale-110"
                        : "group-hover:border-gray-300 group-hover:shadow-md"
                    }
                  `}
                  style={{ backgroundColor: color.color }}
                />
                <span
                  className={`
                  text-xs font-medium text-center transition-colors duration-200
                  ${isSelected ? "text-gray-900" : "text-gray-600"}
                `}
                >
                  {color.name}
                </span>
              </div>

              {isSelected && (
                <div className="absolute inset-0 rounded-xl pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Selected:{" "}
          <span className="font-medium text-gray-900">
            {currentSelectedColor.name}
          </span>
        </p>
      </div>
    </div>
  );
};
