import React from 'react';

interface SectionHeaderProps {
  title: string;
  highlight?: string;
  highlightColor?: string; // CSS class for the highlight part, e.g., "text-brand-gold" or "font-bold"
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  mb?: string; // Margin bottom, default is "mb-8"
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  highlight, 
  highlightColor = "font-bold", 
  className = "",
  as: Tag = "h2",
  mb = "mb-8"
}) => {
  return (
    <Tag className={`text-lg md:text-xl font-outfit font-light text-gray-900 tracking-[0.2em] ${mb} ${className}`}>
      {title} {highlight && <span className={highlightColor}>{highlight}</span>}
    </Tag>
  );
};
