import { NextRequest, NextResponse } from "next/server";

// POST /api/upload/video
// Returns a Mux direct upload URL for the client to PUT the video file to
export async function POST(req: NextRequest) {
  try {
    const { lessonId } = await req.json();

    if (!lessonId) {
      return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
    }

    // In production: use Mux SDK to create a direct upload URL
    // const upload = await mux.video.uploads.create({
    //   cors_origin: process.env.NEXT_PUBLIC_APP_URL!,
    //   new_asset_settings: { playback_policy: ["signed"] },
    // });
    // return NextResponse.json({ uploadUrl: upload.url, uploadId: upload.id });

    // Placeholder response for development
    return NextResponse.json({
      uploadUrl: "https://storage.googleapis.com/video-mux-upload-placeholder",
      uploadId: `upload_${Date.now()}`,
      lessonId,
    });
  } catch (error) {
    console.error("Video upload URL creation failed:", error);
    return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
  }
}
