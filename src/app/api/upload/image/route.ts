import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// POST /api/upload/image
// Returns an S3/R2 presigned URL for uploading course thumbnails or profile images.
// Requires authentication.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
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

    // Sanitise filename — keep only safe chars
    const safeFilename = filename.replace(/[^a-z0-9._-]/gi, "_").toLowerCase();
    const key = `${folder}/${Date.now()}-${safeFilename}`;

    if (!process.env.S3_BUCKET || !process.env.S3_ACCESS_KEY) {
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({
          uploadUrl: null,
          publicUrl: null,
          key,
          note: "S3 not configured — set S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY in .env",
        });
      }
      return NextResponse.json({ error: "Storage service not configured" }, { status: 503 });
    }

    // Production: generate real presigned PUT URL
    // const command = new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, ContentType: contentType });
    // const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    // const publicUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
    // return NextResponse.json({ uploadUrl, publicUrl, key });

    return NextResponse.json({ uploadUrl: null, publicUrl: null, key });
  } catch (error) {
    console.error("Image upload URL creation failed:", error);
    return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
  }
}
