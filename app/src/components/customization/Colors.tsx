import { useCustomization } from "@/contexts/CustomizationContext";
import type { ColorOption } from "@/types/customization";
import { ColorPalette } from "../ui/ColorPalette";

export const Colors = () => {
  const { currentPartColor, changePartColor, getAvailableColors } =
    useCustomization();

  const availableColors = getAvailableColors();
  const handleColorSelect = (color: ColorOption) => {
    changePartColor(color.id);
  };

  return (
    <ColorPalette
      className="w-144 max-h-full"
      colors={availableColors}
      value={currentPartColor}
      onChange={handleColorSelect}
    />
  );
};
