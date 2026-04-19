"use client";

import React, { useState } from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { RichTextArea } from "../Form/SpecialInputs";

interface Message {
  id: number;
  sender: "admin" | "customer";
  text: string;
  time: string;
}

interface CustomerMessageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
}

export function CustomerMessageDrawer({ isOpen, onClose, customer }: CustomerMessageDrawerProps) {
  const [messageText, setMessageText] = useState("");
  
  const mockMessages: Message[] = [
    { id: 1, sender: "customer", text: "Hi, I have a question about my recent order #ORD0001.", time: "10:30 AM" },
    { id: 2, sender: "admin", text: "Hello! Sure, I'd be happy to help. What seems to be the issue?", time: "10:32 AM" },
    { id: 3, sender: "customer", text: "The delivery status shows as delivered but I haven't received it yet.", time: "10:35 AM" },
  ];

  if (!customer) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Message ${customer.name}`} width="max-w-md">
      <div className="flex flex-col h-full gap-6">
        {/* Customer Quick Header */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 animate-in fade-in zoom-in duration-300">
             <img 
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop" 
              alt="" 
              className="w-full h-full object-cover" 
             />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-[#1D3557]">{customer.name}</span>
            <span className="text-[11px] font-bold text-gray-400">{customer.email}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Online</span>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
          <div className="flex flex-col items-center py-4">
             <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Today, Jan 15</span>
          </div>
          
          {mockMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender === "admin" ? "items-end" : "items-start"} gap-1.5`}
            >
              <div 
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm transition-all
                  ${msg.sender === "admin" 
                    ? "bg-[#1D3557] text-white rounded-tr-none" 
                    : "bg-white border border-gray-200 text-gray-700 rounded-tl-none"}
                `}
              >
                {msg.text}
              </div>
              <span className="text-[10px] font-bold text-gray-300 px-1">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Templates Area */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Quick Templates</span>
          <div className="flex flex-wrap gap-2">
            {["Order Update", "Security Alert", "Greeting"].map((template) => (
              <button 
                key={template}
                onClick={() => setMessageText(prev => prev + (prev ? " " : "") + template)}
                className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[11px] font-bold text-gray-500 hover:border-brand-blue hover:text-brand-blue transition-all"
              >
                {template}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-gray-50">
          <RichTextArea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-[120px]"
          />
          
          <Button 
            variant="primary" 
            className="w-full h-10 sm:h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#1D3557]/10"
            disabled={!messageText.trim()}
            iconRight={<Icon name="arrow_forward" folder="icon" size="sm" />}
            onClick={() => {
               console.log(`Sending to ${customer.name}: ${messageText}`);
               setMessageText("");
            }}
          >
            Send Message
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
