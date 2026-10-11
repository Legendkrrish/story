"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileUp,
  BookOpen,
  CheckCircle,
  Eye,
  ArrowLeft,
  Sparkles,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Category, ParsedChapter } from "@/types/database";

export default function NewBookImportPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [coverUrl, setCoverUrl] = useState(
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800"
  );
  const [spineColor, setSpineColor] = useState("#1A3C34");
  const [publicationStatus, setPublicationStatus] = useState<
    "published" | "draft" | "scheduled" | "archived"
  >("published");

  // Document file & parsing state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [importDone, setImportDone] = useState(false);
  const [parsedChapters, setParsedChapters] = useState<ParsedChapter[]>([]);
  const [activeChapterTab, setActiveChapterTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Categories
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setCategoryId(data.categories[0].id);
          }
        }
      })
      .catch(console.error);
  }, []);

  // Handle file upload selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Auto pre-fill title from filename if empty
      if (!title) {
        const cleanName = file.name
          .replace(/\.(docx|txt|md)$/i, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setTitle(cleanName);
      }
    }
  };

  // Test with preloaded sample DOCX
  const handleUseSampleDocx = async () => {
    try {
      setIsParsing(true);
      setStatusMessage(null);
      const res = await fetch("/sample-documents/the-forgotten-sanctuary.docx");
      const blob = await res.blob();
      const file = new File([blob], "the-forgotten-sanctuary.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      setSelectedFile(file);
      setTitle("The Forgotten Sanctuary of Eldermere");
      setAuthor("Lady Genevieve Thorne");
      setDescription(
        "High upon the western bluffs stood the ruins of Eldermere Abbey. A tale of floating tapers, ancient brass locks, and living books."
      );

      // Now trigger parse
      await parseSelectedFile(file, "The Forgotten Sanctuary of Eldermere", "Lady Genevieve Thorne");
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: "Failed to load sample docx: " + err.message,
      });
    } finally {
      setIsParsing(false);
    }
  };

  // Parse document via API
  const handleImportAndPreview = async () => {
    if (!selectedFile) {
      setStatusMessage({
        type: "error",
        text: "Please select a .docx, .txt, or .md file to upload.",
      });
      return;
    }
    await parseSelectedFile(selectedFile, title, author);
  };

  const parseSelectedFile = async (file: File, docTitle: string, docAuthor: string) => {
    setIsParsing(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", docTitle || "Untitled Manuscript");
    formData.append("author", docAuthor || "Anonymous");

    try {
      const res = await fetch("/api/books/import-docx", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to parse document");
      }

      setParsedChapters(data.data.chapters || []);
      if (!description && data.data.description) {
        setDescription(data.data.description);
      }
      setImportDone(true);
      setStatusMessage({
        type: "success",
        text: `Successfully parsed ${data.data.chapters.length} chapters (${data.data.totalWords} words). Review and edit below before publishing.`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message,
      });
    } finally {
      setIsParsing(false);
    }
  };

  // Update chapter text in preview editor
  const handleChapterTitleChange = (index: number, newTitle: string) => {
    const updated = [...parsedChapters];
    updated[index].title = newTitle;
    setParsedChapters(updated);
  };

  const handleChapterContentChange = (index: number, newHtml: string) => {
    const updated = [...parsedChapters];
    updated[index].content_html = newHtml;
    setParsedChapters(updated);
  };

  // Submit and Publish Book
  const handlePublishBook = async () => {
    if (!title || !author) {
      setStatusMessage({
        type: "error",
        text: "Title and author are required.",
      });
      return;
    }

    if (parsedChapters.length === 0) {
      setStatusMessage({
        type: "error",
        text: "Please import a document with at least one chapter before publishing.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const payload = {
        title,
        author,
        description,
        category_id: categoryId,
        cover_url: coverUrl,
        spine_color: spineColor,
        status: publicationStatus,
        chapters: parsedChapters,
      };

      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish book");
      }

      router.push(`/admin/books`);
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#C8A66A]/20">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/books"
            className="p-2 rounded-xl bg-[#10271F] border border-[#C8A66A]/30 text-[#C8A66A] hover:border-[#C8A66A]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#F5EBD7]">
              Word Document to 3D Book
            </h1>
            <p className="text-xs text-[#F5EBD7]/70 font-sans mt-0.5">
              Upload your Microsoft Word (.docx) file. The system extracts headings, preserves typography, and generates living pages.
            </p>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center space-x-2 ${
            statusMessage.type === "success"
              ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-200"
              : "bg-red-950/70 border border-red-500/40 text-red-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Step 1: Metadata & Upload Form */}
      <div className="bg-[#10271F] border border-[#C8A66A]/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h2 className="font-serif text-xl font-bold text-[#F5EBD7] flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-[#C8A66A] text-[#091812] text-xs font-bold flex items-center justify-center font-sans">
            1
          </span>
          <span>Book Metadata & File Selection</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
          <div>
            <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Book Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. The Forgotten Sanctuary of Eldermere"
              className="w-full px-4 py-3 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] placeholder-[#F5EBD7]/40 focus:outline-none focus:border-[#C8A66A]"
            />
          </div>

          <div>
            <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Author Name *
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="E.g. Lady Genevieve Thorne"
              className="w-full px-4 py-3 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] placeholder-[#F5EBD7]/40 focus:outline-none focus:border-[#C8A66A]"
            />
          </div>

          <div>
            <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Genre / Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Publication Status
            </label>
            <select
              value={publicationStatus}
              onChange={(e) => setPublicationStatus(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A]"
            >
              <option value="published">Published (Visible to public)</option>
              <option value="draft">Draft (Archivist only)</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Synopsis / Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief overview of the manuscript's themes and story..."
              className="w-full px-4 py-3 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] placeholder-[#F5EBD7]/40 focus:outline-none focus:border-[#C8A66A]"
            />
          </div>

          <div>
            <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A]"
            />
          </div>

          <div>
            <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
              Spine & Cover Base Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={spineColor}
                onChange={(e) => setSpineColor(e.target.value)}
                className="w-12 h-11 rounded-lg bg-[#091812] border border-[#C8A66A]/30 cursor-pointer"
              />
              <span className="text-xs text-[#F5EBD7]/70 font-mono">
                {spineColor}
              </span>
            </div>
          </div>
        </div>

        {/* File Dropzone */}
        <div className="pt-4 border-t border-[#C8A66A]/15">
          <label className="block text-[#DFCA9B] font-semibold mb-2 uppercase tracking-wider text-[10px]">
            Upload Microsoft Word (.docx) or Text (.txt, .md) File
          </label>

          <div className="border-2 border-dashed border-[#C8A66A]/40 rounded-2xl p-8 text-center bg-[#091812]/60 hover:border-[#C8A66A] transition-colors relative cursor-pointer">
            <input
              type="file"
              accept=".docx,.txt,.md"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="space-y-3">
              <FileUp className="w-10 h-10 text-[#C8A66A] mx-auto" />
              <div>
                <p className="font-serif font-bold text-sm text-[#F5EBD7]">
                  {selectedFile
                    ? `Selected: ${selectedFile.name}`
                    : "Drag and drop your manuscript here, or click to browse"}
                </p>
                <p className="text-xs text-[#F5EBD7]/50 mt-1">
                  Supports Microsoft Word (.docx), Markdown (.md), and plain text (.txt)
                </p>
              </div>
            </div>
          </div>

          {/* Quick Demo Preloaded DOCX Button */}
          <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
            <button
              type="button"
              onClick={handleUseSampleDocx}
              disabled={isParsing}
              className="text-xs text-[#C8A66A] hover:text-[#DFCA9B] underline flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Click to test with preloaded sample DOCX file</span>
            </button>

            <button
              type="button"
              onClick={handleImportAndPreview}
              disabled={!selectedFile || isParsing}
              className="px-5 py-2.5 rounded-xl bg-[#C8A66A] text-[#091812] text-xs font-bold uppercase tracking-wider hover:brightness-110 disabled:opacity-40 transition-all shadow-md flex items-center space-x-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>{isParsing ? "Parsing Document..." : "Import & Preview"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 2: Content Preview & Corrections Editor */}
      {importDone && parsedChapters.length > 0 && (
        <div className="bg-[#10271F] border border-[#C8A66A]/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-[#C8A66A]/20">
            <h2 className="font-serif text-xl font-bold text-[#F5EBD7] flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-[#C8A66A] text-[#091812] text-xs font-bold flex items-center justify-center font-sans">
                2
              </span>
              <span>Extracted Chapters Preview & Editor</span>
            </h2>
            <span className="text-xs text-[#DFCA9B] font-mono">
              {parsedChapters.length} Chapters Extracted
            </span>
          </div>

          {/* Chapter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#C8A66A]/15">
            {parsedChapters.map((ch, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveChapterTab(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  activeChapterTab === idx
                    ? "bg-[#C8A66A] text-[#091812]"
                    : "bg-[#091812] text-[#F5EBD7]/70 hover:text-[#F5EBD7]"
                }`}
              >
                Chapter {ch.chapter_number}: {ch.title}
              </button>
            ))}
          </div>

          {/* Active Chapter Editor */}
          {parsedChapters[activeChapterTab] && (
            <div className="space-y-4 font-sans text-xs">
              <div>
                <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Chapter {parsedChapters[activeChapterTab].chapter_number} Title
                </label>
                <input
                  type="text"
                  value={parsedChapters[activeChapterTab].title}
                  onChange={(e) =>
                    handleChapterTitleChange(activeChapterTab, e.target.value)
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A]"
                />
              </div>

              <div>
                <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Chapter HTML Content (Preserved Formatting)
                </label>
                <textarea
                  rows={8}
                  value={parsedChapters[activeChapterTab].content_html}
                  onChange={(e) =>
                    handleChapterContentChange(activeChapterTab, e.target.value)
                  }
                  className="w-full font-mono text-xs px-4 py-3 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#DFCA9B] focus:outline-none focus:border-[#C8A66A]"
                />
              </div>

              {/* Live Rendered View in Ivory Paper */}
              <div>
                <span className="block text-[#DFCA9B] font-semibold mb-2 uppercase tracking-wider text-[10px]">
                  Reader Paper Simulation
                </span>
                <div className="paper-texture text-[#25241F] rounded-2xl p-6 sm:p-8 border border-[#C8A66A]/40 shadow-inner max-h-72 overflow-y-auto">
                  <h3 className="font-serif text-xl font-bold mb-3 pb-2 border-b border-[#25241F]/15">
                    {parsedChapters[activeChapterTab].title}
                  </h3>
                  <div
                    className="font-serif leading-relaxed text-sm space-y-3"
                    dangerouslySetInnerHTML={{
                      __html: parsedChapters[activeChapterTab].content_html,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Publish Action Button */}
          <div className="pt-6 border-t border-[#C8A66A]/20 flex items-center justify-between">
            <span className="text-xs text-[#DFCA9B]">
              Ready to publish into the 3D sanctuary catalogue?
            </span>
            <button
              type="button"
              onClick={handlePublishBook}
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C8A66A] to-[#A68446] text-[#091812] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg disabled:opacity-50 transition-all flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isSubmitting ? "Publishing Book..." : "Publish Book"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
