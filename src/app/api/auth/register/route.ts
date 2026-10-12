import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const { email, password, displayName, favoriteGenre } = await request.json();

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: "Display name, email, and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.getProfile(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const newProfile = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      display_name: displayName.trim(),
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
      role: "reader" as const,
      favorite_genre: favoriteGenre || "Inspirational",
      password: password,
      created_at: new Date().toISOString(),
    };

    // Permanently persist to DB state & disk
    db.saveProfile(newProfile);

    await setSession(newProfile);
    return NextResponse.json({ success: true, profile: newProfile });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
