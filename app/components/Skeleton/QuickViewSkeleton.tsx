"use client";

import React from "react";

export const QuickViewSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row h-full animate-pulse">
      {/* Left: Image Section Skeleton */}
      <div className="w-full md:w-1/2 bg-gray-50/50 p-6 md:p-10 flex flex-col gap-6 items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
        <div className="relative w-full aspect-square bg-gray-200 border border-gray-100   overflow-hidden" />
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-16 h-16 bg-gray-200 border border-gray-100" />
          ))}
        </div>
      </div>

      {/* Right: Content Section Skeleton */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="h-3 w-32 bg-gray-200" />
          <div className="h-10 w-full bg-gray-200" />
          <div className="flex items-center gap-4">
            <div className="h-4 w-24 bg-gray-200" />
            <div className="h-4 w-32 bg-gray-200" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="h-10 w-48 bg-gray-200" />
          <div className="h-4 w-40 bg-gray-200" />
        </div>

        <div className="flex flex-col gap-4 border-y border-gray-100 py-6">
          <div className="h-4 w-24 bg-gray-200 mb-2" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200" />
            <div className="h-3 w-full bg-gray-200" />
            <div className="h-3 w-2/3 bg-gray-200" />
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-auto">
          <div className="flex items-center gap-4">
            <div className="h-14 w-40 bg-gray-200" />
            <div className="h-14 w-14 bg-gray-200" />
          </div>
          <div className="h-16 w-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
};
