import React from "react";
import Link from "next/link";
import { Icon } from "./Icon";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showIcon?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "", showIcon = false }) => {
  return (
    <nav className={`flex items-center gap-2 text-[10px] uppercase tracking-widest ${className}`}>
      <Link href="/" className="text-gray-400 hover:text-brand-gold transition-colors flex items-center">
        {showIcon ? <Icon name="home" size="md" /> : "Home"}
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <Icon name="chevron_right" size="xs" className="text-gray-300" />
          {item.href ? (
            <Link href={item.href} className="text-gray-400 hover:text-brand-gold transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-600 font-bold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
