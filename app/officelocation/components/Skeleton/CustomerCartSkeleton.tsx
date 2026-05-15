"use client";

import React from "react";

export const CustomerCartSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="h-20 w-full animate-pulse border-b border-gray-100 bg-gray-50" />

      <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-12">
        <div className="mb-12 h-8 w-32 animate-pulse rounded-full bg-gray-50" />
        
        <div className="mb-8 h-10 w-48 animate-pulse rounded-md bg-gray-50" />

        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-6 border-b border-gray-50 py-8 md:flex-row">
              <div className="h-32 w-32 animate-pulse rounded-2xl bg-gray-50" />
              <div className="flex-1 space-y-4">
                <div className="h-6 w-1/3 animate-pulse rounded bg-gray-50" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-50" />
                <div className="flex justify-between pt-4">
                  <div className="h-10 w-32 animate-pulse rounded-full bg-gray-50" />
                  <div className="h-10 w-24 animate-pulse rounded bg-gray-50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
