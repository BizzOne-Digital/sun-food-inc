import { cookies } from "next/headers";
import { ADMIN_COOKIE, USER_COOKIE, SessionPayload, verifySession } from "./session";

export async function getServerAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySession(token);
  if (!payload || payload.role !== "admin") return null;
  return payload;
}

export async function getServerUserSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySession(token);
  if (!payload || payload.role !== "user") return null;
  return payload;
}
