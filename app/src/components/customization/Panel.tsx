import type { ColorOption, ShoePart } from "@/types/customization";
import { ScrollPicker } from "@/components/ui/ScrollPicker";
import { useCustomization } from "@/contexts/CustomizationContext";
import { SHOE_PARTS } from "@/data/shoeParts";
import { ColorPalette } from "@/components/ui/ColorPalette";

interface PanelProps {
  disabled?: boolean;
}

export const Panel = ({ disabled = false }: PanelProps) => {
  const {
    currentPartColor,
    currentPart,
    changePartColor,
    selectPart,
    getAvailableColors,
  } = useCustomization();
  const availableColors = getAvailableColors();

  const handleColorSelect = (color: ColorOption) => {
    changePartColor(color.id);
  };

  const handleSelectionChange = (part: ShoePart) => {
    selectPart(part.id);
  };

  return (
    <div className="absolute w-full left-0 bottom-0 overflow-hidden h-60 flex justify-center items-center gap-14 bg-zinc-100">
      <ScrollPicker
        getKey={(part) => part.id}
        items={SHOE_PARTS}
        renderItem={(item) => item.displayName}
        onSelectionChange={handleSelectionChange}
        selectedItem={currentPart}
        width={180}
        height="100%"
        itemHeight={36}
        disabled={disabled}
        snapToCenter={true}
      />
      <ColorPalette
        className="w-144 max-h-full"
        colors={availableColors}
        value={currentPartColor}
        onChange={handleColorSelect}
      />
    </div>
  );
};
