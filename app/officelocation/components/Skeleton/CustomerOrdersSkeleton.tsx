"use client";

import React from "react";

export const CustomerOrdersSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="h-20 w-full animate-pulse border-b border-gray-100 bg-gray-50" />

      <div className="mx-auto max-w-[1440px] px-6 pt-12 pb-32 md:px-12">
        <div className="mb-12 h-8 w-32 animate-pulse rounded-full bg-gray-50" />
        
        <div className="mb-8 h-10 w-64 animate-pulse rounded-md bg-gray-50" />

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-6 border-b border-gray-50 pb-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 animate-pulse rounded-xl bg-gray-50" />
                <div className="space-y-2">
                  <div className="h-5 w-48 animate-pulse rounded bg-gray-50" />
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-50" />
                </div>
              </div>
              <div className="h-10 w-32 animate-pulse rounded-full bg-gray-50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
