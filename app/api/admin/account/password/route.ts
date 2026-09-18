import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function PUT(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await request.json();
    if (typeof currentPassword !== "string" || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const admin = await Admin.findById(session.id);
    if (!admin) return NextResponse.json({ success: false, error: "Admin not found" }, { status: 404 });

    const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!valid) return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 401 });

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    await admin.save();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update password" }, { status: 500 });
  }
}
