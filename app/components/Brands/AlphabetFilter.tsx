
"use client";

import React from "react";

interface AlphabetFilterProps {
  alphabet: string[];
  activeLetter: string;
  onLetterClick: (letter: string) => void;
  stickyTop?: string;
}

export const AlphabetFilter: React.FC<AlphabetFilterProps> = ({ 
  alphabet, 
  activeLetter, 
  onLetterClick,
  stickyTop = "72px"
}) => {
  return (
    <div 
      className="bg-white border border-gray-100 rounded-none overflow-hidden shadow-sm sticky z-30"
      style={{ top: stickyTop }}
    >
      <div className="flex flex-wrap items-center divide-x divide-gray-100">
        {alphabet.map((char) => (
          <button
            key={char}
            onClick={() => onLetterClick(char)}
            className={`flex-1 min-w-[45px] h-12 flex items-center justify-center text-[11px] font-black tracking-widest transition-all
              ${activeLetter === char 
                ? "bg-black text-white" 
                : "text-gray-500 hover:bg-gray-50 hover:text-black"
              }`}
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
};
