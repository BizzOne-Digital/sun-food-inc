import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    await connectToDatabase();
    const users = await User.find().sort({ createdAt: -1 }).select("-passwordHash").lean();
    return NextResponse.json({ success: true, customers: users.map((u) => ({ ...u, _id: String(u._id) })) });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load customers" }, { status: 500 });
  }
}
