import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import crypto from "crypto";

/**
 * POST /api/upload/image
 *
 * Generates a Cloudflare R2 (S3-compatible) presigned PUT URL so the browser
 * can upload images (thumbnails, profile pics) directly without routing bytes
 * through our server.
 *
 * Flow:
 *  1. Client POSTs { filename, contentType, folder? }.
 *  2. We generate a presigned PUT URL using AWS Signature V4.
 *  3. Client PUTs the file directly to Cloudflare R2.
 *  4. On success, client uses the returned publicUrl as the image src.
 *
 * Required env vars:
 *   S3_BUCKET       — R2 bucket name
 *   S3_REGION       — "auto" for Cloudflare R2
 *   S3_ACCESS_KEY   — R2 access key ID
 *   S3_SECRET_KEY   — R2 secret access key
 *   S3_ENDPOINT     — https://<accountid>.r2.cloudflarestorage.com
 *   (optional) NEXT_PUBLIC_R2_PUBLIC_URL — public bucket URL, e.g. https://cdn.learnai.in
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { filename?: string; contentType?: string; folder?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { filename, contentType, folder = "thumbnails" } = body;

  if (!filename || typeof filename !== "string") {
    return NextResponse.json({ error: "filename is required" }, { status: 400 });
  }
  if (!contentType || typeof contentType !== "string") {
    return NextResponse.json({ error: "contentType is required" }, { status: 400 });
  }

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: `Invalid content type. Allowed: ${ALLOWED_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  // Sanitise the filename — only safe chars
  const safeFilename = filename.replace(/[^a-z0-9._-]/gi, "_").toLowerCase();
  const key = `${folder}/${Date.now()}-${safeFilename}`;

  // ── Dev stub when R2 is not configured ──────────────────────────────────
  const { S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY, S3_ENDPOINT } = process.env;

  if (!S3_BUCKET || !S3_ACCESS_KEY || !S3_SECRET_KEY) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Storage service not configured. Set S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY." },
        { status: 503 }
      );
    }
    return NextResponse.json({
      uploadUrl: null,
      publicUrl: null,
      key,
      note:      "R2/S3 not configured — set S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY, S3_ENDPOINT in .env",
    });
  }

  // ── Production: generate AWS Signature V4 presigned PUT URL ─────────────
  try {
    const region      = S3_REGION ?? "auto";
    const endpoint    = S3_ENDPOINT ?? `https://${S3_BUCKET}.s3.${region}.amazonaws.com`;
    const expiresIn   = 300; // 5 minutes
    const service     = "s3";
    const now         = new Date();
    const dateStamp   = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 8);    // YYYYMMDD
    const amzDate     = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 15) + "Z"; // YYYYMMDDTHHMMSSZ
    const host        = new URL(endpoint).host;
    const uploadUrl   = `${endpoint}/${key}`;

    // Canonical headers (only host for presigned URL)
    const canonicalHeaders    = `host:${host}\n`;
    const signedHeaders       = "host";
    const credentialScope     = `${dateStamp}/${region}/${service}/aws4_request`;
    const credential          = `${S3_ACCESS_KEY}/${credentialScope}`;

    // Canonical query string for presigned URL
    const queryParams: Record<string, string> = {
      "X-Amz-Algorithm":       "AWS4-HMAC-SHA256",
      "X-Amz-Credential":      credential,
      "X-Amz-Date":            amzDate,
      "X-Amz-Expires":         String(expiresIn),
      "X-Amz-SignedHeaders":   signedHeaders,
    };

    const sortedQuery = Object.keys(queryParams)
      .sort()
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(queryParams[k]!)}`)
      .join("&");

    const canonicalRequest = [
      "PUT",
      `/${key}`,
      sortedQuery,
      canonicalHeaders,
      signedHeaders,
      "UNSIGNED-PAYLOAD",
    ].join("\n");

    const stringToSign = [
      "AWS4-HMAC-SHA256",
      amzDate,
      credentialScope,
      crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
    ].join("\n");

    // Derive signing key
    function hmacSha256(key: Buffer | string, data: string): Buffer {
      return crypto.createHmac("sha256", key).update(data).digest();
    }
    const signingKey = hmacSha256(
      hmacSha256(
        hmacSha256(
          hmacSha256(`AWS4${S3_SECRET_KEY}`, dateStamp),
          region
        ),
        service
      ),
      "aws4_request"
    );

    const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");
    const presignedUrl = `${uploadUrl}?${sortedQuery}&X-Amz-Signature=${signature}`;

    // Public URL — use CDN domain if set, else construct from endpoint
    const publicBaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? endpoint;
    const publicUrl = `${publicBaseUrl}/${key}`;

    return NextResponse.json({ uploadUrl: presignedUrl, publicUrl, key });
  } catch (error) {
    console.error("Presigned URL generation failed:", error);
    return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
  }
}
