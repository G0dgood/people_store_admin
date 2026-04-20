"use client";

import React, { useState } from "react";
import { Icon } from "../../components/Icon";
import { Button } from "../../components/Button";
import { Input } from "../../components/Form/Inputs";
import { StatCard } from "../../components/Admin/StatCard";
import { TabFilter } from "../../components/Admin/TabFilter";
import { Pagination } from "../../components/Admin/Pagination";
import { TicketDetailDrawer } from "../../components/Admin/TicketDetailDrawer";
import { SupportChatDrawer } from "../../components/Admin/SupportChatDrawer";
import { CreateTicketModal } from "../../components/Admin/CreateTicketModal";
import { BulkActionsDrawer } from "../../components/Admin/BulkActionsDrawer";
import { RowsPerPage } from "@/app/components/rows-per-page";
import Checkbox from "@/app/components/Checkbox";
import { BiMessageDetail } from "react-icons/bi";
import { HiOutlineDocumentText } from "react-icons/hi2";

const ticketsData = [
  { ticketId: "#TKT_001", customer: "Alice Johnson", subject: "Login Issue", priority: "High", activity: "2 mins ago", status: "Open" },
  { ticketId: "#TKT_002", customer: "Bob Smith", subject: "Payment Failed", priority: "Urgent", activity: "15 mins ago", status: "Pending" },
  { ticketId: "#TKT_003", customer: "Charlie Brown", subject: "Order Status", priority: "Medium", activity: "1 hour ago", status: "Open" },
  { ticketId: "#TKT_004", customer: "Diana Prince", subject: "Refund Request", priority: "High", activity: "3 hours ago", status: "Resolved" },
  { ticketId: "#TKT_005", customer: "Edward Norton", subject: "Product Feedback", priority: "Low", activity: "5 hours ago", status: "Open" },
  { ticketId: "#TKT_006", customer: "Fiona Gallagher", subject: "Account Deletion", priority: "Medium", activity: "8 hours ago", status: "Pending" },
  { ticketId: "#TKT_007", customer: "George Costanza", subject: "Damaged Item", priority: "Urgent", activity: "1 day ago", status: "Open" },
  { ticketId: "#TKT_008", customer: "Hannah Baker", subject: "Shipping Update", priority: "Low", activity: "1 day ago", status: "Resolved" },
  { ticketId: "#TKT_009", customer: "Ian Curtis", subject: "Promotion Code", priority: "Medium", activity: "2 days ago", status: "Resolved" },
  { ticketId: "#TKT_010", customer: "Jane Austen", subject: "Gift Card Query", priority: "Low", activity: "2 days ago", status: "Open" },
];

const priorityStyles = {
  Urgent: "text-rose-600 bg-rose-50",
  High: "text-orange-600 bg-orange-50",
  Medium: "text-brand-gold bg-brand-gold/10",
  Low: "text-emerald-600 bg-emerald-50",
};

const statusStyles = {
  Open: "bg-brand-gold",
  Pending: "bg-orange-400",
  Resolved: "bg-emerald-500",
};

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("All tickets");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const toggleAll = () => {
    if (selectedIds.length === ticketsData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(ticketsData.map(t => t.ticketId));
    }
  };

  const toggleItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Header Area */}
      <div className="flex justify-end items-center mb-2">
        <Button shape="rounded-sm" variant="primary"
          className="transition-all duration-300 hover:bg-brand-gold hover:text-white hover:border-brand-gold  text-[10px] font-black uppercase tracking-widest"
          iconLeft={<Icon name="circle-plus" folder="dashboardIcon" size="sm" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Ticket
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Tickets"
          value="1,284"
          trendValue="12.5%"
          trendIsUp={true}
          periodLabel="Since last month"
        />
        <StatCard
          title="Open Tickets"
          value="45"
          trendValue="5.2%"
          trendIsUp={false}
          periodLabel="Active now"
        />
        <StatCard
          title="Resolved"
          value="1,120"
          trendValue="8.4%"
          trendIsUp={true}
          periodLabel="This month"
        />
        <StatCard
          title="Avg. Response"
          value="24m"
          trendValue="15%"
          trendIsUp={true}
          periodLabel="Response time"
        />
      </div>

      {/* Ticket History Table Card */}
      <div className="bg-white rounded-[6px] overflow-hidden flex flex-col border border-[#1C1C1C1A]">
        {/* Controls Bar */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between border-b border-gray-50">
          <TabFilter
            tabs={["All tickets", "Open", "Pending", "Resolved"]}
            activeTab={activeTab}
            onChange={setActiveTab} id={""} />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input shape="rounded-sm"
              type="text"
              placeholder="Search tickets by ID or Subject"
              containerClassName="w-full lg:w-80 xl:w-96"
              className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage} />

              <div className="flex gap-2 ml-auto sm:ml-0">
                <Button variant="outline" shape="rounded-sm" className="!p-2.5 text-gray-400">
                  <Icon name="filter" folder="dashboardIcon" size="sm" />
                </Button>
                <Button variant="outline" shape="rounded-sm" className="!p-2.5 text-gray-400">
                  <Icon name="DotsHorizontal" folder="dashboardIcon" size="sm" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-container">
          <table>
            <thead>
              <tr>
                <th className="w-10 pl-8">
                  <Checkbox
                    checked={selectedIds.length === ticketsData.length && ticketsData.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                <th>Ticket Id</th>
                <th>Customer</th>
                <th>Subject</th>
                <th className="text-center">Activity</th>
                <th className="text-center">Priority</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {ticketsData.map((ticket, idx) => (
                <tr key={idx} className="group">
                  <td className="w-10 pl-8">
                    <Checkbox
                      checked={selectedIds.includes(ticket.ticketId)}
                      onChange={() => toggleItem(ticket.ticketId)}
                    />
                  </td>
                  <td>
                    <span className="text-xs font-bold text-gray-900">{ticket.ticketId}</span>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1D3557]">{ticket.customer}</span>
                      <span className="text-[10px] font-bold text-gray-400 italic">User ID: #USR_023</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-bold text-gray-700 truncate max-w-[150px] inline-block">{ticket.subject}</span>
                  </td>
                  <td className="text-[11px] font-bold text-gray-400 text-center">{ticket.activity}</td>
                  <td className="text-center">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${priorityStyles[ticket.priority as keyof typeof priorityStyles]}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyles[ticket.status as keyof typeof statusStyles]}`}></span>
                      <span className={`text-xs font-bold text-gray-700`}>{ticket.status}</span>
                    </div>
                  </td>
                  <td className="text-right pr-8">
                    <div className="flex justify-end items-center gap-2">
                      <Button shape="rounded-sm" variant="outline"
                        className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all duration-300"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setIsChatDrawerOpen(true);
                        }}
                      >
                        <BiMessageDetail size={14} />
                      </Button>
                      <Button shape="rounded-sm" variant="outline"
                        className="!p-1.5 text-gray-400 hover:text-white hover:bg-brand-gold hover:border-brand-gold transition-all duration-300"
                        onClick={() => {
                          setSelectedTicket(ticket);
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
          totalPages={12}
          onPageChange={setCurrentPage}
        />
      </div>

      <TicketDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        ticket={selectedTicket}
      />

      <SupportChatDrawer
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        ticket={selectedTicket}
      />

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(data) => console.log("Creating new ticket:", data)}
      />

      <BulkActionsDrawer
        isOpen={selectedIds.length > 0}
        onClose={() => setSelectedIds([])}
        selectedIds={selectedIds}
        items={ticketsData}
        onClearSelection={() => setSelectedIds([])}
        idProp="ticketId"
        labelProp="subject"
        title="Tickets Selected"
        actions={[
          {
            id: "resolve",
            title: "Mark as Resolved",
            icon: "verified",
            folder: "icon",
            onClick: () => console.log("Resolving tickets:", selectedIds),
          },
          {
            id: "assign",
            title: "Assign to Agent",
            icon: "Group",
            folder: "dashboardIcon",
            onClick: () => console.log("Assigning tickets:", selectedIds),
          },
          {
            id: "delete",
            title: "Delete Tickets",
            icon: "Delete",
            folder: "dashboardIcon",
            variant: "danger",
            onClick: () => console.log("Deleting tickets:", selectedIds),
          },
        ]}
      />
    </div>
  );
}
