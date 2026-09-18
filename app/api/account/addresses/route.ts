import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User, { IAddress } from "@/models/User";
import { requireUser } from "@/lib/userAuth";
import { Types } from "mongoose";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await requireUser(request);
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { label, address, apartment, city, province, postalCode, country } = body;
    if (
      typeof address !== "string" || !address.trim() ||
      typeof city !== "string" || !city.trim() ||
      typeof province !== "string" || !province.trim() ||
      typeof postalCode !== "string" || !postalCode.trim()
    ) {
      return NextResponse.json({ success: false, error: "Missing address fields" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(session.id);
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    user.addresses.push({
      label: typeof label === "string" ? label : "",
      address: address.trim(),
      apartment: typeof apartment === "string" ? apartment.trim() : "",
      city: city.trim(),
      province: province.trim(),
      postalCode: postalCode.trim(),
      country: typeof country === "string" && country.trim() ? country.trim() : "Canada",
    });
    await user.save();

    return NextResponse.json({ success: true, addresses: user.addresses });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to add address" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await requireUser(request);
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { addressId } = await request.json();
    if (typeof addressId !== "string") {
      return NextResponse.json({ success: false, error: "Missing addressId" }, { status: 400 });
    }
    await connectToDatabase();
    const user = await User.findById(session.id);
    if (!user) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    user.addresses = user.addresses.filter(
      (a: IAddress & { _id: Types.ObjectId }) => String(a._id) !== addressId
    ) as typeof user.addresses;
    await user.save();

    return NextResponse.json({ success: true, addresses: user.addresses });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete address" }, { status: 500 });
  }
}
