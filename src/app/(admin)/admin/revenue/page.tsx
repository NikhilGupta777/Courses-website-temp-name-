"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";

export default function AdminRevenuePage() {
  const { data, isLoading } = useQuery(trpc.admin.getRevenue.queryOptions());

  const mrr = data?.mrr ?? 0;
  const totalRevenue = data?.totalRevenue ?? 0;
  const paymentsByMonth = data?.paymentsByMonth ?? [];
  const planBreakdown = data?.planBreakdown ?? [];
  const maxMonthRevenue = Math.max(...paymentsByMonth.map(p => p.revenue), 1);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Revenue Dashboard</h1>
            <p className="text-sm text-gray-500">All figures in Indian Rupees (₹) · GST inclusive</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Revenue", value: isLoading ? "—" : `₹${totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, up: true },
            { label: "Latest Month", value: isLoading ? "—" : `₹${mrr.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, up: true },
            { label: "Monthly Data Points", value: isLoading ? "—" : paymentsByMonth.length.toString(), up: true },
            { label: "Plan Types", value: isLoading ? "—" : planBreakdown.length.toString(), up: true },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">{s.label}</div>
              <div className="text-xl font-bold text-gray-900">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-6">Monthly Revenue</h2>
            {paymentsByMonth.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No revenue data yet</div>
            ) : (
              <div className="flex items-end gap-3 h-48">
                {paymentsByMonth.slice(-6).map((d) => {
                  const height = Math.round((d.revenue / maxMonthRevenue) * 100);
                  return (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="text-xs text-gray-500 font-medium">₹{Math.round(d.revenue / 1000)}k</div>
                      <div className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-indigo-500" style={{ height: `${Math.max(height, 5)}%` }} />
                      <div className="text-xs text-gray-400">{d.month.slice(0, 7)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-6">Subscriptions by Plan</h2>
            {planBreakdown.length === 0 ? (
              <div className="text-gray-400 text-sm text-center py-8">No subscription data</div>
            ) : (
              <div className="space-y-4">
                {planBreakdown.map((p) => {
                  const total = planBreakdown.reduce((sum, x) => sum + x.count, 0);
                  const pct = total > 0 ? Math.round((p.count / total) * 100) : 0;
                  return (
                    <div key={p.plan}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">{p.plan.replace(/_/g, " ")}</span>
                        <span className="font-bold text-gray-900">{pct}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2.5 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{p.count} subscribers</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Month-by-Month Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Month", "Revenue"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array.from({length:6}).map((_,i) => <tr key={i}><td colSpan={2} className="px-5 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
                ) : paymentsByMonth.length === 0 ? (
                  <tr><td colSpan={2} className="px-5 py-8 text-center text-gray-400 text-sm">No payment data available</td></tr>
                ) : paymentsByMonth.map((row) => (
                  <tr key={row.month} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{row.month}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-violet-700">₹{row.revenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
