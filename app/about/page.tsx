"use client";

import React from "react";
import Image from "next/image";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiHeart, HiLightBulb, HiUserGroup, HiStar, HiRocketLaunch } from "react-icons/hi2";
import { motion } from "framer-motion";

const AboutPage = () => {
  const team = [
    {
      name: "Sarah Bloom",
      role: "Creative Director", image: "/avatars/avatar=pic1.jpg"
    },
    {
      name: "Michael Mist",
      role: "Master Perfumer", image: "/avatars/avatar=pic2.png"
    },
    {
      name: "Elena Rivers",
      role: "Skin Lab Director", image: "/avatars/avatar=pic3.png"
    },
    {
      name: "David Stone",
      role: "Botanical Sourcing", image: "/avatars/avatar=pic4.png"
    },
    {
      name: "Aria Chen",
      role: "Client Relations", image: "/avatars/avatar=pic5.png"
    },
  ];

  const values = [
    {
      title: "Uncompromising Quality",
      desc: "We believe that excellence is found in the details. Every product undergoes a rigorous curation process.",
      icon: <HiStar className="text-brand-blue" size={24} />
    },
    {
      title: "Sustainable Innovation",
      desc: "Blooming without harming. We prioritize ethical sourcing and eco-friendly practices in everything we do.",
      icon: <HiLightBulb className="text-brand-blue" size={24} />
    },
    {
      title: "Community Growth",
      desc: "We don't just sell products; we cultivate a community of individuals who appreciate fine artistry.",
      icon: <HiUserGroup className="text-brand-blue" size={24} />
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
      <Header />

      <main className="flex-1 w-full bg-white">
        {/* Step 62: Hero section with parallax-style background */}
        <section className="relative w-full h-[400px] md:h-[520px] overflow-hidden flex items-center justify-center text-center">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <Image
              src="/brandImage/brand_banner.png"
              alt="Bloom & Mist Background"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
          <div className="relative z-10 max-w-[1440px] px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-4"
            >
              <span className="px-4 py-1.5 bg-brand-blue rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white">Established 2015</span>
              <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter font-inter leading-none">
                Cultivating <span className="text-brand-blue">Pure</span> Excellence
              </h1>
              <p className="text-white/70 max-w-xl text-sm md:text-lg mt-2 leading-relaxed">
                Bloom & Mist was founded on a simple philosophy: beauty should be accessible, sustainable, and high-fidelity.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Step 63: Alternating Brand Narrative section */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-24 md:py-32 flex flex-col gap-24 md:gap-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              <h2 className="text-3xl md:text-5xl font-black text-[#1D3557] tracking-tight leading-tight">The intersection <br />of scent and skin.</h2>
              <div className="w-20 h-1.5 bg-brand-blue rounded-full" />
              <p className="text-gray-500 text-base md:text-xl leading-relaxed">
                In a world of mass-produced beauty, we chose the path of the artisan. Our journey began with a single botanical extract and a vision to merge the alchemy of scent with the science of skin wellness.
              </p>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Every Bloom & Mist creation is a sensory experience designed to nourish the skin while elevating the spirit.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl"
            >
              <Image src="/brandImage/serene_story.png" alt="Aesthetic" fill className="object-cover" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl order-2 lg:order-1"
            >
              <Image src="/brandImage/product_2.png" alt="Quality" fill className="object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-6 order-1 lg:order-2"
            >
              <h2 className="text-3xl md:text-5xl font-black text-[#1D3557] tracking-tight leading-tight">Sourced with soul, <br />crafted for life.</h2>
              <div className="w-20 h-1.5 bg-[#8CB7F5] rounded-full" />
              <p className="text-gray-500 text-base md:text-xl leading-relaxed">
                We travel the globe, not just for materials, but for stories. Our sourcing team partners with local communities to ensure that every raw material is harvested with respect for the earth.
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-[#1D3557]">50+</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Partners</span>
                </div>
                <div className="h-10 w-px bg-gray-200" />
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-[#1D3557]">100%</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ethical Choice</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Step 64: Core Values Grid */}
        <section className="bg-gray-50 py-24 md:py-32">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 text-center">
            <div className="flex flex-col items-center gap-4 mb-20 text-center">
              <span className="text-brand-blue font-bold tracking-[0.2em] uppercase text-xs">Our Foundations</span>
              <h2 className="text-3xl md:text-5xl font-black text-[#1D3557] tracking-tight">The Mist & Bloom Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all text-left flex flex-col gap-6 group"
                >
                  <div className="w-14 h-14 bg-brand-blue-light rounded-2xl flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    {v.icon}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="text-xl font-bold text-[#1D3557]">{v.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Step 64: Meet the Team */}
        <section className="py-24 md:py-32">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <div className="flex flex-col items-start gap-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-[#1D3557] tracking-tight">Meet the Architects</h2>
              <p className="text-gray-500 max-w-xl">The passionate individuals behind the scenes who make Bloom & Mist happen every single day.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
              {team.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col gap-4 group"
                >
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shadow-lg">
                    <Image src={member.image} alt={member.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <div className="flex gap-3 text-white">
                        <button className="hover:scale-120 transition-transform"><HiStar size={18} /></button>
                        <button className="hover:scale-120 transition-transform"><HiHeart size={18} /></button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h5 className="font-bold text-[#1D3557] text-lg">{member.name}</h5>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue">{member.role}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Step 64: Trust/Stats Section */}
        <section className="bg-[#1D3557] py-20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue rounded-full filter blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8CB7F5] rounded-full filter blur-[120px] opacity-10 -translate-x-1/2 translate-y-1/2" />

          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            <div className="flex flex-col items-center lg:items-start gap-2">
              <span className="text-4xl md:text-6xl font-black text-white tracking-tighter">10<span className="text-brand-blue">+</span></span>
              <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Years of Pursuit</span>
            </div>
            <div className="flex flex-col items-center lg:items-start gap-2">
              <span className="text-4xl md:text-6xl font-black text-white tracking-tighter">5M<span className="text-[#8CB7F5]">+</span></span>
              <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Global Shipments</span>
            </div>
            <div className="flex flex-col items-center lg:items-start gap-2">
              <span className="text-4xl md:text-6xl font-black text-white tracking-tighter">24<span className="text-brand-blue">/</span>7</span>
              <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Expert Support</span>
            </div>
            <div className="flex flex-col items-center lg:items-start gap-2">
              <span className="text-4xl md:text-6xl font-black text-white tracking-tighter">98<span className="text-[#8CB7F5]">%</span></span>
              <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Customer Trust</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
