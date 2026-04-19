"use client";

import React from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";

const Newsletter = () => {
  return (
    <section className="w-full bg-white py-16 px-6 text-center flex flex-col items-center gap-8 relative overflow-hidden border-t border-gray-200">
      <div className="max-w-[600px] flex flex-col items-center text-center gap-3 z-10">
        <h3 className="text-xl md:text-3xl font-black text-neutral-900 uppercase tracking-tighter">Subscribe to our newsletter</h3>
        <p className="text-sm md:text-base text-gray-500 leading-relaxed font-medium">
          Get exclusive offers and limited-edition releases delivered to your inbox.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 w-full max-w-[450px] z-10 px-4 md:px-0">
        <div className="flex-1 relative flex items-center group">
          <Icon name="email" size="sm" className="absolute left-4 text-gray-400 group-focus-within:text-brand-red transition-colors" />
          <input
            type="email"
            placeholder="ENTER YOUR EMAIL"
            className="w-full h-12 border border-gray-200 pl-12 pr-4 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/5 transition-all bg-white text-[11px] font-bold tracking-widest uppercase"
          />
        </div>
        <Button className="h-12 bg-brand-red text-white px-10 hover:bg-brand-red-dark active:scale-95 transition-all w-full md:w-fit font-bold uppercase text-[11px] tracking-widest">
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
