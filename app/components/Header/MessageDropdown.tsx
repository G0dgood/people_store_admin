import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "../Icon";
import { DropdownMenu, DropdownFooterAction } from "../Dropdown/DropdownMenu";

export const MessageDropdown: React.FC = () => {
  const router = useRouter();

  return (
    <div 
      className="absolute top-full right-1/2 translate-x-1/2 pt-4 z-50 cursor-default" 
      onClick={e => e.preventDefault()}
    >
      <DropdownMenu width={320} className="shadow-2xl border-gray-200 p-0">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <span className="font-bold text-gray-900 text-sm">Messages</span>
          <span className="text-[10px] text-brand-blue bg-brand-blue-light px-2 py-0.5 rounded-full font-bold">2 New</span>
        </div>

        <div className="flex flex-col max-h-[320px] overflow-y-auto">
          {/* Notification 1 (Unread) */}
          <div className="px-4 py-3 hover:bg-gray-50 flex gap-3 cursor-pointer transition-colors border-b border-gray-50 last:border-0 relative">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 bg-white">
              <Image src="/avatars/avatar=pic1.jpg" alt="Avatar" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col min-w-0 pr-4">
              <div className="flex justify-between items-start gap-2">
                <span className="text-sm font-bold text-gray-900 truncate">Alex (Supplier)</span>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">2m ago</span>
              </div>
              <p className="text-xs text-brand-blue font-medium truncate mt-0.5">Can you confirm all dimensions...</p>
            </div>
            <div className="w-2 h-2 bg-brand-blue rounded-full absolute top-5 right-4 shadow-sm"></div>
          </div>

          {/* Notification 2 (Unread) */}
          <div className="px-4 py-3 hover:bg-gray-50 flex gap-3 cursor-pointer transition-colors border-b border-gray-50 last:border-0 relative">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 bg-white">
              <Image src="/avatars/avatar=pic2.png" alt="Avatar" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col min-w-0 pr-4">
              <div className="flex justify-between items-start gap-2">
                <span className="text-sm font-bold text-gray-900 truncate">TechStore Inc.</span>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">1h ago</span>
              </div>
              <p className="text-xs text-brand-blue font-medium truncate mt-0.5">Your tracking number is #9034...</p>
            </div>
            <div className="w-2 h-2 bg-brand-blue rounded-full absolute top-5 right-4 shadow-sm"></div>
          </div>

          {/* Notification 3 (Read) */}
          <div className="px-4 py-3 hover:bg-gray-50 flex gap-3 cursor-pointer transition-colors border-b border-gray-50 last:border-0 opacity-75">
            <div className="w-10 h-10 rounded-full bg-brand-blue-light flex items-center justify-center flex-shrink-0 text-brand-blue shadow-inner">
              <Icon name="message_header" size="sm" />
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex justify-between items-start gap-2">
                <span className="text-sm font-bold text-gray-900 truncate">System</span>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">Yesterday</span>
              </div>
              <p className="text-xs text-gray-500 font-medium truncate mt-0.5">Welcome to the marketplace!</p>
            </div>
          </div>
        </div>

        <DropdownFooterAction 
          label="View all messages" 
          onClick={() => router.push('/messages')} 
          icon="arrow_forward" 
        />
      </DropdownMenu>
    </div>
  );
};
