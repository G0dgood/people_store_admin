import React from 'react';
import { HiOutlineInformationCircle } from 'react-icons/hi2';

interface InfoBannerProps {
  message: string;
  type?: 'info' | 'warning' | 'success' | 'error';
  className?: string;
}

export const InfoBanner = ({ message, type = 'info', className = "" }: InfoBannerProps) => {
  const styles = {
    info: 'bg-blue-50 text-blue-700 border-blue-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    error: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border ${styles[type]} ${className}`}>
      <HiOutlineInformationCircle className="shrink-0" size={20} />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};
