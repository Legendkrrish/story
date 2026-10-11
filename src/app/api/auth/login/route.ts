import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check admin credentials
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@thelivingbook.com").toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (cleanEmail === adminEmail && password === adminPassword) {
      let adminProfile = db.getProfile(cleanEmail);
      if (!adminProfile) {
        adminProfile = {
          id: "admin-1",
          email: cleanEmail,
          display_name: "The Grand Archivist",
          role: "admin",
          created_at: new Date().toISOString(),
        };
      }
      await setSession(adminProfile);
      return NextResponse.json({ success: true, profile: adminProfile });
    }

    // Check reader profile
    const profile = db.getProfile(cleanEmail);
    if (!profile) {
      return NextResponse.json(
        { error: "No account found with this email. Please register." },
        { status: 401 }
      );
    }

    await setSession(profile);
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 });
  }
}
