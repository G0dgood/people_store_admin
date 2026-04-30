"use client";

import React from "react";
import Image from "next/image";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { HiCalendar, HiClock, HiChevronRight, HiArrowLongRight } from "react-icons/hi2";
import { motion } from "framer-motion";

const BlogPage = () => {
  const posts = [
    {
      title: "The Art of Scent Layering: A Bloom & Mist Guide",
      excerpt: "Unlock the secrets of fragrance architecture. Learn how to combine Eau de Parfum and body oils for a signature bloom...",
      category: "Fragrance",
      date: "Oct 12, 2023",
      readTime: "5 min read",
      image: "/books/1.png"
    },
    {
      title: "Botanical Extracts: Nature's Skin Lab",
      excerpt: "Discover the therapeutic power of our sustainably sourced ingredients, from Bulgarian Rose to Wild Lavender...",
      category: "Skincare",
      date: "Oct 08, 2023",
      readTime: "8 min read",
      image: "/books/2.png"
    },
    {
      title: "The Gift of Thought: Curating the Perfect Set",
      excerpt: "Gifting is an art form. Our curators share insights on selecting products that resonate with beauty and soul...",
      category: "Gifts",
      date: "Sep 28, 2023",
      readTime: "6 min read",
      image: "/books/3.png"
    },
    {
      title: "Morning Rituals: Skin Health in 2024",
      excerpt: "Insights from our Clinical Skin Lab on the evolving morning routines that prioritize hydration and barrier protection...",
      category: "Skincare",
      date: "Sep 22, 2023",
      readTime: "10 min read",
      image: "/books/4.png"
    },
    {
      title: "Sourcing Oud: A Journey to the East",
      excerpt: "Behind the scenes of our fragrance sourcing. How we find the world's most rare and sustainable agarwood...",
      category: "Fragrance",
      date: "Sep 15, 2023",
      readTime: "4 min read",
      image: "/books/5.png"
    },
    {
      title: "Tactile Senses: The Feeling of Luxury Skin",
      excerpt: "Why the texture of a serum matters just as much as its ingredients. Exploring the tactile science of skincare...",
      category: "Innovation",
      date: "Sep 02, 2023",
      readTime: "7 min read",
      image: "/books/6.png"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col font-sans text-black">
      <Header />

      <main className="flex-1 w-full bg-white">
        {/* Step 80: Implement Editorial Hero section */}
        <section className="bg-gray-50 py-20 md:py-32 border-b border-gray-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold rounded-full filter blur-[120px] opacity-5 -translate-x-1/2 -translate-y-1/2" />
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-4"
            >
              <span className="text-brand-gold font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs">Bloom & Mist Journal</span>
              <h1 className="text-4xl md:text-7xl font-black text-[#1D3557] tracking-tighter leading-none">
                Insights <span className="text-brand-gold">&</span> Inspiration.
              </h1>
              <p className="text-gray-500 max-w-2xl text-sm md:text-lg mt-4 leading-relaxed font-medium">
                Exploring the intersection of high-fidelity craftsmanship, sustainable innovation, and modern lifestyle orchestration.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
          {/* Step 81: Build Featured Story immersive card */}
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full mb-24 cursor-pointer group"
          >
            <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-[40px] bg-gray-100 overflow-hidden relative shadow-2xl">
              <Image 
                src="/books/7.png" 
                alt="Featured Story" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D3557] via-[#1D3557]/20 to-transparent flex items-end">
                <div className="p-8 md:p-16 max-w-4xl flex flex-col gap-4">
                  <span className="px-4 py-1.5 bg-brand-gold rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white w-fit">Featured Story</span>
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">Beyond the Interface: The Humanity of High-Fidelity Design</h2>
                  <p className="text-blue-100/60 text-sm md:text-lg max-w-2xl leading-relaxed">
                    How we orchestrated a digital language that feels as tactile as our physical products. An interview with our lead architects.
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <button className="bg-white text-[#1D3557] px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl flex items-center gap-2 group-hover:bg-brand-gold group-hover:text-white transition-all">
                      Read Feature <HiArrowLongRight size={18} />
                    </button>
                    <div className="flex items-center gap-4 text-white/40 text-xs font-bold uppercase tracking-widest">
                       <span className="flex items-center gap-1"><HiCalendar /> Oct 20, 2023</span>
                       <span className="flex items-center gap-1"><HiClock /> 12 min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Step 82: Implement Responsive Journal Feed (Article Grid) */}
          <section className="flex flex-col gap-12">
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-black text-[#1D3557] tracking-tight">Recent Journal Entries</h3>
               <div className="flex items-center gap-3 text-brand-gold font-bold text-sm cursor-pointer group">
                  <span className="group-hover:mr-2 transition-all">View All Categories</span>
                  <HiChevronRight />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post, i) => (
                <motion.article 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col gap-6 cursor-pointer group"
                >
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-sm">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase tracking-widest text-brand-gold shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       <span className="flex items-center gap-1"><HiCalendar className="text-brand-gold" /> {post.date}</span>
                       <span className="flex items-center gap-1"><HiClock className="text-brand-gold" /> {post.readTime}</span>
                    </div>
                    <h4 className="text-xl font-black text-[#1D3557] leading-tight group-hover:text-brand-gold transition-colors duration-300 line-clamp-2">
                       {post.title}
                    </h4>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                       {post.excerpt}
                    </p>
                    <div className="pt-2">
                       <div className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-[#1D3557] group-hover:text-brand-gold transition-colors">
                          Read Story <HiChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                       </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-16 flex justify-center">
               <button className="px-12 py-4 border-2 border-gray-200 rounded-2xl text-[#1D3557] font-black uppercase tracking-widest text-xs hover:border-brand-gold hover:text-brand-gold transition-all">
                  Load Older Stories
               </button>
            </div>
          </section>
        </div>
      </main>


      <Footer />
    </div>
  );
};

export default BlogPage;
