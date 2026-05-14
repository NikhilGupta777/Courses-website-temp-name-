"use client";

/**
 * EnrollButton — handles both free-course enrollment and paid-course checkout.
 *
 * BUG #4 FIX: Paid courses were linking to /register?plan=pro (wrong).
 * BUG #5 FIX: Free courses were linking directly to the player without calling
 *             enrollment.enrollFree — so if not already enrolled the player
 *             returned "Not enrolled" error.
 *
 * This component:
 *  - Free course: calls enrollment.enrollFree mutation → redirects to player
 *  - Paid course: calls payment.createCourseCheckout mutation → redirects to Stripe
 *  - Shows loading/error states
 *  - If user not logged in: redirects to /login?callbackUrl=...
 */

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";
import { useState } from "react";

interface EnrollButtonProps {
  courseId: string;
  courseSlug: string;
  isFree: boolean;
  price?: number | null;
  className?: string;
  label?: string;
}

export function EnrollButton({
  courseId,
  courseSlug,
  isFree,
  price,
  className,
  label,
}: EnrollButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ── Free enroll mutation ────────────────────────────────────────────────
  const enrollFree = useMutation(trpc.enrollment.enrollFree.mutationOptions({
    onSuccess: () => {
      router.push(`/dashboard/courses/${courseId}/learn`);
    },
    onError: (err) => {
      setErrorMsg(err.message ?? "Enrollment failed. Please try again.");
    },
  }));

  // ── Paid checkout mutation ──────────────────────────────────────────────
  const createCheckout = useMutation(trpc.payment.createCourseCheckout.mutationOptions({
    onSuccess: (data) => {
      window.location.assign(data.checkoutUrl);
    },
    onError: (err) => {
      setErrorMsg(err.message ?? "Could not start checkout. Please try again.");
    },
  }));

  const isPending = enrollFree.isPending || createCheckout.isPending;

  const handleClick = () => {
    setErrorMsg(null);

    // Not logged in → go to login with callback
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/courses/${courseSlug}`);
      return;
    }

    if (isFree) {
      enrollFree.mutate({ courseId });
    } else {
      createCheckout.mutate({ courseId });
    }
  };

  const defaultLabel = isFree
    ? "Enroll Free — Start Now"
    : `Buy Now — ₹${(price ?? 0).toLocaleString("en-IN")}`;

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        disabled={isPending || status === "loading"}
        className={className ?? (
          isFree
            ? "block w-full text-center py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow-lg disabled:opacity-60"
            : "block w-full text-center py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-60"
        )}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {isFree ? "Enrolling…" : "Starting checkout…"}
          </span>
        ) : (
          label ?? defaultLabel
        )}
      </button>
      {errorMsg && (
        <p className="mt-2 text-xs text-red-500 text-center">{errorMsg}</p>
      )}
    </div>
  );
}
