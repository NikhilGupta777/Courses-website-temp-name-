"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";

const roleColors: Record<string, string> = {
  STUDENT: "bg-blue-100 text-blue-700",
  INSTRUCTOR: "bg-violet-100 text-violet-700",
  ADMIN: "bg-red-100 text-red-700",
};

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | "STUDENT" | "INSTRUCTOR" | "ADMIN">("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const { data, isLoading } = useQuery(trpc.admin.getUsers.queryOptions({
    page,
    search: search.trim() || undefined,
    role: roleFilter || undefined,
  }));

  const updateUser = useMutation(trpc.admin.updateUser.mutationOptions({
    onSuccess: () => queryClient.invalidateQueries(trpc.admin.getUsers.queryOptions({ page, search: search.trim() || undefined, role: roleFilter || undefined })),
  }));

  const users = data?.users ?? [];

  const toggleSelect = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500">{data?.total ?? 0} total users</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="flex gap-2">
            {(["", "STUDENT", "INSTRUCTOR", "ADMIN"] as const).map((r) => (
              <button key={r || "All"} onClick={() => { setRoleFilter(r); setPage(1); }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${roleFilter === r ? "bg-violet-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                {r || "All"}
              </button>
            ))}
          </div>
        </div>

        {selected.length > 0 && (
          <div className="mb-4 flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-2.5">
            <span className="text-sm font-semibold text-violet-700">{selected.length} selected</span>
            <button onClick={() => {
              selected.forEach(id => updateUser.mutate({ id, isActive: false }));
              setSelected([]);
            }} className="text-xs font-medium text-red-600 hover:underline">Suspend</button>
            <button onClick={() => setSelected([])} className="ml-auto text-xs text-gray-400 hover:text-gray-600">Clear</button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input type="checkbox"
                      onChange={(e) => setSelected(e.target.checked ? users.map(u => u.id) : [])}
                      className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                  </th>
                  {["User", "Role", "Courses", "Joined", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array.from({length: 5}).map((_,i) => (
                    <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-6 bg-gray-100 rounded animate-pulse" /></td></tr>
                  ))
                ) : users.map((user) => (
                  <tr key={user.id} className={`hover:bg-gray-50/50 transition-colors ${selected.includes(user.id) ? "bg-violet-50/30" : ""}`}>
                    <td className="px-4 py-3.5">
                      <input type="checkbox" checked={selected.includes(user.id)} onChange={() => toggleSelect(user.id)}
                        className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {user.name?.charAt(0) ?? "?"}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${roleColors[user.role] ?? "bg-gray-100 text-gray-500"}`}>{user.role}</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{user._count.enrollments}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {user.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateUser.mutate({ id: user.id, isActive: !user.isActive })}
                          className={`text-xs hover:underline font-medium ${user.isActive ? "text-red-500" : "text-green-600"}`}>
                          {user.isActive ? "Suspend" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Showing {users.length} of {data?.total ?? 0} users</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-xs">Prev</button>
              <button onClick={() => setPage(p => Math.min(data?.pages ?? 1, p+1))} disabled={page === (data?.pages ?? 1)}
                className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
