"use client";

import { useState } from "react";
import Link from "next/link";

const mockUsers = [
  { id: "u-001", name: "Ankit Verma", email: "ankit@example.com", role: "STUDENT", plan: "Pro", joined: "Jan 15, 2026", courses: 3, status: "Active" },
  { id: "u-002", name: "Divya Nair", email: "divya@example.com", role: "STUDENT", plan: "Free", joined: "Feb 2, 2026", courses: 1, status: "Active" },
  { id: "u-003", name: "Rahul Mehta", email: "rahul@example.com", role: "INSTRUCTOR", plan: "Pro", joined: "Dec 1, 2025", courses: 4, status: "Active" },
  { id: "u-004", name: "Sneha Reddy", email: "sneha@example.com", role: "INSTRUCTOR", plan: "Pro", joined: "Dec 5, 2025", courses: 2, status: "Active" },
  { id: "u-005", name: "Priya Sharma", email: "priya@example.com", role: "INSTRUCTOR", plan: "Pro", joined: "Dec 5, 2025", courses: 3, status: "Active" },
  { id: "u-006", name: "Rohit Gupta", email: "rohit@example.com", role: "STUDENT", plan: "Pro Annual", joined: "Mar 10, 2026", courses: 5, status: "Active" },
  { id: "u-007", name: "Meera Patel", email: "meera@example.com", role: "STUDENT", plan: "Free", joined: "Apr 20, 2026", courses: 1, status: "Suspended" },
  { id: "u-008", name: "Arjun Singh", email: "arjun@example.com", role: "INSTRUCTOR", plan: "Pro", joined: "Dec 1, 2025", courses: 3, status: "Active" },
];

const roleColors: Record<string, string> = {
  STUDENT: "bg-blue-100 text-blue-700",
  INSTRUCTOR: "bg-violet-100 text-violet-700",
  ADMIN: "bg-red-100 text-red-700",
};
const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Suspended: "bg-red-100 text-red-600",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleSelect = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500">{mockUsers.length} total users</p>
          </div>
          <button className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="flex gap-2">
            {["All", "STUDENT", "INSTRUCTOR", "ADMIN"].map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${roleFilter === r ? "bg-violet-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk actions */}
        {selected.length > 0 && (
          <div className="mb-4 flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-2.5">
            <span className="text-sm font-semibold text-violet-700">{selected.length} selected</span>
            <button className="text-xs font-medium text-red-600 hover:underline">Suspend</button>
            <button className="text-xs font-medium text-gray-500 hover:underline">Export</button>
            <button onClick={() => setSelected([])} className="ml-auto text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input type="checkbox"
                      onChange={(e) => setSelected(e.target.checked ? filtered.map((u) => u.id) : [])}
                      className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                  </th>
                  {["User", "Role", "Plan", "Courses", "Joined", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => (
                  <tr key={user.id} className={`hover:bg-gray-50/50 transition-colors ${selected.includes(user.id) ? "bg-violet-50/30" : ""}`}>
                    <td className="px-4 py-3.5">
                      <input type="checkbox" checked={selected.includes(user.id)} onChange={() => toggleSelect(user.id)}
                        className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${roleColors[user.role]}`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{user.plan}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{user.courses}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">{user.joined}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[user.status]}`}>{user.status}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button className="text-xs text-violet-600 hover:underline font-medium">Edit</button>
                        <button className="text-xs text-red-500 hover:underline font-medium">
                          {user.status === "Active" ? "Suspend" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Showing {filtered.length} of {mockUsers.length} users</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-xs" disabled>Prev</button>
              <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
