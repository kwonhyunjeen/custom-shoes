import type { ShoePart } from "@/types/customization";

export const SHOE_PARTS = [
  {
    id: "collar",
    name: "Collar",
    displayName: "Collar",
  },
  { id: "laces", name: "Laces", displayName: "Laces" },
  {
    id: "eyestay",
    name: "Eyestay",
    displayName: "Eyestay",
  },
  { id: "insole", name: "Insole", displayName: "Insole" },
  {
    id: "mudguard",
    name: "Mudguard",
    displayName: "Mudguard",
  },
  {
    id: "midsole",
    name: "Midsole",
    displayName: "Midsole",
  },
  {
    id: "heel_counter",
    name: "Heel_Counter",
    displayName: "Heel Counter",
  },
  {
    id: "quarter",
    name: "Quarter",
    displayName: "Quarter",
  },
  { id: "logo", name: "Logo", displayName: "Logo" },
  {
    id: "outsole",
    name: "Outsole",
    displayName: "Outsole",
  },
  { id: "toe", name: "Toe", displayName: "Toe" },
  { id: "tongue", name: "Tongue", displayName: "Tongue" },
  { id: "vamp", name: "Vamp", displayName: "Vamp" },
] as const satisfies ShoePart[];
