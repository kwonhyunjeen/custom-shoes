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
    | "gray"
    | "white"
    | "cream"
    | "light-gray"
    | "golden"
    | "olive"
    | "dark-green"
    | "royal-blue"
    | "navy"
    | "pink"
    | "burgundy"
    | "sky-blue"
    | "red"
    | "orange"
    | "purple"
    | "teal"
    | "brown"
    | "coral"
    | "cocoa"
    | "sage";
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
    color: "#2D2D2D",
    name: "Black",
  },
  {
    id: "gray",
    color: "#8B9198",
    name: "Gray",
  },
  {
    id: "white",
    color: "#FFFFFF",
    name: "White",
  },
  {
    id: "cream",
    color: "#F5F1EB",
    name: "Cream",
  },
  {
    id: "light-gray",
    color: "#E8E6E1",
    name: "Light Gray",
  },
  {
    id: "golden",
    color: "#C89F3C",
    name: "Golden",
  },
  {
    id: "olive",
    color: "#8B9B7A",
    name: "Olive",
  },
  {
    id: "dark-green",
    color: "#2D3A28",
    name: "Dark Green",
  },
  {
    id: "royal-blue",
    color: "#6D9AD9",
    name: "Royal Blue",
  },
  {
    id: "navy",
    color: "#2E3B5A",
    name: "Navy",
  },
  {
    id: "pink",
    color: "#E8C5CE",
    name: "Pink",
  },
  {
    id: "burgundy",
    color: "#8B3A3A",
    name: "Burgundy",
  },
  {
    id: "red",
    color: "#C42126",
    name: "Red",
  },
  {
    id: "orange",
    color: "#F1A82E",
    name: "Orange",
  },
  {
    id: "purple",
    color: "#C4B5FD",
    name: "Light Purple",
  },
  {
    id: "teal",
    color: "#14B8A6",
    name: "Teal",
  },
  {
    id: "brown",
    color: "#6C4C3E",
    name: "Brown",
  },
  {
    id: "coral",
    color: "#F87171",
    name: "Coral",
  },
  {
    id: "cocoa",
    color: "#A2857B",
    name: "Cocoa",
  },
  {
    id: "sage",
    color: "#9CAF88",
    name: "Sage",
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

  const [currentPartId, selectPartId] =
    useState<ShoePart["id"]>("heel_counter");

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
