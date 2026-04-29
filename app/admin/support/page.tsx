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
import { useGetTicketsQuery, ticketApi } from "@/lib/redux/services/ticketApi";
import { useSocket } from "@/app/context/SocketContext";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

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
  Closed: "bg-gray-500",
};

export default function SupportPage() {
  const dispatch = useDispatch();
  const { on, off } = useSocket();
  const [activeTab, setActiveTab] = useState("All tickets");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useEffect(() => {
    const handleTicketUpdate = (updatedTicket: any) => {
      console.log("Ticket list update received via socket");
      (dispatch as any)(ticketApi.util.invalidateTags([{ type: 'Ticket', id: 'LIST' }]));
    };

    on("ticket:update", handleTicketUpdate);

    return () => {
      off("ticket:update", handleTicketUpdate);
    };
  }, [on, off, dispatch]);

  const { data: ticketsResponse, isLoading } = useGetTicketsQuery({
    status: activeTab === "All tickets" ? undefined : activeTab,
    search: searchQuery || undefined,
    page: currentPage,
    limit: rowsPerPage
  });

  const ticketsData = ticketsResponse?.data?.tickets || [];
  const pagination = ticketsResponse?.data?.pagination;

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
          value={pagination?.total?.toString() || "0"}
          trendValue="12.5%"
          trendIsUp={true}
          periodLabel="Since last month"
        />
        <StatCard
          title="Open Tickets"
          value={ticketsData.filter(t => t.status === 'Open').length.toString()}
          trendValue="5.2%"
          trendIsUp={false}
          periodLabel="Active now"
        />
        <StatCard
          title="Resolved"
          value={ticketsData.filter(t => t.status === 'Resolved').length.toString()}
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
            tabs={["All tickets", "Open", "Pending", "Resolved", "Closed"]}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1); // Reset to first page on tab change
            }} id={""} />

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <Input shape="rounded-sm"
              type="text"
              placeholder="Search tickets by ID or Subject"
              containerClassName="w-full lg:w-80 xl:w-96"
              className="bg-white border-gray-200 placeholder:text-gray-400 text-xs font-medium"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              suffixElement={<Icon name="search-01" folder="dashboardIcon" size="sm" className="text-gray-400" />}
            />

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <RowsPerPage value={rowsPerPage} onChange={(val) => {
                setRowsPerPage(val);
                setCurrentPage(1);
              }} />

              <div className="flex gap-2 ml-auto sm:ml-0">
                <Button variant="outline" shape="rounded-sm" className="!p-2.5 text-gray-400">
                  <Icon name="filter" folder="dashboardIcon" size="sm" />
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
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400 text-xs font-bold">Loading tickets...</td>
                </tr>
              ) : ticketsData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400 text-xs font-bold">No tickets found</td>
                </tr>
              ) : (
                ticketsData.map((ticket, idx) => (
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
                        <span className="text-xs font-bold text-[#1D3557]">{ticket.customerName}</span>
                        <span className="text-[10px] font-bold text-gray-400 italic">{ticket.customerEmail}</span>
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <Pagination
          currentPage={currentPage}
          totalPages={pagination?.totalPages || 1}
          onPageChange={setCurrentPage}
        />
      </div>

      <TicketDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        ticket={selectedTicket}
        onReply={() => {
          setIsDetailDrawerOpen(false);
          setIsChatDrawerOpen(true);
        }}
      />

      <SupportChatDrawer
        isOpen={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
        ticketId={selectedTicket?._id}
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
