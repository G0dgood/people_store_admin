"use client";

import React from "react";

export const CustomerCheckoutSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="h-20 w-full animate-pulse border-b border-gray-100 bg-gray-50" />

      <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-12 flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-12">
          <div className="h-8 w-32 animate-pulse rounded-full bg-gray-50" />
          
          <div className="space-y-6">
            <div className="h-10 w-48 animate-pulse rounded bg-gray-50" />
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 w-full animate-pulse rounded bg-gray-50" />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-[400px] w-full space-y-6">
          <div className="h-64 w-full animate-pulse rounded-2xl bg-gray-50" />
          <div className="h-14 w-full animate-pulse rounded bg-gray-50" />
        </div>
      </div>
    </div>
  );
};
