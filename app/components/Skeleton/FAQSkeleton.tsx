"use client";

import React from "react";

export const FAQSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-8 animate-pulse">
      {/* Category Tabs Skeleton */}
      <div className="flex justify-center mb-12 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-32 bg-gray-100 rounded-full" />
        ))}
      </div>

      {/* Accordion Items Skeleton */}
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-full h-16 bg-gray-50 border border-gray-100 rounded-2xl" />
        ))}
      </div>
    </div>
  );
};
