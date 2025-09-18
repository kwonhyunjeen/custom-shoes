import type { ShoePart } from "@/types/customization";
import { ScrollPicker } from "../ui/ScrollPicker";
import { useCustomization } from "@/contexts/CustomizationContext";
import { SHOE_PARTS } from "@/data/shoeParts";

interface PartsProps {
  disabled?: boolean;
}

export const Parts = ({ disabled = false }: PartsProps) => {
  const { currentPart, selectPart } = useCustomization();

  const handleSelectionChange = (part: ShoePart) => {
    selectPart(part.id);
  };

  return (
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
  );
};
