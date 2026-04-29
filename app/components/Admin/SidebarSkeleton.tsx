"use client";

import React from "react";

export const SidebarSkeleton = () => {
  return (
    <aside id="sidenav" className="w-64 h-full shrink-0 flex flex-col bg-white border-r border-gray-200">
      <div className="p-6">
        <div className="h-8 w-32 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="flex-1 px-4 py-2 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {[1, 2].map(i => (
            <div key={i} className="h-10 w-full bg-gray-50 rounded animate-pulse" />
          ))}
        </div>
        {[1, 2].map(g => (
          <div key={g} className="flex flex-col gap-3">
            <div className="h-3 w-20 bg-gray-100 rounded animate-pulse ml-4" />
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 w-full bg-gray-50 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
        <div className="flex flex-col gap-2">
          <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
          <div className="h-2 w-16 bg-gray-50 rounded animate-pulse" />
        </div>
      </div>
    </aside>
  );
};
