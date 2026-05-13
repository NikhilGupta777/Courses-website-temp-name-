"use client";

import { useState } from "react";

const payouts = [
  { id: "p-01", period: "Apr 1 – Apr 30, 2026", amount: 62300, status: "Completed", date: "May 7, 2026", txId: "TXN-20260507-4821" },
  { id: "p-02", period: "Mar 1 – Mar 31, 2026", amount: 48900, status: "Completed", date: "Apr 7, 2026", txId: "TXN-20260407-3291" },
  { id: "p-03", period: "Feb 1 – Feb 28, 2026", amount: 41200, status: "Completed", date: "Mar 7, 2026", txId: "TXN-20260307-2654" },
  { id: "p-04", period: "May 1 – May 31, 2026", amount: 71400, status: "Pending", date: "Jun 7, 2026", txId: "—" },
];

const statusStyle: Record<string, string> = {
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
};

export default function PayoutsPage() {
  const [requestSent, setRequestSent] = useState(false);
  const totalEarned = payouts.filter((p) => p.status === "Completed").reduce((a, b) => a + b.amount, 0);
  const pending = payouts.filter((p) => p.status === "Pending").reduce((a, b) => a + b.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payouts</h1>
          <p className="text-gray-500 mt-1">You earn 70% of every course sale. Payouts on the 7th of every month.</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Earned (All Time)", value: `₹${totalEarned.toLocaleString("en-IN")}`, sub: "70% revenue share", color: "from-violet-50 to-indigo-50 border-violet-100" },
            { label: "Pending Payout", value: `₹${pending.toLocaleString("en-IN")}`, sub: "Due Jun 7, 2026", color: "from-yellow-50 to-amber-50 border-yellow-100" },
            { label: "Bank Account", value: "HDFC ••••4821", sub: "Connected via Razorpay", color: "from-green-50 to-emerald-50 border-green-100" },
          ].map((s) => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 border`}>
              <div className="text-xs text-gray-500 mb-1">{s.label}</div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Request payout */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900">Request Early Payout</h3>
            <p className="text-sm text-gray-500 mt-0.5">Minimum balance of ₹5,000 required. Processed within 3 business days.</p>
          </div>
          {requestSent ? (
            <div className="flex items-center gap-2 text-green-600 font-semibold text-sm bg-green-50 px-5 py-2.5 rounded-xl">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Request Submitted
            </div>
          ) : (
            <button onClick={() => setRequestSent(true)}
              className="flex-shrink-0 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md text-sm">
              Request Payout — ₹{pending.toLocaleString("en-IN")}
            </button>
          )}
        </div>

        {/* Payout history */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Payout History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Period", "Amount", "Status", "Payout Date", "Transaction ID"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-700">{p.period}</td>
                    <td className="px-5 py-4 text-sm font-bold text-gray-900">₹{p.amount.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{p.date}</td>
                    <td className="px-5 py-4 text-xs text-gray-400 font-mono">{p.txId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tax info */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-amber-800 text-sm">Tax Deduction at Source (TDS)</h4>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">TDS at 10% is deducted from payouts as per Indian income tax rules. A Form 16A will be issued quarterly. Please ensure your PAN is updated in your tax profile.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
