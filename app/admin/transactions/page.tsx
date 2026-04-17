"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { StatCard } from "../../components/Admin/StatCard";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { TransactionDetailDrawer } from "../../components/Admin/TransactionDetailDrawer";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { HiOutlineDocumentText } from "react-icons/hi2";

const transactionsData = [
  { custId: "#CUST001", name: "John Doe", date: "01-01-2025", total: "₦2,904", method: "CC", status: "Complete" },
  { custId: "#CUST002", name: "John Doe", date: "01-01-2025", total: "₦2,904", method: "PayPal", status: "Complete" },
  { custId: "#CUST003", name: "John Doe", date: "01-01-2025", total: "₦2,904", method: "CC", status: "Complete" },
  { custId: "#CUST004", name: "John Doe", date: "01-01-2025", total: "₦2,904", method: "Bank", status: "Complete" },
  { custId: "#CUST005", name: "Jane Smith", date: "01-01-2025", total: "₦2,904", method: "CC", status: "Canceled" },
  { custId: "#CUST006", name: "Emily Davis", date: "01-01-2025", total: "₦2,904", method: "PayPal", status: "Pending" },
  { custId: "#CUST007", name: "Jane Smith", date: "01-01-2025", total: "₦2,904", method: "Bank", status: "Canceled" },
  { custId: "#CUST008", name: "John Doe", date: "01-01-2025", total: "₦2,904", method: "CC", status: "Complete" },
  { custId: "#CUST009", name: "Emily Davis", date: "01-01-2025", total: "₦2,904", method: "PayPal", status: "Pending" },
  { custId: "#CUST010", name: "Jane Smith", date: "01-01-2025", total: "₦2,904", method: "Bank", status: "Canceled" },
];

const statusStyles = {
  Complete: { color: "text-blue-500", bg: "bg-blue-500" },
  Canceled: { color: "text-rose-500", bg: "bg-rose-500" },
  Pending: { color: "text-orange-400", bg: "bg-orange-400" },
};

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("All transactions");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const toggleAll = () => {
    if (selectedIds.length === transactionsData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(transactionsData.map(t => t.custId));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Top Grid: Stats & Payment Method */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Stats Section (Left 2 columns in a 2x2 grid) */}
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Total Revenue"
            value="₦15,045"
            trendValue="14.4%"
            trendIsUp={true}
            periodLabel="Last 7 days"
          />
          <StatCard
            title="Completed Transactions"
            value="3,150"
            trendValue="20%"
            trendIsUp={true}
            periodLabel="Last 7 days"
          />
          <StatCard
            title="Pending Transactions"
            value="150"
            trendValue="85%"
            trendIsUp={true}
            periodLabel="Last 7 days"
          />
          <StatCard
            title="Failed Transactions"
            value="75"
            trendValue="15%"
            trendIsUp={false}
            periodLabel="Last 7 days"
          />
        </div>

        {/* Payment Method Card (Right 2 columns) */}
        <div className="xl:col-span-2 bg-white rounded-[6px] border border-[#1C1C1C1A] overflow-hidden flex flex-col p-6 gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#1D3557]">Payment Method</h3>
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-gray-600 !p-1"
            >
              <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            {/* Visual Card */}
            <div className="relative w-full max-w-[320px] h-[180px] rounded-[16px] overflow-hidden shadow-xl shadow-blue-100 group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2196F3] via-blue-400 to-[#1D3557]"></div>
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('/dashboardImage/image 270.png')] bg-cover"></div>

              <div className="relative h-full p-6 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <span className="text-xl font-black italic tracking-tighter">Finaci</span>
                  <div className="flex gap-1 items-center">
                    <div className="w-8 h-8 rounded-full bg-white/20"></div>
                    <div className="w-8 h-8 rounded-full bg-white/40 -ml-4"></div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs font-medium opacity-70">Card Holder name</p>
                  <p className="text-sm font-bold tracking-widest uppercase">Noman Manzoor</p>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-bold tracking-[0.2em]">**** **** **** 2345</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] opacity-70">Expiry Date</p>
                    <p className="text-xs font-bold">02/30</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Info */}
            <div className="flex-1 flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Status:</span>
                  <span className="text-xs font-bold text-blue-500">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Transactions:</span>
                  <span className="text-xs font-bold text-[#1D3557]">1,250</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Revenue:</span>
                  <span className="text-xs font-bold text-[#1D3557]">₦50,000</span>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-[11px] font-black text-brand-blue uppercase tracking-widest hover:underline !px-0 !justify-start"
              >
                View Transactions
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-gray-50">
            <Button
              variant="secondary"
              className="flex-1 h-12 rounded-[6px] border-dashed border-gray-200 text-gray-400 hover:text-brand-blue hover:border-brand-blue transition-all"
              iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
            >
              Add Card
            </Button>
            <Button
              variant="rose"
              shape="rounded-sm"
              className="h-12 px-6 w-full sm:w-auto"
            >
              Deactivate
            </Button>
          </div>
        </div>
      </div>

      {/* Transaction History Card */}
      <div className="bg-white rounded-[6px] overflow-hidden flex flex-col border border-[#1C1C1C1A] rounded-[6px] ">
        {/* Controls Bar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All transactions", "Completed", "Pending", "Canceled"]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input
              type="text"
              placeholder="Search payment history"
              containerClassName="w-full lg:w-80 xl:w-96"
              className="bg-white border-gray-100 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

              <div className="flex gap-2 ml-auto sm:ml-0">
                <Button
                  variant="outline"
                  shape="rounded-sm"
                  className="!p-2.5 text-gray-400"
                >
                  <Icon name="sort" folder="dashboardIcon" size="sm" />
                </Button>
                <Button
                  variant="outline"
                  shape="rounded-sm"
                  className="!p-2.5 text-gray-400"
                >
                  <Icon name="flowbite_arrow-up-down-outline" folder="dashboardIcon" size="sm" />
                </Button>
                <Button
                  variant="outline"
                  shape="rounded-sm"
                  className="!p-2.5 text-gray-400"
                >
                  <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-container ">
          <table>
            <thead>
              <tr>
                <th className="w-10 pl-8">
                  <Checkbox
                    checked={selectedIds.length === transactionsData.length && transactionsData.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th>Customer Id</th>
                <th>Name</th>
                <th className="text-center">Date</th>
                <th>Total</th>
                <th className="text-center">Method</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactionsData.map((tx, idx) => (
                <tr key={idx} className="group">
                  <td className="w-10 pl-8">
                    <Checkbox
                      checked={selectedIds.includes(tx.custId)}
                      onChange={() => toggleItem(tx.custId)}
                    />
                  </td>
                  <td>
                    <span className="text-xs font-bold text-gray-900">{tx.custId}</span>
                  </td>
                  <td className="text-xs font-bold text-gray-700">{tx.name}</td>
                  <td className="text-xs font-bold text-gray-400 text-center">{tx.date}</td>
                  <td className="text-xs font-bold text-gray-900">{tx.total}</td>
                  <td className="text-xs font-bold text-gray-700 text-center">{tx.method}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyles[tx.status as keyof typeof statusStyles].bg}`}></span>
                      <span className={`text-xs font-bold ${statusStyles[tx.status as keyof typeof statusStyles].color}`}>{tx.status}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2 pr-4">
                      <Button
                        variant="outline"
                        shape="rounded-sm"
                        className="!p-1.5 text-gray-400 hover:text-blue-500 hover:bg-brand-blue-light transition-all"
                        onClick={() => {
                          setSelectedTransaction(tx);
                          setIsDetailDrawerOpen(true);
                        }}
                      >
                        <HiOutlineDocumentText size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={24}
          onPageChange={setCurrentPage}
        />
      </div>

      <TransactionDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}
