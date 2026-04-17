"use client";

import React, { useState, useMemo } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FAQAccordion } from "../components/ui/FAQAccordion";
import { TabFilter } from "../components/Admin/TabFilter";
import { Input } from "../components/Form/Inputs";
import { Icon } from "../components/Icon";
import { HiMagnifyingGlass, HiOutlineChatBubbleLeftRight, HiOutlineEnvelope } from "react-icons/hi2";
import { motion } from "framer-motion";

const faqData = [
  {
    category: "Orders & Tracking",
    items: [
      { id: 1, question: "How can I track my order?", answer: "Once your order is shipped, you will receive an email with a tracking number and a link to track your package on our carrier's website. You can also track it directly from your 'My Orders' section in your account." },
      { id: 2, question: "Can I modify my order after placing it?", answer: "We process orders quickly, but you can request modifications within 1 hour of placing the order. Please contact our support team immediately with your order ID." },
      { id: 3, question: "What should I do if my order is delayed?", answer: "Shipping times vary by location. If your order hasn't arrived within the estimated delivery window, please check the tracking link or contact our support team for assistance." },
    ]
  },
  {
    category: "Shipping & Delivery",
    items: [
      { id: 4, question: "What are the shipping rates?", answer: "Shipping rates are calculated based on the weight of your order and the delivery destination. You can view the exact shipping cost at the checkout page before completing your purchase." },
      { id: 5, question: "Do you offer international shipping?", answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by country." },
      { id: 6, question: "How long does delivery take?", answer: "Standard local delivery typically takes 3-5 business days. Express shipping takes 1-2 business days. International orders can take 7-14 business days." },
    ]
  },
  {
    category: "Payments & Refunds",
    items: [
      { id: 7, question: "What payment methods do you accept?", answer: "We accept all major credit/debit cards, PayPal, and local bank transfers. All transactions are secure and encrypted." },
      { id: 8, question: "How long does a refund take?", answer: "Once we process your refund, it typically takes 5-10 business days for the funds to appear in your account, depending on your bank's processing time." },
      { id: 9, question: "Is my payment information secure?", answer: "Yes, we use industry-standard SSL encryption and secure payment gateways to ensure your sensitive information is always protected." },
    ]
  },
  {
    category: "Returns & Exchanges",
    items: [
      { id: 10, question: "What is your return policy?", answer: "We offer a 30-day return policy for most items. Products must be in their original packaging and unused. Some items like personal care products are non-returnable." },
      { id: 11, question: "How do I initiate a return?", answer: "Go to your 'My Orders' section, select the item you wish to return, and click 'Initiate Return'. Follow the instructions to print your return label." },
      { id: 12, question: "Can I exchange an item for a different size?", answer: "Yes, you can initiate an exchange through the 'My Orders' page. Once we receive your return, we will process the new item shipment." },
    ]
  }
];

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState("Orders & Tracking");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = faqData.map(d => d.category);

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
            className="inline-block text-brand-blue font-black text-[10px] uppercase tracking-[0.2em] mb-4 bg-blue-50 px-4 py-1.5 rounded-full"
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
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-xl mx-auto"
          >
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400">
              <HiMagnifyingGlass size={22} />
            </div>
            <input 
              type="text"
              placeholder="Search common questions, articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-14 pr-6 rounded-2xl border-none shadow-xl shadow-blue-900/5 bg-white text-base font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-brand-blue/20 transition-all"
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1000px] mx-auto px-6 py-16 md:py-24">
        {!searchQuery && (
          <div className="flex justify-center mb-12">
            <TabFilter 
              tabs={categories}
              activeTab={activeTab}
              onChange={setActiveTab}
              containerClassName="!p-1.5 shadow-sm !rounded-2xl"
            />
          </div>
        )}

        <div className="flex flex-col gap-8">
          {searchQuery && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-[#1D3557]">Search Results</h2>
              <button 
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-brand-blue hover:underline"
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
                <HiMagnifyingGlass size={32} />
              </div>
              <p className="text-gray-500 font-bold">No results found for "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="text-sm font-black text-brand-blue hover:underline"
              >
                Try searching something else
              </button>
            </div>
          )}
        </div>
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
              <div className="w-12 h-12 rounded-xl bg-brand-blue flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
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
