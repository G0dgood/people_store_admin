"use client";

import React from "react";

export const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 max-w-[1600px] mx-auto pb-12 animate-pulse">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column (33%) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Profile Summary Card Skeleton */}
          <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 shadow-sm" />
            <div className="h-5 w-48 bg-gray-200 rounded-[4px] mb-2" />
            <div className="h-3 w-40 bg-gray-100 rounded-[4px] mb-6" />

            <div className="w-full border-t border-gray-50 pt-6 flex flex-col gap-4">
              <div className="h-3 w-32 bg-gray-100 rounded-[4px] mx-auto" />
              <div className="flex items-center justify-center gap-4">
                <div className="h-4 w-16 bg-gray-50 rounded-[4px]" />
                <div className="h-4 w-16 bg-gray-50 rounded-[4px]" />
                <div className="h-4 w-16 bg-gray-50 rounded-[4px]" />
              </div>
              <div className="mt-2 h-8 w-32 bg-gray-50 rounded-[6px] mx-auto" />
            </div>
          </div>

          {/* Change Password Card Skeleton */}
          <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[6px] bg-gray-100" />
                <div className="h-4 w-32 bg-gray-200 rounded-[4px]" />
              </div>
              <div className="h-3 w-16 bg-gray-100 rounded-[4px]" />
            </div>

            <div className="flex flex-col gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-3 w-24 bg-gray-100 rounded-[4px] ml-1" />
                  <div className="h-12 w-full bg-gray-50/80 rounded-[6px]" />
                </div>
              ))}
              <div className="h-12 w-full bg-gray-200 rounded-[6px] mt-2" />
            </div>
          </div>
        </div>

        {/* Right Column (66%) */}
        <div className="xl:col-span-8">
          <div className="bg-white rounded-[6px] border border-gray-200 shadow-sm p-8 flex flex-col gap-8">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-32 bg-gray-200 rounded-[4px]" />
              <div className="h-10 w-28 bg-gray-100 rounded-[6px]" />
            </div>

            {/* Avatar Management Skeleton */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200" />
              <div className="flex gap-2">
                <div className="h-9 w-28 bg-gray-200 rounded-[6px]" />
                <div className="h-9 w-20 bg-gray-50 rounded-[6px]" />
              </div>
            </div>

            {/* Update Form Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-3 w-24 bg-gray-200 rounded-[4px]" />
                  <div className="h-11 w-full bg-gray-50/50 rounded-[6px]" />
                </div>
              ))}
              <div className="md:col-span-2 flex flex-col gap-2">
                <div className="h-3 w-24 bg-gray-200 rounded-[4px]" />
                <div className="h-11 w-full bg-gray-50/50 rounded-[6px]" />
              </div>
              <div className="md:col-span-2 flex flex-col gap-2">
                <div className="h-3 w-24 bg-gray-200 rounded-[4px]" />
                <div className="h-32 w-full bg-gray-50/50 rounded-[6px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
