"use client";

import React, { useEffect } from "react";
import { Icon } from "../Icon";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "normal" | "medium" | "large";
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  size = "normal", 
  className = "" 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    normal: "max-w-md",
    medium: "max-w-xl",
    large: "max-w-3xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px] animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`
        relative w-full bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300
        ${sizes[size]}
        ${className}
      `}>
        {children}
      </div>
    </div>
  );
};

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  icon?: string;
  className?: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose, icon, className = "" }) => (
  <div className={`flex items-center justify-between p-6 border-b border-gray-100 ${className}`}>
    <div className="flex items-center gap-3">
      {icon && (
        <Icon name={icon} size="sm" className={icon === "warning" ? "text-orange-500" : "text-brand-blue"} />
      )}
      <h3 className="text-xl font-bold text-gray-900 leading-tight">{title}</h3>
    </div>
    <button 
      onClick={onClose}
      className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400"
    >
      <Icon name="clear" size="sm" />
    </button>
  </div>
);

const ModalBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`p-6 bg-gray-50/30 border-t border-gray-100 flex justify-end gap-3 ${className}`}>
    {children}
  </div>
);

export { Modal, ModalHeader, ModalBody, ModalFooter };
