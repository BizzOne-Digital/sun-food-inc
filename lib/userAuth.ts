import { NextRequest } from "next/server";
import { USER_COOKIE, SessionPayload, verifySession } from "./session";

export async function requireUser(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get(USER_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySession(token);
  if (!payload || payload.role !== "user") return null;
  return payload;
}
