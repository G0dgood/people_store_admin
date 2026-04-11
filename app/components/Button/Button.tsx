import React from "react";
import { Icon } from "../Icon";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
type ButtonShape = "rounded" | "pill";

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
      ghost: "bg-transparent text-brand-blue hover:bg-brand-blue/10 active:bg-brand-blue/20 focus:ring-brand-blue/50",
    };

    // Size styles
    const sizes = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-3",
    };

    // Shape styles
    const shapes = {
      rounded: "rounded-lg",
      pill: "rounded-full",
    };

    const combinedClassName = `
      ${baseStyles}
      ${variants[variant]}
      ${sizes[size]}
      ${shapes[shape]}
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
