import { Icon } from "../Icon";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "md",
  className = "",
}) => {
  const sizes = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-12 h-12 text-xs",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-3xl",
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div className={`
      relative rounded-full overflow-hidden flex items-center justify-center bg-brand-gold/5 border-2 border-white shrink-0
      ${sizes[size]} ${className}
    `}>
      {src ? (
        <img
          src={src}
          alt={name || "Avatar"}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).parentElement!.classList.add('bg-brand-gold/5');
          }}
        />
      ) : initials ? (
        <span className="text-brand-gold font-black tracking-tighter">{initials}</span>
      ) : (
        <div className="w-full h-full bg-brand-gold/10 flex items-center justify-center text-brand-gold">
          <Icon name="person" size={size === "xl" ? "lg" : size === "lg" ? "md" : "sm"} />
        </div>
      )}
    </div>
  );
};

export { Avatar };
