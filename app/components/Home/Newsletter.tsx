"use client";

import React from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";

const Newsletter = () => {
  return (
    <section className="w-full bg-[#EFF2F4] py-12 px-6 rounded-lg text-center flex flex-col items-center gap-6 relative overflow-hidden shadow-sm">
      <div className="max-w-[500px] flex flex-col items-center text-center gap-2 z-10">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 truncate w-full">Subscribe on our newsletter</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Get daily news on upcoming offers from many suppliers all over the world
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-2 w-full max-w-[400px] z-10 px-4 md:px-0">
        <div className="flex-1 relative flex items-center group">
          <Icon name="email" size="sm" className="absolute left-3 text-gray-400 group-focus-within:text-brand-blue transition-colors" />
          <input
            type="email"
            placeholder="Email"
            className="w-full h-10 border border-gray-300 rounded-lg pl-10 pr-3 outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/20 transition-all bg-white"
          />
        </div>
        <Button className="h-10 bg-brand-blue text-white px-8 hover:bg-brand-blue/90 shadow-md active:scale-95 transition-all w-full md:w-fit font-bold">
          Subscribe
        </Button>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-blue/5 rounded-full -ml-16 -mb-16 blur-3xl"></div>
    </section>
  );
};

export { Newsletter };
