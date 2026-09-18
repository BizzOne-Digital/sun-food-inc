import { NextResponse } from "next/server";
import { USER_COOKIE } from "@/lib/session";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(USER_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
