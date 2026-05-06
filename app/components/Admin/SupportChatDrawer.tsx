"use client";

import React, { useEffect, useRef, useState } from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { UpdateTicketStatusModal } from "./UpdateTicketStatusModal";
import { PiPaperclipBold } from "react-icons/pi";
import { IoSend } from "react-icons/io5";
import { useAddTicketResponseMutation, useUpdateTicketMutation, ticketApi, useGetTicketByIdQuery } from "@/lib/redux/services/ticketApi";
import { useUploadMediaMutation } from "@/lib/redux/services/mediaApi";
import { toast } from "sonner";
import { useSocket } from "@/app/context/SocketContext";
import { useDispatch } from "react-redux";
import { BiSliderAlt } from "react-icons/bi";
import { HiCheckBadge } from "react-icons/hi2";

interface SupportChatDrawerProps {
 isOpen: boolean;
 onClose: () => void;
 ticketId: string;
}

export function SupportChatDrawer({ isOpen, onClose, ticketId }: SupportChatDrawerProps) {
 const dispatch = useDispatch();
 const { on, off } = useSocket();
 const messagesEndRef = useRef<HTMLDivElement>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);

 const [message, setMessage] = useState("");
 const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
 const [isUploading, setIsUploading] = useState(false);
 const [attachments, setAttachments] = useState<string[]>([]);

 const { data: ticketResponse, isLoading: isLoadingTicket } = useGetTicketByIdQuery(ticketId, {
  skip: !isOpen || !ticketId
 });
 const ticket = ticketResponse?.data;

 const [addResponse, { isLoading: isSending }] = useAddTicketResponseMutation();
 const [updateTicket] = useUpdateTicketMutation();
 const [uploadMedia] = useUploadMediaMutation();

 const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
 };

 // Combine initial message and responses for the display
 const allMessages = ticket ? [
  {
   sender: "Customer",
   message: ticket.message,
   timestamp: ticket.createdAt,
   attachments: [],
   isInitial: true
  },
  ...(ticket.responses || []).map((r: any) => ({
   sender: r.sender,
   message: r.message,
   timestamp: r.timestamp,
   attachments: r.attachments || [],
   isInitial: false
  }))
 ] : [];

 useEffect(() => {
  if (isOpen) {
   scrollToBottom();
  }
 }, [allMessages.length, isOpen]);

 useEffect(() => {
  if (isOpen && ticketId) {
   const eventName = `ticket:${ticketId}`;

   const handleUpdate = (updatedTicket: any) => {

    (dispatch as any)(
     ticketApi.util.updateQueryData('getTicketById', ticketId, (draft: any) => {
      if (draft.data) {
       Object.assign(draft.data, updatedTicket);
      }
     })
    );
    (dispatch as any)(ticketApi.util.invalidateTags([{ type: 'Ticket', id: 'LIST' }]));
   };

   on(eventName, handleUpdate);

   return () => {
    off(eventName, handleUpdate);
   };
  }
 }, [isOpen, ticketId, dispatch, on, off]);

 if (!ticket && !isLoadingTicket) return null;

 const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  setIsUploading(true);
  try {
   const formData = new FormData();
   for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
   }

   const result = await uploadMedia(formData).unwrap();
   if (result.data) {
    const urls = result.data.map((item: any) => item.url);
    setAttachments(prev => [...prev, ...urls]);
    toast.success("Images uploaded successfully");
   }
  } catch (error: any) {
   toast.error(error?.data?.message || "Failed to upload images");
  } finally {
   setIsUploading(false);
   if (fileInputRef.current) fileInputRef.current.value = "";
  }
 };

 const handleUpdateStatus = async (status: "Open" | "Pending" | "Resolved" | "Closed", note: string) => {
  if (!ticket) return;
  try {
   await updateTicket({
    id: ticket._id,
    body: { status }
   }).unwrap();

   if (note.trim()) {
    await addResponse({
     id: ticket._id,
     body: { message: `Status updated to ${status}. Note: ${note}`, sender: "Admin" }
    }).unwrap();
   }

   toast.success("Ticket status updated successfully");
   setIsStatusModalOpen(false);
  } catch (error: any) {
   toast.error(error?.data?.message || "Failed to update status");
  }
 };

 const handleSendMessage = async () => {
  if (!message.trim() && attachments.length === 0) return;
  if (!ticket) return;

  const currentMessage = message;
  const currentAttachments = [...attachments];

  setMessage("");
  setAttachments([]);

  try {
   await addResponse({
    id: ticket._id,
    body: {
     message: currentMessage,
     sender: "Admin",
     attachments: currentAttachments
    }
   }).unwrap();
  } catch (error: any) {
   setMessage(currentMessage);
   setAttachments(currentAttachments);
   toast.error(error?.data?.message || "Failed to send message");
  }
 };

 const handleKeyPress = (e: React.KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
   e.preventDefault();
   handleSendMessage();
  }
 };

 return (
  <Drawer
   isOpen={isOpen}
   onClose={onClose}
   title={`Support Chat - ${ticket?.ticketId || '...'}`}
   width="max-w-xl"
   footer={
    <Button
     shape="rounded-sm"
     variant="primary"
     onClick={() => setIsStatusModalOpen(true)}
     className="h-10 text-[10px] font-black uppercase tracking-widest px-6"
     iconLeft={<BiSliderAlt size={16} />}
    >
     Status
    </Button>
   }
  >
   <div className="flex flex-col h-[calc(100vh-120px)] relative">
    {isUploading && (
     <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center flex-col gap-3">
      <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
      <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest">Uploading Media...</span>
     </div>
    )}

    {isLoadingTicket ? (
     <div className="flex-1 flex items-center justify-center">
      <span className="text-xs font-bold text-gray-400 animate-pulse">Loading conversation...</span>
     </div>
    ) : (
     <>
      {/* Chat Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
       <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white  ">
         <img src={"https://ui-avatars.com/api/?name=" + ticket?.customerName} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
       </div>
       <div className="flex flex-col">
        <span className="text-sm font-black text-[#1D3557]">{ticket?.customerName}</span>
        <div className="flex items-center gap-1.5">
         <div className="flex items-center gap-1 text-emerald-500">
          <HiCheckBadge size={14} />
          <span className="text-[10px] font-bold">Verified User</span>
         </div>
         <span className="text-[10px] font-bold text-gray-400">·</span>
         <span className="text-[10px] font-bold text-gray-400">{ticket?.ticketId}</span>
        </div>
       </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-6 custom-scrollbar">
       {allMessages.map((msg, idx) => (
        <div key={idx} className={`flex ${msg.sender === "Admin" ? "justify-end" : "justify-start"}`}>
         <div className={`max-w-[80%] flex flex-col gap-1.5 ${msg.sender === "Admin" ? "items-end" : "items-start"}`}>
          <div className={`p-4 rounded-2xl text-xs font-bold leading-relaxed   flex flex-col gap-3
                                 ${msg.sender === "Admin"
            ? "bg-brand-gold text-white rounded-tr-none"
            : "bg-gray-100 text-[#1D3557] rounded-tl-none"}
                              `}>
           {msg.message}
           {msg.attachments && msg.attachments.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-1">
             {msg.attachments.map((url: string, i: number) => (
              <a key={i} href={url} target="_blank" rel="noreferrer" className="rounded-lg overflow-hidden border border-white/20">
               <img src={url} alt="attachment" className="w-full h-24 object-cover" />
              </a>
             ))}
            </div>
           )}
          </div>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
           {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
         </div>
        </div>
       ))}
       <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-6 border-t border-gray-200 mt-auto">
       {attachments.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
         {attachments.map((url: string, i: number) => (
          <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-brand-gold/20 flex-shrink-0 group">
           <img src={url} alt="preview" className="w-full h-full object-cover" />
           <button
            onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
            className="absolute top-0 right-0 p-1 bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
           >
            <Icon name="Delete" folder="dashboardIcon" size="xs" />
           </button>
          </div>
         ))}
        </div>
       )}

       <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-brand-gold/30 focus-within:bg-white transition-all">
        <input
         type="file"
         ref={fileInputRef}
         onChange={handleFileChange}
         className="hidden"
         multiple
         accept="image/*"
        />
        <button
         onClick={() => fileInputRef.current?.click()}
         className="p-2 text-gray-400 hover:text-brand-gold transition-colors"
        >
         <PiPaperclipBold size={20} />
        </button>
        <input
         type="text"
         value={message}
         onChange={(e) => setMessage(e.target.value)}
         onKeyDown={handleKeyPress}
         placeholder="Type your message..."
         className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-[#1D3557] placeholder:text-gray-400 py-2"
        />
        <button
         onClick={handleSendMessage}
         disabled={isSending || isUploading || (!message.trim() && attachments.length === 0)}
         className="w-10 h-10 rounded-xl bg-brand-gold text-white flex items-center justify-center shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
         <IoSend size={18} />
        </button>
       </div>
       <p className="text-[10px] text-center text-gray-400 mt-3 font-medium italic">
        Press Enter to send message
       </p>
      </div>
     </>
    )}

    <UpdateTicketStatusModal
     isOpen={isStatusModalOpen}
     onClose={() => setIsStatusModalOpen(false)}
     onConfirm={handleUpdateStatus}
     ticket={ticket}
    />
   </div>
  </Drawer>
 );
}
