import React, { useState } from "react";
import { ProductReviews } from "./ProductReviews";
import { ProductDescription } from "./ProductDescription";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("Description");
  const tabs = ["Description", "Reviews"];

  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col min-h-[600px]">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-8 py-4 text-sm font-bold transition-colors relative
              ${activeTab === tab ? "text-brand-blue border-b-2 border-brand-blue" : "text-gray-400 hover:text-gray-600"}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-8">
        {activeTab === "Description" && <ProductDescription />}
        {activeTab === "Reviews" && <ProductReviews />}
      </div>
    </div>
  );
};

export { ProductTabs };
