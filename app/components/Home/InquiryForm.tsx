"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import { Input, Textarea } from "@/app/components/Form";
import { Icon } from "@/app/components/Icon";

const InquiryForm = () => {
  return (
    <section className="w-full relative rounded-lg min-h-[420px] shadow-sm flex bg-brand-blue/90 overflow-hidden">
      <Image
        src="/web_images/Mask_group_two.png"
        alt="Inquiry BG"
        fill
        className="object-cover absolute inset-0 z-0"
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-brand-blue/0 via-brand-blue/0 to-transparent"></div>

      <div className="relative z-10 w-full p-6 md:p-10 flex flex-col lg:flex-row justify-between gap-10">
        <div className="max-w-md text-white flex flex-col gap-4 z-10">
          <h2 className="text-3xl md:text-[32px] font-bold leading-tight drop-shadow-sm pr-4 text-white">
            An easy way to send requests to all suppliers
          </h2>
          <p className="text-base text-white hidden md:block leading-relaxed max-w-[390px]">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt.
          </p>
        </div>

        <div className="w-full max-w-[490px] bg-white p-6 md:p-8 rounded-lg shadow-2xl flex flex-col gap-5 z-10 border border-brand-blue-light">
          <h3 className="text-xl font-bold text-gray-900">Send quote to suppliers</h3>
          <Input placeholder="What item you need?" className="h-10" />
          <Textarea placeholder="Type more details" rows={3} />
          <div className="flex gap-4">
            <Input placeholder="Quantity" className="w-full md:flex-1 h-10" />
            <div className="w-full md:w-[140px] flex items-center justify-between px-3 border border-gray-300 rounded-lg bg-white cursor-pointer h-10 hover:border-brand-blue transition-colors">
              <span className="text-sm text-gray-900">Pcs</span>
              <Icon name="expand_more" size="xs" className="text-gray-400" />
            </div>
          </div>
          <Button className="w-fit bg-brand-blue text-white px-8 h-10 hover:bg-brand-blue/90 shadow-lg active:scale-95 transition-all">
            Send inquiry
          </Button>
        </div>
      </div>
    </section>
  );
};

export { InquiryForm };
