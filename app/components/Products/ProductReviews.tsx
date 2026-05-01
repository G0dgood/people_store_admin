"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "../Icon";
import { ReviewModal } from "../Modal";
import { useGetPublicReviewsByProductQuery } from "@/lib/redux/services/boutiqueApi";
import moment from "moment";
import { EmptyState } from "../Admin/EmptyState";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { useApiError } from "@/app/hooks/useApiError";

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

const RatingProgressBar = ({ stars, pct }: { stars: number; pct: number }) => (
  <div className="flex items-center gap-4">
    <span className="text-xs font-bold text-gray-500 w-12">{stars} Stars</span>
    <div className="flex-1 h-2 bg-gray-200 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="h-full bg-brand-gold"
      />
    </div>
    <span className="text-xs font-bold text-gray-400 w-10 text-right">{pct}%</span>
  </div>
);

const RatingSummary = ({ product, reviews }: { product: any, reviews: any[] }) => (
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
        const count = reviews.filter((r: any) => Math.round(r.rating) === stars).length;
        const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
        return <RatingProgressBar key={stars} stars={stars} pct={pct} />;
      })}
    </div>
  </div>
);



const ReviewList = ({
  reviews,
  isLoading,
  onWriteReview
}: {
  reviews: any[],
  isLoading: boolean,
  onWriteReview: () => void
}) => (
  <div className="flex flex-col gap-8">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-bold text-gray-900 tracking-tight">User Reviews</h3>
      <button
        onClick={onWriteReview}
        className="text-sm font-bold text-brand-gold hover:underline cursor-pointer"
      >
        Write a Review
      </button>
    </div>

    <div className="flex flex-col gap-8 divide-y divide-gray-100">
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={<HiOutlineChatBubbleLeftRight size={36} />}
          title="No Reviews Yet"
          description="Be the first to share your experience with this artisanal piece. Your feedback helps others discover the beauty of our collection."
          className="py-12 border border-dashed border-gray-200"
        />
      ) : (
        reviews.map((review: any) => (
          <div key={review._id} className="pt-8 first:pt-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 overflow-hidden bg-gray-100 border border-gray-100">
                  {review.customer?.avatar ? (
                    <Image src={review.customer.avatar} alt={review.customer.fullName || "User"} fill className="object-cover" sizes="48px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-brand-gold/10 text-brand-gold font-bold text-xs">
                      {review.customer?.fullName?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{review.customer?.fullName || "Verified User"}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon key={star} name="star" size="xs" className={star <= review.rating ? "text-orange-400" : "text-gray-200"} />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">• {moment(review.createdAt).fromNow()}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed max-w-[900px]">
              {review.comment}
            </p>

            {review.reply && (
              <div className="mt-4 ml-12 p-4 bg-gray-50 border-l-2 border-brand-gold">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-gold mb-1">Response from Boutique</h5>
                <p className="text-xs text-gray-600 leading-relaxed italic">{review.reply.comment}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  </div>
);

const ProductReviews = ({ product }: { product: any }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = React.useState(false);
  const { data: reviewsResponse, isLoading, isError, error } = useGetPublicReviewsByProductQuery(product?._id, {
    skip: !product?._id
  });
  const reviews = reviewsResponse?.data || [];

  console.log("DEBUG: Product ID:", product?._id);
  console.log("DEBUG: Reviews Response:", reviewsResponse);
  console.log("DEBUG: Reviews List:", reviews);

  useApiError(isError, error, "Failed to load reviews");

  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-10"
    >
      {/* Rating Summary Section */}
      <RatingSummary product={product} reviews={reviews} />

      {/* Review List */}
      <ReviewList
        reviews={reviews}
        isLoading={isLoading}
        onWriteReview={() => setIsReviewModalOpen(true)}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productName={product.name}
        productId={product?._id}
      />
    </motion.div>
  );
};

export { ProductReviews };
