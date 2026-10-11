import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const book = db.getMostReadBook();
    return NextResponse.json({ success: true, book });
  } catch (error) {
    console.error("Error fetching most read book:", error);
    return NextResponse.json(
      { error: "Failed to fetch most read book" },
      { status: 500 }
    );
  }
}
