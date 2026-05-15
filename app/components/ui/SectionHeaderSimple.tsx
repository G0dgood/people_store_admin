import React from 'react';

interface SectionHeaderSimpleProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const SectionHeaderSimple: React.FC<SectionHeaderSimpleProps> = ({ title, children, className = "" }) => {
  return (
    <div className={`p-6 border-b border-gray-200 flex items-center justify-between ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 font-outfit">{title}</h3>
      {children}
    </div>
  );
};
