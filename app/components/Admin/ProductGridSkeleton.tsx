import React from "react";

interface ProductGridSkeletonProps {
  count?: number;
  className?: string;
}

export const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ 
  count = 8,
  className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-xl animate-pulse">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
          <div className="flex flex-col flex-1 gap-2.5">
            <div className="h-3 bg-gray-100 rounded w-3/4" />
            <div className="h-2.5 bg-gray-50 rounded w-1/2" />
            <div className="flex justify-between items-center mt-1">
              <div className="h-3 bg-gray-100 rounded w-1/4" />
              <div className="h-4 bg-gray-50 rounded-full w-1/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
