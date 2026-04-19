"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../Icon";

export interface MessageData {
 id: string;
 sender: string;
 avatar: string;
 subject: string;
 preview: string;
 time: string;
 isUnread: boolean;
}

const MOCK_MESSAGES: MessageData[] = [
 {
  id: "1",
  sender: "Alex (Supplier)",
  avatar: "/avatars/avatar=pic1.jpg",
  subject: "Order #8023 Updates",
  preview: "Can you confirm all dimensions before I approve the container? We need to finalize this before tomorrow.",
  time: "2m ago",
  isUnread: true,
 },
 {
  id: "2",
  sender: "TechStore Inc.",
  avatar: "/avatars/avatar=pic2.png",
  subject: "Shipping Tracking Number",
  preview: "Your tracking number is #9034211119. You can track this via our partnered logistics provider portal.",
  time: "1h ago",
  isUnread: true,
 },
 {
  id: "3",
  sender: "System",
  avatar: "icon:message_header",
  subject: "Welcome to the marketplace!",
  preview: "We're glad to have you. Explore new categories or configure your seller profile directly from settings.",
  time: "Yesterday",
  isUnread: false,
 },
 {
  id: "4",
  sender: "Design Studio Pro",
  avatar: "/avatars/avatar=pic3.png",
  subject: "Re: Branding Assets",
  preview: "Sounds good. We will update the spec sheet with the secondary colors and send over the PDF.",
  time: "Monday",
  isUnread: false,
 },
 {
  id: "5",
  sender: "Global Electronics",
  avatar: "/avatars/avatar=pic4.png",
  subject: "New Quote Responded",
  preview: "We have reviewed your request for quotation and the finalized pricing is attached in the dashboard.",
  time: "Last Week",
  isUnread: false,
 }
];

export const MessageFeed: React.FC = () => {
 const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

 const displayedMessages = activeTab === "all"
  ? MOCK_MESSAGES
  : MOCK_MESSAGES.filter(m => m.isUnread);

 // Framer motion variants for the container to stagger children
 const containerVariants = {
  hidden: { opacity: 0 },
  show: {
   opacity: 1,
   transition: { staggerChildren: 0.05 }
  }
 };

 // Variants for individual feed items
 const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
 };

 return (
  <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
   {/* Feed Toolbar */}
   <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
     <button
      onClick={() => setActiveTab("all")}
      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'all' ? 'bg-white shadow-sm text-brand-blue' : 'text-gray-600 hover:text-gray-900'}`}
     >
      All Messages
     </button>
     <button
      onClick={() => setActiveTab("unread")}
      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'unread' ? 'bg-white shadow-sm text-brand-blue' : 'text-gray-600 hover:text-gray-900'}`}
     >
      Unread
     </button>
    </div>

    <div className="relative w-full sm:w-64">
     <Icon name="search" size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
     <input
      type="text"
      placeholder="Search messages..."
      className="w-full h-10 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-brand-blue transition-colors text-gray-900"
     />
    </div>
   </div>

   {/* Feed List Area */}
   <motion.div
    className="flex-1 w-full flex flex-col divide-y divide-gray-100 min-h-[400px]"
    variants={containerVariants}
    initial="hidden"
    animate="show"
   >
    <AnimatePresence mode="popLayout">
     {displayedMessages?.map((message) => {
      return (
       <motion.div
        key={message.id}
        variants={itemVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        layout
        className={`p-4 sm:p-5 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer group relative ${message.isUnread ? 'bg-brand-blue-light/20' : 'bg-white'}`}
       >
        {message.isUnread && (
         <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-blue rounded-r"></div>
        )}

        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 bg-white">
         {message.avatar.startsWith("icon:") ? (
          <div className="w-full h-full bg-brand-blue-light flex items-center justify-center text-brand-blue">
           <Icon name={message.avatar.replace("icon:", "")} size="md" />
          </div>
         ) : (
          <Image src={message.avatar} alt={message.sender} width={48} height={48} className="w-full h-full object-cover" />
         )}
        </div>

        <div className="flex-1 flex flex-col min-w-0">
         <div className="flex justify-between items-start mb-1 gap-4">
          <span className={`text-sm sm:text-base truncate ${message.isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
           {message.sender}
          </span>
          <span className={`text-xs sm:text-sm whitespace-nowrap pt-0.5 ${message.isUnread ? 'font-bold text-brand-blue' : 'text-gray-400 font-medium'}`}>
           {message.time}
          </span>
         </div>

         <span className={`text-sm truncate mb-1 ${message.isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
          {message.subject}
         </span>

         <p className="text-sm text-gray-500 line-clamp-1 sm:line-clamp-2 leading-relaxed">
          {message.preview}
         </p>
        </div>

        <div className="hidden sm:flex flex-col justify-center items-end opacity-0 group-hover:opacity-100 transition-opacity">
         <button className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-brand-blue hover:border-brand-blue flex items-center justify-center shadow-sm">
          <Icon name="delete" size="sm" />
         </button>
        </div>
       </motion.div>
      )
     })}
     {displayedMessages.length === 0 && (
      <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       className="p-12 flex flex-col items-center justify-center text-gray-500 w-full col-span-full h-40"
      >
       <Icon name="message_header" size="lg" className="mb-4 opacity-50" />
       <p className="font-medium">No messages found.</p>
      </motion.div>
     )}
    </AnimatePresence>
   </motion.div>
  </div>
 );
};
