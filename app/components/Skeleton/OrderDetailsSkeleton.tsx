"use client";

import React from "react";

export const OrderDetailsSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 pb-12 animate-pulse">
      {/* Header & Breadcrumbs Skeleton */}
      <div className="flex flex-col gap-4">
        <div className="h-4 bg-gray-100 w-48 rounded" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-10 bg-gray-200 w-64 rounded" />
            <div className="h-6 bg-gray-100 w-24 rounded" />
            <div className="h-6 bg-gray-100 w-24 rounded" />
          </div>
          <div className="flex gap-3 items-center">
            <div className="h-12 bg-gray-100 w-32 rounded" />
            <div className="h-12 bg-gray-100 w-48 rounded" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details Area Skeleton */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white border border-gray-100 rounded-[6px] overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="h-7 bg-gray-100 w-48 rounded" />
              <div className="h-4 bg-gray-50 w-24 rounded" />
            </div>
            <div className="p-8 flex flex-col gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl" />
                    <div className="flex flex-col gap-2">
                      <div className="h-4 bg-gray-100 w-32 rounded" />
                      <div className="h-3 bg-gray-50 w-20 rounded" />
                    </div>
                  </div>
                  <div className="h-4 bg-gray-100 w-24 rounded" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[6px] p-8 flex flex-col gap-6">
            <div className="h-7 bg-gray-100 w-48 rounded" />
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <div className="h-4 bg-gray-100 w-32 rounded" />
                <div className="h-4 bg-gray-50 w-full rounded" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="h-4 bg-gray-100 w-32 rounded" />
                <div className="h-4 bg-gray-50 w-full rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="flex flex-col gap-8">
          <div className="bg-white border border-gray-100 rounded-[6px] p-8 flex flex-col gap-6">
            <div className="h-7 bg-gray-100 w-48 rounded" />
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full" />
              <div className="flex flex-col gap-2">
                <div className="h-5 bg-gray-100 w-32 rounded" />
                <div className="h-3 bg-gray-50 w-48 rounded" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[6px] p-8 flex flex-col gap-6">
            <div className="h-7 bg-gray-100 w-48 rounded" />
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex-shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 bg-gray-100 w-32 rounded" />
                    <div className="h-3 bg-gray-50 w-full rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
