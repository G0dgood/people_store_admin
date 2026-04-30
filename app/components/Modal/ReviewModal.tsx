"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { FloatingInput } from "../Form";
import { toast } from "sonner";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  productName = "Product",
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please provide a star rating.");
      return;
    }
    toast.success("Review submitted successfully! Thank you for your feedback.");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Write a Review"
    >
      <div className="flex flex-col gap-6 py-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">How would you rate your experience with</p>
          <h4 className="text-md font-bold text-gray-900 leading-snug">{productName}</h4>
        </div>

        {/* Star Rating Selector */}
        <div className="flex flex-col gap-3 p-6 bg-gray-50 rounded-2xl border border-gray-200 items-center justify-center">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform active:scale-90 cursor-pointer p-1"
              >
                <Icon
                  name="star"
                  size="lg"
                  className={
                    star <= (hoveredRating || rating)
                      ? "text-orange-400"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
            {rating === 0 ? "Select a rating" : `${rating} - ${["Poor", "Fair", "Good", "Very Good", "Excellent"][rating - 1]}`}
          </span>
        </div>

        <div className="flex flex-col gap-5">
          <FloatingInput
            label="Review Title"
            placeholder="Summarize your experience"
          />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
              Your Review
            </label>
            <textarea
              className="w-full min-h-[120px] p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/10 transition-all text-sm text-gray-700 resize-none"
              placeholder="What did you like or dislike? How was the quality?"
            />
          </div>
        </div>

        {/* Image Upload Placeholder */}
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group hover:border-brand-gold/30 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-brand-gold group-hover:bg-brand-gold/5 transition-colors">
            <Icon name="photo_camera" size="sm" />
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-sm font-bold text-gray-900">Add Photos</span>
            <span className="text-xs text-gray-400">Drag & drop or click to upload</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button 
            className="flex-1 h-12 font-bold" 
            onClick={handleSubmit}
          >
            Submit Review
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 h-12 font-bold text-gray-500" 
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
