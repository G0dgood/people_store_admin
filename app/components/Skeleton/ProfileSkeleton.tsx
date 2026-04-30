"use client";

import React from "react";
import { motion } from "framer-motion";

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-inter">
      {/* Header Skeleton Placeholder */}
      <div className="h-20 bg-white border-b border-gray-100 animate-pulse" />

      <div className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-10 lg:px-16 py-6 md:py-8">
        {/* Breadcrumbs Skeleton */}
        <div className="h-6 w-48 bg-gray-200 rounded-lg mb-8 animate-pulse" />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Skeleton */}
          <div className="w-full lg:w-72 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-[500px] flex flex-col items-center p-8">
            <div className="w-24 h-24 rounded-full bg-gray-100 animate-pulse mb-6" />
            <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mb-3" />
            <div className="h-4 w-24 bg-gray-50 rounded animate-pulse mb-8" />
            <div className="w-full space-y-3 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 w-full bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1 w-full flex flex-col gap-6 md:gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-50">
                <div className="h-7 w-48 bg-gray-100 rounded animate-pulse mb-2" />
                <div className="h-4 w-64 bg-gray-50 rounded animate-pulse" />
              </div>

              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`flex flex-col gap-2 ${i <= 2 ? 'md:col-span-2' : ''}`}>
                      <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                      <div className="h-12 w-full bg-gray-50 rounded-xl animate-pulse border border-gray-100" />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-gray-50">
                  <div className="h-5 w-48 bg-gray-50 rounded animate-pulse" />
                  <div className="flex gap-4">
                    <div className="h-11 w-24 bg-gray-100 rounded-xl animate-pulse" />
                    <div className="h-11 w-32 bg-brand-gold/20 rounded-xl animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Skeleton */}
            <div className="h-40 w-full bg-brand-gold/10 rounded-2xl animate-pulse flex items-center justify-between px-8">
              <div className="space-y-2">
                <div className="h-6 w-64 bg-brand-gold/20 rounded" />
                <div className="h-4 w-80 bg-brand-gold/10 rounded" />
              </div>
              <div className="flex gap-3">
                <div className="h-12 w-64 bg-brand-gold/10 rounded-xl border border-brand-gold/20" />
                <div className="h-12 w-24 bg-orange-200 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
