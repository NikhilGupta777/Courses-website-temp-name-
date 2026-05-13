import Link from "next/link";

const monthlyRevenue = [
  { month: "Dec 25", mrr: 3240000, newSubs: 1820, churn: 140, net: 1680 },
  { month: "Jan 26", mrr: 4120000, newSubs: 2210, churn: 180, net: 2030 },
  { month: "Feb 26", mrr: 5480000, newSubs: 2890, churn: 200, net: 2690 },
  { month: "Mar 26", mrr: 6740000, newSubs: 3210, churn: 220, net: 2990 },
  { month: "Apr 26", mrr: 7920000, newSubs: 3780, churn: 260, net: 3520 },
  { month: "May 26", mrr: 8920080, newSubs: 4120, churn: 290, net: 3830 },
];

const planBreakdown = [
  { plan: "Pro Monthly (₹999)", subscribers: 6840, revenue: 6833160, pct: 77 },
  { plan: "Pro Annual (₹8,999)", subscribers: 1420, revenue: 1279858, pct: 14 },
  { plan: "Enterprise (Custom)", subscribers: 22, revenue: 807062, pct: 9 },
];

const maxMRR = Math.max(...monthlyRevenue.map((r) => r.mrr));

export default function AdminRevenuePage() {
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
          <button className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
            Export Report
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "MRR (May 2026)", value: "₹89,20,080", delta: "+₹10,00,000", up: true },
            { label: "ARR (Run Rate)", value: "₹10.7 Cr", delta: "+18% YoY", up: true },
            { label: "Avg Revenue / User", value: "₹999", delta: "Stable", up: true },
            { label: "Churn Rate", value: "3.2%", delta: "-0.4%", up: true },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">{s.label}</div>
              <div className="text-xl font-bold text-gray-900">{s.value}</div>
              <div className={`text-xs font-medium mt-1 ${s.up ? "text-green-600" : "text-red-500"}`}>{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* MRR Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-6">Monthly Recurring Revenue</h2>
            <div className="flex items-end gap-3 h-48">
              {monthlyRevenue.map((d) => {
                const height = Math.round((d.mrr / maxMRR) * 100);
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="text-xs text-gray-500 font-medium">₹{Math.round(d.mrr / 100000)}L</div>
                    <div className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-indigo-500"
                      style={{ height: `${height}%` }} />
                    <div className="text-xs text-gray-400">{d.month}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plan Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-6">Revenue by Plan</h2>
            <div className="space-y-4">
              {planBreakdown.map((p) => (
                <div key={p.plan}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700 truncate pr-2">{p.plan}</span>
                    <span className="font-bold text-gray-900 flex-shrink-0">{p.pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2.5 rounded-full" style={{ width: `${p.pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{p.subscribers.toLocaleString("en-IN")} subscribers</span>
                    <span>₹{p.revenue.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Detail Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Month-by-Month Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Month", "MRR", "New Subscriptions", "Churn", "Net Growth"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {monthlyRevenue.map((row) => (
                  <tr key={row.month} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{row.month}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-violet-700">₹{row.mrr.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3.5 text-sm text-green-700 font-medium">+{row.newSubs.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-sm text-red-500">-{row.churn}</td>
                    <td className="px-5 py-3.5 text-sm font-bold text-gray-900">+{row.net.toLocaleString()}</td>
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
