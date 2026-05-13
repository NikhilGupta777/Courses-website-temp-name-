import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const RegisterSchema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Check for existing user
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password — bcrypt cost factor 12 (strong but not too slow)
    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date();

    const user = await db.$transaction(async (tx) => {
      // Create user
      const createdUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "STUDENT",
        },
        select: { id: true, email: true, name: true },
      });

      // createUser event in Auth.js handles the FREE subscription creation —
      // but since we're not going through Auth.js here, create it manually
      await tx.subscription.create({
        data: {
          userId: createdUser.id,
          plan: "FREE",
          status: "ACTIVE",
          currentPeriodStart: now,
          currentPeriodEnd: new Date(now.getTime() + 100 * 365 * 24 * 60 * 60 * 1000),
        },
      });

      return createdUser;
    });

    return NextResponse.json(
      { message: "Account created successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
