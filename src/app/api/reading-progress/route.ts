import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const session = await getCurrentSession();
    const userId = session?.userId || "reader-1"; // Fallback to demo reader if not logged in

    const progressList = db.getUserReadingProgress(userId);
    return NextResponse.json({ success: true, progress: progressList });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reading progress" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    const body = await request.json();

    const userId = session?.userId || body.userId || "reader-1";
    if (!body.book_id || body.current_page === undefined) {
      return NextResponse.json(
        { error: "Book ID and current page are required" },
        { status: 400 }
      );
    }

    const saved = db.saveReadingProgress({
      user_id: userId,
      book_id: body.book_id,
      current_chapter_id: body.current_chapter_id,
      current_page: body.current_page,
      total_pages: body.total_pages || 100,
      percentage: Math.min(
        100,
        Math.round((body.current_page / (body.total_pages || 100)) * 100)
      ),
    });

    return NextResponse.json({ success: true, progress: saved });
  } catch (error) {
    console.error("Error saving reading progress:", error);
    return NextResponse.json(
      { error: "Failed to save reading progress" },
      { status: 500 }
    );
  }
}
