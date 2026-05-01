"use client";

import React from "react";

export const CategorySectionSkeleton = ({ reverse = false }: { reverse?: boolean }) => {
  return (
    <div className={`w-full bg-white flex flex-col md:flex-row overflow-hidden animate-pulse ${reverse ? "md:flex-row-reverse" : ""}`}>
      {/* Banner Skeleton */}
      <div className="w-full md:w-80 relative min-h-[200px] md:min-h-[400px] bg-gray-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="h-8 bg-gray-200 w-3/4 mb-4 rounded" />
        <div className="h-10 bg-gray-200 w-1/2 rounded" />
      </div>

      {/* Product Grid Skeleton */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col p-4 md:p-6 gap-3 border-r border-b border-gray-200">
            <div className="w-full aspect-square bg-gray-50 rounded-xl" />
            <div className="flex flex-col gap-2">
              <div className="h-4 bg-gray-100 w-3/4 rounded" />
              <div className="h-3 bg-gray-50 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
