import React from "react";
import { Icon } from "../Icon";

interface RatingProps {
  value: number; // 0 to 5
  max?: number;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({ 
  value, 
  max = 5, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isFull = starValue <= value;
        const isHalf = !isFull && starValue - 0.5 <= value;

        return (
          <Icon
            key={i}
            name={isFull ? "star" : isHalf ? "star_half" : "star_border"}
            size="sm"
            className={isFull || isHalf ? "text-[#F59E0B]" : "text-gray-200"}
          />
        );
      })}
    </div>
  );
};

export { Rating };
