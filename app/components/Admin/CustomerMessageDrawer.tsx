"use client";

import React, { useState, useEffect, useRef } from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { RichTextArea } from "../Form/SpecialInputs";
import { useGetChatHistoryQuery, useSendMessageMutation, useMarkReadMutation, messageApi } from "@/lib/redux/services/messageApi";
import { useGetCurrentUserQuery } from "@/lib/redux/services/authApi";
import { useSocket } from "@/app/context/SocketContext";
import { useDispatch } from "react-redux";
import { SVGLoaderFetch } from "../Options";
import { toast } from "sonner";
import { BsCheck, BsCheckAll } from "react-icons/bs";

interface CustomerMessageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
}


export function CustomerMessageDrawer({ isOpen, onClose, customer }: CustomerMessageDrawerProps) {
  const dispatch = useDispatch();
  const { on, off, emit } = useSocket();
  const { data: currentUserResponse } = useGetCurrentUserQuery();
  const adminId = currentUserResponse?.data?._id;

  const [messageText, setMessageText] = useState("");
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: historyResponse, isLoading: isLoadingChat } = useGetChatHistoryQuery(customer?._id || "", {
    skip: !customer?._id || !isOpen
  });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markRead] = useMarkReadMutation();

  const messages = historyResponse?.data?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages.length, isOpen, isOtherTyping]);

  useEffect(() => {
    if (isOpen && customer?._id) {
      if (typeof window !== "undefined") {
        (window as any).__activeChatCustomerId = String(customer._id);
      }
      markRead({ senderId: customer._id }).unwrap().catch(() => {});
      (dispatch as any)(messageApi.util.invalidateTags([{ type: 'Message', id: 'UNREAD' }]));
    }
    return () => {
      if (typeof window !== "undefined") {
        (window as any).__activeChatCustomerId = undefined;
      }
    };
  }, [isOpen, customer?._id, dispatch, markRead]);

  useEffect(() => {
    if (!isOpen || !customer?._id || !adminId) return;

    const handleTyping = (data: any) => {
      if (String(data.senderId) === String(customer._id)) {
        setIsOtherTyping(true);
      }
    };

    const handleStopTyping = (data: any) => {
      if (String(data.senderId) === String(customer._id)) {
        setIsOtherTyping(false);
      }
    };

    on(`typing:${adminId}`, handleTyping);
    on(`stop_typing:${adminId}`, handleStopTyping);

    return () => {
      off(`typing:${adminId}`, handleTyping);
      off(`stop_typing:${adminId}`, handleStopTyping);
      setIsOtherTyping(false);
    };
  }, [isOpen, customer?._id, adminId, on, off]);

  // Real-time message status updates (sent, delivered, read checkmarks)
  useEffect(() => {
    if (!isOpen || !customer?._id || !adminId) return;

    const handleDelivered = (data: any) => {
      (dispatch as any)(
        messageApi.util.updateQueryData("getChatHistory", customer._id, (draft) => {
          if (draft?.data?.messages) {
            draft.data.messages.forEach((m: any) => {
              if (m.senderModel === "User" && m.status === "sent") {
                m.status = "delivered";
              }
            });
          }
        })
      );
    };

    const handleRead = (data: any) => {
      (dispatch as any)(
        messageApi.util.updateQueryData("getChatHistory", customer._id, (draft) => {
          if (draft?.data?.messages) {
            draft.data.messages.forEach((m: any) => {
              if (m.senderModel === "User" && m.status !== "read") {
                m.status = "read";
                m.isRead = true;
              }
            });
          }
        })
      );
    };

    on(`delivered:${adminId}`, handleDelivered);
    on(`read:${adminId}`, handleRead);

    return () => {
      off(`delivered:${adminId}`, handleDelivered);
      off(`read:${adminId}`, handleRead);
    };
  }, [isOpen, customer?._id, adminId, on, off, dispatch]);

  useEffect(() => {
    if (!isOpen || !customer?._id || !adminId) return;

    const adminEventName = `message:${adminId}`;
    const customerEventName = `message:${customer._id}`;

    const handleIncomingMessage = (msg: any) => {
      const senderId = typeof msg.sender === "object" ? msg.sender?._id : msg.sender;
      const receiverId = typeof msg.receiver === "object" ? msg.receiver?._id : msg.receiver;

      const isBelongingToConversation =
        (String(senderId) === String(customer._id) && String(receiverId) === String(adminId)) ||
        (String(senderId) === String(adminId) && String(receiverId) === String(customer._id));

      if (isBelongingToConversation) {
        let updatedMsg = msg;
        if (String(senderId) === String(customer._id)) {
          markRead({ senderId: customer._id }).unwrap().catch(() => {});
          updatedMsg = { ...msg, isRead: true, status: "read" };
        }

        (dispatch as any)(
          messageApi.util.updateQueryData("getChatHistory", customer._id, (draft) => {
            if (draft?.data?.messages) {
              const exists = draft.data.messages.some((m: any) => m._id === updatedMsg._id);
              if (!exists) {
                draft.data.messages.push(updatedMsg);
              }
            }
          })
        );
      }
    };

    on(adminEventName, handleIncomingMessage);
    on(customerEventName, handleIncomingMessage);

    return () => {
      off(adminEventName, handleIncomingMessage);
      off(customerEventName, handleIncomingMessage);
    };
  }, [isOpen, customer?._id, adminId, on, off, dispatch, markRead]);

  if (!customer) return null;

  const handleInputChange = (val: string) => {
    setMessageText(val);

    if (!adminId || !customer?._id) return;

    if (val.trim().length > 0) {
      emit("typing", { senderId: adminId, receiverId: customer._id });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        emit("stop_typing", { senderId: adminId, receiverId: customer._id });
      }, 2000);
    } else {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      emit("stop_typing", { senderId: adminId, receiverId: customer._id });
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      emit("stop_typing", { senderId: adminId, receiverId: customer._id });

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
            <span className="text-sm font-black text-[#121212]">{customer.fullName}</span>
            <span className="text-[11px] font-bold text-gray-400">
              {isOtherTyping ? (
                <span className="text-brand-gold font-bold">typing...</span>
              ) : (
                customer.email
              )}
            </span>
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
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] font-medium leading-relaxed   transition-all
                    ${msg.senderModel === "User"
                      ? "bg-brand-charcoal text-white rounded-tr-none"
                      : "bg-white border border-gray-200 text-gray-700 rounded-tl-none"}
                  `}
                >
                  {msg.message}
                </div>
                <div className="flex items-center gap-1.5 px-1">
                  <span className="text-[10px] font-bold text-gray-300">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.senderModel === "User" && (
                    <span className="flex items-center justify-center">
                      {msg.status === "read" || msg.isRead ? (
                        <BsCheckAll className="text-sky-500 w-4 h-4" />
                      ) : msg.status === "delivered" ? (
                        <BsCheckAll className="text-gray-300 w-4 h-4" />
                      ) : (
                        <BsCheck className="text-gray-300 w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
          {isOtherTyping && (
            <div className="flex flex-col items-start gap-1.5 animate-pulse">
              <div className="bg-gray-100 border border-gray-200 text-gray-400 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Templates Area */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Quick Templates</span>
          <div className="flex flex-wrap gap-2">
            {["Order Update", "Security Alert", "Greeting"].map((template) => (
              <button
                key={template}
                onClick={() => {
                  const newVal = messageText + (messageText ? " " : "") + template;
                  handleInputChange(newVal);
                }}
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
            onChange={(e) => handleInputChange(e.target.value)}
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
