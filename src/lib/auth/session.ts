import { cookies } from "next/headers";
import { Profile } from "@/types/database";
import { db } from "@/lib/db";

const COOKIE_NAME = "living_book_session";

export interface SessionData {
  userId: string;
  email: string;
  displayName: string;
  role: "admin" | "reader";
  avatarUrl?: string;
}

export async function getCurrentSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const parsed: SessionData = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString("utf-8")
    );
    return parsed;
  } catch (err) {
    return null;
  }
}

export async function setSession(profile: Profile): Promise<void> {
  const cookieStore = await cookies();
  const sessionData: SessionData = {
    userId: profile.id,
    email: profile.email,
    displayName: profile.display_name,
    role: profile.role,
    avatarUrl: profile.avatar_url,
  };

  const encoded = Buffer.from(JSON.stringify(sessionData)).toString("base64");

  cookieStore.set(COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function verifyAdminSession(): Promise<SessionData | null> {
  const session = await getCurrentSession();
  if (session && session.role === "admin") {
    return session;
  }
  return null;
}
