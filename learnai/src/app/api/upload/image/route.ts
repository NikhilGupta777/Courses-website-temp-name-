import { NextRequest, NextResponse } from "next/server";

// POST /api/upload/image
// Returns an S3/R2 presigned URL for uploading course thumbnails or profile images
export async function POST(req: NextRequest) {
  try {
    const { filename, contentType, folder = "thumbnails" } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: "filename and contentType are required" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    const key = `${folder}/${Date.now()}-${filename.replace(/[^a-z0-9.]/gi, "_")}`;

    // In production: generate real presigned URL
    // const command = new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, ContentType: contentType });
    // const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    return NextResponse.json({
      uploadUrl: `https://your-bucket.s3.amazonaws.com/${key}?X-Amz-Signature=placeholder`,
      publicUrl: `https://cdn.learnai.in/${key}`,
      key,
    });
  } catch (error) {
    console.error("Image upload URL creation failed:", error);
    return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
  }
}
