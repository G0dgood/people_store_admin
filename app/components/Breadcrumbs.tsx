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
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`}>
      <Link href="/" className="text-gray-400 hover:text-brand-blue transition-colors flex items-center">
        <Icon name="home" size="xs" />
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <Icon name="chevron_right" size="xs" className="text-gray-300" />
          {item.href ? (
            <Link href={item.href} className="text-gray-400 hover:text-brand-blue transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-bold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
