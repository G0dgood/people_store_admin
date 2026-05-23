"use client";

import React from "react";
import Image from "next/image";

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
  const isCMS = type === "cms";
  const isLight = variant === "on-light";

  const sizeStyles = {
    sm: {
      box: "px-2 py-0.5 text-[11px] tracking-[0.1em]",
      text: "text-[11px] tracking-[0.1em]",
      img: { w: 20, h: 20 }
    },
    md: {
      box: "px-3 py-1 text-sm tracking-[0.15em]",
      text: "text-sm tracking-[0.15em]",
      img: { w: 30, h: 30 }
    },
    lg: {
      box: "px-5 py-2 text-xl tracking-[0.2em]",
      text: "text-xl tracking-[0.2em]",
      img: { w: 50, h: 50 }
    },
    xl: {
      box: "px-8 py-3 text-3xl tracking-[0.3em]",
      text: "text-3xl tracking-[0.3em]",
      img: { w: 80, h: 80 }
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

  // Boutique Side Logo (Image + Text Beside)
  if (!isCMS) {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <div className="relative flex-shrink-0">
          <Image
            src="/brand_logo/logo.png"
            alt="Bloom & Mist"
            width={style.img.w}
            height={style.img.w} // Square icon
            className="object-contain"
            style={{ height: "auto" }}
            priority
          />
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className={`font-outfit font-black uppercase tracking-[0.2em] ${isLight ? "text-brand-charcoal" : "text-white"} ${size === 'sm' ? 'text-[11px]' : 'text-[14px]'}`}>
            Bloom
          </span>
          <span className={`font-outfit font-light uppercase tracking-[0.3em] text-brand-gold ${size === 'sm' ? 'text-[10px]' : 'text-[13px]'}`}>
            & Mist
          </span>
        </div>
      </div>
    );
  }

  // CMS Side Logo (CSS)
  return (
    <div className={`inline-flex items-center justify-center gap-1 ${className}`}>
      {/* Bloom - Box Shape */}
      <div className="relative group">
        {/* Box Body / Label */}
        <div className={`
          flex items-center justify-center transition-all duration-500
          ${isLight ? "bg-brand-charcoal border-brand-gold-light/30 shadow-[0_4px_10px_rgba(0,0,0,0.1)]" : "bg-white border-brand-charcoal/10  "} 
          border-[0.5px] ${style.box} rounded-[1px]
        `}>
          <span className={`
            font-outfit font-black
            uppercase tracking-[0.15em]
            bg-gradient-to-tr from-brand-gold to-brand-gold-light bg-clip-text text-transparent
          `}>
            Bloom
          </span>
        </div>
      </div>

      <div className="pb-1 ml-1">
        <span className={`
          font-outfit font-black tracking-widest
          uppercase whitespace-nowrap transition-all duration-300
          ${isLight ? "text-brand-gold" : "text-white"} 
          ${style.text}
        `}>
          CMS
        </span>
      </div>
    </div>
  );
};

export { Logo };

