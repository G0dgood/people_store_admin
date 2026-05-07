import React from "react";
import { OrderSkeleton } from "./OrderSkeleton";

export const OrdersListSkeleton = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Skeleton Toolbar */}
      <div className="bg-white p-6 border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 animate-pulse">
        <div className="flex flex-col gap-2">
          <div className="h-3 bg-gray-100 w-20" />
          <div className="h-6 bg-gray-100 w-48" />
        </div>
        <div className="w-full md:w-96 h-12 bg-gray-100" />
      </div>

      {/* Skeleton List */}
      <div className="flex flex-col gap-5">
        {[...Array(5)].map((_, i) => (
          <OrderSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
