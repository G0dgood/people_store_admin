"use client";

import React, { useState } from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { Input } from "../Form/Inputs";
import { UpdateTicketStatusModal } from "./UpdateTicketStatusModal";
import { PiPaperclipBold } from "react-icons/pi";
import { IoSend } from "react-icons/io5";
import { HiCheckBadge } from "react-icons/hi2";
import { BiSliderAlt } from "react-icons/bi";

interface SupportChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
}

export function SupportChatDrawer({ isOpen, onClose, ticket }: SupportChatDrawerProps) {
  const [message, setMessage] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  if (!ticket) return null;

  const mockMessages = [
    { id: 1, sender: "customer", text: "Hello, I haven't received my order #ORD-092 yet.", time: "10:05 AM" },
    { id: 2, sender: "agent", text: "Hello Alice! Let me check that for you right away.", time: "10:10 AM" },
    { id: 3, sender: "agent", text: "It seems there was a slight delay in logistics. It's currently out for delivery.", time: "10:12 AM" },
    { id: 4, sender: "customer", text: "Oh, thank you for the update. Will it arrive today?", time: "10:15 AM" },
  ];

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Customer Chat" 
      width="max-w-md"
      rightElement={
        <Button
          variant="outline"
          shape="rounded-sm"
          className="!py-1.5 !px-3 text-[10px] font-black uppercase tracking-wider border-gray-100 text-[#1D3557] gap-2 hover:bg-gray-50 transition-colors"
          onClick={() => setIsStatusModalOpen(true)}
        >
          <BiSliderAlt size={14} className="text-brand-blue" />
          Status
        </Button>
      }
    >
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Chat Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
           <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                 <img src={"https://ui-avatars.com/api/?name=" + ticket.customer} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
           </div>
           <div className="flex flex-col">
              <span className="text-sm font-black text-[#1D3557]">{ticket.customer}</span>
              <div className="flex items-center gap-1.5">
                 <div className="flex items-center gap-1 text-emerald-500">
                    <HiCheckBadge size={14} />
                    <span className="text-[10px] font-bold">Verified User</span>
                 </div>
                 <span className="text-[10px] text-gray-300">•</span>
                 <span className="text-[10px] font-bold text-gray-400">{ticket.ticketId}</span>
              </div>
           </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 custom-scrollbar">
           {mockMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}>
                 <div className={`max-w-[80%] flex flex-col gap-1.5 ${msg.sender === "agent" ? "items-end" : "items-start"}`}>
                    <div className={`p-4 rounded-2xl text-xs font-bold leading-relaxed shadow-sm
                       ${msg.sender === "agent" 
                          ? "bg-brand-blue text-white rounded-tr-none" 
                          : "bg-gray-100 text-[#1D3557] rounded-tl-none"}
                    `}>
                       {msg.text}
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{msg.time}</span>
                 </div>
              </div>
           ))}
           
           <div className="flex justify-center">
              <span className="px-3 py-1 bg-gray-50 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
                 Today
              </span>
           </div>
        </div>

        {/* Input Area */}
        <div className="pt-6 border-t border-gray-100 mt-auto">
           <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:border-brand-blue/30 focus-within:bg-white transition-all">
              <button className="p-2 text-gray-400 hover:text-brand-blue transition-colors">
                 <PiPaperclipBold size={20} />
              </button>
              <input 
                 type="text" 
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 placeholder="Type your message..."
                 className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-[#1D3557] placeholder:text-gray-400 py-2"
              />
              <button className="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all">
                 <IoSend size={18} />
              </button>
           </div>
           <p className="text-[10px] text-center text-gray-400 mt-3 font-medium italic">
              Press Enter to send message
           </p>
        </div>

        <UpdateTicketStatusModal
           isOpen={isStatusModalOpen}
           onClose={() => setIsStatusModalOpen(false)}
           onConfirm={(status, note) => {
              console.log(`Updating ticket ${ticket.ticketId} to ${status}. Note: ${note}`);
           }}
           ticket={ticket}
        />
      </div>
    </Drawer>
  );
}
