"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Modal from "./Modal";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { FloatingInput } from "../Form";
import { toast } from "sonner";
import { useSubmitReviewMutation } from "@/lib/redux/services/boutiqueApi";
import { useApiError } from "@/app/hooks/useApiError";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productId: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  productName = "Product",
  productId,
}) => {
  const [submitReview, { isLoading: isSubmitting, isError, error }] = useSubmitReviewMutation();
  useApiError(isError, error, "Failed to submit review");

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error("You can only upload up to 5 images.");
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please provide a star rating.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a review comment.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("rating", rating.toString());
      formData.append("title", title);
      formData.append("comment", comment);

      images.forEach((image) => {
        formData.append("images", image);
      });

      await submitReview(formData).unwrap();

      toast.success("Review submitted successfully!");

      // Reset form
      setRating(0);
      setTitle("");
      setComment("");
      setImages([]);
      setPreviews([]);

      onClose();
    } catch (err: any) {
      // Error handled by useApiError
    }
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">
              Your Review
            </label>
            <textarea
              className="w-full min-h-[120px] p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/10 transition-all text-sm text-gray-700 resize-none"
              placeholder="What did you like or dislike? How was the quality?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        {/* Image Upload System */}
        <div className="flex flex-col gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 group hover:border-brand-gold/30 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-brand-gold group-hover:bg-brand-gold/5 transition-colors">
              <Icon name="photo_camera" size="sm" />
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-bold text-gray-900">Add Photos</span>
              <span className="text-xs text-gray-400">Drag & drop or click to upload (up to 5)</span>
            </div>
          </div>

          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {previews.map((preview, index) => (
                <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden group border border-gray-100">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-900   opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-gold hover:text-white"
                  >
                    <Icon name="close" size="xs" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-row justify-end sm:flex-row gap-3 mt-4">
          <Button
            shape="rounded-sm"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            shape="rounded-sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Submit Review
          </Button>
        </div>
      </div>
    </Modal>
  );
};
