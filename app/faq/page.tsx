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
import Image from "next/image";

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
    <div className="min-h-screen !bg-white flex flex-col font-sans text-black">
      <Header />

      <main className="flex-1 w-full !bg-white py-8 md:py-12">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col gap-12 md:gap-24">
          {/* FAQ Hero Section */}
          <section className="relative pt-10 pb-12  md:pb-20 bg-white overflow-hidden">

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="flex flex-col gap-6"
              >
                <span className="text-brand-gold font-black tracking-[0.4em] text-xs">Knowledge Base</span>
                <h1 className="text-4xl md:text-7xl font-black text-black tracking-tighter leading-none font-inter">
                  How can we <br /><span className="text-brand-gold">help you?</span>
                </h1>

                <div className="max-w-2xl mt-4 justify-start">
                  <PageSearch
                    value={searchQuery}
                    onChange={setSearchQuery}
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-8 md:py-12">
            <div className="max-w-[1000px] mx-auto">
              {isLoading ? (
                <FAQSkeleton />
              ) : (
                <>
                  {!searchQuery && (
                    <div className="flex justify-center mb-16">
                      <TabFilter
                        tabs={categories}
                        activeTab={activeTab}
                        onChange={setActiveTab} id={""} />
                    </div>
                  )}

                  <div className="flex flex-col gap-8">
                    {searchQuery && (
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-black text-black tracking-tight">Search Results</h2>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-xs font-black text-brand-gold hover:underline tracking-widest"
                        >
                          Clear search
                        </button>
                      </div>
                    )}

                    {filteredFAQs.length > 0 ? (
                      <FAQAccordion items={filteredFAQs} />
                    ) : (
                      <div className="py-20 text-center flex flex-col items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 border border-gray-100">
                          <HiOutlineSearch size={40} />
                        </div>
                        <p className="text-gray-500 font-bold text-lg">No results found for "{searchQuery}"</p>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-sm font-black text-brand-gold hover:underline tracking-widest"
                        >
                          Try searching something else
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-gray-50 border border-gray-100 rounded-[48px] py-24 relative overflow-hidden">

            <Image
              src="/brandImage/cat_body.png"
              alt="Contact Background"
              fill
              className="object-cover opacity-20 "
              sizes="100vw"
            />
            <div className="max-w-[1440px] mx-auto px-6 relative z-20 flex flex-col items-center text-center">
              <div className="flex flex-col gap-4 mb-10">
                <span className="text-brand-gold font-bold tracking-[0.4em] text-xs">Human Connection</span>
                <h2 className="text-4xl md:text-6xl font-black text-black tracking-tighter leading-none font-inter">Still have questions?</h2>
                <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                  Our artisanal support curators are available to orchestrate a personalized resolution for your inquiries.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
                <div className="bg-gray-50 backdrop-blur-md rounded-[32px] p-10 border border-gray-200 flex flex-col items-center gap-6 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="w-16 h-16 rounded-2xl bg-brand-gold flex items-center justify-center text-white shadow-lg shadow-brand-gold/20 group-hover:scale-110 transition-transform">
                    <HiOutlineChatBubbleLeftRight size={32} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-black font-black text-2xl tracking-tight">Live Chat</span>
                    <span className="text-gray-500 text-[10px] font-black tracking-[0.2em]">Response within 2 mins</span>
                  </div>
                </div>

                <div className="bg-gray-50 backdrop-blur-md rounded-[32px] p-10 border border-gray-200 flex flex-col items-center gap-6 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="w-16 h-16 rounded-2xl bg-brand-gold flex items-center justify-center text-white shadow-lg shadow-brand-gold/20 group-hover:scale-110 transition-transform">
                    <HiOutlineEnvelope size={32} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-black font-black text-2xl tracking-tight">Email Concierge</span>
                    <span className="text-gray-500 text-[10px] font-black tracking-[0.2em]">Materializing in 24h</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
