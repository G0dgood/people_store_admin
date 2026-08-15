"use client";

import React, { useState, useEffect } from "react";
import Drawer from "../Drawer/Drawer";
import { Textarea } from "../Form/Inputs";
import { Button } from "../Button";
import { Icon } from "../Icon";

import { useReplyToReviewMutation } from "@/lib/redux/services/reviewApi";
import { toast } from "sonner";

interface ReviewReplyDrawerProps {
   isOpen: boolean;
   onClose: () => void;
   review: any;
}

export function ReviewReplyDrawer({ isOpen, onClose, review }: ReviewReplyDrawerProps) {
   const [reply, setReply] = useState("");
   const [replyToReview, { isLoading }] = useReplyToReviewMutation();

   // Load any existing reply so the admin sees what was already published
   // and can edit it, instead of always starting from a blank box.
   const existingReply = review?.reply?.comment || "";
   useEffect(() => {
      setReply(existingReply);
   }, [review?._id, existingReply]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         await replyToReview({ id: review._id, comment: reply }).unwrap();
         toast.success(existingReply ? "Reply updated successfully" : "Reply published successfully");
         onClose();
      } catch (error) {
         toast.error("Failed to publish reply");
         console.error(error);
      }
   };

   if (!review) return null;

   return (
      <Drawer isOpen={isOpen} onClose={onClose} title="Reply to Review">
         <div className="flex flex-col h-full gap-8">
            {/* Review Context */}
            <div className="flex flex-col gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-200">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white  ">
                     <img src={review.customer?.avatar || "/dashboardImage/Fashion.png"} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-sm font-black text-[#121212]">{review.customer?.fullName}</span>
                     <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                           <Icon key={star} name="star" folder="dashboardIcon" size="xs" className={star <= review.rating ? "text-amber-400" : "text-gray-200"} />
                        ))}
                     </div>
                  </div>
               </div>
               <p className="text-[12px] font-bold text-gray-500 italic leading-relaxed">
                  "{review.comment}"
               </p>
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Admin Response</label>
                  <Textarea
                     placeholder="Write your response to the customer..."
                     value={reply}
                     onChange={(e) => setReply(e.target.value)}
                     className="min-h-[200px]"
                     required
                  />
               </div>

               <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-3">
                  <Button
                     variant="primary"
                     type="submit"
                     disabled={isLoading}
                     className="w-full h-10 sm:h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
                  >
                     {isLoading ? "Publishing..." : existingReply ? "Update Reply" : "Publish Reply"}
                  </Button>
                  <Button variant="ghost" type="button" onClick={onClose} className="w-full h-10 sm:h-12 text-[11px] font-bold text-gray-400">
                     Cancel
                  </Button>
               </div>
            </form>
         </div>
      </Drawer>
   );
}
