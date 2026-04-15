"use client";

import React from "react";
import Drawer from "../Drawer/Drawer";
import { Icon } from "../Icon";
import { Button } from "../Button";

interface SecurityHelpDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SecurityHelpDrawer({ isOpen, onClose }: SecurityHelpDrawerProps) {
  const helpItems = [
    {
      title: "Password Complexity",
      description: "Passwords must be at least 12 characters long and include a mix of uppercase letters, numbers, and special symbols (@, #, $, etc.).",
      icon: "lock",
    },
    {
      title: "Two-Factor Authentication",
      description: "Enable 2FA in your account settings to add an extra layer of security. This requires a code from your mobile device to log in.",
      icon: "verified_user",
    },
    {
      title: "Session Governance",
      description: "Administrative sessions expire after 30 minutes of inactivity. Ensure you save your changes frequently to avoid data loss.",
      icon: "security",
    },
    {
      title: "Account Recovery",
      description: "If you lose access to your primary email, contact the Super Admin immediately to trigger a manual identity verification process.",
      icon: "vpn_key",
    },
  ];

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Security & Access Help">
      <div className="flex flex-col h-full gap-8">
        <div className="flex items-center gap-4 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl">
           <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-brand-blue shadow-sm shrink-0">
              <Icon name="live_help" folder="icon" size="sm" />
           </div>
           <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-black text-[#1D3557]">Need immediate assistance?</span>
              <span className="text-[11px] font-medium text-blue-600 leading-tight">Our security team is available 24/7 for account emergencies.</span>
           </div>
        </div>

        <div className="flex flex-col gap-2">
           <p className="text-[10px] font-black text-gray-400 border-b border-gray-50 pb-2 uppercase tracking-[0.2em] px-2 mb-2">
              Security Guidelines
           </p>
           <div className="flex flex-col gap-3">
              {helpItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all group">
                   <div className="mt-1 w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-brand-blue group-hover:border-brand-blue/20 transition-all shadow-sm shrink-0">
                      <Icon name={item.icon} folder="icon" size="xs" />
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[12px] font-black text-[#1D3557] group-hover:text-brand-blue transition-colors">{item.title}</span>
                      <span className="text-[11px] font-medium text-gray-400 leading-relaxed">{item.description}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="mt-auto flex flex-col gap-3 pb-8">
           <Button 
            variant="primary" 
            className="w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
            onClick={() => {
              console.log("Escalating to support...");
              onClose();
            }}
           >
              Message Security Team
           </Button>
           <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest">
              Response time: ~5 minutes
           </p>
        </div>
      </div>
    </Drawer>
  );
}
