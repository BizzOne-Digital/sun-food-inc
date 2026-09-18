import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { requireUser } from "@/lib/userAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await requireUser(request);
  if (!session) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }
  try {
    await connectToDatabase();
    const user = await User.findById(session.id).lean();
    if (!user) return NextResponse.json({ success: false, user: null }, { status: 401 });
    return NextResponse.json({
      success: true,
      user: {
        id: String(user._id),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
      },
    });
  } catch {
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
