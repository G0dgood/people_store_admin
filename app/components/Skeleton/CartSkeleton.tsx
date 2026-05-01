"use client";

import React from "react";

const CartSkeleton = () => {
  return (
    <div className="flex flex-col gap-10 w-full animate-pulse">
      <div className="h-10 w-64 bg-gray-200 rounded-sm" />
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Cart Items Skeleton */}
        <div className="flex-1 flex flex-col gap-px border border-gray-200 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col md:flex-row gap-6 p-6 border-b border-gray-200 last:border-0 bg-white">
              <div className="w-24 h-24 bg-gray-100 flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-4">
                <div className="h-4 w-3/4 bg-gray-100 rounded-sm" />
                <div className="h-3 w-1/2 bg-gray-50 rounded-sm" />
                <div className="flex gap-4 mt-2">
                  <div className="h-3 w-16 bg-gray-50 rounded-sm" />
                  <div className="h-3 w-20 bg-gray-50 rounded-sm" />
                </div>
              </div>
              <div className="w-full md:w-32 flex flex-col items-end gap-2">
                <div className="h-4 w-20 bg-gray-100 rounded-sm" />
                <div className="h-8 w-24 bg-gray-50 rounded-sm mt-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Summary Skeleton */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6">
          <div className="bg-white border border-gray-200 p-6 flex flex-col gap-4">
            <div className="h-3 w-24 bg-gray-100 rounded-sm" />
            <div className="h-12 w-full bg-gray-50 rounded-sm" />
          </div>
          
          <div className="bg-white border border-gray-200 p-8 flex flex-col gap-6">
            <div className="h-6 w-32 bg-gray-100 rounded-sm border-b border-gray-200 pb-4" />
            <div className="flex flex-col gap-4 border-b border-gray-200 pb-6">
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-gray-50 rounded-sm" />
                <div className="h-3 w-20 bg-gray-50 rounded-sm" />
              </div>
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-gray-50 rounded-sm" />
                <div className="h-3 w-20 bg-gray-50 rounded-sm" />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-gray-100 rounded-sm" />
              <div className="h-6 w-24 bg-gray-100 rounded-sm" />
            </div>
            <div className="h-14 w-full bg-gray-200 rounded-sm mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export { CartSkeleton };
