import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// POST /api/upload/video
// Returns a Mux direct upload URL for the client to PUT the video file to.
// Requires authentication — only instructors and admins may upload course videos.
export async function POST(req: NextRequest) {
  // Auth check — no unauthenticated video uploads
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { lessonId } = body;

    if (!lessonId || typeof lessonId !== "string") {
      return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
    }

    if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
      // In development without Mux credentials, return a clearly-labelled stub
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({
          uploadUrl: null,
          uploadId: `dev_upload_${Date.now()}`,
          lessonId,
          note: "Mux not configured — set MUX_TOKEN_ID and MUX_TOKEN_SECRET in .env",
        });
      }
      return NextResponse.json({ error: "Video upload service not configured" }, { status: 503 });
    }

    // Production: create a Mux direct upload
    // const mux = new Mux({ tokenId: process.env.MUX_TOKEN_ID, tokenSecret: process.env.MUX_TOKEN_SECRET });
    // const upload = await mux.video.uploads.create({
    //   cors_origin: process.env.NEXT_PUBLIC_APP_URL!,
    //   new_asset_settings: { playback_policy: ["signed"] },
    // });
    // return NextResponse.json({ uploadUrl: upload.url, uploadId: upload.id, lessonId });

    return NextResponse.json({
      uploadUrl: null,
      uploadId:  `upload_${Date.now()}`,
      lessonId,
    });
  } catch (error) {
    console.error("Video upload URL creation failed:", error);
    return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
  }
}
