import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  Clock,
  Bookmark,
  Share2,
  ChevronRight,
  List,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { db } from "@/lib/db";

interface BookDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = db.getBookBySlug(slug);
  if (!book) return { title: "Book Not Found" };

  return {
    title: `${book.title} by ${book.author}`,
    description: book.description,
  };
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { slug } = await params;
  const book = db.getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#091812] pt-28 pb-24 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_10%,rgba(21,50,40,0.8),transparent)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <Link
          href="/books"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#DFCA9B] hover:text-[#F5EBD7] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grand Library</span>
        </Link>

        {/* Hero Book Presentation */}
        <div className="bg-[#10271F]/90 rounded-3xl border border-[#C8A66A]/40 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: 3D Hardcover Cover Showcase */}
          <div className="lg:col-span-5 flex justify-center perspective-1000">
            <div
              className="relative w-64 sm:w-72 h-96 sm:h-[420px] rounded-r-xl overflow-hidden border-2 border-[#C8A66A]/60 shadow-2xl transform-style-3d hover:rotate-y-[-12deg] transition-transform duration-500 p-6 flex flex-col justify-between"
              style={{
                backgroundColor: book.spine_color || "#10271F",
                backgroundImage: `
                  radial-gradient(circle at 50% 30%, rgba(200, 166, 106, 0.25) 0%, transparent 70%),
                  url('${book.cover_url}')
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#091812]/95 via-[#091812]/50 to-[#091812]/40" />

              {/* Edge Stacked Paper Layer */}
              <div className="absolute right-0 top-2 bottom-2 w-4 bg-[#F5EBD7] book-edge-shadow rounded-r-xs" />

              {/* Embossed Corner Borders */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#C8A66A]" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#C8A66A]" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#C8A66A]" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#C8A66A]" />

              <div className="relative z-10 text-center">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C8A66A] font-bold">
                  {book.category?.name || "Sanctuary Volume"}
                </span>
              </div>

              <div className="relative z-10 text-center space-y-2 my-auto">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5EBD7] drop-shadow-md">
                  {book.title}
                </h2>
                <p className="font-serif italic text-sm text-[#DFCA9B]">
                  By {book.author}
                </p>
              </div>

              <div className="relative z-10 text-center">
                <span className="text-[11px] font-sans text-[#DFCA9B]/80 italic">
                  Living 3D Edition
                </span>
              </div>
            </div>
          </div>

          {/* Right: Metadata, Synopsis & Action CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 flex-wrap gap-2">
                <span className="px-3.5 py-1 rounded-full bg-[#091812] border border-[#C8A66A]/40 text-xs font-bold uppercase tracking-wider text-[#DFCA9B]">
                  {book.category?.name || "Fiction"}
                </span>
                <div className="flex items-center space-x-1 text-xs text-[#F5EBD7]/70 bg-[#091812] px-3 py-1 rounded-full border border-[#C8A66A]/20">
                  <Clock className="w-3.5 h-3.5 text-[#C8A66A]" />
                  <span>{book.estimated_reading_time}</span>
                </div>
                <span className="text-xs text-[#F5EBD7]/70 bg-[#091812] px-3 py-1 rounded-full border border-[#C8A66A]/20">
                  {book.total_pages} Pages
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5EBD7] leading-tight">
                {book.title}
              </h1>

              <p className="font-serif italic text-lg sm:text-xl text-[#DFCA9B]">
                Written by {book.author}
              </p>
            </div>

            <div className="w-20 h-[2px] bg-[#C8A66A]/40" />

            {/* Synopsis */}
            <div className="space-y-2">
              <h3 className="font-sans text-xs uppercase tracking-wider text-[#C8A66A] font-bold">
                Synopsis
              </h3>
              <p className="font-serif text-base sm:text-lg text-[#F5EBD7]/85 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href={`/read/${book.slug}`}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#C8A66A] via-[#DFCA9B] to-[#C8A66A] text-[#091812] font-bold text-sm tracking-wider uppercase shadow-xl hover:shadow-[#C8A66A]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>OPEN & READ 3D BOOK</span>
              </Link>

              <Link
                href={`/read/${book.slug}?page=1`}
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-[#091812] hover:bg-[#10271F] border border-[#C8A66A]/40 text-[#DFCA9B] text-xs font-semibold uppercase tracking-wider transition-colors text-center"
              >
                Resume from First Page
              </Link>
            </div>
          </div>
        </div>

        {/* Chapters Table of Contents */}
        <div className="mt-16 bg-[#10271F]/70 border border-[#C8A66A]/30 rounded-2xl p-6 sm:p-10 shadow-xl">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#C8A66A]/20">
            <List className="w-5 h-5 text-[#C8A66A]" />
            <h2 className="font-serif text-2xl font-bold text-[#F5EBD7]">
              Manuscript Chapters ({book.chapters?.length || 0})
            </h2>
          </div>

          <div className="space-y-3">
            {book.chapters?.map((ch) => (
              <div
                key={ch.id}
                className="bg-[#091812]/90 rounded-xl p-4 sm:p-5 border border-[#C8A66A]/20 hover:border-[#C8A66A]/50 transition-all flex items-center justify-between flex-wrap gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-3 text-xs text-[#C8A66A] font-sans">
                    <span className="uppercase tracking-wider font-bold">
                      Chapter {ch.chapter_number}
                    </span>
                    <span>•</span>
                    <span className="text-[#F5EBD7]/50">{ch.word_count} words</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#F5EBD7] group-hover:text-[#DFCA9B] transition-colors">
                    {ch.title}
                  </h3>
                </div>

                <Link
                  href={`/read/${book.slug}`}
                  className="px-4 py-2 rounded-full bg-[#10271F] border border-[#C8A66A]/40 text-xs font-bold text-[#DFCA9B] hover:bg-[#C8A66A] hover:text-[#091812] transition-colors flex items-center space-x-1.5"
                >
                  <span>Read Chapter</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
