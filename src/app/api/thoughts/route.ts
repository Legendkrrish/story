import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || undefined;
    const isToday = searchParams.get("today") === "true";
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : undefined;

    if (isToday) {
      const todayThought = db.getTodayThought(date);
      return NextResponse.json({ success: true, thought: todayThought });
    }

    const thoughts = db.getDailyThoughts({ date, limit });
    return NextResponse.json({ success: true, thoughts });
  } catch (error) {
    console.error("Error fetching thoughts:", error);
    return NextResponse.json(
      { error: "Failed to fetch thoughts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    if (!body.quote || !body.author) {
      return NextResponse.json(
        { error: "Quote and author are required" },
        { status: 400 }
      );
    }

    const newThought = db.saveThought(body);
    return NextResponse.json({ success: true, thought: newThought });
  } catch (error) {
    console.error("Error saving thought:", error);
    return NextResponse.json(
      { error: "Failed to save thought" },
      { status: 500 }
    );
  }
}
