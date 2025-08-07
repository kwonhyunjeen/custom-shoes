import { ScrollPicker } from "../ui/ScrollPicker";
import {
  SHOE_PARTS,
  useCustomization,
  type ShoePart,
} from "@/contexts/CustomizationContext";

interface PartsProps {
  disabled?: boolean;
}

export const Parts = ({ disabled = false }: PartsProps) => {
  const { currentPart, selectPart } = useCustomization();

  const handleSelectionChange = (part: ShoePart) => {
    selectPart(part.id);
  };

  const renderPartItem = (part: ShoePart) => (
    <div className="text-center uppercase">
      <div>{part.displayName}</div>
    </div>
  );

  return (
    <ScrollPicker
      keyExtractor={(part) => part.id}
      items={SHOE_PARTS}
      selectedItem={currentPart}
      onSelectionChange={handleSelectionChange}
      disabled={disabled}
      renderItem={renderPartItem}
      className="w-55"
      itemClassName="px-4"
      height={300}
      itemHeight={60}
      snapToCenter={true}
    />
  );
};
