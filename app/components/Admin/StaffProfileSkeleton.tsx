"use client";

import React from "react";

export function StaffProfileSkeleton() {
  return (
    <div className="flex flex-col gap-8 pb-12 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center gap-4 relative overflow-hidden  ">
        <div className="w-24 h-24 rounded-full bg-gray-100" />
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-32 bg-gray-100 rounded-md" />
          <div className="h-4 w-40 bg-gray-50 rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-50 rounded-[6px]" />
          <div className="h-6 w-16 bg-gray-50 rounded-[6px]" />
        </div>
      </div>

      {/* Info Grid Skeletons */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 flex flex-col gap-2">
            <div className="h-3 w-16 bg-gray-100 rounded" />
            <div className="h-5 w-24 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Permissions Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <div className="h-4 w-32 bg-gray-100 rounded" />
          <div className="h-3 w-12 bg-gray-50 rounded" />
        </div>
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-100" />
                <div className="h-4 w-24 bg-gray-100 rounded" />
              </div>
              <div className="h-6 w-20 bg-gray-50 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
