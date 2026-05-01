"use client";

import React, { useState, useEffect, useCallback } from "react";

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

  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
  }, [value]);

  const getPercent = useCallback(
    (val: number) => ((val - min) / (max - min)) * 100,
    [min, max]
  );

  const minPercent = getPercent(minVal);
  const maxPercent = getPercent(maxVal);

  return (
    <div className={`relative w-full max-w-[250px] ${className}`}>
      {/* TRACK */}
      <div className="relative h-[4px] bg-gray-200 rounded">
        {/* ACTIVE RANGE */}
        <div
          className="absolute h-[4px] bg-[#C5A028] rounded"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
      </div>

      {/* MIN INPUT */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={(e) => {
          const v = Math.min(Number(e.target.value), maxVal - step);
          setMinVal(v);
          onChange([v, maxVal]);
        }}
        className="range-thumb absolute top-[-7px] w-full appearance-none bg-transparent pointer-events-none"
      />

      {/* MAX INPUT */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={(e) => {
          const v = Math.max(Number(e.target.value), minVal + step);
          setMaxVal(v);
          onChange([minVal, v]);
        }}
        className="range-thumb absolute top-[-7px] w-full appearance-none bg-transparent pointer-events-none"
      />

      <style jsx>{`
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #000;
          border: 2px solid #C5A028;
          cursor: pointer;
          pointer-events: auto;
          margin-top: 0px; /* FIX alignment */
        }

        .range-thumb::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #000;
          border: 2px solid #C5A028;
          cursor: pointer;
          pointer-events: auto;
        }

        input[type="range"]::-webkit-slider-runnable-track {
          height: 4px;
          background: transparent;
        }

        input[type="range"]::-moz-range-track {
          height: 4px;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export { RangeSlider };