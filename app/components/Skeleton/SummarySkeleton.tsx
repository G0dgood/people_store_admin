"use client";

import React from "react";

export function SummarySkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-[4px] bg-gray-50 border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[4px] bg-gray-200" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <div className="h-8 bg-white rounded-lg border border-gray-50 w-full" />
        <div className="h-8 bg-white rounded-lg border border-gray-50 w-full" />
        <div className="h-8 bg-white rounded-lg border border-gray-50 w-full" />
      </div>
    </div>
  );
}
