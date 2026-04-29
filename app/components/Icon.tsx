import React from "react";

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  folder?: "icon" | "dashboardIcon";
}

const Icon: React.FC<IconProps> = ({ name, size = "md", folder = "icon", className = "", ...props }) => {
  const sizes = {
    xs: "w-2.5 h-2.5",
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-10 h-10",
    "2xl": "w-16 h-16",
  };

  const iconUrl = `/${folder}/${name}.svg`;

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
