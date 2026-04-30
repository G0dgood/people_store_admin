"use client";

import React, { useState, useMemo } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FAQAccordion } from "../components/ui/FAQAccordion";
import { TabFilter } from "../components/Admin/TabFilter";
import { HiOutlineChatBubbleLeftRight, HiOutlineEnvelope } from "react-icons/hi2";
import { motion } from "framer-motion";
import { HiOutlineSearch } from "react-icons/hi";
import { PageSearch } from "../components/Form/PageSearch";

import { useGetPublicFaqsQuery } from "@/lib/redux/services/boutiqueApi";
import { FAQSkeleton } from "../components/Skeleton/FAQSkeleton";

export default function FAQPage() {
  const { data: faqResponse, isLoading } = useGetPublicFaqsQuery();
  const rawFaqs = faqResponse?.data || [];

  const [searchQuery, setSearchQuery] = useState("");

  const faqData = useMemo(() => {
    const grouped: { category: string; items: any[] }[] = [];
    rawFaqs.forEach(item => {
      if (item.status !== 'Active') return;
      let cat = grouped.find(g => g.category === item.category);
      if (!cat) {
        cat = { category: item.category, items: [] };
        grouped.push(cat);
      }
      cat.items.push({
        id: item?._id,
        question: item?.question,
        answer: item?.answer
      });
    });
    return grouped;
  }, [rawFaqs]);

  const categories = useMemo(() => faqData.map(d => d.category), [faqData]);
  const [activeTab, setActiveTab] = useState("");

  // Set initial active tab when data is loaded
  React.useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0]);
    }
  }, [categories, activeTab]);

  const filteredFAQs = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();

    // If searching, show all matching across categories
    if (searchQuery) {
      return faqData.flatMap(cat => cat.items).filter(item =>
        item.question.toLowerCase().includes(searchLower) ||
        item.answer.toString().toLowerCase().includes(searchLower)
      );
    }

    // Otherwise show by category
    return faqData.find(cat => cat.category === activeTab)?.items || [];
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>

        <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-brand-gold font-black text-[10px] uppercase tracking-[0.2em] mb-4 bg-blue-50 px-4 py-1.5 rounded-full"
          >
            Help Center
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-[#1D3557] mb-6 leading-tight"
          >
            How can we help you?
          </motion.h1>

          <PageSearch
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1000px] mx-auto px-6 py-16 md:py-24">
        {isLoading ? (
          <FAQSkeleton />
        ) : (
          <>
            {!searchQuery && (
              <div className="flex justify-center mb-12">
                <TabFilter
                  tabs={categories}
                  activeTab={activeTab}
                  onChange={setActiveTab} id={""} />
              </div>
            )}

            <div className="flex flex-col gap-8">
              {searchQuery && (
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-[#1D3557]">Search Results</h2>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-bold text-brand-gold hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}

              {filteredFAQs.length > 0 ? (
                <FAQAccordion items={filteredFAQs} />
              ) : (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                    <HiOutlineSearch size={32} />
                  </div>
                  <p className="text-gray-500 font-bold">No results found for "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-sm font-black text-brand-gold hover:underline"
                  >
                    Try searching something else
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* Contact CTA */}
      <section className="bg-[#1D3557] py-20 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <h2 className="text-3xl font-black text-white mb-4">Still have questions?</h2>
          <p className="text-blue-200/70 text-base md:text-lg mb-10 max-w-xl font-medium">
            Contact our dedicated support team. We're here to help you solve any issues as quickly as possible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 flex flex-col items-center gap-4 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-brand-gold flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <HiOutlineChatBubbleLeftRight size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-lg">Live Chat</span>
                <span className="text-blue-200/50 text-xs font-bold uppercase tracking-widest mt-1">Average wait: 2 mins</span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 flex flex-col items-center gap-4 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <HiOutlineEnvelope size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-black text-lg">Email Support</span>
                <span className="text-blue-200/50 text-xs font-bold uppercase tracking-widest mt-1">Response within 24h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
