import Image from "next/image";
import { Icon } from "../Icon";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: { class: "w-8 h-8", dim: 32 },
    md: { class: "w-12 h-12", dim: 48 },
    lg: { class: "w-24 h-24", dim: 96 },
  };

  const selectedSize = sizes[size];
  const initials = name
    ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "";

  return (
    <div className={`
      relative rounded-full overflow-hidden flex items-center justify-center bg-gray-100 border-2 border-white  shrink-0
      ${selectedSize.class} ${className}
    `}>
      {src ? (
        <Image
          src={src}
          alt={name || "Avatar"}
          width={selectedSize.dim}
          height={selectedSize.dim}
          className="w-full h-full object-cover"
        />
      ) : initials ? (
        <span className="text-gray-500 font-bold text-sm">{initials}</span>
      ) : (
        <div className="w-full h-full bg-[#BFDBFE] flex items-center justify-center text-white">
          <Icon name="person" size={size === "lg" ? "lg" : "md"} />
        </div>
      )}
    </div>
  );
};

export { Avatar };
