import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

type MuxPayload = {
  type: string;
  data: Record<string, unknown>;
};

type MuxPlaybackId = {
  id?: string;
};

// ─── Issue #011 fix: verify Mux webhook signature ────────────────────────────
// Without verification, any HTTP client can POST fake "video.asset.ready" events
// and flip lesson video status to "ready" for content that was never uploaded.
//
// Mux signs webhooks with HMAC-SHA256 using the secret from your Mux dashboard.
// Header: mux-signature  value: "t=<timestamp>,v1=<hex-digest>"
function verifyMuxSignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.MUX_WEBHOOK_SECRET;
  if (!secret) {
    // No secret configured → only allow in development
    if (process.env.NODE_ENV === "production") {
      console.error("MUX_WEBHOOK_SECRET is not set — rejecting request in production");
      return false;
    }
    console.warn("MUX_WEBHOOK_SECRET not configured — skipping verification in dev");
    return true;
  }

  if (!signatureHeader) return false;

  // Parse "t=<timestamp>,v1=<digest>"
  const parts: Record<string, string> = {};
  for (const part of signatureHeader.split(",")) {
    const [key, val] = part.split("=");
    if (key && val) parts[key.trim()] = val.trim();
  }

  const timestamp = parts["t"];
  const receivedDigest = parts["v1"];
  if (!timestamp || !receivedDigest) return false;

  const parsedTimestamp = parseInt(timestamp, 10);
  if (Number.isNaN(parsedTimestamp)) return false;

  // Replay-attack guard: reject events outside the allowed 5-minute clock skew
  const eventAge = Math.floor(Date.now() / 1000) - parsedTimestamp;
  if (Math.abs(eventAge) > 300) {
    console.warn(`Mux webhook timestamp outside allowed skew: ${eventAge}s`);
    return false;
  }

  // Compute expected HMAC
  const payload = `${timestamp}.${rawBody}`;
  const expectedDigest = crypto
    .createHmac("sha256", secret)
    .update(payload, "utf8")
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(receivedDigest, "hex"),
      Buffer.from(expectedDigest,  "hex")
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  // Read raw text so we can verify the signature before parsing
  const rawBody = await req.text();
  const signatureHeader = req.headers.get("mux-signature");

  if (!verifyMuxSignature(rawBody, signatureHeader)) {
    console.error("Mux webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let parsedBody: MuxPayload;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { type, data } = parsedBody;

  try {
    switch (type) {
      // Video is ready to stream
      case "video.asset.ready": {
        const { id: muxAssetId, playback_ids } = data;
        const playbackId = Array.isArray(playback_ids)
          ? (playback_ids[0] as MuxPlaybackId | undefined)?.id
          : undefined;

        if (typeof muxAssetId === "string" && playbackId) {
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
        if (typeof muxAssetId === "string") {
          await db.lesson.updateMany({
            where: { muxAssetId },
            data: { videoStatus: "errored" },
          });
          console.error(`Mux asset errored: ${muxAssetId}`);
        }
        break;
      }

      // Upload completed and asset was created
      case "video.upload.asset_created": {
        const { upload_id, asset_id } = data;
        if (typeof upload_id === "string" && typeof asset_id === "string") {
          await db.lesson.updateMany({
            where: { videoUrl: upload_id },
            data: {
              muxAssetId: asset_id,
              videoStatus: "preparing",
            },
          });
        }
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
