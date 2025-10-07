import React, {
  createContext,
  useState,
  use,
  useMemo,
  useCallback,
} from "react";
import type { ReactNode } from "react";

import type {
  ShoePart,
  ColorOption,
  CustomizationContextType,
} from "@/types/customization";
import { SHOE_PARTS } from "@/data/shoeParts";
import { COLOR_OPTIONS } from "@/data/colorOptions";
import { PART_COLOR_RULES } from "@/data/partColorRules";

const CustomizationContext = createContext<
  CustomizationContextType | undefined
>(undefined);

interface CustomizationProviderProps {
  children: ReactNode;
}

export const CustomizationProvider: React.FC<CustomizationProviderProps> = ({
  children,
}) => {
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
    const rule = PART_COLOR_RULES[currentPartId];

    if (rule === "all") {
      return COLOR_OPTIONS;
    }

    return COLOR_OPTIONS.filter((color) => rule.includes(color.id));
  }, [currentPartId]);

  const resetPartColor = useCallback(() => {
    if (!currentPartId) return;
    setShoesColors((prevCustomization) => ({
      ...prevCustomization,
      [currentPartId]: "white",
    }));
  }, [currentPartId]);

  return (
    <CustomizationContext.Provider
      value={{
        getAvailableColors,
        shoesColors,
        currentPart,
        currentPartColor,
        selectPart,
        changePartColor,
        changePartColors,
        resetPartColor,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = use(CustomizationContext);
  if (!context) {
    throw new Error(
      "useCustomization must be used within a CustomizationProvider",
    );
  }
  return context;
};
