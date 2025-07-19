import React, {
  createContext,
  useState,
  use,
  useMemo,
  useCallback,
} from "react";
import type { ReactNode } from "react";

export interface ShoePart {
  id:
    | "collar"
    | "eyestay"
    | "heel_counter"
    | "insole"
    | "laces"
    | "logo"
    | "midsole"
    | "mudguard"
    | "outsole"
    | "quarter"
    | "toe"
    | "tongue"
    | "vamp";
  name: string;
  displayName: string;
}

export interface ColorOption {
  id:
    | "black"
    | "white"
    | "cobblestone"
    | "sport-red"
    | "sail"
    | "old-royal"
    | "royal-tint"
    | "pink-foam"
    | "kumquat"
    | "tour-yellow"
    | "light-bone"
    | "malachite";
  color: string;
  name: string;
}

export const SHOE_PARTS = [
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
] as const satisfies ShoePart[];

export const COLOR_OPTIONS = [
  {
    id: "black",
    color: "#000000",
    name: "Black",
  },
  {
    id: "white",
    color: "#ffffff",
    name: "White",
  },
  {
    id: "cobblestone",
    color: "#979C98",
    name: "Cobblestone",
  },
  {
    id: "sport-red",
    color: "#9F072D",
    name: "Sport Red",
  },
  {
    id: "sail",
    color: "#D4CCC3",
    name: "Sail",
  },
  {
    id: "old-royal",
    color: "#151468",
    name: "Old Royal",
  },
  {
    id: "royal-tint",
    color: "#A0BBE0",
    name: "Royal Tint",
  },
  {
    id: "pink-foam",
    color: "#E8CED2",
    name: "Pink Foam",
  },
  {
    id: "kumquat",
    color: "#E48F3E",
    name: "Kumquat",
  },
  {
    id: "tour-yellow",
    color: "#FFD73D",
    name: "Tour Yellow",
  },
  {
    id: "light-bone",
    color: "#EDEBDE",
    name: "Light Bone",
  },
  {
    id: "malachite",
    color: "#316E55",
    name: "Malachite",
  },
] as const satisfies ColorOption[];

interface CustomizationContextType {
  shoesColors: Record<ShoePart["id"], ColorOption["id"]>;
  currentPart: ShoePart;
  currentPartColor: ColorOption;
  selectPart: (part: ShoePart["id"]) => void;
  changePartColor: (color: ColorOption["id"]) => void;
  changePartColors: (
    colors: Partial<Record<ShoePart["id"], ColorOption["id"]>>,
  ) => void;
  resetPartColor: () => void;
}

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

  const [currentPartId, selectPartId] = useState<ShoePart["id"]>("collar");

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
