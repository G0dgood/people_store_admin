"use client";

import React from "react";
import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi2";

interface GoBackButtonProps {
  href: string;
  label?: string;
}

export const GoBackButton = ({ href, label = "Go Back" }: GoBackButtonProps) => {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-gray-500 transition-colors hover:text-[#156BB6]"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition-all group-hover:border-[#156BB6] group-hover:bg-[#156BB6]/5">
        <HiOutlineArrowLeft className="h-4 w-4" />
      </div>
      {label}
    </Link>
  );
};
