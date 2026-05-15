"use client";

import React from "react";
import Link from "next/link";
import { HiOutlineInbox, HiOutlineShoppingBag } from "react-icons/hi2";
import { HiOutlineClipboardList } from "react-icons/hi";

interface EmptyStateProps {
  iconName?: "NOProduct" | "orders" | "cart";
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
  onClick?: () => void;
}

const icons = {
  NOProduct: HiOutlineInbox,
  orders: HiOutlineClipboardList,
  cart: HiOutlineShoppingBag,
};

export const EmptyState = ({
  iconName = "NOProduct",
  title,
  description,
  href,
  linkLabel,
  onClick,
}: EmptyStateProps) => {
  const Icon = icons[iconName] || HiOutlineInbox;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
        <Icon className="h-12 w-12" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900">{title}</h2>
      <p className="mb-8 max-w-xs text-sm font-medium text-gray-500">{description}</p>

      {linkLabel && (
        href ? (
          <Link
            href={href}
            className="flex h-12 items-center justify-center rounded-full bg-black px-10 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-brand-gold hover:shadow-lg hover:shadow-brand-gold/20"
          >
            {linkLabel}
          </Link>
        ) : (
          <button
            onClick={onClick}
            className="flex h-12 items-center justify-center rounded-full bg-black px-10 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-brand-gold hover:shadow-lg hover:shadow-brand-gold/20"
          >
            {linkLabel}
          </button>
        )
      )}
    </div>
  );
};
