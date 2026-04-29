"use client";

import React from "react";

export const OrderSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 p-4 md:p-6 flex flex-col md:flex-row gap-6 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-24 h-24 md:w-48 md:h-48 flex-shrink-0 bg-gray-100 border border-gray-200" />

      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col gap-3 py-1">
        <div className="flex flex-col gap-2">
          <div className="h-3 bg-gray-100 w-20" />
          <div className="h-6 bg-gray-100 w-40" />
          <div className="h-3 bg-gray-50 w-32" />
        </div>

        <div className="flex items-center gap-3 mt-1">
          <div className="w-1.5 h-1.5 bg-gray-100" />
          <div className="h-3 bg-gray-50 w-24" />
        </div>

        <div className="mt-auto pt-4 flex items-center gap-6">
          <div className="h-3 bg-gray-100 w-20" />
          <div className="h-3 bg-gray-50 w-24" />
        </div>
      </div>

      {/* Price & Primary Actions Skeleton */}
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-between py-1 min-w-[180px] border-t md:border-t-0 md:border-l border-gray-200 md:pl-8 pt-4 md:pt-0">
        <div className="flex flex-col md:items-end gap-2">
          <div className="h-3 bg-gray-100 w-24" />
          <div className="h-8 bg-gray-100 w-32" />
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto">
          <div className="h-6 bg-gray-50 w-20 self-end" />
          <div className="h-11 bg-gray-100 w-full md:w-36" />
        </div>
      </div>
    </div>
  );
};
