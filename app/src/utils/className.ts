import { twMerge } from "tailwind-merge";

export function cn(...classNames: (string | false | null | undefined)[]) {
  return twMerge(classNames.filter(Boolean).join(" "));
}
