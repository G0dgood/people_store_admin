"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "../Icon";
import { BlogPost } from "@/lib/redux/services/blogApi";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, index }) => {
  const imageUrl = post.yoast_head_json?.og_image?.[0]?.url || 
                   post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                   "/placeholder-blog.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group bg-white border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-brand-gold/5 transition-all duration-500 flex flex-col h-full"
    >
      <Link href={`/blog/${post.slug}`} className="relative h-64 overflow-hidden block">
        <Image
          src={imageUrl}
          alt={post.title.rendered}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-gold">
          Perfume Art
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-[1px] w-8 bg-brand-gold" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 
            className="text-xl font-outfit font-light text-gray-900 mb-4 group-hover:text-brand-gold transition-colors duration-300 line-clamp-2 leading-tight"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </Link>

        <div 
          className="text-sm text-gray-500 font-outfit font-light line-clamp-3 mb-6 flex-1"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />

        <Link 
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-900 group-hover:text-brand-gold transition-all duration-300"
        >
          Read full story
          <Icon name="arrow_forward" size="xs" className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};
