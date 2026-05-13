import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

const Schema = z.object({
  token:    z.string().min(32),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { token, password } = parsed.data;

    // Find the token
    const record = await db.verificationToken.findUnique({ where: { token } });

    if (!record) {
      return NextResponse.json({ error: "Invalid or expired reset link. Please request a new one." }, { status: 400 });
    }

    if (record.expires < new Date()) {
      await db.verificationToken.delete({ where: { token } });
      return NextResponse.json({ error: "This reset link has expired. Please request a new one." }, { status: 400 });
    }

    // Hash new password
    const hashed = await bcrypt.hash(password, 12);

    // Update user
    const updated = await db.user.update({
      where: { email: record.identifier },
      data: { password: hashed },
      select: { id: true },
    });

    if (!updated) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Delete the used token so it can't be reused
    await db.verificationToken.delete({ where: { token } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
