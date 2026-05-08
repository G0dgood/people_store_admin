"use client";

import React from "react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { BlogHero } from "@/app/components/Blog/BlogHero";
import { BlogCard } from "@/app/components/Blog/BlogCard";
import { useGetPostsQuery } from "@/lib/redux/services/blogApi";
import { motion } from "framer-motion";

export default function BlogPage() {
  const { data: posts, isLoading, isError } = useGetPostsQuery();

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <BlogHero />

      <section className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-24 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-outfit font-light text-gray-900 mb-4 tracking-tight">
              Latest <span className="font-bold">Articles</span>
            </h2>
            <div className="h-1 w-20 bg-brand-gold" />
          </div>
          
          <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            <span>Filter by:</span>
            <button className="text-gray-900 border-b border-brand-gold pb-1 transition-all">All Stories</button>
            <button className="hover:text-gray-900 transition-all">Education</button>
            <button className="hover:text-gray-900 transition-all">Curations</button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-gray-50 aspect-[4/5] rounded-none border border-gray-100" />
            ))}
          </div>
        ) : isError ? (
          <div className="py-20 text-center">
            <p className="text-gray-500 font-outfit">Unable to load our latest stories. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {posts?.map((post, idx) => (
              <BlogCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
