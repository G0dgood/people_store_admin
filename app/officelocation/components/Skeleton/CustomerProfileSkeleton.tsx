"use client";

import React from "react";

export const CustomerProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="h-20 w-full animate-pulse border-b border-gray-100 bg-gray-50" />

      <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-12">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-2xl space-y-12">
            <div className="flex justify-between">
              <div className="h-5 w-32 animate-pulse rounded bg-gray-50" />
              <div className="h-5 w-24 animate-pulse rounded bg-gray-50" />
            </div>

            <div className="space-y-4">
              <div className="h-10 w-48 animate-pulse rounded bg-gray-50" />
              <div className="h-4 w-64 animate-pulse rounded bg-gray-50" />
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-50" />
                    <div className="h-12 w-full animate-pulse rounded bg-gray-50" />
                  </div>
                ))}
              </div>
              <div className="h-14 w-full animate-pulse rounded bg-gray-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
