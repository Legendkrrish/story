import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminSession } from "@/lib/auth/session";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const updated = db.saveThought({ ...body, id });

    return NextResponse.json({ success: true, thought: updated });
  } catch (error) {
    console.error("Error updating thought:", error);
    return NextResponse.json(
      { error: "Failed to update thought" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    db.deleteThought(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting thought:", error);
    return NextResponse.json(
      { error: "Failed to delete thought" },
      { status: 500 }
    );
  }
}

// Track share or copy counts
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await request.json();

    if (action === "share" || action === "copy") {
      db.incrementThoughtStat(id, action);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to record stat" },
      { status: 500 }
    );
  }
}
