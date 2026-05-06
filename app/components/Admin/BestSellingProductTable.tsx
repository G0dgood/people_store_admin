"use client";

import React from "react";
import { Icon } from "../Icon";
import { Button } from "../Button";

import { useGetBestSellingProductsQuery } from "@/lib/redux/services/productApi";
import { SVGLoaderFetch, NoRecordFound } from "../Options";

export function BestSellingProductTable() {
  const { data: response, isLoading } = useGetBestSellingProductsQuery();
  const bestSellers = response?.data || [];

  return (
    <div className="bg-white p-8 rounded-[6px] border border-gray-200   flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-black text-[#1D3557]">Top Performers</h3>
        <Button
          shape="rounded-sm"
          iconRight={<Icon name="sort" folder="dashboardIcon" size="sm" />}
          className="bg-[#66BB6A] hover:bg-[#4CAF50] text-white text-[11px] font-black px-6 h-9 rounded-[6px]  "
        >
          Filter
        </Button>
      </div>

      <div className="admin-table-container">
        <table>
          <thead>
            <tr>
              <th className="pl-4">PRODUCT</th>
              <th>TOTAL ORDER</th>
              <th>STATUS</th>
              <th className="text-right">PRICE</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SVGLoaderFetch colSpan={4} text="Loading top performers..." />
            ) : bestSellers.length === 0 ? (
              <NoRecordFound colSpan={4} text="No performance data yet." />
            ) : bestSellers.map((item: any, i: number) => (
              <tr key={i} className="group">
                <td className="pl-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.productDetails.productImage || "/dashboardImage/Frame 4259.png"}
                      className="w-10 h-10 rounded-[6px] object-contain bg-gray-50 border border-gray-200 p-1"
                    />
                    <span className="text-[12px] font-black text-[#1D3557]">{item.productDetails.name}</span>
                  </div>
                </td>
                <td className="text-[12px] font-bold text-gray-500">{item.totalOrders}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.productDetails.stock > 0 ? "bg-[#4CAF50]" : "bg-red-500"}`}></span>
                    <span className="text-[12px] font-bold text-[#1D3557]">
                      {item.productDetails.stock > 0 ? "Stock" : "Stock out"}
                    </span>
                  </div>
                </td>
                <td className="text-[12px] font-black text-[#1D3557] text-right">₦{item.productDetails.price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          shape="rounded-sm"
          variant="ghost"
          className="border border-brand-gold/20 text-brand-gold text-[10px] font-black uppercase tracking-widest px-8 h-10 rounded-[6px] hover:bg-brand-gold/5"
        >
          Details
        </Button>
      </div>
    </div>
  );
}
