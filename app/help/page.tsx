"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiQuestionMarkCircle, HiTruck, HiCreditCard, HiArrowPath, HiShieldCheck, HiChevronRight } from "react-icons/hi2";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HiSearch } from "react-icons/hi";

const HelpCenterPage = () => {
  const categories = [
    {
      title: "Getting Started",
      icon: <HiQuestionMarkCircle size={28} />,
      links: ["Set up your account", "First-time shopping", "Member benefits"],
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Shipping & Delivery",
      icon: <HiTruck size={28} />,
      links: ["Delivery timelines", "Free shipping policy", "International rates"],
      color: "bg-emerald-50 text-emerald-600",
      href: "/shipping"
    },
    {
      title: "Payments & Pricing",
      icon: <HiCreditCard size={28} />,
      links: ["Accepted methods", "Currency options", "Voucher codes"],
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "Returns & Refunds",
      icon: <HiArrowPath size={28} />,
      links: ["Return policy", "Refund timelines", "Exchanges"],
      color: "bg-rose-50 text-rose-600",
      href: "/refund"
    }
  ];

  const popularFaqs = [
    "How do I track my atmospheric fragrance delivery?",
    "What is the Bloom & Mist 'Sourced with Soul' guarantee?",
    "Can I cancel my artisanal gift set order?",
    "How to manage my cookie and privacy preferences?"
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
      <Header />

      <main className="flex-1 w-full bg-white">
        {/* Help Center Hero */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 bg-[#1D3557] overflow-hidden">
          <Image
            src="/brandImage/brand_banner.png"
            alt="Support Banner"
            fill
            className="object-cover opacity-100"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1D3557] via-[#1D3557]/80 to-transparent" />

          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col gap-8 items-center text-center md:items-start md:text-left"
            >
              <div className="flex flex-col gap-4">
                <span className="text-[#8CB7F5] font-black tracking-[0.4em] uppercase text-xs">Support Concierge</span>
                <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none font-inter">
                  How can we <br /><span className="text-[#8CB7F5]">help you?</span>
                </h1>
              </div>

              {/* Search Bar Component */}
              <div className="w-full max-w-2xl relative group">
                <HiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-gold transition-colors" size={24} />
                <input
                  type="text"
                  placeholder="Search for articles, tracking, or policies..."
                  className="w-full bg-white/95 backdrop-blur-md border border-white/20 py-6 pl-16 pr-8 rounded-2xl shadow-2xl outline-none focus:ring-4 focus:ring-brand-gold/20 transition-all text-gray-900 font-medium"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Category Grid */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[32px] border border-gray-200   hover:shadow-2xl hover:-translate-y-2 transition-all group lg:aspect-square flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-6`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-black text-[#1D3557] mb-4">{cat.title}</h3>
                  <div className="flex flex-col gap-2">
                    {cat.links.map((link, j) => (
                      <span key={j} className="text-sm text-gray-400 font-medium hover:text-brand-gold cursor-pointer transition-colors">{link}</span>
                    ))}
                  </div>
                </div>
                <Link href={cat.href || "#"} className="mt-8 flex items-center justify-between text-xs font-black uppercase tracking-widest text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">
                  View More <HiChevronRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Popular FAQs Section */}
          <div className="mt-40 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <span className="text-brand-gold font-bold tracking-[0.2em] uppercase text-xs">Discovery</span>
                <h2 className="text-4xl font-black text-[#1D3557] tracking-tight">Trending Questions.</h2>
              </div>
              <div className="flex flex-col gap-4">
                {popularFaqs.map((faq, i) => (
                  <div key={i} className="p-6 bg-gray-50 border border-transparent hover:border-brand-gold hover:bg-white rounded-2xl cursor-pointer transition-all flex items-center justify-between group">
                    <span className="text-gray-600 font-medium group-hover:text-[#1D3557]">{faq}</span>
                    <HiChevronRight className="text-gray-300 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1D3557] rounded-[48px] p-10 md:p-16 flex flex-col justify-center gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold rounded-full filter blur-[100px] opacity-10 translate-x-1/2 -translate-y-1/2" />
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-[#8CB7F5]">
                <HiShieldCheck size={32} />
              </div>
              <h3 className="text-3xl font-black text-white leading-tight">Can't find the <br /><span className="text-[#8CB7F5]">answer?</span></h3>
              <p className="text-blue-100/40 text-lg">Our artisanal support curators are available from 9am to 6pm for a personalized consultation.</p>
              <div className="pt-4">
                <Link href="/contact" className="px-12 py-5 bg-brand-gold text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-500/20 hover:scale-105 transition-all inline-block">
                  Talk to a Human
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>


      <Footer />
    </div>
  );
};

export default HelpCenterPage;
