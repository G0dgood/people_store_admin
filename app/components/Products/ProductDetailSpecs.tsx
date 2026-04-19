"use client";

import React from "react";

interface PriceTier {
  price: string;
  range: string;
  isActive?: boolean;
}

export const PriceTiers: React.FC<{ tiers: PriceTier[] }> = ({ tiers }) => {
  return (
    <div className="bg-[#FFF0DF] p-4 border border-gray-200 grid grid-cols-3 divide-x divide-gray-200">
      {tiers.map((tier, idx) => (
        <div key={idx} className="flex flex-col gap-1 px-4 first:pl-0 last:pr-0">
          <span className={`text-xl font-bold ${tier.isActive ? "text-[#EB001B]" : "text-[#1C1C1C]"}`}>
            {tier.price}
          </span>
          <span className="text-xs text-gray-400">{tier.range}</span>
        </div>
      ))}
    </div>
  );
};

interface SpecItem {
  label: string;
  value: string;
}

export const SpecsTable: React.FC<{ specs: SpecItem[] }> = ({ specs }) => {
  return (
    <div className="flex flex-col gap-4 py-4 border-b border-gray-200">
      {specs.map((spec, idx) => (
        <div key={idx} className="flex text-sm">
          <span className="w-24 text-gray-400 flex-shrink-0">{spec.label}</span>
          <span className="text-gray-600">{spec.value}</span>
        </div>
      ))}
    </div>
  );
};

export const ProtectionWarranty: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 py-4 border-b border-gray-200 text-sm text-gray-400">
      <div className="flex">
        <span className="w-24 flex-shrink-0">Customization:</span>
        <span className="text-gray-600">Customized logo and design custom packages</span>
      </div>
      <div className="flex">
        <span className="w-24 flex-shrink-0">Protection:</span>
        <span className="text-gray-600">Refund Policy</span>
      </div>
      <div className="flex">
        <span className="w-24 flex-shrink-0">Warranty:</span>
        <span className="text-gray-600">2 years full warranty</span>
      </div>
    </div>
  );
};
