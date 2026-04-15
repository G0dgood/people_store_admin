"use client";

import React from "react";
import { Icon } from "../Icon";
import { Button } from "../Button";

const bestSellingData = [
  {
    name: "Apple iPhone 13",
    orders: 104,
    status: "Stock",
    price: "₦999.00",
    image: "/dashboardImage/Frame 4259.png",
    color: "bg-[#4CAF50]",
  },
  {
    name: "Nike Air Jordan",
    orders: 56,
    status: "Stock out",
    price: "₦999.00",
    image: "/dashboardImage/Frame 4259 copy.png",
    color: "bg-red-500",
  },
  {
    name: "T-shirt",
    orders: 266,
    status: "Stock",
    price: "₦999.00",
    image: "/dashboardImage/Frame 4259 copy 2.png",
    color: "bg-[#4CAF50]",
  },
  {
    name: "Cross Bag",
    orders: 506,
    status: "Stock",
    price: "₦999.00",
    image: "/dashboardImage/Frame 4259 copy 3.png",
    color: "bg-[#4CAF50]",
  },
];

export function BestSellingProductTable() {
  return (
    <div className="bg-white p-8 rounded-[6px] border border-gray-100 shadow-sm flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-black text-[#1D3557]">Best selling product</h3>
        <Button 
          iconRight={<Icon name="sort" folder="dashboardIcon" size="sm" />}
          className="bg-[#66BB6A] hover:bg-[#4CAF50] text-white text-[11px] font-black px-6 h-9 rounded-[6px] shadow-sm"
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
            {bestSellingData.map((p, i) => (
              <tr key={i} className="group">
                <td className="pl-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={p.image}
                      className="w-10 h-10 rounded-[6px] object-contain bg-gray-50 border border-gray-100 p-1"
                    />
                    <span className="text-[12px] font-black text-[#1D3557]">{p.name}</span>
                  </div>
                </td>
                <td className="text-[12px] font-bold text-gray-500">{p.orders}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${p.color}`}></span>
                    <span className="text-[12px] font-bold text-[#1D3557]">{p.status}</span>
                  </div>
                </td>
                <td className="text-[12px] font-black text-[#1D3557] text-right">{p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          variant="ghost"
          className="border border-brand-blue/20 text-brand-blue text-[10px] font-black uppercase tracking-widest px-8 h-10 rounded-[6px] hover:bg-brand-blue/5"
        >
          Details
        </Button>
      </div>
    </div>
  );
}
