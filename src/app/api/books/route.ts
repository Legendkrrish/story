import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;
    const featured = searchParams.get("featured")
      ? searchParams.get("featured") === "true"
      : undefined;

    const books = db.getBooks({ categorySlug, status, search, featured });
    return NextResponse.json({ success: true, books });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
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
    if (!body.title || !body.author) {
      return NextResponse.json(
        { error: "Title and author are required" },
        { status: 400 }
      );
    }

    const newBook = db.saveBook(body);
    return NextResponse.json({ success: true, book: newBook });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}
