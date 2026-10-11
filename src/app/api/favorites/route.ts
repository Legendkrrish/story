import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getCurrentSession();
    const userId = session?.userId || "reader-1";
    const favorites = db.getUserFavorites(userId);
    return NextResponse.json({ success: true, favorites });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    const userId = session?.userId || "reader-1";
    const { itemType, itemId } = await request.json();

    if (!itemType || !itemId) {
      return NextResponse.json(
        { error: "Item type and ID are required" },
        { status: 400 }
      );
    }

    const isFavorited = db.toggleFavorite(userId, itemType, itemId);
    return NextResponse.json({ success: true, isFavorited });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}
