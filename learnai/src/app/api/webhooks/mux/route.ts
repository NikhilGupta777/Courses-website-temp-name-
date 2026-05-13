import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Mux video asset webhooks — fired when video processing completes
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, data } = body;

  try {
    switch (type) {
      // Video is ready to stream
      case "video.asset.ready": {
        const { id: muxAssetId, playback_ids, status } = data;
        const playbackId = playback_ids?.[0]?.id;

        if (muxAssetId && playbackId) {
          await db.lesson.updateMany({
            where: { muxAssetId },
            data: {
              muxPlaybackId: playbackId,
              videoStatus: "ready",
            },
          });
          console.log(`Mux asset ready: ${muxAssetId} → playback ${playbackId}`);
        }
        break;
      }

      // Video processing failed
      case "video.asset.errored": {
        const { id: muxAssetId } = data;
        await db.lesson.updateMany({
          where: { muxAssetId },
          data: { videoStatus: "errored" },
        });
        console.error(`Mux asset errored: ${muxAssetId}`);
        break;
      }

      // Upload completed and asset was created
      case "video.upload.asset_created": {
        const { upload_id, asset_id } = data;
        await db.lesson.updateMany({
          where: { videoUrl: upload_id },
          data: {
            muxAssetId: asset_id,
            videoStatus: "preparing",
          },
        });
        break;
      }

      default:
        console.log(`Unhandled Mux event: ${type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Mux webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
