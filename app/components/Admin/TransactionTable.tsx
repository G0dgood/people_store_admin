"use client";

import React from "react";
import { Icon } from "../Icon";
import { Button } from "../Button";

const transactionData = [
  { id: "6545", date: "01 Oct | 11:29 am", status: "Paid", amount: "$64", color: "bg-[#4CAF50]" },
  { id: "5412", date: "01 Oct | 11:29 am", status: "Pending", amount: "$557", color: "bg-[#FFC107]" },
  { id: "6622", date: "01 Oct | 11:29 am", status: "Paid", amount: "$156", color: "bg-[#4CAF50]" },
  { id: "6462", date: "01 Oct | 11:29 am", status: "Paid", amount: "$265", color: "bg-[#4CAF50]" },
  { id: "6462", date: "01 Oct | 11:29 am", status: "Paid", amount: "$265", color: "bg-[#4CAF50]" },
];

export function TransactionTable() {
  return (
    <div className="bg-white p-8 rounded-[6px] border border-gray-100 shadow-sm flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-black text-[#1D3557]">Transaction</h3>
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
              <th>No</th>
              <th>Id Customer</th>
              <th>Order Date</th>
              <th className="pl-4">Status</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactionData.map((tx, i) => (
              <tr key={i} className="group">
                <td className="text-[13px] font-black text-[#1D3557]">{i + 1}.</td>
                <td className="text-[13px] font-black text-[#1D3557]">#{tx.id}</td>
                <td className="text-[11px] font-bold text-gray-600">{tx.date}</td>
                <td className="pl-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${tx.color}`}></span>
                    <span className="text-[12px] font-bold text-[#1D3557]">{tx.status}</span>
                  </div>
                </td>
                <td className="text-[13px] font-black text-[#1D3557] text-right">{tx.amount}</td>
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
