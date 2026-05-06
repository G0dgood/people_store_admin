"use client";

import React from "react";

export const EditProductSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Top Header / Action Bar Skeleton */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-[4px] bg-gray-100 animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="flex gap-2 w-full xl:w-auto">
            <div className="h-11 w-32 bg-gray-200 rounded-[4px] animate-pulse" />
            <div className="h-11 w-32 bg-gray-100 rounded-[4px] animate-pulse" />
            <div className="h-11 w-11 bg-gray-100 rounded-[4px] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left Column (Main Details) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Basic Details Card */}
          <div className="bg-white rounded-[6px] border border-gray-200   p-8 flex flex-col gap-8">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2" />

            <div className="flex flex-col gap-3">
              <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-50 rounded-[4px] animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                  <div className="h-12 w-full bg-gray-50 rounded-[4px] animate-pulse" />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
              <div className="h-32 w-full bg-gray-50 rounded-[4px] animate-pulse" />
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-[6px] border border-gray-200   p-8 flex flex-col gap-8">
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2" />

            <div className="flex flex-col gap-3">
              <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-50 rounded-[4px] animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
                <div className="h-12 w-full bg-gray-50 rounded-[4px] animate-pulse" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="flex gap-6 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gray-100 animate-pulse" />
                    <div className="h-3 w-10 bg-gray-50 rounded animate-pulse" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gray-100 animate-pulse" />
                    <div className="h-3 w-10 bg-gray-50 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Media & Meta) */}
        <div className="flex flex-col gap-6">
          {/* Images Card */}
          <div className="bg-white rounded-[6px] border border-gray-200   p-8 flex flex-col gap-6">
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />

            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-12 bg-gray-50 rounded animate-pulse" />
              </div>
              <div className="aspect-square w-full rounded-[6px] bg-gray-50 animate-pulse" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-[6px] bg-gray-50 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Categories Card */}
          <div className="bg-white rounded-[6px] border border-gray-200   p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-50 rounded-[4px] animate-pulse" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-50 rounded-[4px] animate-pulse" />
            </div>
          </div>

          {/* Colors Card */}
          <div className="bg-white rounded-[6px] border border-gray-200   p-8 flex flex-col gap-6">
            <div className="h-3 w-32 bg-gray-100 rounded animate-pulse" />
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-[6px] bg-gray-50 animate-pulse" />
              ))}
              <div className="w-10 h-10 rounded-[6px] border-2 border-dashed border-gray-100 bg-gray-50/50 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
