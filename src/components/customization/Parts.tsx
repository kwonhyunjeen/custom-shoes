import { useState } from "react";
import { ScrollPicker } from "../ui/ScrollPicker";

interface ShoePart {
  id: string;
  name: string;
  displayName: string;
}

// @todo dummy data for shoe parts
// @todo replace with real data from API
const SHOE_PARTS: ShoePart[] = [
  { id: "collar", name: "Collar", displayName: "Collar" },
  { id: "eyestay", name: "Eyestay", displayName: "Eyestay" },
  { id: "heel_counter", name: "Heel_Counter", displayName: "Heel Counter" },
  { id: "insole", name: "Insole", displayName: "Insole" },
  { id: "laces", name: "Laces", displayName: "Laces" },
  { id: "logo", name: "Logo", displayName: "Logo" },
  { id: "midsole", name: "Midsole", displayName: "Midsole" },
  { id: "mudguard", name: "Mudguard", displayName: "Mudguard" },
  { id: "outsole", name: "Outsole", displayName: "Outsole" },
  { id: "quarter", name: "Quarter", displayName: "Quarter" },
  { id: "toe", name: "Toe", displayName: "Toe" },
  { id: "tongue", name: "Tongue", displayName: "Tongue" },
  { id: "vamp", name: "Vamp", displayName: "Vamp" },
];

export const Parts = () => {
  const [selectedPart, setSelectedPart] = useState<ShoePart | null>(null);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const index = Math.round(container.scrollTop / 40);
    setSelectedPart(SHOE_PARTS[index] || null);
  };

  return (
    <div className="h-fit">
      <h2 className="text-xl font-semibold text-amber-100 mb-4">
        SELECT PARTS
      </h2>
      <p className="text-sm text-amber-100 mb-4">
        CHOOSE SHOE PARTS TO CUSTOMIZE
      </p>
      <ScrollPicker
        items={SHOE_PARTS.map((part) => part.displayName)}
        onScroll={handleScroll}
        selectedItem={selectedPart ? selectedPart.displayName : ""}
      />
    </div>
  );
};
