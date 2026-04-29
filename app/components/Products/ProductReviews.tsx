"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "../Icon";
import { toast } from "sonner";
import { ReviewModal } from "../Modal";

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

const mockReviews: Review[] = [
  {
    id: 1,
    user: "Michael Scott",
    avatar: "/avatars/avatar=pic1.jpg",
    rating: 5,
    date: "2 days ago",
    comment: "Absolutely amazing! The quality of the fabric is much better than I expected. It fits perfectly and looks very premium. Highly recommended for summer wear.",
    verified: true
  },
  {
    id: 2,
    user: "Pam Beesly",
    avatar: "/avatars/avatar=pic2.png",
    rating: 4,
    date: "1 week ago",
    comment: "Very nice shirt, the color is exactly as shown in the pictures. Shipping was fast. It's a bit loose on the shoulders but still looks great.",
    verified: true
  },
  {
    id: 3,
    user: "Jim Halpert",
    avatar: "/avatars/avatar=pic1.jpg",
    rating: 5,
    date: "2 weeks ago",
    comment: "This is my second purchase from this brand. Consistency is key and they never disappoint. Perfect for office wear too.",
    verified: true
  }
];

const ProductReviews = ({ product }: { product: any }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);

  if (!product) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-10"
    >
      {/* Rating Summary Section */}
      <div className="flex flex-col md:flex-row gap-8 md:items-center bg-white p-6 md:p-8 border border-gray-200">
        <div className="flex flex-col items-center text-center md:border-r border-gray-200 md:pr-12">
          <span className="text-5xl font-black text-gray-900 leading-none">{product.ratings || 0}</span>
          <div className="flex gap-1 my-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon key={star} name="star" size="sm" className={star <= Math.round(product.ratings || 0) ? "text-orange-400" : "text-gray-300"} />
            ))}
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Based on {product.reviewCount || 0} reviews</p>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {[5, 4, 3, 2, 1].map((stars) => {
             const percentages = { 5: 85, 4: 10, 3: 3, 2: 2, 1: 0 };
             const pct = percentages[stars as keyof typeof percentages];
             return (
               <div key={stars} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-500 w-12">{stars} Stars</span>
                  <div className="flex-1 h-2 bg-gray-200 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                      className="h-full bg-brand-blue"
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-400 w-10 text-right">{pct}%</span>
               </div>
             );
          })}
        </div>
      </div>

      {/* Review List */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">User Reviews</h3>
          <button 
            onClick={() => setIsReviewModalOpen(true)}
            className="text-sm font-bold text-brand-blue hover:underline cursor-pointer"
          >
            Write a Review
          </button>
        </div>

        <ReviewModal 
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          productName={product.name}
        />

        <div className="flex flex-col gap-8 divide-y divide-gray-100">
          {mockReviews.map((review) => (
            <div key={review.id} className="pt-8 first:pt-0">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 overflow-hidden border-2 border-white ring-1 ring-gray-100">
                    <Image src={review.avatar} alt={review.user} fill className="object-cover" sizes="48px" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.user}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                       <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Icon key={star} name="star" size="xs" className={star <= review.rating ? "text-orange-400" : "text-gray-200"} />
                          ))}
                       </div>
                       <span className="text-[10px] text-gray-400 font-medium">• {review.date}</span>
                    </div>
                  </div>
                </div>

                {review.verified && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-blue-light text-[10px] font-black text-blue-600 uppercase tracking-wider border border-blue-100">
                    <Icon name="check" size="xs" />
                    Verified
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed max-w-[900px]">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export { ProductReviews };
