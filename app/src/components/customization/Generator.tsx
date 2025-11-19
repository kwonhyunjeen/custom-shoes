import React, { useState, useEffect, useRef, useCallback } from "react";
import type { ColorOption, ShoePart } from "@/types/customization";
import { MagicIcon } from "../ui/Icon";
import { ResponseError } from "@/utils/response";
import { PART_COLOR_RULES_SCHEMA } from "@/data/partColorRules";
import z from "zod";

interface GeneratorProps {
  changePartColors: (
    colors: Partial<Record<ShoePart["id"], ColorOption["id"]>>,
  ) => void;
}

export const Generator = ({ changePartColors }: GeneratorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFirstrun, setIsFirstrun] = useState(true);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleDialog = useCallback((value: boolean) => {
    setIsOpen(value);
    if (value) {
      setIsFirstrun(false);
    } else {
      setInput("");
      setErrorMessage(null);
    }
  }, []);

  const handleGenerateClick = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (!response.ok) throw new ResponseError(response);

      const colorByPartIdDict = (await response.json()) as z.infer<
        ReturnType<(typeof PART_COLOR_RULES_SCHEMA)["partial"]>
      >;
      PART_COLOR_RULES_SCHEMA.partial().parse(colorByPartIdDict);

      changePartColors(colorByPartIdDict);
      toggleDialog(false);
    } catch (err) {
      clearTimeout(timeoutId);

      if (!(err instanceof Error)) {
        return setErrorMessage("An unknown error occurred.");
      }

      if (err instanceof ResponseError) {
        return setErrorMessage(
          "An error occurred while processing the request. Please try again.",
        );
      }

      if (err instanceof z.ZodError) {
        return setErrorMessage(
          "Unable to process the response. Please try again.",
        );
      }

      if (err.name === "AbortError") {
        return setErrorMessage("Request timed out. Please try again.");
      }

      setErrorMessage(
        "Unable to connect to the server. Please check your network.",
      );
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
      toggleDialog(false);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭으로 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        toggleDialog(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleDialog]);

  return (
    <div className="fixed bottom-5 right-10 z-100" ref={containerRef}>
      <button
        type="button"
        onClick={() => toggleDialog(!isOpen)}
        className="relative rounded-full"
      >
        {isFirstrun && (
          <>
            <div className="absolute inset-0 rounded-full bg-sky-400/50 animate-[ripple-1_2s_infinite]" />
            <div className="absolute inset-0 rounded-full bg-sky-500/50 animate-[ripple-2_2s_infinite]" />
            <div className="absolute inset-0 rounded-full bg-sky-500/50 animate-[ripple-3_2s_infinite]" />
          </>
        )}
        <span className="flex bg-white/90 backdrop-blur-sm cursor-pointer hover:bg-white shadow-lg hover:shadow-xl p-3 rounded-full transition-all duration-300 hover:scale-110">
          <MagicIcon className="relative w-6 h-6 text-stone-600 group-hover:text-stone-800 transition-colors z-10" />
        </span>
      </button>
      <div
        role="dialog"
        className={`absolute bottom-0 right-16 transition-all duration-300 ease-out ${
          isOpen
            ? "translate-x-0 opacity-100 visible pointer-events-auto"
            : "translate-x-8 opacity-0 invisible pointer-events-none"
        }`}
        onTransitionStart={() => {
          if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
          }
        }}
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 min-w-100 border border-white/20">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your shoe design..."
            className="w-full h-20 p-3 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-stone-600">예시</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-start gap-2">
                <span>🎨</span>
                <div className="flex text-gray-500 italic">
                  <div>빨간색 신발로 만들어줘,</div>
                  <div>&nbsp;Make it red shoes</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span>🍂</span>
                <div>
                  <div className="text-gray-500 italic">
                    Recommend autumn colors
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span>✨</span>
                <div>
                  <div className="text-gray-500 italic">
                    클래식하고 세련된 느낌으로
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span>🎯</span>
                <div className="flex text-gray-500 italic">
                  <div>밑창을 검은색으로 바꿔줘,</div>
                  <div>&nbsp;Change the sole to black</div>
                </div>
              </div>
            </div>
          </div>
          {errorMessage && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-red-700 font-medium">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => void handleGenerateClick()}
              disabled={!input.trim() || isLoading}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md cursor-pointer hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-default transition-colors text-sm font-medium"
            >
              {isLoading
                ? "Generating..."
                : errorMessage
                  ? "Retry"
                  : "Generate"}
            </button>
            <button
              type="button"
              onClick={() => {
                toggleDialog(false);
              }}
              className="px-3 py-2 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
