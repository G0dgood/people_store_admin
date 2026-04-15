"use client";

import React, { useState } from "react";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { useRouter } from "next/navigation";
import { TransactionDetailDrawer } from "./TransactionDetailDrawer";

const transactionData = [
  { id: "6545", custId: "#CUST001", name: "John Doe", date: "01 Oct | 11:29 am", status: "Complete", total: "$64", amount: "$64", method: "CC", color: "bg-[#4CAF50]", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  { id: "5412", custId: "#CUST002", name: "Jane Smith", date: "01 Oct | 11:29 am", status: "Pending", total: "$557", amount: "$557", method: "PayPal", color: "bg-[#FFC107]", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
  { id: "6622", custId: "#CUST003", name: "Robert Fox", date: "01 Oct | 11:29 am", status: "Complete", total: "$156", amount: "$156", method: "CC", color: "bg-[#4CAF50]", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
  { id: "6462", custId: "#CUST004", name: "Eleanor Pena", date: "01 Oct | 11:29 am", status: "Complete", total: "$265", amount: "$265", method: "Bank", color: "bg-[#4CAF50]", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { id: "6462", custId: "#CUST005", name: "Theresa Webb", date: "01 Oct | 11:29 am", status: "Complete", total: "$265", amount: "$265", method: "CC", color: "bg-[#4CAF50]", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
];

export function TransactionTable() {
  const router = useRouter();
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  return (
    <div className="bg-white p-8 rounded-[6px] border border-gray-100 shadow-sm flex flex-col gap-6">
      <TransactionDetailDrawer 
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        transaction={selectedTransaction}
      />
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
              <th className="text-right">Action</th>
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
                <td className="text-right">
                   <button 
                     className="p-1 px-2 text-[10px] font-black text-brand-blue uppercase hover:bg-brand-blue-light rounded-[4px] transition-all"
                     onClick={() => {
                       setSelectedTransaction(tx);
                       setIsDetailDrawerOpen(true);
                     }}
                   >
                      View
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          variant="ghost"
          className="border border-brand-blue/20 text-brand-blue text-[10px] font-black uppercase tracking-widest px-8 h-10 rounded-[6px] hover:bg-brand-blue/5"
          onClick={() => router.push("/admin/transactions")}
        >
          Details
        </Button>
      </div>
    </div>
  );
}
