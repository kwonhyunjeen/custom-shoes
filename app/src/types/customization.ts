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
    | "red"
    | "orange"
    | "purple"
    | "teal"
    | "brown"
    | "coral"
    | "cocoa";
  color: string;
  name: string;
}

export interface CustomizationContextType {
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
