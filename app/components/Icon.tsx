import React from "react";

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
}

const Icon: React.FC<IconProps> = ({ name, size = "md", className = "", ...props }) => {
  const sizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const iconUrl = `/icon/${name}.svg`;

  return (
    <span
      className={`inline-block ${sizes[size]} bg-current ${className}`}
      style={{
        maskImage: `url("${iconUrl}")`,
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
        WebkitMaskImage: `url("${iconUrl}")`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",
      }}
      {...props}
    />
  );
};

export { Icon };
