"use client";

import { useState } from "react";
import Link from "next/link";

const TABS = ["Profile", "Account", "Billing", "Notifications"] as const;
type Tab = typeof TABS[number];

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  bio: string;
  headline: string;
  linkedin: string;
  github: string;
}

const PROFILE_FIELDS: Array<{ label: string; key: keyof ProfileForm; type: string }> = [
  { label: "Full Name", key: "name", type: "text" },
  { label: "Email", key: "email", type: "email" },
  { label: "Phone Number", key: "phone", type: "tel" },
  { label: "Professional Headline", key: "headline", type: "text" },
  { label: "LinkedIn URL", key: "linkedin", type: "url" },
  { label: "GitHub URL", key: "github", type: "url" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<ProfileForm>({
    name: "Ankit Verma",
    email: "ankit@example.com",
    phone: "+91 98765 43210",
    bio: "Software developer learning AI to build smarter products.",
    headline: "Full-Stack Developer | AI Enthusiast",
    linkedin: "linkedin.com/in/ankitverma",
    github: "github.com/ankitverma",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-sm text-gray-500">Manage your profile and preferences</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1.5 mb-8 w-fit">
          {TABS.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === t ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* ── Profile Tab ── */}
          {activeTab === "Profile" && (
            <div className="p-8">
              {/* Avatar */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {profile.name.charAt(0)}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center text-white hover:bg-violet-700 transition-colors shadow">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{profile.name}</div>
                  <div className="text-sm text-gray-500">{profile.email}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">✦ Pro Plan</span>
                    <span className="text-xs text-gray-400">Member since Jan 2026</span>
                  </div>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {PROFILE_FIELDS.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                    <input type={field.type} value={profile[field.key]}
                      onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                  <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button onClick={handleSave}
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md text-sm">
                  Save Changes
                </button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Saved!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ── Account Tab ── */}
          {activeTab === "Account" && (
            <div className="p-8 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Change Password</h3>
                <p className="text-sm text-gray-500 mb-4">Last changed 30 days ago</p>
                <div className="space-y-3 max-w-md">
                  {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                    <div key={label}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input type="password" placeholder="••••••••"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                    </div>
                  ))}
                  <button className="px-5 py-2.5 bg-violet-600 text-white font-semibold rounded-xl text-sm hover:bg-violet-700 transition-colors">Update Password</button>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-red-600 mb-1">Danger Zone</h3>
                <p className="text-sm text-gray-500 mb-4">Once deleted, your account cannot be recovered.</p>
                <button className="px-5 py-2.5 border-2 border-red-200 text-red-600 font-semibold rounded-xl text-sm hover:bg-red-50 transition-colors">Delete My Account</button>
              </div>
            </div>
          )}

          {/* ── Billing Tab ── */}
          {activeTab === "Billing" && (
            <div className="p-8 space-y-6">
              <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl p-5 border border-violet-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900">Pro Plan — Monthly</div>
                    <div className="text-sm text-gray-600 mt-0.5">₹999 / month · Renews June 15, 2026</div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <Link href="/pricing" className="px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors">Upgrade to Annual (Save ₹2,989)</Link>
                  <button className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors">Cancel Plan</button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Payment History</h3>
                <div className="space-y-2">
                  {[
                    { date: "May 15, 2026", desc: "Pro Monthly — May", amount: "₹999", status: "Paid" },
                    { date: "Apr 15, 2026", desc: "Pro Monthly — April", amount: "₹999", status: "Paid" },
                    { date: "Mar 15, 2026", desc: "Pro Monthly — March", amount: "₹999", status: "Paid" },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{p.desc}</div>
                        <div className="text-xs text-gray-400">{p.date}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900">{p.amount}</span>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{p.status}</span>
                        <button className="text-xs text-violet-600 hover:underline">Invoice</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications Tab ── */}
          {activeTab === "Notifications" && (
            <div className="p-8">
              <h3 className="font-semibold text-gray-900 mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: "Live class reminders", desc: "Get notified 24h and 30 min before a live session", defaultOn: true },
                  { label: "New course launches", desc: "Be the first to know when new AI courses are added", defaultOn: true },
                  { label: "Quiz results", desc: "Receive a summary of your quiz performance", defaultOn: true },
                  { label: "Certificate issued", desc: "Get notified when a new certificate is ready", defaultOn: true },
                  { label: "Promotional offers", desc: "Special discounts, coupons, and seasonal sales", defaultOn: false },
                  { label: "Weekly progress report", desc: "A weekly summary of your learning progress", defaultOn: false },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{n.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{n.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={n.defaultOn} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
                    </label>
                  </div>
                ))}
              </div>
              <button className="mt-6 px-6 py-2.5 bg-violet-600 text-white font-semibold rounded-xl text-sm hover:bg-violet-700 transition-colors">Save Preferences</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
