"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown } from "react-icons/hi2";

interface FAQItemProps {
  question: string;
  answer: string | React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all hover:border-blue-100 hover:shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left transition-colors"
      >
        <span className="text-sm md:text-base font-bold text-[#1D3557]">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`flex-shrink-0 ml-4 ${isOpen ? "text-brand-blue" : "text-gray-400"}`}
        >
          <HiChevronDown size={22} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 text-sm md:text-[15px] leading-relaxed text-gray-500 font-medium">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FAQAccordionProps {
  items: Array<{ id: string | number; question: string; answer: string | React.ReactNode }>;
}

export const FAQAccordion = ({ items }: FAQAccordionProps) => {
  const [openId, setOpenId] = useState<string | number | null>(null);

  const handleToggle = (id: string | number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <FAQItem
          key={item.id}
          question={item.question}
          answer={item.answer}
          isOpen={openId === item.id}
          onToggle={() => handleToggle(item.id)}
        />
      ))}
    </div>
  );
};
