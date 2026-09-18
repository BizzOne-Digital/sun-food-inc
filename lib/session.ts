import jwt from "jsonwebtoken";

export type SessionRole = "admin" | "user";

export interface SessionPayload {
  id: string;
  role: SessionRole;
  email: string;
  name?: string;
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add it to your .env.local file (see .env.example)."
    );
  }
  return secret;
}

export function signSession(payload: SessionPayload, expiresIn: string = "7d"): string {
  return jwt.sign(payload, getSecret(), { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, getSecret());
    if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
      return decoded as unknown as SessionPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export const ADMIN_COOKIE = "sf_admin_session";
export const USER_COOKIE = "sf_user_session";
