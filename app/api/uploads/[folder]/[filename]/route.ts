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

    const rawData = upload.data as unknown;
    let buffer: Buffer;
    if (Buffer.isBuffer(rawData)) {
      buffer = rawData;
    } else if (rawData && typeof rawData === "object" && "buffer" in (rawData as Record<string, unknown>)) {
      // mongoose .lean() can return BSON Binary wrapper objects instead of a plain Buffer
      buffer = Buffer.from((rawData as { buffer: ArrayBufferLike }).buffer);
    } else {
      buffer = Buffer.from(rawData as ArrayBuffer);
    }

    // Always derive Content-Length from the actual bytes being sent, never a stored
    // field — a mismatch causes HTTP clients to hang waiting for bytes that never arrive.
    const body = Uint8Array.from(buffer);

    return new Response(body, {
      headers: {
        "Content-Type": upload.mimeType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
