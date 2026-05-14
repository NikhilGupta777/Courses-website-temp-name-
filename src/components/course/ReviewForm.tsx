"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";

interface ReviewFormProps {
  courseId: string;
}

export function ReviewForm({ courseId }: ReviewFormProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const createReview = useMutation(trpc.review.create.mutationOptions({
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries(trpc.review.getByCourse.queryOptions({ courseId }));
    },
  }));

  if (!session?.user) return null;
  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 font-medium">
        ✓ Thank you for your review!
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
      <div className="flex items-center gap-1 mb-4">
        {[1,2,3,4,5].map((star) => (
          <button key={star}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(star)}
            className="focus:outline-none">
            <svg className={`w-8 h-8 transition-colors ${(hover || rating) >= star ? "text-yellow-400 fill-current" : "text-gray-200 fill-current"}`} viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        {rating > 0 && <span className="ml-2 text-sm text-gray-500">{rating}/5</span>}
      </div>
      <div className="space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Review title (optional)"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Share your experience with this course..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
        />
        <button
          onClick={() => createReview.mutate({ courseId, rating, title: title || undefined, comment: comment || undefined })}
          disabled={rating === 0 || createReview.isPending}
          className="px-6 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 text-sm">
          {createReview.isPending ? "Submitting..." : "Submit Review"}
        </button>
        {createReview.isError && (
          <p className="text-sm text-red-500">Failed to submit. You may have already reviewed this course.</p>
        )}
      </div>
    </div>
  );
}
