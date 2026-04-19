import React, { useState } from "react";
import { ProductReviews } from "./ProductReviews";
import { ProductDescription } from "./ProductDescription";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("Description");
  const tabs = ["Description", "Reviews"];

  return (
    <div className="flex-1 bg-white flex flex-col min-h-[500px]">
      {/* Tab Headers */}
      <div className="flex gap-12 border-b border-gray-100 bg-white mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              pb-4 text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300 relative
              ${activeTab === tab 
                ? "text-black border-b-2 border-brand-gold" 
                : "text-gray-400 hover:text-black"}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="py-2">
        {activeTab === "Description" && <ProductDescription />}
        {activeTab === "Reviews" && <ProductReviews />}
      </div>
    </div>
  );
};

export { ProductTabs };
