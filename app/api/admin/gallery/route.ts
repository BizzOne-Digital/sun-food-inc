import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import StoredUpload from "@/models/StoredUpload";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder");
    const query: Record<string, unknown> = {};
    if (folder && folder !== "all") query.folder = folder;

    const uploads = await StoredUpload.find(query, { data: 0 }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      uploads: uploads.map((u) => ({
        _id: String(u._id),
        folder: u.folder,
        filename: u.filename,
        mimeType: u.mimeType,
        size: u.size,
        url: `/api/uploads/${u.folder}/${u.filename}`,
        createdAt: u.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load gallery" }, { status: 500 });
  }
}
