"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin",          label: "Overview" },
  { href: "/admin/users",    label: "Users" },
  { href: "/admin/courses",  label: "Courses" },
  { href: "/admin/revenue",  label: "Revenue" },
  { href: "/admin/coupons",  label: "Coupons" },
];

interface CouponForm {
  code:          string;
  description:   string;
  discountType:  "percentage" | "fixed";
  discountValue: string;
  maxUses:       string;
  validUntil:    string;
  courseId:      string;
}

const DEFAULT_FORM: CouponForm = {
  code:          "",
  description:   "",
  discountType:  "percentage",
  discountValue: "",
  maxUses:       "",
  validUntil:    "",
  courseId:      "",
};

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "LEARNAI-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CouponForm>(DEFAULT_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const { data, isLoading } = useQuery(trpc.coupon.getAll.queryOptions());

  const createMutation = useMutation(
    trpc.coupon.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.coupon.getAll.queryOptions());
        setShowModal(false);
        setForm(DEFAULT_FORM);
        setFormError(null);
      },
      onError: (err) => setFormError(err.message ?? "Failed to create coupon"),
    })
  );

  const toggleMutation = useMutation(
    trpc.coupon.toggle.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries(trpc.coupon.getAll.queryOptions()),
    })
  );

  const deleteMutation = useMutation(
    trpc.coupon.delete.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries(trpc.coupon.getAll.queryOptions()),
      onError: (err) => alert(err.message ?? "Delete failed"),
    })
  );

  const handleCreate = () => {
    setFormError(null);
    if (!form.code.trim()) { setFormError("Coupon code is required"); return; }
    if (!form.discountValue || Number(form.discountValue) <= 0) { setFormError("Discount value must be positive"); return; }

    createMutation.mutate({
      code:          form.code.trim().toUpperCase(),
      description:   form.description || undefined,
      discountType:  form.discountType,
      discountValue: Number(form.discountValue),
      maxUses:       form.maxUses ? Number(form.maxUses) : undefined,
      validUntil:    form.validUntil || undefined,
      courseId:      form.courseId || undefined,
    });
  };

  const coupons = data?.coupons ?? [];
  const stats   = data?.stats;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-200 min-h-screen pt-6 px-3 flex-shrink-0">
          <div className="mb-6 px-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-sm">Admin Panel</span>
            </div>
          </div>
          <nav className="space-y-1">
            {adminNav.map((item) => (
              <Link key={item.href} href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  item.href === "/admin/coupons"
                    ? "bg-violet-50 text-violet-700"
                    : "text-gray-600 hover:bg-violet-50 hover:text-violet-700"
                )}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pb-6 px-3">
            <Link href="/" className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">← Back to Site</Link>
          </div>
        </aside>

        <main className="flex-1 p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Coupon Management</h1>
              <p className="text-sm text-gray-500 mt-1">Create and manage discount codes</p>
            </div>
            <button
              onClick={() => { setShowModal(true); setForm(DEFAULT_FORM); setFormError(null); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Coupon
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Coupons",     value: stats?.totalCoupons ?? 0,      color: "bg-violet-50 text-violet-600" },
              { label: "Active Coupons",    value: stats?.activeCoupons ?? 0,     color: "bg-green-50 text-green-600" },
              { label: "Total Redemptions", value: stats?.totalRedemptions ?? 0,  color: "bg-amber-50 text-amber-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="text-2xl font-bold text-gray-900">{isLoading ? "—" : s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">All Coupons</h2>
            </div>

            {coupons.length === 0 && !isLoading ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-700 mb-1">No coupons yet</h3>
                <p className="text-sm text-gray-400">Create your first discount code to boost enrollments.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Code", "Description", "Discount", "Used / Max", "Expiry", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {isLoading
                      ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                      : coupons.map((coupon) => {
                          const isExpired = coupon.validUntil && new Date(coupon.validUntil) < new Date();
                          const isMaxed   = coupon.maxUses !== null && coupon.currentUses >= coupon.maxUses;
                          return (
                            <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-5 py-4">
                                <span className="font-mono text-sm font-bold text-gray-900">{coupon.code}</span>
                              </td>
                              <td className="px-5 py-4 text-sm text-gray-500 max-w-xs truncate">
                                {coupon.description ?? "—"}
                                {coupon.course && <div className="text-xs text-violet-600 mt-0.5">Course: {coupon.course.title}</div>}
                              </td>
                              <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                                {coupon.discountType === "percentage"
                                  ? `${coupon.discountValue}%`
                                  : `₹${coupon.discountValue}`}
                              </td>
                              <td className="px-5 py-4 text-sm text-gray-600">
                                {coupon.currentUses} / {coupon.maxUses ?? "∞"}
                              </td>
                              <td className="px-5 py-4 text-sm text-gray-500">
                                {coupon.validUntil
                                  ? new Date(coupon.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                  : "No expiry"}
                              </td>
                              <td className="px-5 py-4">
                                <span className={cn(
                                  "px-2.5 py-1 rounded-full text-xs font-semibold",
                                  !coupon.isActive || isExpired || isMaxed
                                    ? "bg-gray-100 text-gray-500"
                                    : "bg-green-50 text-green-700"
                                )}>
                                  {!coupon.isActive ? "Inactive" : isExpired ? "Expired" : isMaxed ? "Maxed" : "Active"}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => toggleMutation.mutate({ id: coupon.id })}
                                    disabled={toggleMutation.isPending}
                                    className={cn(
                                      "px-3 py-1 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50",
                                      coupon.isActive
                                        ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                                        : "text-green-600 bg-green-50 hover:bg-green-100"
                                    )}
                                  >
                                    {coupon.isActive ? "Disable" : "Enable"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Delete coupon "${coupon.code}"?`)) {
                                        deleteMutation.mutate({ id: coupon.id });
                                      }
                                    }}
                                    disabled={deleteMutation.isPending}
                                    className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Create Coupon</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Coupon Code *</label>
                <div className="flex gap-2">
                  <input
                    value={form.code}
                    onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. SAVE20"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <button
                    onClick={() => setForm((f) => ({ ...f, code: generateCode() }))}
                    className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Auto
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="e.g. 20% off for new students"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Discount Type + Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Type *</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value as "percentage" | "fixed" }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Value * {form.discountType === "percentage" ? "(%)" : "(₹)"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={form.discountType === "percentage" ? 100 : undefined}
                    value={form.discountValue}
                    onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
                    placeholder={form.discountType === "percentage" ? "20" : "500"}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              {/* Max Uses + Expiry */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Uses (optional)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.maxUses}
                    onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
                    placeholder="Unlimited"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date (optional)</label>
                  <input
                    type="date"
                    value={form.validUntil}
                    onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {formError}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl text-sm hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-60"
              >
                {createMutation.isPending ? "Creating…" : "Create Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
