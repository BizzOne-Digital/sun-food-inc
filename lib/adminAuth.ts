import { NextRequest } from "next/server";
import { ADMIN_COOKIE, SessionPayload, verifySession } from "./session";

export async function requireAdmin(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySession(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}
