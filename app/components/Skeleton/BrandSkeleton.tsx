"use client";

import React from "react";

export const BrandSkeleton = () => {
  return (
    <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-gray-100 animate-pulse  ">
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/20 flex flex-col gap-3">
          <div className="flex items-center justify-end">
            <div className="w-10 h-3 bg-gray-200 rounded" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-5 w-2/3 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-200 rounded" />
          </div>
          <div className="h-3 w-16 bg-gray-200 rounded mt-1" />
        </div>
      </div>
    </div>
  );
};
