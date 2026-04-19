import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixElement?: React.ReactNode;
  suffixElement?: React.ReactNode;
  containerClassName?: string;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ prefixElement, suffixElement, containerClassName = "", className = "", error, ...props }, ref) => {
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
            placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900
            transition-all duration-200
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
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`
          w-full bg-white border border-gray-200 py-2.5 px-4 text-sm text-gray-900 
          placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900
          transition-all duration-200 min-h-[100px] resize-y
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
