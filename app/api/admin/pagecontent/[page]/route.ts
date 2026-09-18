import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import PageContent from "@/models/PageContent";
import { requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";

const ALLOWED_PAGES = ["home", "about", "contact"];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const { page } = await params;
  if (!ALLOWED_PAGES.includes(page)) {
    return NextResponse.json({ success: false, error: "Invalid page" }, { status: 400 });
  }
  try {
    await connectToDatabase();
    let content = await PageContent.findOne({ page });
    if (!content) content = await PageContent.create({ page });
    return NextResponse.json({ success: true, content: content.toObject() });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load content" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const { page } = await params;
  if (!ALLOWED_PAGES.includes(page)) {
    return NextResponse.json({ success: false, error: "Invalid page" }, { status: 400 });
  }
  try {
    const body = await request.json();
    await connectToDatabase();
    let content = await PageContent.findOne({ page });
    if (!content) content = new PageContent({ page });

    const stringFields = [
      "heroHeading", "heroSubheading", "heroImage",
      "ctaPrimaryText", "ctaPrimaryLink", "ctaSecondaryText", "ctaSecondaryLink",
      "ourStoryHeading", "ourStoryBody", "ourStoryImage",
    ] as const;
    for (const field of stringFields) {
      if (typeof body[field] === "string") content[field] = body[field];
    }
    if (body.sectionsVisible && typeof body.sectionsVisible === "object") {
      content.sectionsVisible = body.sectionsVisible;
    }
    if (body.blocks && typeof body.blocks === "object") {
      content.blocks = body.blocks;
    }

    await content.save();
    return NextResponse.json({ success: true, content: content.toObject() });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update content" }, { status: 400 });
  }
}
