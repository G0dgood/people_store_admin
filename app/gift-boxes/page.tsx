"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiChevronRight, HiSparkles, HiShoppingBag, HiHeart, HiStar, HiGift } from "react-icons/hi2";
import { motion } from "framer-motion";
import { Button } from "@/app/components/Button";

const GiftBoxesPage = () => {
    const giftSets = [
        {
            id: "gs1",
            title: "The Signature Oud Collection",
            subtitle: "Midnight Bloom & Intense Oud",
            price: "₦285.00",
            image: "/brandImage/product_1.png",
            tag: "Best Seller"
        },
        {
            id: "gs2",
            title: "Radiant Skin Ritual",
            subtitle: "Vitamin C & Hyaluronic Duo",
            price: "₦195.00",
            image: "/brandImage/product_2.png",
            tag: "Essential"
        },
        {
            id: "gs3",
            title: "Artisanal Mist Discovery",
            subtitle: "5 Miniature Signature Scents",
            price: "₦155.00",
            image: "/brandImage/product_3.png",
            tag: "Limited Edition"
        },
        {
            id: "gs4",
            title: "Garden Bloom Gift Set",
            subtitle: "Floral Extracts & Body Silk",
            price: "₦220.00",
            image: "/brandImage/product_4.png",
            tag: "New Arrival"
        },
        {
            id: "gs5",
            title: "Midnight Noir Duo",
            subtitle: "Intense Perfume & Candle",
            price: "₦310.00",
            image: "/brandImage/product_5.png",
            tag: "Luxury"
        },
        {
            id: "gs6",
            title: "The Curator's Choice",
            subtitle: "Customizable 3-Piece Selection",
            price: "₦450.00",
            image: "/brandImage/product_6.png",
            tag: "Bespoke"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
            <Header />

            <main className="flex-1 w-full bg-white">
                {/* Step 118: Orchestrate 'Artisanal Curations' hero with cat_gifts.png */}
                <section className="relative w-full h-[450px] md:h-[600px] overflow-hidden">
                    <Image
                        src="/brandImage/cat_gifts.png"
                        alt="Gift Boxes Collection"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1D3557]/90 via-[#1D3557]/60 to-transparent flex items-center">
                        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 w-full">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="flex flex-col gap-4 md:gap-6 max-w-2xl"
                            >
                                <span className="text-[#8CB7F5] font-black tracking-[0.4em] uppercase text-xs md:text-sm">Boutique Curations</span>
                                <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none font-inter">
                                    Artisanal <br /><span className="text-[#8CB7F5]">Gifts.</span>
                                </h1>
                                <p className="text-white/80 text-sm md:text-xl leading-relaxed font-medium mt-2">
                                    Elevate the art of giving with our meticulously curated sensory experiences. Each set is hand-wrapped in our signature Bloom & Mist packaging.
                                </p>
                                <div className="pt-4 flex flex-col md:flex-row gap-4">
                                    <Button className="bg-[#8CB7F5] text-[#1D3557] font-black uppercase tracking-widest px-10 py-5 h-auto rounded-xl">
                                        Shop All Sets
                                    </Button>
                                    <Button variant="ghost" className="text-white border-white/20 hover:bg-white/10 font-black uppercase tracking-widest px-10 py-5 h-auto rounded-xl">
                                        Custom Curation
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-32">
                    {/* Step 119: Build 'Gift Collection' grid with glassmorphism cards */}
                    <div className="flex flex-col gap-4 mb-16 md:mb-24">
                        <span className="text-brand-blue font-bold tracking-[0.2em] uppercase text-xs">The Seasonal Edit</span>
                        <h2 className="text-4xl md:text-6xl font-black text-[#1D3557] tracking-tight">Hand-Wrapped <br />Excellence.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                        {giftSets.map((set, i) => (
                            <motion.div
                                key={set.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-square rounded-[48px] overflow-hidden bg-gray-50 mb-8 border border-gray-200 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-900/10">
                                    <Image
                                        src={set.image}
                                        alt={set.title}
                                        fill
                                        className="object-contain p-12 group-hover:p-8 transition-all duration-700"
                                    />
                                    {/* Glassmorphism Badge */}
                                    <div className="absolute top-8 left-8">
                                        <div className="px-5 py-2 bg-white/70 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#1D3557] border border-white/40 shadow-sm">
                                            {set.tag}
                                        </div>
                                    </div>
                                    {/* Hover Action Overlay */}
                                    <div className="absolute inset-0 bg-[#1D3557]/5 group-hover:bg-[#1D3557]/10 transition-colors" />
                                    <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <button className="w-full py-5 bg-white text-[#1D3557] font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl flex items-center justify-center gap-2">
                                            <HiShoppingBag size={14} /> Add To Cart
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 px-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-2xl font-black text-[#1D3557] tracking-tight group-hover:text-brand-blue transition-colors">
                                            {set.title}
                                        </h3>
                                        <span className="text-xl font-bold text-gray-900">{set.price}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm font-medium line-clamp-1">{set.subtitle}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Step 120: Implement 'Bespoke Concierge' CTA section */}
                    <div className="mt-40 md:mt-60 bg-[#F7FAFC] rounded-[64px] p-10 md:p-24 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/5 rounded-full filter blur-[100px] translate-x-1/2 -translate-y-1/2" />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                            <div className="flex flex-col gap-8 md:gap-10">
                                <div className="flex flex-col gap-4">
                                    <div className="w-16 h-16 bg-brand-blue rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                                        <HiSparkles size={32} />
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black text-[#1D3557] tracking-tight leading-[1.1]">The Bespoke <br /><span className="text-brand-blue">Choice.</span></h2>
                                </div>
                                <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-medium">
                                    Seeking a personalized touch? Our Concierge team specializes in corporate gifting and custom sensory curation for life's most momentous occasions.
                                </p>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black uppercase tracking-widest text-[#1D3557]">Corporate Gifting</span>
                                        <p className="text-sm text-gray-500">Premium sets for your valued partners.</p>
                                    </div>
                                    <div className="w-px h-12 bg-gray-200 hidden md:block" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black uppercase tracking-widest text-[#1D3557]">Wedding Suites</span>
                                        <p className="text-sm text-gray-500">Bespoke scents for your special day.</p>
                                    </div>
                                </div>
                                <Link href="/contact" className="w-full md:w-auto px-12 py-5 bg-[#1D3557] text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-blue-900/20 hover:scale-105 transition-all inline-block md:text-center">
                                    Consult a Curator
                                </Link>
                            </div>
                            <div className="relative aspect-square">
                                <div className="absolute inset-0 bg-brand-blue/10 rounded-[64px] rotate-6" />
                                <div className="absolute inset-0 bg-white rounded-[64px] shadow-2xl relative overflow-hidden p-10 flex items-center justify-center">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src="/brandImage/cat_gifts.png"
                                            alt="Bespoke Curation"
                                            fill
                                            className="object-cover rounded-[32px] opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-24 h-24 bg-white/80 backdrop-blur-xl rounded-full flex items-center justify-center text-[#1D3557] shadow-2xl">
                                                <HiGift size={40} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>


            <Footer />
        </div>
    );
};

export default GiftBoxesPage;
