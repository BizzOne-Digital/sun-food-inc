import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import StoredUpload from "@/models/StoredUpload";

export const runtime = "nodejs";

const ALLOWED_FOLDERS = ["products", "gallery", "pages", "misc"];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ folder: string; filename: string }> }
) {
  const { folder, filename } = await params;

  if (!ALLOWED_FOLDERS.includes(folder)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await connectToDatabase();
    const upload = await StoredUpload.findOne({ folder, filename }).lean();
    if (!upload) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const buffer = Buffer.from(upload.data as unknown as Buffer);

    return new Response(buffer, {
      headers: {
        "Content-Type": upload.mimeType,
        "Content-Length": String(upload.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
