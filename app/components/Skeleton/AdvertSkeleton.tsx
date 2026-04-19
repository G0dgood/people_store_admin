"use client";

import React from "react";

export const AdvertSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto pb-20 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-64 bg-gray-200 rounded-[4px]" />
          <div className="h-4 w-96 bg-gray-100 rounded-[4px]" />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end gap-2 mr-4">
            <div className="h-3 w-24 bg-gray-100 rounded-[4px]" />
            <div className="h-10 w-40 bg-gray-200 rounded-[6px]" />
          </div>
          <div className="h-11 w-44 bg-blue-100 rounded-[6px]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12 flex flex-col gap-8">
          
          {/* Section 01: Copy & Timing Skeleton */}
          <section className="bg-white p-8 rounded-[6px] border border-gray-200 shadow-sm flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <div className="h-7 w-48 bg-gray-200 rounded-[4px]" />
              <div className="h-10 w-64 bg-gray-100 rounded-[6px]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <div className="h-12 w-full bg-gray-50 rounded-[6px]" />
                <div className="h-12 w-full bg-gray-50 rounded-[6px]" />
                <div className="h-12 w-full bg-gray-50 rounded-[6px]" />
              </div>
              <div className="h-48 w-full bg-gray-50 rounded-[6px]" />
            </div>
          </section>

          {/* Section 02: Visuals Skeleton */}
          <section className="bg-white p-8 rounded-[6px] border border-gray-200 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div className="h-7 w-40 bg-gray-200 rounded-[4px]" />
              <div className="h-9 w-32 bg-gray-100 rounded-[6px]" />
            </div>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="min-w-[240px] flex flex-col gap-3">
                  <div className="aspect-[16/10] bg-gray-100 rounded-[6px]" />
                  <div className="h-10 w-full bg-gray-50 rounded-[4px]" />
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Section 03 & 04 Skeleton */}
            <div className="xl:col-span-2 bg-white p-8 rounded-[6px] border border-gray-200 shadow-sm">
              <div className="h-7 w-48 bg-gray-200 rounded-[4px] mb-8" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="aspect-square bg-gray-50 rounded-[6px]" />
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-[6px] border border-gray-200 shadow-sm">
              <div className="h-7 w-48 bg-gray-200 rounded-[4px] mb-8" />
              <div className="flex flex-col gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 w-full bg-gray-50 rounded-[6px]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
