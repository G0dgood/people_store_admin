"use client";

import React from "react";
import { LuBell } from "react-icons/lu";

export const NotificationSkeleton = () => (
  <div className="flex flex-col">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="px-5 py-4 flex gap-4 border-b border-gray-50/50 animate-pulse">
        <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200/50">
          <LuBell className="text-gray-200 w-5 h-5" />
        </div>
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="flex justify-between items-center gap-4">
            <div className="h-4 bg-gray-100 rounded-md w-3/4"></div>
            <div className="h-2.5 bg-gray-50 rounded-md w-12"></div>
          </div>
          <div className="h-3 bg-gray-50 rounded-md w-full"></div>
          <div className="h-3 bg-gray-50 rounded-md w-2/3"></div>
          <div className="h-4 bg-gray-50 rounded-full w-20 mt-1"></div>
        </div>
      </div>
    ))}
  </div>
);
