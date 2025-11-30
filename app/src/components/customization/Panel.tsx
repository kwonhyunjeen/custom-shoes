import { type ReactNode } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "../ui/Icon";

interface PanelProps {
  children?: ReactNode;
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

export const Panel = ({
  children,
  isCollapsed = false,
  onCollapseChange,
}: PanelProps) => {
  const toggleCollapse = () => {
    onCollapseChange?.(!isCollapsed);
  };

  return (
    <div
      className={`absolute left-0 right-0 bottom-0 overflow-hidden bg-zinc-100 transition-all duration-300 ease-in-out ${
        isCollapsed ? "h-22" : "h-60"
      }`}
    >
      <button
        onClick={toggleCollapse}
        className="absolute top-6 left-8 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
      >
        {isCollapsed ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-600" />
        )}
      </button>
      {children}
    </div>
  );
};
