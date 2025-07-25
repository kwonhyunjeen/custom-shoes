import { ScrollPicker } from "../ui/ScrollPicker";
import { cn } from "@/utils/className";
import {
  useCustomization,
  type ShoePart,
} from "@/contexts/CustomizationContext";

const SHOE_PARTS: ShoePart[] = [
  {
    id: "collar",
    name: "Collar",
    displayName: "Collar",
  },
  {
    id: "eyestay",
    name: "Eyestay",
    displayName: "Eyestay",
  },
  {
    id: "heel_counter",
    name: "Heel_Counter",
    displayName: "Heel Counter",
  },
  { id: "insole", name: "Insole", displayName: "Insole" },
  { id: "laces", name: "Laces", displayName: "Laces" },
  { id: "logo", name: "Logo", displayName: "Logo" },
  {
    id: "midsole",
    name: "Midsole",
    displayName: "Midsole",
  },
  {
    id: "mudguard",
    name: "Mudguard",
    displayName: "Mudguard",
  },
  {
    id: "outsole",
    name: "Outsole",
    displayName: "Outsole",
  },
  {
    id: "quarter",
    name: "Quarter",
    displayName: "Quarter",
  },
  { id: "toe", name: "Toe", displayName: "Toe" },
  { id: "tongue", name: "Tongue", displayName: "Tongue" },
  { id: "vamp", name: "Vamp", displayName: "Vamp" },
];

interface PartsProps {
  disabled?: boolean;
}

export const Parts = ({ disabled = false }: PartsProps) => {
  const { selectedPart, setSelectedPart } = useCustomization();

  const currentSelectedPart = selectedPart || SHOE_PARTS[0];

  const handleSelectionChange = (part: ShoePart) => {
    setSelectedPart(part);
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
        selectedItem={currentSelectedPart}
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
