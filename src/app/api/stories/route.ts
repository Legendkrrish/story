import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const featured = searchParams.get("featured")
      ? searchParams.get("featured") === "true"
      : undefined;

    const stories = db.getStories({ categorySlug: category, status, featured });
    return NextResponse.json({ success: true, stories });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
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
    if (!body.title || !body.content_html) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const newStory = db.saveStory(body);
    return NextResponse.json({ success: true, story: newStory });
  } catch (error) {
    console.error("Error saving story:", error);
    return NextResponse.json(
      { error: "Failed to save story" },
      { status: 500 }
    );
  }
}
