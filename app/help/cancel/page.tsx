"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiXMark, HiClock, HiCurrencyDollar, HiScale, HiShieldCheck, HiArrowPath } from "react-icons/hi2";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/Button";

const CancelOrderPage = () => {
    const policies = [
        {
            title: "Pre-Orchestration Window",
            desc: "Cancellations are accepted within the first 6 hours of order placement, before our curators begin the artisanal selection and packaging process.",
            icon: <HiClock size={28} />
        },
        {
            title: "Full Refund Integrity",
            desc: "Approved cancellations result in a 100% refund of the purchase price and shipping fees, credited back to your original payment method.",
            icon: <HiCurrencyDollar size={28} />
        },
        {
            title: "Post-Shipping Protocol",
            desc: "If your order has already entered the regional logistics network, a cancellation is no longer possible. Please refer to our Refund Policy for returns.",
            icon: <HiArrowPath size={28} />,
            link: "/refund"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
            <Header />

            <main className="flex-1 w-full bg-white">
                {/* Cancellation Hero */}
                <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 bg-[#1D3557] overflow-hidden">
                    <Image
                        src="/brandImage/shipping_banner.png"
                        alt="Cancellation Policy"
                        fill
                        className="object-cover opacity-100 grayscale brightness-50"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1D3557] via-[#1D3557]/80 to-transparent" />
                    
                    <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            className="flex flex-col gap-6"
                        >
                            <span className="text-brand-blue font-black tracking-[0.4em] uppercase text-xs">Policy Framework</span>
                            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none font-inter">
                                Order <br /><span className="text-[#8CB7F5]">Cancellation.</span>
                            </h1>
                            <p className="text-blue-100/60 max-w-2xl text-lg md:text-xl font-medium">
                                We understand that intentions change. Our cancellation framework is designed to provide maximum flexibility while respecting the artisanal nature of our fulfillment.
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-24 md:py-32">
                    {/* Policy Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {policies.map((policy, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-10 rounded-[40px] border border-gray-200 shadow-sm hover:shadow-2xl transition-all group"
                            >
                                <div className="w-16 h-16 bg-brand-blue-light rounded-3xl flex items-center justify-center text-brand-blue mb-8 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-500">
                                    {policy.icon}
                                </div>
                                <h3 className="text-2xl font-black text-[#1D3557] mb-4">{policy.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                    {policy.desc}
                                </p>
                                {policy.link && (
                                    <Link href={policy.link} className="text-xs font-black uppercase tracking-widest text-brand-blue hover:underline">
                                        View Returns →
                                    </Link>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Interactive Action Area */}
                    <div className="mt-24 md:mt-40 bg-gray-50 rounded-[64px] p-10 md:p-24 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full filter blur-[100px] translate-x-1/2 -translate-y-1/2" />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col gap-4">
                                    <span className="text-brand-blue font-bold tracking-[0.2em] uppercase text-xs">Immediate Request</span>
                                    <h2 className="text-3xl md:text-5xl font-black text-[#1D3557] tracking-tight leading-tight">Materialize Your <br />Cancellation.</h2>
                                </div>
                                <p className="text-gray-500 text-lg leading-relaxed">
                                    If your order is within the 6-hour pre-orchestration window, please connect with our support concierge immediately to process your request.
                                </p>
                                <div className="flex flex-col md:flex-row gap-4 pt-2">
                                    <Button 
                                        onClick={() => window.location.href = '/contact'}
                                        variant="primary" 
                                        className="px-12 py-5 bg-[#1D3557] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl"
                                    >
                                        Request Cancellation
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        className="px-12 py-5 border-gray-200 text-[#1D3557] rounded-2xl font-black uppercase tracking-widest text-sm"
                                    >
                                        View My Orders
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-8 bg-white p-10 md:p-12 rounded-[48px] shadow-sm border border-gray-200">
                                <div className="flex items-center gap-4 text-brand-blue">
                                    <HiShieldCheck size={32} />
                                    <h4 className="text-xl font-black text-[#1D3557]">Our Guarantee</h4>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed italic">
                                    "We prioritize your satisfaction above all. Our concierge team is committed to resolving all cancellation requests with precision and empathy, ensuring your Bloom & Mist experience remains flawless even when plans change."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand-blue-light" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase text-[#1D3557] tracking-widest">Director of Logistics</span>
                                        <span className="text-[10px] text-gray-400 font-medium">Bloom & Mist Support Suite</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>


            <Footer />
        </div>
    );
};

export default CancelOrderPage;
