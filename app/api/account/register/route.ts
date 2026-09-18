import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { signSession, USER_COOKIE } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, password } = body;

    if (
      typeof firstName !== "string" || !firstName.trim() ||
      typeof lastName !== "string" || !lastName.trim() ||
      typeof email !== "string" || !email.trim() ||
      typeof password !== "string" || password.length < 6
    ) {
      return NextResponse.json(
        { success: false, error: "Please fill all required fields (password min 6 characters)" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone: typeof phone === "string" ? phone.trim() : "",
      passwordHash,
    });

    const token = signSession({ id: String(user._id), role: "user", email: user.email, name: user.firstName });
    const response = NextResponse.json({ success: true });
    response.cookies.set(USER_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}
