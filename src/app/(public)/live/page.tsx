import Link from "next/link";
import { trpcClient } from "@/lib/trpc/client";

const howItWorks = [
  { step: "01", title: "Register for a Class",  desc: "Pick an upcoming session and reserve your seat. All live classes are free with the Pro plan.", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" },
  { step: "02", title: "Get a Reminder",         desc: "We'll send you an email and WhatsApp reminder 24 hours and 30 minutes before the class.", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
  { step: "03", title: "Join on Zoom or Meet",   desc: "Click the join link at class time. Ask questions live, get answers in real time.", icon: "M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  { step: "04", title: "Watch the Recording",    desc: "Every session is recorded and uploaded to your dashboard within 24 hours. Watch anytime.", icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" },
];

export default async function LiveClassesPage() {
  // Fetch real data from DB
  let upcomingSessions: Awaited<ReturnType<typeof trpcClient.liveClass.getUpcoming.query>> = [];
  let pastData: Awaited<ReturnType<typeof trpcClient.liveClass.getAll.query>> = { items: [], total: 0, pages: 1, page: 1 };

  try {
    [upcomingSessions, pastData] = await Promise.all([
      trpcClient.liveClass.getUpcoming.query(),
      trpcClient.liveClass.getAll.query({ status: "COMPLETED", limit: 6 }),
    ]);
  } catch (err) {
    console.error("Live classes fetch error:", err);
  }

  const pastRecordings = pastData.items;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-violet-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            Live &amp; Interactive Learning
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            🎥 Live AI Classes &amp; Webinars
          </h1>
          <p className="mt-4 text-lg text-violet-200 max-w-2xl mx-auto">
            Join interactive live sessions with India&apos;s top AI experts. Ask questions, get real-time answers, and access all recordings afterward.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?plan=pro" className="px-8 py-3.5 bg-white text-violet-700 font-semibold rounded-xl hover:bg-violet-50 shadow-lg transition-all hover:scale-105">
              Join Pro — All Sessions Free
            </Link>
            <Link href="#upcoming" className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all">
              View Upcoming Sessions
            </Link>
          </div>
          <p className="mt-4 text-violet-300 text-sm">✓ All live sessions included in Pro Plan (₹999/month)</p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-violet-50 border-b border-violet-100 py-6">
        <div className="mx-auto max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Live Sessions / Month", value: "8+" },
            { label: "Average Attendees",     value: "350" },
            { label: "Session Recordings",    value: `${pastRecordings.length > 0 ? pastData.total + "+" : "40+"}` },
            { label: "Expert Instructors",    value: "4" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-violet-700">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming live classes */}
      <section id="upcoming" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Upcoming Sessions</h2>
              <p className="text-gray-500 mt-1">Reserve your seat before they fill up</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded-full font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free with Pro Plan
            </div>
          </div>

          {upcomingSessions.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-700 mb-1">No upcoming sessions right now</h3>
              <p className="text-sm text-gray-400">Check back soon — new sessions are added every week.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingSessions.map((cls) => {
                const seatsLeft = cls.maxSeats - cls._count.rsvps;
                const seatsPercent = Math.round((cls._count.rsvps / cls.maxSeats) * 100);
                const isAlmostFull = seatsLeft < cls.maxSeats * 0.15;
                const isLive = cls.status === "LIVE";
                return (
                  <div key={cls.id} className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-all group ${isLive ? "border-red-200 ring-2 ring-red-400/30" : "border-gray-200 hover:border-violet-200"}`}>
                    <div className={`h-1.5 ${isLive ? "bg-red-500 animate-pulse" : "bg-gradient-to-r from-violet-500 to-indigo-500"}`} />
                    <div className="p-5">
                      {isLive && (
                        <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full mb-3">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                          LIVE NOW
                        </div>
                      )}
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{cls.title}</h3>
                      {cls.topic && <p className="text-xs text-violet-600 font-medium mb-3">{cls.topic}</p>}
                      <div className="space-y-2 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium text-gray-700">{cls.instructor.displayName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(cls.scheduledAt).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {cls.durationMins} min
                          </div>
                          <span className="font-medium text-gray-600">{cls.platform}</span>
                        </div>
                      </div>
                      {/* Seats progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className={`font-medium ${isAlmostFull ? "text-orange-600" : "text-gray-600"}`}>
                            {isAlmostFull ? "⚡ Almost full! " : ""}{seatsLeft} of {cls.maxSeats} seats left
                          </span>
                          <span className="text-gray-400">{seatsPercent}% filled</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${isAlmostFull ? "bg-orange-500" : "bg-gradient-to-r from-violet-500 to-indigo-500"}`}
                            style={{ width: `${seatsPercent}%` }}
                          />
                        </div>
                      </div>
                      <Link
                        href="/register?plan=pro"
                        className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] ${
                          isLive
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20"
                            : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-500/20"
                        }`}
                      >
                        {isLive ? "🔴 Join Live Now" : "Register Free →"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-y border-gray-100">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">How Live Classes Work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="relative text-center">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] right-0 h-0.5 bg-violet-100" />
                )}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-100 mb-4">
                  <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
                  </svg>
                </div>
                <div className="text-xs font-bold text-violet-400 tracking-widest mb-1">{step.step}</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past recordings */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Past Session Recordings</h2>
              <p className="text-gray-500 text-sm mt-1">Missed a class? Watch the full recording anytime.</p>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">Pro members only</span>
          </div>
          {pastRecordings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-gray-400 text-sm">No recordings available yet. Completed sessions will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pastRecordings.map((rec) => (
                <div key={rec.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  <div className="h-36 bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center relative">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-violet-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                      {rec.durationMins} min
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{rec.title}</h3>
                    {rec.topic && <p className="text-xs text-violet-600 mb-2">{rec.topic}</p>}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                      <span>{rec.instructor.displayName}</span>
                      <span>{new Date(rec.scheduledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{rec._count.rsvps} attended</span>
                      <Link href="/register?plan=pro" className="text-xs font-semibold text-violet-600 hover:text-violet-700">
                        Watch Recording →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-indigo-600 text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Never miss a live session</h2>
        <p className="text-violet-200 mb-8 max-w-xl mx-auto">
          Get unlimited access to all live classes, past recordings, and every premium course with the Pro Plan.
        </p>
        <Link href="/register?plan=pro" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-700 font-semibold rounded-xl shadow-lg hover:bg-violet-50 transition-all hover:scale-105">
          Start Pro — 7 Days Free
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        <p className="mt-3 text-violet-300 text-sm">₹999/month · Cancel anytime · 30-day money-back</p>
      </section>
    </div>
  );
}
