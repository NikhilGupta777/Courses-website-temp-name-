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

    // Find the specific token
    const record = await db.verificationToken.findUnique({ where: { token } });

    if (!record) {
      return NextResponse.json(
        { error: "Invalid or expired reset link. Please request a new one." },
        { status: 400 }
      );
    }

    if (record.expires < new Date()) {
      // Clean up this one expired token only, then reject
      await db.verificationToken.deleteMany({ where: { identifier: record.identifier } });
      return NextResponse.json(
        { error: "This reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashed = await bcrypt.hash(password, 12);

    // Update the user's password
    const updated = await db.user.update({
      where: { email: record.identifier },
      data:  { password: hashed },
      select: { id: true },
    }).catch(() => null);

    if (!updated) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // ─── Fix #7: delete ALL tokens for this email ─────────────────────────────
    // The original code only deleted the single token used in this request.
    // Any other unexpired tokens issued earlier (e.g. from multiple "forgot
    // password" submissions) would remain valid and could be used to set the
    // password again.  We now delete every verificationToken row for this email
    // so that no previously-issued token can be replayed.
    await db.verificationToken.deleteMany({
      where: { identifier: record.identifier },
    });

    // Also delete all active sessions for this user so that any session started
    // with the old password is invalidated immediately.
    await db.session.deleteMany({
      where: { userId: updated.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
