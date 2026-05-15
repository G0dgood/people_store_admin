import React from "react";

interface CarouselIndicatorsProps {
  total: number;
  currentIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({
  total,
  currentIndex,
  onSelect,
  className = "absolute bottom-6 left-0 right-0 z-20",
}) => {
  if (total <= 1) return null;

  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      {Array.from({ length: total }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={`transition-all duration-500 rounded-full ${idx === currentIndex
            ? "w-8 h-1.5 bg-brand-gold shadow-[0_0_8px_rgba(255,215,0,0.5)]"
            : "w-1.5 h-1.5 bg-white/40 hover:bg-white/80"
            }`}
          aria-label={`Go to slide ${idx + 1}`}
        />
      ))}
    </div>
  );
};
