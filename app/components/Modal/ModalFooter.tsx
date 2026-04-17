import React from "react";

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children, className = "" }) => {
  return (
    <div className={`px-6 bg-gray-50 flex flex-row gap-3 items-center justify-end border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export default ModalFooter;
