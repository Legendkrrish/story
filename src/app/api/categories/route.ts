import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const categories = db.getCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
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
    if (!body.name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const category = db.saveCategory(body);
    return NextResponse.json({ success: true, category });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
