"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useGetPostsQuery } from "@/lib/redux/services/blogApi";
import { Icon } from "../Icon";

export const BlogSection: React.FC = () => {
  const { data: posts, isLoading } = useGetPostsQuery();
  const featuredPosts = posts?.slice(0, 3) || [];

  if (isLoading) return (
    <section className="w-full py-20 bg-neutral-50 border border-gray-200">
      <div className="px-8 mb-16 h-12 bg-gray-100 animate-pulse w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <div key={i} className="h-[500px] bg-gray-100 animate-pulse" />)}
      </div>
    </section>
  );

  if (!posts || posts.length === 0) return null;

  return (
    <section className="w-full py-20 bg-neutral-50 border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between px-8 mb-16 gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-brand-gold" />
            <span className="text-xs font-bold text-brand-gold uppercase tracking-[0.4em]">The Journal</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-outfit font-light text-gray-900 tracking-tight leading-tight">
            Dive into the <span className="font-bold italic">Art</span> of Perfumery
          </h2>
        </div>
        
        <Link 
          href="/blog" 
          className="group flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 hover:text-brand-gold transition-all"
        >
          View all stories
          <Icon name="arrow_forward" size="xs" className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {featuredPosts.map((post, idx) => {
          const imageUrl = post.yoast_head_json?.og_image?.[0]?.url || 
                           post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                           "/placeholder-blog.jpg";
          
          return (
            <Link 
              key={post.id} 
              href={`/blog/${post.slug}`}
              className={`group relative h-[500px] overflow-hidden border-gray-200 ${idx !== 2 ? 'md:border-r' : ''}`}
            >
              <Image 
                src={imageUrl}
                alt={post.title.rendered}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.3em] mb-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <h3 
                  className="text-2xl font-outfit font-light text-white leading-tight mb-6 translate-y-8 group-hover:translate-y-0 transition-transform duration-500"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <div className="h-[2px] w-0 bg-brand-gold group-hover:w-full transition-all duration-700" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
