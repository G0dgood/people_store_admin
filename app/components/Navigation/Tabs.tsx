import React from "react";
import { Icon } from "../Icon";

type TabVariant = "underline" | "pill";

interface TabItem {
  id: string;
  label?: string;
  icon?: string;
}

interface TabsProps {
  items: TabItem[];
  activeId?: string;
  onTabChange?: (id: string) => void;
  variant?: TabVariant;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onTabChange,
  variant = "underline",
  className = "",
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div
        className={`flex ${variant === "pill"
            ? "bg-gray-100/50 p-1 rounded-lg w-fit"
            : "border-b border-gray-200"
          }`}
      >
        {items.map((tab) => {
          const isActive = tab.id === activeId;

          if (variant === "pill") {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`flex items-center px-6 py-2 text-sm font-medium rounded-md transition-all ${isActive
                    ? "bg-brand-gold-light text-brand-gold "
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                {tab.icon && (
                  <Icon
                    name={tab.icon}
                    size="sm"
                    className={`${tab.label ? "mr-2" : ""} ${isActive ? "text-brand-gold" : "text-gray-400"}`}
                  />
                )}
                {tab.label}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-all relative border-b-2 ${isActive
                  ? "border-brand-gold text-brand-gold"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                }`}
            >
              {tab.icon && (
                <Icon
                  name={tab.icon}
                  size="sm"
                  className={`${tab.label ? "mr-2" : ""} ${isActive ? "text-brand-gold" : "text-gray-400"}`}
                />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { Tabs };
