"use client";

import React from "react";

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-[6px] border border-[#1C1C1C1A] flex flex-col gap-4 relative animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-3 w-24 bg-gray-100 rounded-sm"></div>
        <div className="h-6 w-6 bg-gray-50 rounded-md"></div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-32 bg-gray-100 rounded-md"></div>
          <div className="h-4 w-12 bg-gray-50 rounded-md"></div>
        </div>

        <div className="h-10 w-full bg-gray-50/50 rounded-md"></div>
      </div>

      <div className="mt-2 flex justify-between items-center">
        <div className="h-3 w-20 bg-gray-50 rounded-sm"></div>
        <div className="h-3 w-16 bg-gray-50 rounded-sm"></div>
      </div>
    </div>
  );
};
