import { NextResponse } from "next/server";
import { clearSession, getCurrentSession } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function POST() {
  await clearSession();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, session: null });
  }

  const profile = db.getProfile(session.userId) || db.getProfile(session.email);
  return NextResponse.json({
    authenticated: true,
    session,
    profile,
  });
}
