import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
  containerClassName?: string;
  error?: boolean;
  shape?: "rounded" | "rounded-sm" | "pill";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ prefixElement, suffixElement, containerClassName = "", className = "", error, shape = "rounded", ...props }, ref) => {
    const shapes = {
      rounded: "rounded-none",
      "rounded-sm": "rounded-sm",
      pill: "rounded-full",
    };

    return (
      <div className={`relative flex items-center w-full ${containerClassName}`}>
        {prefixElement && (
          <div className="absolute left-3 flex items-center pointer-events-none">
            {prefixElement}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-white border border-gray-200 py-2.5 px-4 text-sm text-gray-900 
            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold
            transition-all duration-200
            ${shapes[shape]}
            ${prefixElement ? "pl-10" : ""}
            ${suffixElement ? "pr-10" : ""}
            ${error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""}
            ${className}
          `}
          {...props}
        />
        {suffixElement && (
          <div className="absolute right-3 flex items-center">
            {suffixElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  shape?: "rounded" | "rounded-sm" | "pill";
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", error, shape = "rounded", ...props }, ref) => {
    const shapes = {
      rounded: "rounded-none",
      "rounded-sm": "rounded-sm",
      pill: "rounded-full",
    };

    return (
      <textarea
        ref={ref}
        className={`
          w-full bg-white border border-gray-200 py-2.5 px-4 text-sm text-gray-900 
          placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold/20 focus:border-brand-gold
          transition-all duration-200 min-h-[100px] resize-y
          ${shapes[shape]}
          ${error ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Input, Textarea };
