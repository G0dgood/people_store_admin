import React from "react";
import { Icon } from "../Icon";

interface TagProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ label, onRemove, className = "" }) => {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-600 ${className}`}>
      {label}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-0.5 hover:bg-gray-200 rounded transition-colors"
        >
          <Icon name="clear" size="xs" className="text-gray-400" />
        </button>
      )}
    </span>
  );
};

export { Tag };
