import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required" },
        { status: 403 }
      );
    }

    const stats = db.getDashboardStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
