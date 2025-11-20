import { useCallback, useMemo, useState } from "react";
import { Scene } from "./Scene";
import { Generator } from "./Generator";
import { Panel } from "./Panel";
import { Shoes } from "./Shoes";
import type { ColorOption, ShoePart } from "@/types/customization";
import { SHOE_PARTS } from "@/data/shoeParts";
import { COLOR_OPTIONS } from "@/data/colorOptions";
import { PART_COLOR_RULES } from "@/data/partColorRules";
import { ColorPalette } from "../ui/ColorPalette";
import { ChevronLeftIcon, ChevronRightIcon } from "../ui/Icon";
import { ScrollPicker } from "../ui/ScrollPicker";
import { nonNullable } from "@/utils/typeGuard";

export const ShoeCustomizer = () => {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [shoesColors, setShoesColors] = useState<
    Record<ShoePart["id"], ColorOption["id"]>
  >(
    SHOE_PARTS.reduce(
      (acc, part) => {
        acc[part.id] = "white";
        return acc;
      },
      {} as Record<ShoePart["id"], ColorOption["id"]>,
    ),
  );

  const [currentPartId, selectPartId] = useState<ShoePart["id"]>("mudguard");
  const [isHighlighting, setIsHighlighting] = useState(false);

  const currentPart = useMemo(() => {
    const part = SHOE_PARTS.find((part) => part.id === currentPartId);
    if (!part) {
      throw new Error(`Part with id ${currentPartId} not found`);
    }
    return part;
  }, [currentPartId]);

  const currentPartColor = useMemo(() => {
    const currentColorId = shoesColors[currentPartId];
    const color = COLOR_OPTIONS.find((color) => color.id === currentColorId);
    if (!color) {
      throw new Error(`Color with id ${currentColorId} not found`);
    }
    return color;
  }, [currentPartId, shoesColors]);

  const selectPart = useCallback((partId: ShoePart["id"]) => {
    selectPartId(partId);
  }, []);

  const changePartColor = useCallback(
    (colorId: ColorOption["id"]) => {
      if (!currentPartId) return;
      setShoesColors((prevCustomization) => ({
        ...prevCustomization,
        [currentPartId]: colorId,
      }));
    },
    [currentPartId],
  );

  const changePartColors = useCallback(
    (colors: Partial<Record<ShoePart["id"], ColorOption["id"]>>) => {
      setShoesColors((prevCustomization) => ({
        ...prevCustomization,
        ...colors,
      }));
    },
    [],
  );

  const getAvailableColors = useCallback(() => {
    const colorIds = PART_COLOR_RULES[currentPartId];

    return colorIds
      .map((color) => COLOR_OPTIONS.find((option) => option.id === color))
      .filter(nonNullable);
  }, [currentPartId]);

  // const resetPartColor = useCallback(() => {
  //   if (!currentPartId) return;
  //   setShoesColors((prevCustomization) => ({
  //     ...prevCustomization,
  //     [currentPartId]: "white",
  //   }));
  // }, [currentPartId]);

  const availableColors = getAvailableColors();

  const handleColorSelect = (color: ColorOption) => {
    if (isHighlighting) return;
    changePartColor(color.id);
  };

  const handleSelectionChange = (part: ShoePart) => {
    selectPart(part.id);
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
    <div className="h-screen relative">
      <Scene isPanelCollapsed={isPanelCollapsed}>
        <Shoes
          shoesColors={shoesColors}
          currentPart={currentPart}
          onPartSelect={selectPart}
          onHighlightingChange={setIsHighlighting}
        />
      </Scene>
      <Panel
        isCollapsed={isPanelCollapsed}
        onCollapseChange={setIsPanelCollapsed}
      >
        {isPanelCollapsed ? (
          // Collapsed state: Part navigation only
          <div className="flex items-center justify-center h-full gap-8">
            <button
              onClick={goToPreviousPart}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors disabled:opacity-50"
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
      </Panel>
      <Generator changePartColors={changePartColors} />
    </div>
  );
};
