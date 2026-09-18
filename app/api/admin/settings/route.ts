import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    await connectToDatabase();
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    return NextResponse.json({ success: true, settings: settings.toObject() });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    await connectToDatabase();
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings({});

    const fields = [
      "businessName", "email", "phone", "address", "serviceArea",
      "socialFacebook", "socialInstagram", "socialTwitter", "footerText",
      "seoTitle", "seoDescription", "earlyBirdText",
    ] as const;
    for (const field of fields) {
      if (typeof body[field] === "string") settings[field] = body[field];
    }
    if (typeof body.earlyBirdEnabled === "boolean") settings.earlyBirdEnabled = body.earlyBirdEnabled;

    await settings.save();
    return NextResponse.json({ success: true, settings: settings.toObject() });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 400 });
  }
}
