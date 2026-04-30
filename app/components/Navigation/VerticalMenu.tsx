import React from "react";
import { Icon } from "../Icon";

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

interface VerticalMenuProps {
  items: MenuItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
  className?: string;
}

const VerticalMenu: React.FC<VerticalMenuProps> = ({
  items,
  activeId,
  onItemClick,
  className = "",
}) => {
  return (
    <nav className={`w-full max-w-xs bg-white rounded-lg border border-gray-200  overflow-hidden ${className}`}>
      <ul className="flex flex-col">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <button
                onClick={() => onItemClick?.(item.id)}
                className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors border-l-4 ${isActive
                  ? "bg-brand-gold-light text-brand-gold border-brand-gold"
                  : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                {item.icon && (
                  <Icon
                    name={item.icon}
                    size="sm"
                    className={`mr-3 ${isActive ? "text-brand-gold" : "text-gray-400"}`}
                  />
                )}
                <span className="flex-1 text-left">{item.label}</span>
                {item.count !== undefined && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${isActive ? "bg-brand-gold text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                    {item.count}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export { VerticalMenu };
