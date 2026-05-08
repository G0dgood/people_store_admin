"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { useGetPostBySlugQuery, useGetPostsQuery } from "@/lib/redux/services/blogApi";
import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "@/app/components/Icon";
import Link from "next/link";

export default function BlogPostDetail() {
  const { slug } = useParams();
  const { data: posts, isLoading, isError } = useGetPostBySlugQuery(slug as string);
  const post = posts?.[0];

  if (isLoading) return <div className="min-h-screen bg-white" />;

  if (isError || !post) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 font-outfit">Post not found.</p>
        </div>
        <Footer />
      </main>
    );
  }

  const imageUrl = post.yoast_head_json?.og_image?.[0]?.url || 
                   post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                   "/placeholder-blog.jpg";

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Article Hero */}
      <article className="flex-1">
        <header className="w-full pt-20 pb-12 bg-neutral-50 border-b border-gray-100">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
            <div className="max-w-4xl mx-auto">
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-brand-gold transition-colors mb-12 group"
              >
                <Icon name="arrow_back" size="xs" className="group-hover:-translate-x-1 transition-transform" />
                Back to Journal
              </Link>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-bold text-brand-gold uppercase tracking-[0.3em]">Fragrance Culture</span>
                <div className="h-[1px] w-8 bg-gray-300" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-outfit font-light text-gray-900 leading-[1.1] mb-8"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />

              <div className="flex items-center gap-4 py-6 border-t border-gray-200">
                <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-white font-bold text-sm">
                  B&M
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-900">Bloom & Mist Editorial</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Curators of Fine Scents</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 -mt-12 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[21/9] w-full overflow-hidden shadow-2xl"
          >
            <Image
              src={imageUrl}
              alt={post.title.rendered}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 pb-32">
          <div className="max-w-3xl mx-auto">
            <div 
              className="prose prose-lg prose-neutral max-w-none 
                prose-headings:font-outfit prose-headings:font-light prose-headings:tracking-tight prose-headings:text-gray-900
                prose-p:font-outfit prose-p:font-light prose-p:text-gray-600 prose-p:leading-relaxed
                prose-a:text-brand-gold prose-a:no-underline hover:prose-a:underline
                prose-strong:font-bold prose-strong:text-gray-900
                prose-img:rounded-none prose-img:border prose-img:border-gray-100"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
            
            {/* Share & Footer Tags */}
            <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Share this story</span>
                <div className="flex gap-4">
                   <button className="text-gray-400 hover:text-brand-gold transition-colors"><Icon name="social/instagram" size="sm" /></button>
                   <button className="text-gray-400 hover:text-brand-gold transition-colors"><Icon name="social/whatsapp" size="sm" /></button>
                   <button className="text-gray-400 hover:text-brand-gold transition-colors"><Icon name="social/facebook" size="sm" /></button>
                </div>
              </div>
              
              <Link href="/blog" className="text-[11px] font-bold uppercase tracking-widest text-brand-gold hover:text-gray-900 transition-colors">
                Discover more stories
              </Link>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        <RelatedPostsSection currentSlug={post.slug} />
      </article>

      <Footer />
    </main>
  );
}

const RelatedPostsSection = ({ currentSlug }: { currentSlug: string }) => {
  const { data: posts, isLoading } = useGetPostsQuery();
  const relatedPosts = posts?.filter(p => p.slug !== currentSlug).slice(0, 3) || [];

  if (isLoading || relatedPosts.length === 0) return null;

  return (
    <section className="bg-neutral-50 py-24 border-t border-gray-100">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-[0.4em] mb-4 block">Keep Reading</span>
            <h2 className="text-3xl md:text-4xl font-outfit font-light text-gray-900 tracking-tight">
              Other <span className="font-bold italic">Journals</span> You Might Enjoy
            </h2>
          </div>
          <Link href="/blog" className="text-[11px] font-bold uppercase tracking-widest text-gray-900 hover:text-brand-gold transition-colors pb-1 border-b border-gray-200">
            View all stories
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {relatedPosts.map((post, idx) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <Link href={`/blog/${post.slug}`} className="block mb-6 relative aspect-[4/3] overflow-hidden">
                <Image 
                  src={post.yoast_head_json?.og_image?.[0]?.url || "/placeholder-blog.jpg"}
                  alt={post.title.rendered}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </Link>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <Link href={`/blog/${post.slug}`}>
                <h3 
                  className="text-lg font-outfit font-light text-gray-900 group-hover:text-brand-gold transition-colors line-clamp-2 leading-snug"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
