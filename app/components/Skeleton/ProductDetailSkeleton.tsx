"use client";

import React from "react";

export const ProductDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-10 animate-pulse">
       {/* Breadcrumbs Skeleton */}
       <div className="h-4 bg-gray-100 w-64 rounded" />

       <div className="flex flex-col lg:flex-row gap-16">
          {/* Gallery Skeleton */}
          <div className="flex-1 flex flex-col gap-6">
             <div className="w-full aspect-square bg-gray-50 border border-gray-100" />
             <div className="flex gap-4">
                {[1, 2, 3, 4].map(i => (
                   <div key={i} className="w-20 h-20 bg-gray-50 border border-gray-100" />
                ))}
             </div>
          </div>

          {/* Info Skeleton */}
          <div className="flex-1 flex flex-col gap-8">
             <div className="flex flex-col gap-4">
                <div className="h-4 bg-gray-50 w-32" />
                <div className="h-12 bg-gray-100 w-full" />
                <div className="h-12 bg-gray-100 w-2/3" />
                <div className="flex gap-4 mt-2">
                   <div className="h-4 bg-gray-50 w-24" />
                   <div className="h-4 bg-gray-50 w-24" />
                </div>
             </div>

             <div className="flex flex-col gap-4">
                <div className="h-4 bg-gray-50 w-24" />
                <div className="flex gap-4">
                   {[1, 2, 3].map(i => (
                      <div key={i} className="w-24 h-24 bg-gray-50 border border-gray-100" />
                   ))}
                </div>
             </div>

             <div className="flex flex-col gap-2">
                {[1, 2, 3, 4].map(i => (
                   <div key={i} className="h-12 bg-gray-50 w-full" />
                ))}
             </div>

             <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                   <div className="flex-1 h-14 bg-gray-100" />
                   <div className="w-14 h-14 bg-gray-50" />
                </div>
                <div className="w-full h-14 bg-gray-100" />
             </div>
          </div>
       </div>
    </div>
  );
};
