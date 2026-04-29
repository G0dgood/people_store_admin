"use client";

import React from "react";

export const ProductSkeleton = ({ viewMode = "grid" }: { viewMode?: "grid" | "list" }) => {
  if (viewMode === "list") {
    return (
      <div className="bg-white border border-gray-100 p-3 md:p-5 flex gap-3 md:gap-6 animate-pulse">
        {/* Image Skeleton */}
        <div className="w-24 h-24 md:w-48 md:h-48 flex-shrink-0 bg-gray-100" />
        
        {/* Content Skeleton */}
        <div className="flex-1 flex flex-col gap-3 py-2">
          <div className="h-4 bg-gray-100 w-3/4" />
          <div className="flex items-center gap-4">
             <div className="h-6 bg-gray-100 w-24" />
             <div className="h-4 bg-gray-50 w-16" />
          </div>
          <div className="flex items-center gap-3">
             <div className="h-3 bg-gray-50 w-20" />
             <div className="h-3 bg-gray-50 w-20" />
          </div>
          <div className="hidden md:block h-10 bg-gray-50 w-full mt-2" />
          <div className="flex gap-4 mt-auto">
             <div className="h-3 bg-gray-50 w-24" />
             <div className="h-3 bg-gray-50 w-24" />
          </div>
        </div>

        {/* Action Skeleton */}
        <div className="hidden md:flex flex-col items-end justify-between py-1 min-w-[160px]">
           <div className="w-8 h-8 bg-gray-50 rounded-full" />
           <div className="w-full h-10 bg-gray-100 mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 overflow-hidden flex flex-col h-full animate-pulse">
      {/* Image Section */}
      <div className="relative w-full aspect-square bg-gray-50 p-5 border-b border-gray-100" />
      
      {/* Content Section */}
      <div className="p-5 flex flex-col gap-3 pb-20">
         <div className="h-6 bg-gray-100 w-24" />
         <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className="w-3 h-3 bg-gray-50 rounded-full" />
            ))}
         </div>
         <div className="flex flex-col gap-2 mt-2">
            <div className="h-3 bg-gray-100 w-full" />
            <div className="h-3 bg-gray-50 w-2/3" />
         </div>
      </div>

      {/* Footer Section */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-50 flex gap-2">
         <div className="w-10 h-10 bg-gray-50" />
         <div className="flex-1 h-10 bg-gray-100" />
      </div>
    </div>
  );
};
