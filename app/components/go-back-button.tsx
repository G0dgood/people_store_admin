"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiArrowLeft } from "react-icons/hi2";

interface GoBackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function GoBackButton({ href, label = "Go Back", className = "" }: GoBackButtonProps) {
  const router = useRouter();

  if (href) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors ${className}`}
      >
        <HiArrowLeft size={16} />
        {label}
      </Link>
    );
  }

  return (
    <button
      onClick={() => router.back()}
      className={`inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors ${className}`}
    >
      <HiArrowLeft size={16} />
      {label}
    </button>
  );
}
