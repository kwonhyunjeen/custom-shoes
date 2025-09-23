import type { ShoePart, ColorOption } from "@/types/customization";

export type PartColorRule = ColorOption["id"][] | "all";

export const PART_COLOR_RULES: Record<ShoePart["id"], PartColorRule> = {
  laces: ["black", "white", "gray", "cream", "red", "navy", "brown"],

  logo: ["black", "white", "golden"],

  outsole: ["black", "white", "gray", "brown"],

  midsole: ["white", "cream", "light-gray"],

  heel_counter: ["black", "gray", "white", "navy", "brown", "burgundy"],

  insole: ["white", "cream", "light-gray", "black"],

  mudguard: ["black", "white", "gray", "brown", "navy", "dark-green"],

  collar: ["black", "white", "gray", "red", "navy", "burgundy", "brown"],

  eyestay: ["black", "white", "gray", "brown", "navy"],

  tongue: "all",

  toe: "all",

  quarter: "all",

  vamp: "all",
} as const;
