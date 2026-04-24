"use client";

import React from "react";
import { Icon } from "../Icon";

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
    <div className="flex flex-col gap-4 py-6 border-b border-gray-200">
      {specs.map((spec, idx) => (
        <div key={idx} className="flex text-[11px] uppercase tracking-widest">
          <span className="w-32 text-gray-400 flex-shrink-0 font-bold">{spec.label}</span>
          <span className="text-gray-900 font-bold">{spec.value}</span>
        </div>
      ))}
    </div>
  );
};

export const ProtectionWarranty: React.FC = () => {
  return (
    <div className="flex flex-col gap-5 py-8 border-b border-gray-200 text-[10px] uppercase tracking-widest font-bold">
      <div className="flex items-center gap-4 text-gray-400">
        <Icon name="security" size="sm" className="text-brand-gold" />
        <div className="flex flex-col gap-1">
          <span className="text-gray-900">Authenticity Guaranteed</span>
          <span className="font-medium text-gray-400 normal-case tracking-normal">100% genuine luxury products sourced directly.</span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-gray-400">
        <Icon name="cached" size="sm" className="text-brand-gold" />
        <div className="flex flex-col gap-1">
          <span className="text-gray-900">Luxury Returns</span>
          <span className="font-medium text-gray-400 normal-case tracking-normal">Easy returns within 7 days of delivery.</span>
        </div>
      </div>
    </div>
  );
};
