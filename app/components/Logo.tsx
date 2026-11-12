"use client";

import React from "react";
import { BrandMark } from "./BrandMark";

interface LogoProps {
  variant?: "on-light" | "on-dark";
  size?: "sm" | "md" | "lg" | "xl";
  short?: boolean;
  type?: "default" | "cms";
  /** Show the "Maison de Parfum" line under the wordmark (md and up). */
  tagline?: boolean;
  className?: string;
}

const sizes = {
  sm: { mark: 34, word: "text-[17px]", tag: "hidden", gap: "gap-2.5", pad: "pl-2.5" },
  md: { mark: 48, word: "text-[23px]", tag: "text-[8.5px]", gap: "gap-3.5", pad: "pl-3.5" },
  lg: { mark: 66, word: "text-[30px]", tag: "text-[10px]", gap: "gap-4", pad: "pl-4" },
  xl: { mark: 96, word: "text-[42px]", tag: "text-[12px]", gap: "gap-5", pad: "pl-5" },
};

const Logo: React.FC<LogoProps> = ({
  variant = "on-light",
  size = "md",
  short = false,
  type = "default",
  tagline = true,
  className = "",
}) => {
  const isLight = variant === "on-light";
  const isCMS = type === "cms";
  const s = sizes[size];

  const ink = isLight ? "var(--brand-ink)" : "var(--brand-ivory)";
  const petal = isLight ? "var(--brand-gold)" : "var(--brand-gold-light)";

  if (short) {
    return (
      <span className={`inline-flex items-center justify-center ${className}`}>
        <BrandMark size={s.mark} color={ink} flowerColor={petal} title="Bloom & Mist" />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      <BrandMark size={s.mark} color={ink} flowerColor={petal} />
      <span
        className={`flex flex-col justify-center leading-none border-l ${s.pad} ${
          isLight ? "border-[var(--brand-line-strong)]" : "border-white/15"
        }`}
      >
        <span
          className={`font-display font-medium uppercase tracking-[0.08em] whitespace-nowrap ${s.word}`}
          style={{ color: ink }}
        >
          Bloom <span className="italic font-normal" style={{ color: petal }}>&amp;</span> Mist
        </span>
        {isCMS ? (
          <span
            className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.42em]"
            style={{ color: petal }}
          >
            Admin
          </span>
        ) : (
          tagline &&
          size !== "sm" && (
            <span
              className={`mt-1.5 uppercase tracking-[0.42em] whitespace-nowrap ${s.tag} ${
                isLight ? "text-[var(--brand-muted)]" : "text-white/55"
              }`}
            >
              Maison de Parfum
            </span>
          )
        )}
      </span>
    </span>
  );
};

export { Logo };
