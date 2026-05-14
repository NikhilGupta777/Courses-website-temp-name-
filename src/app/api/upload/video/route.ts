import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type SessionUserWithRole = { role?: string };

/**
 * POST /api/upload/video
 *
 * Creates a Mux direct-upload URL so the browser can PUT the video file
 * directly to Mux without routing the bytes through our server.
 *
 * Flow:
 *  1. Client POSTs { lessonId } to this endpoint.
 *  2. We call Mux API to create a DirectUpload and get back a one-time URL.
 *  3. Client PUTs the video file to that URL (tus or plain PUT).
 *  4. Mux transcodes it and fires video.asset.ready webhook.
 *  5. Webhook handler writes muxAssetId + muxPlaybackId back to the lesson.
 *
 * Requires: MUX_TOKEN_ID, MUX_TOKEN_SECRET env vars.
 * Roles: INSTRUCTOR or ADMIN only.
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as SessionUserWithRole).role;
  if (role !== "INSTRUCTOR" && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden — instructors only" }, { status: 403 });
  }

  let body: { lessonId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { lessonId } = body;
  if (!lessonId || typeof lessonId !== "string") {
    return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
  }

  // ── Dev stub when Mux credentials are not set ────────────────────────────
  if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Video upload service is not configured. Set MUX_TOKEN_ID and MUX_TOKEN_SECRET." },
        { status: 503 }
      );
    }
    // Development: return a stub so the UI flow can be tested without Mux
    return NextResponse.json({
      uploadUrl:  null,
      uploadId:   `dev_upload_${Date.now()}`,
      lessonId,
      note:       "Mux not configured — MUX_TOKEN_ID/MUX_TOKEN_SECRET missing from .env",
    });
  }

  // ── Production: call Mux API ─────────────────────────────────────────────
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://learnai.in";

    // Mux REST API — create a direct upload
    // SDK equivalent: mux.video.uploads.create({ cors_origin, new_asset_settings })
    const muxResponse = await fetch("https://api.mux.com/video/v1/uploads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Basic ${Buffer.from(`${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`).toString("base64")}`,
      },
      body: JSON.stringify({
        cors_origin:          appUrl,
        new_asset_settings:   {
          playback_policy:    ["public"],          // "signed" for DRM in Phase 2
          mp4_support:        "standard",          // fallback MP4 renditions
        },
        // Store lessonId in Mux upload passthrough so webhook can link it back
        passthrough:          lessonId,
      }),
    });

    if (!muxResponse.ok) {
      const errText = await muxResponse.text();
      console.error("Mux API error:", errText);
      return NextResponse.json(
        { error: "Mux upload creation failed", detail: errText },
        { status: 502 }
      );
    }

    const muxData = await muxResponse.json() as {
      data: { id: string; url: string };
    };

    return NextResponse.json({
      uploadUrl: muxData.data.url,
      uploadId:  muxData.data.id,
      lessonId,
    });
  } catch (error) {
    console.error("Video upload URL creation failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
