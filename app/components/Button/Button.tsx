import React from "react";
import { Icon } from "../Icon";
import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "emerald" | "rose" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
type ButtonShape = "rounded" | "rounded-sm" | "pill";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  showChevron?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      shape = "rounded",
      iconLeft,
      iconRight,
      showChevron,
      isLoading,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 cursor-pointer";

    // Variant styles
    const variants = {
      primary: "bg-brand-blue text-white hover:bg-blue-600 active:bg-blue-700 focus:ring-brand-blue/50 border border-transparent ",
      secondary: "bg-white text-brand-blue border border-brand-blue hover:bg-brand-blue/5 active:bg-brand-blue/10 focus:ring-brand-blue/50 ",
      emerald: "bg-brand-blue text-white hover:bg-blue-600 active:bg-blue-700 focus:ring-brand-blue/50 border border-transparent shadow-sm",
      rose: "bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white active:bg-rose-600 focus:ring-rose-500/50 border border-transparent shadow-sm transition-all",
      outline: "bg-white text-[#1D3557] border border-gray-200 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-100/50 shadow-sm",
      ghost: "bg-transparent text-brand-blue hover:bg-brand-blue/10 active:bg-brand-blue/20 focus:ring-brand-blue/50",
    };

    // Size styles
    const sizes = {
      sm: "px-2.5 py-1 text-xs gap-1.5",
      md: "px-3.5 py-1.5 text-sm gap-2 font-semibold",
      lg: "px-5 py-2.5 text-base gap-3 font-bold",
    };

    // Shape styles
    const shapes = {
      rounded: "rounded-none",
      "rounded-sm": "rounded-none",
      pill: "rounded-full",
    };

    const combinedClassName = `
      ${baseStyles}
      ${variants[variant as keyof typeof variants] || variants.primary}
      ${sizes[size as keyof typeof sizes] || sizes.md}
      ${shapes[shape as keyof typeof shapes] || shapes.rounded}
      ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
      ${className}
    `.trim().replace(/\s+/g, " ");

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
          />
        )}
        {!isLoading && iconLeft && (
          <span className="flex justify-center items-center shrink-0">
            {iconLeft}
          </span>
        )}
        {children && (
          <span className="flex items-center justify-center truncate">
            {children}
          </span>
        )}
        {!isLoading && iconRight && (
          <span className="flex justify-center items-center shrink-0">
            {iconRight}
          </span>
        )}
        {!isLoading && showChevron && (
          <Icon
            name="expand_more"
            size={size === "sm" ? "xs" : "sm"}
            className={`ml-1.5 shrink-0 transition-transform ${props["aria-expanded"] ? "rotate-180" : ""}`}
          />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
