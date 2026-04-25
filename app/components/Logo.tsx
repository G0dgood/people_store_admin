"use client";

import React from "react";

interface LogoProps {
  variant?: "on-light" | "on-dark";
  size?: "sm" | "md" | "lg" | "xl";
  short?: boolean;
  type?: "default" | "cms";
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  variant = "on-light",
  size = "md",
  short = false,
  type = "default",
  className = "",
}) => {
  // on-light (e.g. White Header) -> Gold text, Charcoal Logo BG
  // on-dark (e.g. Charcoal Header) -> Gold text, White Logo BG
  const isLight = variant === "on-light";
  const isCMS = type === "cms";

  const sizeStyles = {
    sm: {
      box: "px-2 py-0.5 text-[11px] tracking-[0.1em]",
      text: "text-[11px] tracking-[0.1em]"
    },
    md: {
      box: "px-3 py-1 text-sm tracking-[0.15em]",
      text: "text-sm tracking-[0.15em]"
    },
    lg: {
      box: "px-5 py-2 text-xl tracking-[0.2em]",
      text: "text-xl tracking-[0.2em]"
    },
    xl: {
      box: "px-8 py-3 text-3xl tracking-[0.3em]",
      text: "text-3xl tracking-[0.3em]"
    },
  };

  const style = sizeStyles[size];

  if (short) {
    return (
      <div className={`inline-flex items-center justify-center ${isLight ? "bg-brand-charcoal" : "bg-white"} ${style.box} ${className}`}>
        <span className={`font-outfit font-black uppercase ${isLight ? "text-brand-gold-light" : "text-brand-gold"}`}>B</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center gap-1 ${className}`}>
      {/* Bloom - Box Shape */}
      <div className="relative group">
        {/* Bottle Cap - Only for default type */}
        {!isCMS && (
          <div className={`
            absolute -top-[5px] left-1/2 -translate-x-1/2 w-1/3 h-[5px] 
            ${isLight ? "bg-brand-gold-light" : "bg-brand-gold"} 
            rounded-t-[1px] opacity-80
          `}>
            {/* Spray Dots - Visible on Hover */}
            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 group-hover:-top-4 transition-all duration-700 pointer-events-none flex flex-col gap-1.5">
              <div className="w-[2px] h-[2px] bg-brand-gold-light rounded-full opacity-60 animate-pulse" />
              <div className="w-[1.5px] h-[1.5px] bg-brand-gold rounded-full opacity-40 animate-pulse [animation-delay:200ms] ml-3" />
              <div className="w-[1px] h-[1px] bg-brand-gold-light rounded-full opacity-30 animate-pulse [animation-delay:400ms] -ml-1.5" />
              <div className="w-[1px] h-[1px] bg-brand-gold rounded-full opacity-20 animate-pulse [animation-delay:600ms] ml-4" />
            </div>
          </div>
        )}

        {/* Box Body / Label */}
        <div className={`
          flex items-center justify-center transition-all duration-500
          ${isLight ? "bg-brand-charcoal border-brand-gold-light/30 shadow-[0_4px_10px_rgba(0,0,0,0.1)]" : "bg-white border-brand-charcoal/10 shadow-sm"} 
          border-[0.5px] ${style.box} rounded-[1px]
        `}>
          <span className={`
            ${isCMS ? "font-outfit font-black" : "font-serif italic font-medium"}
            uppercase tracking-[0.15em]
            bg-gradient-to-tr from-brand-gold to-brand-gold-light bg-clip-text text-transparent
          `}>
            Bloom
          </span>
        </div>
      </div>

      {/* & - Only for default type */}
      {!isCMS && (
        <div className="pb-1.5 px-1">
          <span className={`
            font-serif italic transition-all duration-300
            text-brand-gold/60
            ${style.text}
          `}>
            &
          </span>
        </div>
      )}

      {/* Trailing Text (Mist or CMS) */}
      <div className={`pb-1 ${isCMS ? 'ml-1' : '-ml-1'}`}>
        <span className={`
          ${isCMS ? "font-outfit font-black tracking-widest" : "font-outfit font-light tracking-[0.4em]"}
          uppercase whitespace-nowrap transition-all duration-300
          ${isLight ? "text-brand-gold" : "text-white"} 
          ${style.text}
        `}>
          {isCMS ? "CMS" : "Mist"}
        </span>
      </div>
    </div>
  );
};

export { Logo };
