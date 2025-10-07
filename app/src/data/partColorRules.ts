import type { ShoePart, ColorOption } from "@/types/customization";

export type PartColorRule = ColorOption["id"][] | "all";

export const PART_COLOR_RULES: Record<ShoePart["id"], PartColorRule> = {
  collar: ["black", "white", "gray", "red", "navy", "burgundy", "brown"],
  laces: ["black", "white", "gray", "cream", "red", "navy", "brown"],
  eyestay: ["black", "white", "gray", "brown", "navy"],
  insole: ["white", "cream", "light-gray", "black"],
  mudguard: ["black", "white", "gray", "brown", "navy", "dark-green"],
  midsole: ["white", "cream", "light-gray"],
  heel_counter: ["black", "gray", "white", "navy", "brown", "burgundy"],
  quarter: "all",
  logo: ["black", "white", "golden"],
  outsole: ["black", "white", "gray", "brown"],
  toe: "all",
  tongue: "all",
  vamp: "all",
} as const;
