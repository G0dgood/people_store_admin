import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Input, Radio } from "@/app/components/Form";
import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const CheckoutForm: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* Step 1: Shipping Address */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
      >
        <div className="p-6 md:p-8 bg-gray-50/50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-black shadow-lg shadow-brand-blue/20">
              1
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Shipping Details</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Where should we deliver?</p>
            </div>
          </div>
          <Icon name="local_shipping" size="md" className="text-brand-blue opacity-10" />
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
              <Input placeholder="John" className="h-[52px] bg-gray-50/50 border-gray-200 focus:border-brand-blue focus:bg-white transition-all shadow-none rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
              <Input placeholder="Doe" className="h-[52px] bg-gray-50/50 border-gray-200 focus:border-brand-blue focus:bg-white transition-all shadow-none rounded-xl" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <Input placeholder="john.doe@example.com" type="email" className="h-[52px] bg-gray-50/50 border-gray-200 focus:border-brand-blue focus:bg-white transition-all shadow-none rounded-xl" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Street Address</label>
              <div className="relative flex items-center">
                <Input placeholder="123 Shopping Avenue, Suite 456" className="h-[52px] bg-gray-50/50 border-gray-200 focus:border-brand-blue focus:bg-white transition-all shadow-none rounded-xl w-full" />
                <Icon name="location_on" size="xs" className="absolute right-4 text-gray-300" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
              <Input placeholder="San Francisco" className="h-[52px] bg-gray-50/50 border-gray-200 focus:border-brand-blue focus:bg-white transition-all shadow-none rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Country</label>
              <div className="flex items-center justify-between px-4 border border-gray-200 rounded-xl bg-gray-50/50 h-[52px] w-full cursor-pointer hover:border-brand-blue hover:bg-white transition-all group">
                <span className="text-sm text-gray-900 font-semibold">United States</span>
                <Icon name="expand_more" size="xs" className="text-gray-400 group-hover:text-brand-blue transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Step 2: Payment Method */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
      >
        <div className="p-6 md:p-8 bg-gray-50/50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-black shadow-lg shadow-brand-blue/20">
              2
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Payment Selection</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Secure Transaction</p>
            </div>
          </div>
          <Icon name="security" size="md" className="text-brand-blue opacity-10" />
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex-1 flex flex-col items-start p-5 rounded-2xl border-2 transition-all gap-4 text-left relative overflow-hidden
                ${paymentMethod === "card"
                  ? "border-brand-blue bg-brand-blue-light/30 shadow-[0_4px_12px_rgb(0,181,23,0.05)]"
                  : "border-gray-50 bg-gray-50/30 hover:border-brand-blue/30 hover:bg-white"}`}
            >
              <Radio
                name="paymentMethod"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                rightElement={
                  <div className="flex gap-2">
                    <Image src="/payment/Payment=payment, Pay-type=visa.png" alt="Visa" width={32} height={20} className="object-contain" />
                    <Image src="/payment/Payment=payment, Pay-type=mastercard.png" alt="Mastercard" width={32} height={20} className="object-contain" />
                  </div>
                }
              />
              <div className="relative z-10 pointer-events-none">
                <span className={`font-bold text-[13px] block ${paymentMethod === "card" ? "text-gray-900" : "text-gray-500"}`}>Credit / Debit Card</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Instant confirmation</span>
              </div>
            </button>

            <button
              onClick={() => setPaymentMethod("paypal")}
              className={`flex-1 flex flex-col items-start p-5 rounded-2xl border-2 transition-all gap-4 text-left relative overflow-hidden
                ${paymentMethod === "paypal"
                  ? "border-[#0070BA] bg-brand-blue-light/30 shadow-[0_4px_12px_rgb(0,112,186,0.05)]"
                  : "border-gray-50 bg-gray-50/30 hover:border-[#0070BA]/30 hover:bg-white"}`}
            >
              <Radio
                name="paymentMethod"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                icon="paypal"
                activeColor="#0070BA"
              />
              <div className="relative z-10 pointer-events-none">
                <span className={`font-bold text-[13px] block ${paymentMethod === "paypal" ? "text-gray-900" : "text-gray-500"}`}>PayPal Express</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Redirect to PayPal</span>
              </div>
            </button>
          </div>

          {paymentMethod === "card" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8 bg-gray-50/80 rounded-2xl border border-gray-200"
            >
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Card Number</label>
                <div className="relative flex items-center">
                  <Input placeholder="0000 0000 0000 0000" className="h-[52px] pl-12 shadow-none border-gray-200 focus:border-brand-blue focus:bg-white rounded-xl" />
                  <Icon name="security" size="xs" className="absolute left-4 text-gray-400" />
                </div>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cardholder Name</label>
                <Input placeholder="FULL NAME AS ON CARD" className="h-[52px] shadow-none border-gray-200 focus:border-brand-blue focus:bg-white rounded-xl uppercase placeholder:normal-case font-semibold text-sm" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Date</label>
                <div className="relative flex items-center">
                  <Input placeholder="MM / YY" className="h-[52px] shadow-none border-gray-200 focus:border-brand-blue focus:bg-white rounded-xl text-center font-bold" />
                  <Icon name="calendar_today" size="xs" className="absolute left-4 text-gray-200 hidden md:block" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Security Code</label>
                <div className="relative flex items-center">
                  <Input placeholder="CVV" type="password" className="h-[52px] shadow-none border-gray-200 focus:border-brand-blue focus:bg-white rounded-xl text-center font-bold tracking-widest" />
                  <Icon name="help" size="xs" className="absolute right-4 text-gray-300" />
                </div>
              </div>
            </motion.div>
          )}

          {paymentMethod === "paypal" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-[#0070BA]/5 rounded-2xl border border-[#0070BA]/10 flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                <Icon name="paypal" size="lg" className="text-[#0070BA]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">PayPal Express</h3>
                <p className="text-sm text-gray-500 max-w-[240px] mt-1">You will be redirected to PayPal to complete your purchase securely.</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
};
