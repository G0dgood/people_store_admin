import React from "react";

interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  isPill?: boolean;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, className = "", isPill = false }) => {
  return (
    <div
      className={`inline-flex -space-x-[1px] ${className}`}
      role="group"
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;

        // Apply custom rounding based on position
        let roundedClass = "";
        if (isFirst && isLast) {
           // Single button in group? Keep its rounded class.
        } else if (isFirst) {
          roundedClass = isPill ? "rounded-l-full rounded-r-none" : "rounded-l-lg rounded-r-none";
        } else if (isLast) {
          roundedClass = isPill ? "rounded-r-full rounded-l-none" : "rounded-r-lg rounded-l-none";
        } else {
          roundedClass = "rounded-none";
        }

        // Cast the child to access its props safely
        const element = child as React.ReactElement<{ className?: string }>;

        return React.cloneElement(element, {
          className: `${element.props.className || ""} ${roundedClass} border-l-brand-gold/30`.trim(),
        });
      })}
    </div>
  );
};

export { ButtonGroup };
