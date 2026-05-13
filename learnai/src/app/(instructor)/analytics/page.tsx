import Link from "next/link";

const monthlyData = [
  { month: "Dec", students: 320, revenue: 63800 },
  { month: "Jan", students: 480, revenue: 95800 },
  { month: "Feb", students: 610, revenue: 121700 },
  { month: "Mar", students: 720, revenue: 143700 },
  { month: "Apr", students: 890, revenue: 177600 },
  { month: "May", students: 1040, revenue: 207500 },
];

const topCourses = [
  { title: "ChatGPT Complete Mastery", students: 14200, revenue: 283900, rating: 4.9, completionRate: 72 },
  { title: "AI Automation & Workflows", students: 8100, revenue: 202500, rating: 4.8, completionRate: 68 },
];

const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/studio" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-500">Last 6 months performance</p>
          </div>
          <div className="ml-auto">
            <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>This year</option>
            </select>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Students", value: "22,300", change: "+18%", up: true },
            { label: "Total Revenue", value: "₹4,84,800", change: "+24%", up: true },
            { label: "Avg Completion Rate", value: "70%", change: "+5%", up: true },
            { label: "Avg Rating", value: "4.85", change: "+0.1", up: true },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">{s.label}</div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className={`text-xs font-semibold mt-1 flex items-center gap-1 ${s.up ? "text-green-600" : "text-red-500"}`}>
                <svg className={`w-3 h-3 ${s.up ? "" : "rotate-180"}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                {s.change} vs prev period
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-6">Monthly Revenue (₹)</h2>
            <div className="flex items-end gap-3 h-48">
              {monthlyData.map((d) => {
                const height = Math.round((d.revenue / maxRevenue) * 100);
                return (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="text-xs text-gray-500 font-medium">
                      ₹{Math.round(d.revenue / 1000)}k
                    </div>
                    <div className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-indigo-500 transition-all hover:from-violet-700 hover:to-indigo-600"
                      style={{ height: `${height}%` }} />
                    <div className="text-xs text-gray-400">{d.month}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Students Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-6">New Enrollments</h2>
            <div className="space-y-3">
              {monthlyData.map((d) => {
                const maxStudents = Math.max(...monthlyData.map((x) => x.students));
                const w = Math.round((d.students / maxStudents) * 100);
                return (
                  <div key={d.month}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500 w-8">{d.month}</span>
                      <span className="font-semibold text-gray-900">{d.students}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 rounded-full" style={{ width: `${w}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top courses table */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Course Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Course", "Students", "Revenue", "Rating", "Completion", "Action"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topCourses.map((c) => (
                  <tr key={c.title} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-sm text-gray-900">{c.title}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{c.students.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">₹{c.revenue.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4 text-sm text-yellow-600 font-semibold">★ {c.rating}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${c.completionRate}%` }} />
                        </div>
                        <span className="text-xs text-gray-600">{c.completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Link href="/studio" className="text-sm text-violet-600 hover:underline font-medium">Edit</Link>
                    </td>
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
