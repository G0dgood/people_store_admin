"use client";

import React, { useState } from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { RichTextArea } from "../Form/SpecialInputs";
import { useGetChatHistoryQuery, useSendMessageMutation } from "@/lib/redux/services/messageApi";
import { SVGLoaderFetch } from "../Options";
import { toast } from "sonner";

interface CustomerMessageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
}


export function CustomerMessageDrawer({ isOpen, onClose, customer }: CustomerMessageDrawerProps) {
  const [messageText, setMessageText] = useState("");

  const { data: historyResponse, isLoading: isLoadingChat } = useGetChatHistoryQuery(customer?._id || "", {
    skip: !customer?._id || !isOpen
  });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const messages = historyResponse?.data || [];

  if (!customer) return null;

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      await sendMessage({
        receiverId: customer._id,
        receiverModel: "Customer",
        message: messageText
      }).unwrap();
      setMessageText("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send message");
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Message ${customer.fullName || "Customer"}`} width="max-w-md">
      <div className="flex flex-col h-full gap-6">
        {/* Customer Quick Header */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 animate-in fade-in zoom-in duration-300">
            <img
              src={customer.avatar || "https://ui-avatars.com/api/?name=" + customer.fullName}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-[#1D3557]">{customer.fullName}</span>
            <span className="text-[11px] font-bold text-gray-400">{customer.email}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Online</span>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
          {isLoadingChat ? (
            <div className="flex justify-center py-10">
               <SVGLoaderFetch asTable={false} text="Loading history..." />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2">
               <Icon name="tabler_message" folder="dashboardIcon" size="md" />
               <p className="text-xs font-bold uppercase tracking-widest">No conversation yet</p>
            </div>
          ) : (
            messages.map((msg: any) => (
              <div
                key={msg._id}
                className={`flex flex-col ${msg.senderModel === "User" ? "items-end" : "items-start"} gap-1.5`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm transition-all
                    ${msg.senderModel === "User"
                      ? "bg-brand-charcoal text-white rounded-tr-none"
                      : "bg-white border border-gray-200 text-gray-700 rounded-tl-none"}
                  `}
                >
                  {msg.message}
                </div>
                <span className="text-[10px] font-bold text-gray-300 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Templates Area */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Quick Templates</span>
          <div className="flex flex-wrap gap-2">
            {["Order Update", "Security Alert", "Greeting"].map((template) => (
              <button
                key={template}
                onClick={() => setMessageText(prev => prev + (prev ? " " : "") + template)}
                className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[11px] font-bold text-gray-500 hover:border-brand-gold hover:text-brand-gold transition-all"
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
            shape="rounded-sm"
            variant="primary"
            className="w-full h-10 sm:h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-brand-charcoal/10"
            disabled={!messageText.trim() || isSending}
            iconRight={<Icon name="arrow_forward" folder="icon" size="sm" />}
            onClick={handleSendMessage}
          >
            {isSending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
