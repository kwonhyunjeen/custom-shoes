import { useState } from "react";
import {
  useCustomization,
  type ColorOption,
  type ShoePart,
} from "@/contexts/CustomizationContext";

const AIIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="currentColor"
    className={className}
  >
    <path d="m176-120-56-56 301-302-181-45 198-123-17-234 179 151 216-88-87 217 151 178-234-16-124 198-45-181-301 301Zm24-520-80-80 80-80 80 80-80 80Zm355 197 48-79 93 7-60-71 35-86-86 35-71-59 7 92-79 49 90 22 23 90Zm165 323-80-80 80-80 80 80-80 80ZM569-570Z" />
  </svg>
);

export const Generator = () => {
  const { changePartColors } = useCustomization();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateClick = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:54321/functions/v1/generate-shoes-color",
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input,
          }),
        },
      );

      const colors = (await response.json()) as Record<
        ShoePart["id"],
        ColorOption["id"]
      >;

      changePartColors(colors);
      setInput("");
      setIsOpen(false); // Close after successful generation
    } catch {
      // Handle error silently or show user notification
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleGenerateClick();
    }
    if (e.key === "Escape") {
      setIsOpen(false);
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-100">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl p-3 rounded-full transition-all duration-300 hover:scale-110"
      >
        <AIIcon className="w-6 h-6 text-stone-600 group-hover:text-stone-800 transition-colors animate-pulse" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
      </button>
      <div
        className={`absolute bottom-0 right-16 transition-all duration-300 ease-out ${
          isOpen
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "translate-x-8 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 min-w-80 border border-white/20">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your shoe design..."
            className="w-full h-20 p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent text-sm"
            disabled={isLoading}
            autoFocus={isOpen}
          />
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => void handleGenerateClick()}
              disabled={!input.trim() || isLoading}
              className="flex-1 px-4 py-2 bg-stone-600 text-white rounded-md hover:bg-stone-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setInput("");
              }}
              className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
