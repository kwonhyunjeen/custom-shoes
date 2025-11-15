import { memo } from "react";
import type { ColorOption, ShoePart } from "@/types/customization";
import { ScrollPicker } from "@/components/ui/ScrollPicker";
import { useCustomization } from "@/contexts/CustomizationContext";
import { SHOE_PARTS } from "@/data/shoeParts";
import { ColorPalette } from "@/components/ui/ColorPalette";

interface PanelProps {
  disabled?: boolean;
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

const ChevronDownIcon = memo(({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
));

const ChevronUpIcon = memo(({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 15.75 7.5-7.5 7.5 7.5"
    />
  </svg>
));

const ChevronLeftIcon = memo(({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5 8.25 12l7.5-7.5"
    />
  </svg>
));

const ChevronRightIcon = memo(({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m8.25 4.5 7.5 7.5-7.5 7.5"
    />
  </svg>
));

export const Panel = ({
  disabled = false,
  isCollapsed = false,
  onCollapseChange,
}: PanelProps) => {
  const {
    currentPartColor,
    currentPart,
    changePartColor,
    selectPart,
    getAvailableColors,
    isHighlighting,
  } = useCustomization();
  const availableColors = getAvailableColors();

  const handleColorSelect = (color: ColorOption) => {
    if (isHighlighting) return;
    changePartColor(color.id);
  };

  const handleSelectionChange = (part: ShoePart) => {
    selectPart(part.id);
  };

  const toggleCollapse = () => {
    onCollapseChange?.(!isCollapsed);
  };

  const currentPartIndex = SHOE_PARTS.findIndex(
    (part) => part.id === currentPart?.id,
  );

  const goToPreviousPart = () => {
    const prevIndex =
      currentPartIndex === 0 ? SHOE_PARTS.length - 1 : currentPartIndex - 1;
    selectPart(SHOE_PARTS[prevIndex].id);
  };

  const goToNextPart = () => {
    const nextIndex =
      currentPartIndex === SHOE_PARTS.length - 1 ? 0 : currentPartIndex + 1;
    selectPart(SHOE_PARTS[nextIndex].id);
  };

  return (
    <div
      className={`absolute left-0 right-0 bottom-0 overflow-hidden bg-zinc-100 transition-all duration-300 ease-in-out ${
        isCollapsed ? "h-22" : "h-60"
      }`}
    >
      <button
        onClick={toggleCollapse}
        className="absolute top-6 left-8 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
        disabled={disabled}
      >
        {isCollapsed ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {isCollapsed ? (
        // Collapsed state: Part navigation only
        <div className="flex items-center justify-center h-full gap-8">
          <button
            onClick={goToPreviousPart}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={disabled}
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>

          <div className="text-center min-w-32">
            <h3 className="font-medium text-gray-900">
              {currentPart?.displayName}
            </h3>
          </div>

          <button
            onClick={goToNextPart}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={disabled}
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      ) : (
        // Expanded state: Full interface
        <div className="flex justify-center items-center gap-14 h-full">
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
      )}
    </div>
  );
};
