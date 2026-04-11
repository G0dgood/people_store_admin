"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  className = "",
}) => {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const minValRef = useRef(value[0]);
  const maxValRef = useRef(value[1]);
  const range = useRef<HTMLDivElement>(null);

  // Synchronize internal state with external value changes (e.g., from a 'Clear All' button)
  useEffect(() => {
    // Check if the external value is actually different from our current values
    if (value[0] !== minVal || value[1] !== maxVal) {
      setMinVal(value[0]);
      setMaxVal(value[1]);
      minValRef.current = value[0];
      maxValRef.current = value[1];
    }
  }, [value[0], value[1], minVal, maxVal]);

  // Convert to percentage
  const getPercent = useCallback(
    (val: number) => Math.round(((val - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);


  return (
    <div className={`relative flex items-center justify-center w-48 h-10 ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        step={step}
        onChange={(event) => {
          const v = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(v);
          minValRef.current = v;
          onChange([v, maxVal]);
        }}
        className="thumb thumb--left pointer-events-none absolute h-0 w-full outline-none z-[3]"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        step={step}
        onChange={(event) => {
          const v = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(v);
          maxValRef.current = v;
          onChange([minVal, v]);
        }}
        className="thumb thumb--right pointer-events-none absolute h-0 w-full outline-none z-[4]"
      />

      <div className="relative w-full">
        <div className="absolute rounded-[3px] h-1 w-full bg-gray-200 z-[1]" />
        <div 
          ref={range} 
          className="absolute rounded-[3px] h-1 bg-brand-blue z-[2]" 
        />
      </div>

      <style jsx>{`
        .thumb::-webkit-slider-thumb {
          background-color: white;
          border: 2px solid #3B82F6;
          border-radius: 50%;
          cursor: pointer;
          height: 14px;
          width: 14px;
          margin-top: 0px;
          pointer-events: auto;
          -webkit-appearance: none;
        }
        .thumb::-moz-range-thumb {
          background-color: white;
          border: 2px solid #3B82F6;
          border-radius: 50%;
          cursor: pointer;
          height: 14px;
          width: 14px;
          pointer-events: auto;
          -moz-appearance: none;
        }
      `}</style>
    </div>
  );
};

export { RangeSlider };
