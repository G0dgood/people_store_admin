import React from "react";
import { Icon } from "../Icon";

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
      outline: "bg-white text-[#1D3557] border border-gray-100 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-100/50 shadow-sm",
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
      rounded: "rounded-lg",
      "rounded-sm": "rounded-[6px]",
      pill: "rounded-full",
    };

    const combinedClassName = `
      ${baseStyles}
      ${variants[variant as keyof typeof variants] || variants.primary}
      ${sizes[size as keyof typeof sizes] || sizes.md}
      ${shapes[shape as keyof typeof shapes] || shapes.rounded}
      ${className}
    `.trim().replace(/\s+/g, " ");

    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {iconLeft && <span className="flex items-center shrink-0">{iconLeft}</span>}
        <span className="truncate">{children}</span>
        {iconRight && <span className="flex items-center shrink-0">{iconRight}</span>}
        {showChevron && (
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
