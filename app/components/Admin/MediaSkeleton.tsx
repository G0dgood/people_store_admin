"use client";

import React from "react";

interface MediaSkeletonProps {
  viewType: "grid" | "list";
  count?: number;
}

export const MediaSkeleton: React.FC<MediaSkeletonProps> = ({ viewType, count = 12 }) => {
  if (viewType === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-[6px] overflow-hidden shadow-sm">
            <div className="aspect-video bg-gray-50 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
              <div className="flex justify-between items-center">
                <div className="h-2 w-16 bg-gray-50 rounded animate-pulse" />
                <div className="h-2 w-20 bg-gray-50 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-gray-100 rounded-[6px] overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-6 border-b border-gray-50 last:border-0">
          <div className="w-16 h-10 bg-gray-50 rounded-[4px] animate-pulse shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
            <div className="h-2 w-24 bg-gray-50 rounded animate-pulse" />
          </div>
          <div className="h-3 w-20 bg-gray-50 rounded animate-pulse hidden sm:block" />
          <div className="h-3 w-24 bg-gray-50 rounded animate-pulse hidden md:block" />
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded bg-gray-50 animate-pulse" />
            <div className="w-8 h-8 rounded bg-gray-50 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};
