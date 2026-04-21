"use client";

import React from "react";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";

interface NewsletterProps {
  variant?: "default" | "footer";
}

const Newsletter = ({ variant = "default" }: NewsletterProps) => {
  if (variant === "footer") {
    return (
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div className="flex flex-col gap-3">
          <h4 className="font-black text-white text-[11px] uppercase tracking-[0.2em]">Join the Privilege</h4>
          <p className="text-[13px] text-gray-400 font-light tracking-wide leading-relaxed">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative flex items-center border border-white/10 bg-white/5">
            <Icon
              name="email"
              size="xs"
              className="absolute left-4 text-white/30"
            />
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="w-full h-11 pl-11 pr-4 bg-transparent text-white text-[10px] font-bold tracking-widest outline-none placeholder:text-white/20"
            />
          </div>
          <Button className="h-11 !bg-brand-gold !text-white hover:!bg-white hover:!text-black transition-all duration-500 font-bold uppercase text-[10px] tracking-[0.2em] rounded-none w-full border-none">
            Subscribe
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#111111] py-24 px-6 text-center flex flex-col items-center gap-10 relative overflow-hidden border-t border-white/5">
      <div className="max-w-[600px] flex flex-col items-center text-center gap-4 z-10">
        <h3 className="text-2xl md:text-4xl font-outfit font-light text-white uppercase tracking-[0.2em]">Join the <span className="font-bold">Privilege</span></h3>
        <p className="text-xs md:text-sm text-white/60 leading-relaxed font-light tracking-[0.1em] uppercase">
          Be the first to experience our latest collections and exclusive private sales.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-0 w-full max-w-[500px] z-10 px-4 md:px-0 border border-white/20 overflow-hidden bg-white/5 backdrop-blur-sm">
        <div className="flex-1 relative flex items-center group">
          <Icon name="email" size="sm" className="absolute left-6 text-white/40 group-focus-within:text-brand-gold transition-colors" />
          <input
            type="email"
            placeholder="YOUR EMAIL ADDRESS"
            className="w-full h-14 pl-14 pr-6 outline-none transition-all bg-transparent text-white text-[10px] font-bold tracking-[0.2em] uppercase placeholder:text-white/30"
          />
        </div>
        <Button className="h-14 bg-brand-gold text-white px-12 hover:bg-brand-gold-light active:scale-95 transition-all w-full md:w-fit font-bold uppercase text-[10px] tracking-[0.2em] rounded-none">
          Subscribe
        </Button>
      </div>

      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold/5 rounded-full -ml-32 -mb-32 blur-[100px]"></div>
    </section>
  );
};

export { Newsletter };
