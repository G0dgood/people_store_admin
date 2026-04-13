"use client";

import { IoIosCloseCircleOutline } from "react-icons/io";
import { Icon } from "../Icon";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  className?: string;
  hideBorder?: boolean;
  icon?: string;
}

export default function ModalHeader({
  title,
  onClose,
  className = "",
  hideBorder = false,
  icon,
}: ModalHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between bg-white px-6 py-4 ${hideBorder ? "" : "border-b border-gray-200"
        }`}
    >
      <div className="flex items-center gap-3">
        {icon && <Icon name={icon} size="sm" className="text-inherit" />}
        <h3
          className={`font-work text-[14px] font-normal tracking-[-0.03em] text-brand-blue md:text-[16px] ${className}`}
        >
          {title}
        </h3>
      </div>
      <button
        onClick={onClose}
        className="cursor-pointer text-gray-600 transition-colors hover:text-gray-400"
      >
        <IoIosCloseCircleOutline className={`text-[20px]`} />
      </button>
    </div>
  );
}
