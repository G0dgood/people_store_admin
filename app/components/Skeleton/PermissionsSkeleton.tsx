"use client";

import React from "react";

export const PermissionsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i} 
          className="bg-white rounded-[6px] border border-[#1C1C1C1A] p-5 flex items-center justify-between animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-gray-200" />
            <div className="flex flex-col gap-2">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-2.5 bg-gray-100 rounded w-48" />
            </div>
          </div>
          <div className="w-5 h-5 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
};
