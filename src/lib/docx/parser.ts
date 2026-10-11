import mammoth from "mammoth";
import sanitizeHtml from "sanitize-html";
import { DocxImportResult, ParsedChapter } from "@/types/database";

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "p",
    "blockquote",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "ul",
    "ol",
    "li",
    "hr",
    "br",
    "span",
  ],
  allowedAttributes: {
    span: ["class", "style"],
    p: ["class"],
    blockquote: ["class"],
  },
};

export async function parseDocxBuffer(
  buffer: Buffer,
  fallbackTitle: string = "Untitled Manuscript",
  fallbackAuthor: string = "Anonymous"
): Promise<DocxImportResult> {
  const result = await mammoth.convertToHtml(
    { buffer },
    {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Quote'] => blockquote:fresh",
        "p[style-name='Intense Quote'] => blockquote:fresh",
      ],
    }
  );

  const rawHtml = result.value || "";
  const sanitized = sanitizeHtml(rawHtml, SANITIZE_OPTIONS);

  return processExtractedHtml(sanitized, fallbackTitle, fallbackAuthor);
}

export function parsePlainText(
  text: string,
  fallbackTitle: string = "Untitled Story",
  fallbackAuthor: string = "Anonymous"
): DocxImportResult {
  // Convert plain text into paragraphs & detect chapter breaks
  const paragraphs = text
    .split(/\r?\n\r?\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  let html = "";
  for (const p of paragraphs) {
    if (/^(Chapter|Part|Section|Book)\s+[0-9IVXLCDM]+/i.test(p) || p.length < 50 && p.toUpperCase() === p) {
      html += `<h2>${escapeHtml(p)}</h2>\n`;
    } else {
      html += `<p>${escapeHtml(p)}</p>\n`;
    }
  }

  return processExtractedHtml(html, fallbackTitle, fallbackAuthor);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function processExtractedHtml(
  html: string,
  defaultTitle: string,
  defaultAuthor: string
): DocxImportResult {
  const chapters: ParsedChapter[] = [];

  // Check if there are headings to split by
  const headingRegex = /<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi;
  const matches = [...html.matchAll(headingRegex)];

  if (matches.length > 0) {
    // Split into chapters along headings
    for (let i = 0; i < matches.length; i++) {
      const currentMatch = matches[i];
      const nextMatch = matches[i + 1];

      const chapterTitle = stripTags(currentMatch[1]).trim() || `Chapter ${i + 1}`;
      const startIndex = currentMatch.index! + currentMatch[0].length;
      const endIndex = nextMatch ? nextMatch.index! : html.length;

      const chapterHtml = html.substring(startIndex, endIndex).trim();
      const rawText = stripTags(chapterHtml);
      const wordCount = countWords(rawText);

      chapters.push({
        chapter_number: i + 1,
        title: chapterTitle,
        content_html: chapterHtml || `<p>${chapterTitle}</p>`,
        raw_text: rawText,
        word_count: wordCount,
      });
    }
  } else {
    // No headings found: treat as single chapter or divide by word blocks if very long
    const rawText = stripTags(html);
    const wordCount = countWords(rawText);

    chapters.push({
      chapter_number: 1,
      title: "Chapter 1",
      content_html: html || "<p>Empty document content.</p>",
      raw_text: rawText,
      word_count: wordCount,
    });
  }

  const totalWords = chapters.reduce((acc, c) => acc + c.word_count, 0);
  const minutes = Math.max(1, Math.round(totalWords / 200));
  const estimatedReadingTime =
    minutes >= 60
      ? `${(minutes / 60).toFixed(1)} hours`
      : `${minutes} mins`;

  return {
    title: defaultTitle,
    author: defaultAuthor,
    description: chapters[0]?.raw_text.substring(0, 180).trim() + "..." || "",
    chapters,
    totalWords,
    estimatedReadingTime,
  };
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Paginates chapter HTML content into reading pages.
 * Ensures no broken HTML tags or cut words.
 */
export function paginateChapterContent(
  contentHtml: string,
  wordsPerPage: number = 220
): string[] {
  // Split into paragraphs
  const paragraphRegex = /<p[^>]*>[\s\S]*?<\/p>|<blockquote[^>]*>[\s\S]*?<\/blockquote>|<h[1-4][^>]*>[\s\S]*?<\/h[1-4]>/gi;
  const blocks = contentHtml.match(paragraphRegex);

  if (!blocks || blocks.length === 0) {
    // Fallback: simple text block splitting
    const raw = stripTags(contentHtml);
    const words = raw.split(/\s+/);
    const pages: string[] = [];
    for (let i = 0; i < words.length; i += wordsPerPage) {
      pages.push(`<p>${words.slice(i, i + wordsPerPage).join(" ")}</p>`);
    }
    return pages.length > 0 ? pages : ["<p>No content on this page.</p>"];
  }

  const pages: string[] = [];
  let currentPageBlocks: string[] = [];
  let currentWordCount = 0;

  for (const block of blocks) {
    const blockWords = countWords(stripTags(block));

    if (currentWordCount + blockWords > wordsPerPage && currentPageBlocks.length > 0) {
      pages.push(currentPageBlocks.join("\n"));
      currentPageBlocks = [block];
      currentWordCount = blockWords;
    } else {
      currentPageBlocks.push(block);
      currentWordCount += blockWords;
    }
  }

  if (currentPageBlocks.length > 0) {
    pages.push(currentPageBlocks.join("\n"));
  }

  return pages;
}
