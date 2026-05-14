"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";

const TABS = ["Profile", "Account", "Billing", "Notifications"] as const;
type Tab = typeof TABS[number];

// ── Skeleton ────────────────────────────────────────────────────────────────
function FieldSkeleton() {
  return <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [saved, setSaved] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);

  // ── Profile form state ──────────────────────────────────────────────────
  const [name, setName]         = useState("");
  const [bio, setBio]           = useState("");
  const [headline, setHeadline] = useState("");

  // ── Notification prefs state ────────────────────────────────────────────
  const [prefs, setPrefs] = useState({
    liveClassReminders:   true,
    newCourseLaunches:    true,
    quizResults:          true,
    certificateIssued:    true,
    promotionalOffers:    false,
    weeklyProgressReport: false,
  });

  // ── Queries ─────────────────────────────────────────────────────────────
  const { data: profile, isLoading: profileLoading } = useQuery(
    trpc.user.getProfile.queryOptions()
  );
  const { data: subscription, isLoading: subLoading } = useQuery(
    trpc.payment.getSubscription.queryOptions()
  );
  const { data: paymentHistory, isLoading: historyLoading } = useQuery({
    ...trpc.payment.getHistory.queryOptions({ page: 1, limit: 10 }),
    enabled: activeTab === "Billing",
  });
  const { data: notifPrefs } = useQuery(
    trpc.user.getNotificationPrefs.queryOptions()
  );

  // ── Populate form once profile loads ────────────────────────────────────
  useEffect(() => {
    if (profile) {
      setName(profile.name ?? "");
      setBio(profile.bio ?? "");
      setHeadline(profile.headline ?? "");
    }
  }, [profile]);

  // ── Populate notification prefs once loaded ──────────────────────────────
  useEffect(() => {
    if (notifPrefs) setPrefs(notifPrefs);
  }, [notifPrefs]);

  // ── Mutations ────────────────────────────────────────────────────────────
  const updateProfile = useMutation(trpc.user.updateProfile.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.user.getProfile.queryOptions());
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  }));

  const savePrefs = useMutation(trpc.user.saveNotificationPrefs.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.user.getNotificationPrefs.queryOptions());
      setPrefsSaved(true);
      setTimeout(() => setPrefsSaved(false), 3000);
    },
  }));

  const getPortalUrl = useMutation(trpc.payment.getPortalUrl.mutationOptions({
    onSuccess: (data) => {
      window.location.href = data.portalUrl;
    },
  }));

  const handleSaveProfile = () => {
    updateProfile.mutate({
      name:     name || undefined,
      bio:      bio || undefined,
      headline: headline || undefined,
    });
  };

  // ── Plan display helpers ─────────────────────────────────────────────────
  const planLabel: Record<string, string> = {
    FREE:        "Free Plan",
    PRO_MONTHLY: "Pro Monthly",
    PRO_ANNUAL:  "Pro Annual",
    ENTERPRISE:  "Enterprise",
  };
  const planPrice: Record<string, string> = {
    FREE:        "₹0",
    PRO_MONTHLY: "₹999 / month",
    PRO_ANNUAL:  "₹5,999 / year",
    ENTERPRISE:  "Custom",
  };

  const currentPlan = subscription?.plan ?? "FREE";
  const renewsAt    = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : null;

  const notifItems = [
    { key: "liveClassReminders"   as const, label: "Live class reminders",    desc: "Get notified 24h and 30 min before a live session" },
    { key: "newCourseLaunches"    as const, label: "New course launches",      desc: "Be the first to know when new AI courses are added" },
    { key: "quizResults"          as const, label: "Quiz results",             desc: "Receive a summary of your quiz performance" },
    { key: "certificateIssued"    as const, label: "Certificate issued",       desc: "Get notified when a new certificate is ready" },
    { key: "promotionalOffers"    as const, label: "Promotional offers",       desc: "Special discounts, coupons, and seasonal sales" },
    { key: "weeklyProgressReport" as const, label: "Weekly progress report",   desc: "A weekly summary of your learning progress" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
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
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                activeTab === t ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              )}>
              {t}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* ── Profile Tab ── */}
          {activeTab === "Profile" && (
            <div className="p-8">
              {/* Avatar row */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                {profileLoading ? (
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 animate-pulse" />
                ) : (
                  <div className="relative">
                    {profile?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profile.image} alt={profile.name ?? "User"} className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {(profile?.name ?? session?.user?.name ?? "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center text-white shadow text-xs font-bold">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                )}
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {profileLoading ? <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" /> : (profile?.name ?? "—")}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">{profile?.email ?? session?.user?.email}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full",
                      currentPlan === "FREE" ? "bg-gray-100 text-gray-600" : "bg-violet-50 text-violet-600"
                    )}>
                      {currentPlan === "FREE" ? "Free" : "✦ " + planLabel[currentPlan]}
                    </span>
                    {memberSince && <span className="text-xs text-gray-400">Member since {memberSince}</span>}
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  {profileLoading ? <FieldSkeleton /> : (
                    <input value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input value={profile?.email ?? session?.user?.email ?? ""} disabled
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Professional Headline</label>
                  {profileLoading ? <FieldSkeleton /> : (
                    <input value={headline} onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. Full-Stack Developer | AI Enthusiast"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                  {profileLoading ? <div className="h-20 bg-gray-100 rounded-xl animate-pulse" /> : (
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button onClick={handleSaveProfile} disabled={updateProfile.isPending}
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all shadow-md text-sm disabled:opacity-60">
                  {updateProfile.isPending ? "Saving…" : "Save Changes"}
                </button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved!
                  </span>
                )}
                {updateProfile.isError && (
                  <span className="text-sm text-red-500">Failed to save. Please try again.</span>
                )}
              </div>
            </div>
          )}

          {/* ── Account Tab ── */}
          {activeTab === "Account" && (
            <div className="p-8 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Change Password</h3>
                <p className="text-sm text-gray-500 mb-4">Use the link below to reset your password securely via email.</p>
                <Link href="/forgot-password"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white font-semibold rounded-xl text-sm hover:bg-violet-700 transition-colors">
                  Send Password Reset Email
                </Link>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-900 mb-1">Linked Accounts</h3>
                <p className="text-sm text-gray-500 mb-3">Social login providers connected to your account.</p>
                <div className="flex gap-3">
                  {["Google", "GitHub"].map((provider) => (
                    <div key={provider} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
                      <span>{provider}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-red-600 mb-1">Danger Zone</h3>
                <p className="text-sm text-gray-500 mb-4">Once deleted, your account and all data cannot be recovered.</p>
                <button className="px-5 py-2.5 border-2 border-red-200 text-red-600 font-semibold rounded-xl text-sm hover:bg-red-50 transition-colors">
                  Delete My Account
                </button>
              </div>
            </div>
          )}

          {/* ── Billing Tab ── */}
          {activeTab === "Billing" && (
            <div className="p-8 space-y-6">
              {/* Current Plan */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Current Plan</h3>
                {subLoading ? (
                  <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                ) : (
                  <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl p-5 border border-violet-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-gray-900">{planLabel[currentPlan] ?? "Free Plan"}</div>
                        <div className="text-sm text-gray-600 mt-0.5">
                          {planPrice[currentPlan]}
                          {renewsAt && currentPlan !== "FREE" && ` · Renews ${renewsAt}`}
                        </div>
                      </div>
                      <span className={cn(
                        "px-3 py-1 text-xs font-bold rounded-full",
                        subscription?.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                        subscription?.status === "TRIALING" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-600"
                      )}>
                        {subscription?.status ?? "Active"}
                      </span>
                    </div>
                    <div className="flex gap-3 mt-4">
                      {currentPlan === "FREE" ? (
                        <Link href="/pricing"
                          className="px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors">
                          Upgrade to Pro
                        </Link>
                      ) : (
                        <>
                          {currentPlan === "PRO_MONTHLY" && (
                            <Link href="/pricing"
                              className="px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors">
                              Upgrade to Annual (Save ₹2,989)
                            </Link>
                          )}
                          <button
                            onClick={() => getPortalUrl.mutate()}
                            disabled={getPortalUrl.isPending}
                            className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                            {getPortalUrl.isPending ? "Loading…" : "Manage / Cancel Plan"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment History */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Payment History</h3>
                {historyLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : !paymentHistory?.payments.length ? (
                  <div className="text-sm text-gray-400 text-center py-8 bg-gray-50 rounded-xl">
                    No payments yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {paymentHistory.payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {p.type === "SUBSCRIPTION" ? "Subscription" : "Course Purchase"}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900">
                            ₹{p.amount.toLocaleString("en-IN")}
                          </span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            p.status === "COMPLETED" ? "bg-green-50 text-green-600" :
                            p.status === "REFUNDED"  ? "bg-orange-50 text-orange-600" :
                            p.status === "FAILED"    ? "bg-red-50 text-red-600" :
                            "bg-gray-50 text-gray-500"
                          )}>
                            {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Notifications Tab ── */}
          {activeTab === "Notifications" && (
            <div className="p-8">
              <h3 className="font-semibold text-gray-900 mb-6">Email & In-App Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: "liveClassReminders"   as const, label: "Live class reminders",     desc: "Get notified 24h and 30 min before a live session" },
                  { key: "newCourseLaunches"    as const, label: "New course launches",       desc: "Be the first to know when new AI courses are added" },
                  { key: "quizResults"          as const, label: "Quiz results",              desc: "Receive a summary of your quiz performance" },
                  { key: "certificateIssued"    as const, label: "Certificate issued",        desc: "Get notified when a new certificate is ready" },
                  { key: "promotionalOffers"    as const, label: "Promotional offers",        desc: "Special discounts, coupons, and seasonal sales" },
                  { key: "weeklyProgressReport" as const, label: "Weekly progress report",    desc: "A weekly summary of your learning progress" },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{n.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{n.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prefs[n.key]}
                        onChange={(e) => setPrefs((prev) => ({ ...prev, [n.key]: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => savePrefs.mutate(prefs)}
                  disabled={savePrefs.isPending}
                  className="px-6 py-2.5 bg-violet-600 text-white font-semibold rounded-xl text-sm hover:bg-violet-700 transition-colors disabled:opacity-60">
                  {savePrefs.isPending ? "Saving…" : "Save Preferences"}
                </button>
                {prefsSaved && (
                  <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Preferences saved!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
