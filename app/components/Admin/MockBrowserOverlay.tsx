import React from "react";

export const MockBrowserOverlay: React.FC = () => {
 return (
  <div className="absolute top-0 inset-x-0 h-8 bg-black/40 backdrop-blur-md z-20 flex items-center px-4 gap-2">
   <div className="flex gap-1.5">
    <div className="w-2 h-2 rounded-full bg-red-400/50" />
    <div className="w-2 h-2 rounded-full bg-amber-400/50" />
    <div className="w-2 h-2 rounded-full bg-emerald-400/50" />
   </div>
   <div className="flex-1 max-w-[400px] h-4 bg-white/10 rounded-[4px] mx-auto" />
  </div>
 );
};
