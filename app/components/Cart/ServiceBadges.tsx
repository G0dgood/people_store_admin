"use client";

import React from "react";
import { Icon } from "../Icon";

const ServiceBadges = () => {
  const badges = [
    { 
      title: "Secure payment", 
      desc: "Have you ever finally just", 
      icon: "lock",
      color: "bg-gray-100" 
    },
    { 
      title: "Customer support", 
      desc: "Have you ever finally just", 
      icon: "chat",
      color: "bg-gray-100" 
    },
    { 
      title: "Free delivery", 
      desc: "Have you ever finally just", 
      icon: "van",
      color: "bg-gray-100" 
    },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center gap-10">
      {badges.map((badge, idx) => (
        <div key={idx} className="flex items-start gap-4 max-w-[250px]">
           <div className={`w-12 h-12 ${badge.color} rounded-full flex-shrink-0 flex items-center justify-center text-gray-400`}>
              <Icon name={badge.icon} size="md" />
           </div>
           <div className="flex flex-col">
              <span className="text-gray-900 font-medium text-sm">{badge.title}</span>
              <p className="text-gray-400 text-xs leading-relaxed">{badge.desc}</p>
           </div>
        </div>
      ))}
    </div>
  );
};

export { ServiceBadges };
