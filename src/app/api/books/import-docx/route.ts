import { NextResponse } from "next/server";
import { parseDocxBuffer, parsePlainText } from "@/lib/docx/parser";
import { verifyAdminSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized: Admin privileges required" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "Untitled Manuscript";
    const author = (formData.get("author") as string) || "Unknown Author";

    if (!file) {
      return NextResponse.json(
        { error: "No document file provided" },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let importResult;

    if (fileName.endsWith(".docx")) {
      importResult = await parseDocxBuffer(buffer, title, author);
    } else if (fileName.endsWith(".txt") || fileName.endsWith(".md")) {
      const textContent = buffer.toString("utf-8");
      importResult = parsePlainText(textContent, title, author);
    } else {
      return NextResponse.json(
        {
          error:
            "Unsupported file format. Please upload a Microsoft Word (.docx), Markdown (.md), or plain text (.txt) file.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: importResult,
    });
  } catch (error: any) {
    console.error("DOCX Import error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to parse document" },
      { status: 500 }
    );
  }
}
