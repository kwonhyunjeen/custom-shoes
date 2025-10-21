import type { ColorOption } from "@/types/customization";

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
    color: "#b33f47",
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
] as const satisfies ColorOption[];
