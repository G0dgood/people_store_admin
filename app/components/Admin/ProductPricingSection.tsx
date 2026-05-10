"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../Icon";
import { Input } from "../Form";
import Checkbox from "@/app/components/Checkbox";
import { Tooltip } from "../Tooltip";

interface ProductPricingSectionProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
}

const currencies = [
  { code: "NGN", label: "Nigeria", symbol: "₦", flag: "/country/Property 1=NG.svg" },
  { code: "USD", label: "USA", symbol: "$", flag: "/country/Property 1=US.png" },
  { code: "GBP", label: "UK", symbol: "£", flag: "/country/Property 1=GB.png" },
  { code: "EUR", label: "EU", symbol: "€", flag: "/country/Property 1=FR.png" },
];

export const ProductPricingSection: React.FC<ProductPricingSectionProps> = ({
  formData,
  handleInputChange,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isDiscountDropdownOpen, setIsDiscountDropdownOpen] = useState(false);

  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  const discountDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(target)) {
        setIsCurrencyDropdownOpen(false);
      }
      if (discountDropdownRef.current && !discountDropdownRef.current.contains(target)) {
        setIsDiscountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-[6px] flex flex-col gap-8">
      <h3 className="text-base font-bold text-[#121212]">Pricing</h3>

      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-[#121212]">Product Price</label>
        <div className="relative" ref={currencyDropdownRef}>
          <Input shape="rounded-sm" type="number"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder="0.00"
            className="bg-gray-50/80 border-gray-50 text-sm font-bold text-gray-900"
            prefixElement={<span className="text-sm font-bold text-gray-400">{currencies.find(c => c.code === selectedCurrency)?.symbol}</span>}
            suffixElement={
              <div
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-[6px] cursor-pointer   hover:bg-gray-50 transition-colors"
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              >
                <img src={currencies.find(c => c.code === selectedCurrency)?.flag} alt={selectedCurrency} className="w-5 h-3 object-cover rounded-[1px]" />
                <Icon name="material-symbols_arrow-downward-rounded" folder="dashboardIcon" size="xs" className="text-gray-400" />
              </div>
            }
          />
          {isCurrencyDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-[6px] shadow-xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {currencies.map((curr) => (
                <div
                  key={curr.code}
                  className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors ${selectedCurrency === curr.code ? "bg-gray-50" : ""}`}
                  onClick={() => {
                    setSelectedCurrency(curr.code);
                    setIsCurrencyDropdownOpen(false);
                  }}
                >
                  <img src={curr.flag} alt={curr.label} className="w-5 h-3 object-cover rounded-[1px]" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-700">{curr.label}</span>
                    <span className="text-[9px] text-gray-400 font-medium uppercase">{curr.code}</span>
                  </div>
                  {selectedCurrency === curr.code && (
                    <div className="ml-auto w-1.5 h-1.5 bg-brand-gold rounded-full" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-bold text-gray-400">Discounted Price <span className="text-gray-300 font-medium">(Optional)</span></label>
          <div className="relative" ref={discountDropdownRef}>
            <Input
              shape="rounded-sm"
              type="number"
              value={formData.discountPrice}
              onChange={(e) => handleInputChange("discountPrice", e.target.value)}
              placeholder="0.00"
              className="bg-gray-50/80 border-gray-50 text-sm font-bold text-gray-900"
              prefixElement={<span className="text-sm font-bold text-gray-400">{currencies.find(c => c.code === selectedCurrency)?.symbol}</span>}
              suffixElement={
                <div
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-[6px] cursor-pointer   hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDiscountDropdownOpen(!isDiscountDropdownOpen)}
                >
                  <img src={currencies.find(c => c.code === selectedCurrency)?.flag} alt={selectedCurrency} className="w-5 h-3 object-cover rounded-[1px]" />
                  <Icon name="material-symbols_arrow-downward-rounded" folder="dashboardIcon" size="xs" className="text-gray-400" />
                </div>
              }
              containerClassName="w-full"
            />
            {isDiscountDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-[6px] shadow-xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {currencies.map((curr) => (
                  <div
                    key={curr.code}
                    className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors ${selectedCurrency === curr.code ? "bg-gray-50" : ""}`}
                    onClick={() => {
                      setSelectedCurrency(curr.code);
                      setIsDiscountDropdownOpen(false);
                    }}
                  >
                    <img src={curr.flag} alt={curr.label} className="w-5 h-3 object-cover rounded-[1px]" />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-700">{curr.label}</span>
                      <span className="text-[9px] text-gray-400 font-medium uppercase">{curr.code}</span>
                    </div>
                    {selectedCurrency === curr.code && (
                      <div className="ml-auto w-1.5 h-1.5 bg-brand-gold rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-bold text-[#121212]">Tax Included</label>
          <div className="flex items-center gap-6 py-3">
            <Checkbox
              checked={formData.taxIncluded}
              onChange={() => handleInputChange("taxIncluded", true)}
              label="Yes"
            />
            <Checkbox
              checked={!formData.taxIncluded}
              onChange={() => handleInputChange("taxIncluded", false)}
              label="No"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-[#121212]">Expiration</label>
          <Tooltip text="Define the start and end dates for the product's availability. The product will only be visible on the boutique during this period." position="top">
            <button type="button" className="text-gray-400 hover:text-brand-gold transition-colors">
              <Icon name="info-circle" folder="dashboardIcon" size="xs" />
            </button>
          </Tooltip>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input shape="rounded-sm"
            type="date"
            value={formData.expiryStart}
            onChange={(e) => handleInputChange("expiryStart", e.target.value)}
            placeholder="Start"
          />
          <Input shape="rounded-sm"
            type="date"
            value={formData.expiryEnd}
            onChange={(e) => handleInputChange("expiryEnd", e.target.value)}
            placeholder="End"
          />
        </div>
      </div>
    </div>
  );
};
