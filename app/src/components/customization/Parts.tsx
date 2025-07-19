import { ScrollPicker } from "../ui/ScrollPicker";
import { cn } from "@/utils/className";
import {
  SHOE_PARTS,
  useCustomization,
  type ShoePart,
} from "@/contexts/CustomizationContext";

interface PartsProps {
  disabled?: boolean;
}

export const Parts = ({ disabled = false }: PartsProps) => {
  const { currentPart: currentPartProp, selectPart } = useCustomization();

  const currentPart = currentPartProp || SHOE_PARTS[0];

  const handleSelectionChange = (part: ShoePart) => {
    selectPart(part.id);
  };

  const renderPartItem = (part: ShoePart, isSelected: boolean) => (
    <div className="text-center">
      <div
        className={cn(
          "transition-all duration-200",
          isSelected ? "text-amber-100" : "text-stone-400",
        )}
      >
        {part.displayName}
      </div>
    </div>
  );

  return (
    <div className="h-fit">
      <h2 className="text-2xl font-semibold text-amber-100 mb-4">
        Select Parts
      </h2>
      <p className="text-sm text-amber-100/80 mb-6 uppercase">
        Choose shoe parts to customize
      </p>

      <ScrollPicker
        items={SHOE_PARTS}
        selectedItem={currentPart}
        onSelectionChange={handleSelectionChange}
        renderItem={renderPartItem}
        keyExtractor={(part) => part.id}
        height={240}
        itemHeight={50}
        disabled={disabled}
        snapToCenter={true}
        selectedItemClassName="text-amber-100 scale-105"
        unselectedItemClassName="text-stone-400"
        itemClassName="px-4"
      />
    </div>
  );
};
