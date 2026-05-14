"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";

const statusStyle: Record<string, string> = {
  completed:  "bg-green-100 text-green-700",
  pending:    "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  failed:     "bg-red-100 text-red-600",
};

export default function PayoutsPage() {
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: payouts, isLoading } = useQuery(trpc.instructor.getPayouts.queryOptions());
  const { data: analytics }          = useQuery(trpc.instructor.getAnalytics.queryOptions());

  // BUG #2 FIX: wire the real requestPayout mutation
  const requestPayout = useMutation(trpc.instructor.requestPayout.mutationOptions({
    onSuccess: () => {
      setRequestSent(true);
      setRequestError(null);
      queryClient.invalidateQueries(trpc.instructor.getPayouts.queryOptions());
    },
    onError: (err) => {
      setRequestError(err.message ?? "Request failed. Please try again.");
    },
  }));

  const payoutList = payouts ?? [];
  const totalEarned = payoutList
    .filter((p) => p.status === "completed")
    .reduce((a, b) => a + b.amount, 0);
  const pending = payoutList
    .filter((p) => p.status === "pending")
    .reduce((a, b) => a + b.amount, 0);

  // Use real revenue from analytics as a fallback display when no payouts exist
  const displayRevenue = totalEarned > 0 ? totalEarned : (analytics?.totalRevenue ?? 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/studio" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payouts</h1>
            <p className="text-gray-500 mt-1">You earn 70% of every course sale. Payouts on the 7th of every month.</p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-5">
            <div className="text-xs text-gray-500 mb-1">Total Earned (All Time)</div>
            {isLoading ? (
              <div className="h-7 w-28 bg-violet-100 rounded animate-pulse mt-1" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">₹{displayRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
            )}
            <div className="text-xs text-gray-500 mt-1">70% revenue share</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-100 rounded-2xl p-5">
            <div className="text-xs text-gray-500 mb-1">Pending Payout</div>
            {isLoading ? (
              <div className="h-7 w-20 bg-yellow-100 rounded animate-pulse mt-1" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">₹{pending.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</div>
            )}
            <div className="text-xs text-gray-500 mt-1">Due on 7th of next month</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5">
            <div className="text-xs text-gray-500 mb-1">Total Students</div>
            {isLoading ? (
              <div className="h-7 w-16 bg-green-100 rounded animate-pulse mt-1" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">{(analytics?.totalStudents ?? 0).toLocaleString("en-IN")}</div>
            )}
            <div className="text-xs text-gray-500 mt-1">Across all courses</div>
          </div>
        </div>

        {/* Request early payout */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900">Request Early Payout</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Minimum balance of ₹5,000 required. Processed within 3 business days.
            </p>
          </div>
          {requestSent ? (
            <div className="flex items-center gap-2 text-green-600 font-semibold text-sm bg-green-50 px-5 py-2.5 rounded-xl">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Request Submitted
            </div>
          ) : (
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => {
                  setRequestError(null);
                  requestPayout.mutate({ amount: pending });
                }}
                disabled={pending < 5000 || requestPayout.isPending}
                className="flex-shrink-0 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {requestPayout.isPending
                  ? "Submitting…"
                  : pending >= 5000
                  ? `Request Payout — ₹${pending.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
                  : "Minimum ₹5,000 required"}
              </button>
              {requestError && <p className="text-xs text-red-500">{requestError}</p>}
            </div>
          )}
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Payout History</h2>
          </div>
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : payoutList.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">No payouts yet.</p>
              <p className="text-xs text-gray-400 mt-1">Your first payout will appear here once processed.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Period", "Amount", "Currency", "Status", "Payout Date"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {payoutList.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4 text-sm text-gray-700">
                        {new Date(p.periodStart).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        {" – "}
                        {new Date(p.periodEnd).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-900">
                        ₹{p.amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500 uppercase">{p.currency}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle[p.status.toLowerCase()] ?? "bg-gray-100 text-gray-600"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* TDS notice */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-amber-800 text-sm">Tax Deduction at Source (TDS)</h4>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              TDS at 10% is deducted from payouts as per Indian income tax rules. A Form 16A will be issued quarterly.
              Please ensure your PAN is updated in your tax profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
