import React from "react";

export const RecommendedItemsSkeleton = () => {
  return (
    <section className="w-full">
      <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-gray-900">Recommended items</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} className="aspect-[4/5] bg-gray-100 animate-pulse rounded-lg   border border-gray-50" />
        ))}
      </div>
    </section>
  );
};
