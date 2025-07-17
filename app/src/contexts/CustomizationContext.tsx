import React, { createContext, useState, use } from "react";
import type { ReactNode } from "react";

export interface ShoePart {
  id: string;
  name: string;
  displayName: string;
}

export interface ColorOption {
  id: string;
  color: string;
  name: string;
}

interface CustomizationContextType {
  selectedPart: ShoePart | null;
  selectedColor: ColorOption | null;
  setSelectedPart: (part: ShoePart) => void;
  setSelectedColor: (color: ColorOption) => void;
  resetColor: () => void;
}

const CustomizationContext = createContext<CustomizationContextType | null>(
  null,
);

interface CustomizationProviderProps {
  children: ReactNode;
}

export const CustomizationProvider: React.FC<CustomizationProviderProps> = ({
  children,
}) => {
  const [selectedPart, setSelectedPart] = useState<ShoePart | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);

  const handleSetSelectedPart = (part: ShoePart) => {
    setSelectedPart(part);
    setSelectedColor(null); // 파트 변경 시 색상 초기화
  };

  const resetColor = () => {
    setSelectedColor(null);
  };

  return (
    <CustomizationContext.Provider
      value={{
        selectedPart,
        selectedColor,
        setSelectedPart: handleSetSelectedPart,
        setSelectedColor,
        resetColor,
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
