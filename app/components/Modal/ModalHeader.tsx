"use client";

import { IoIosCloseCircleOutline } from "react-icons/io";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  className?: string;
  hideBorder?: boolean;
}

export default function ModalHeader({
  title,
  onClose,
  className = "",
  hideBorder = false,
}: ModalHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between bg-white px-6 py-4 ${hideBorder ? "" : "border-b border-gray-200"
        }`}
    >
      <h3
        className={`font-work text-[14px] font-normal leading-10.5 tracking-[-0.03em] text-brand-blue md:text-[16px] ${className}`}
      >
        {title}
      </h3>
      <button
        onClick={onClose}
        className="cursor-pointer text-gray-600 transition-colors hover:text-gray-400"
      >
        <IoIosCloseCircleOutline className={`text-[20px]`} />
      </button>
    </div>
  );
}
