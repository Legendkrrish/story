import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const session = await getCurrentSession();
    const userId = session?.userId || "reader-1";
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId") || undefined;

    const bookmarks = db.getUserBookmarks(userId, bookId);
    return NextResponse.json({ success: true, bookmarks });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    const userId = session?.userId || "reader-1";
    const body = await request.json();

    if (!body.book_id || body.page_number === undefined) {
      return NextResponse.json(
        { error: "Book ID and page number are required" },
        { status: 400 }
      );
    }

    const newBookmark = db.saveBookmark({
      user_id: userId,
      book_id: body.book_id,
      chapter_id: body.chapter_id,
      page_number: body.page_number,
      chapter_title: body.chapter_title,
      note: body.note,
      quote: body.quote,
    });

    return NextResponse.json({ success: true, bookmark: newBookmark });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save bookmark" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getCurrentSession();
    const userId = session?.userId || "reader-1";
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Bookmark ID is required" },
        { status: 400 }
      );
    }

    db.deleteBookmark(id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
