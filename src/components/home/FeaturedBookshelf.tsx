"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  BookMarked,
  Sparkles,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Book, Category, ReadingProgress } from "@/types/database";

interface FeaturedBookshelfProps {
  books: Book[];
  categories: Category[];
  userProgress?: ReadingProgress[];
}

export default function FeaturedBookshelf({
  books,
  categories,
  userProgress = [],
}: FeaturedBookshelfProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);

  // Filter books
  const filteredBooks = books.filter((b) => {
    if (selectedCategory === "all") return true;
    return (
      b.category?.slug.toLowerCase() === selectedCategory.toLowerCase() ||
      b.category_id === selectedCategory
    );
  });

  // Helper to find reading progress for a book
  const getProgress = (bookId: string) => {
    return userProgress.find((p) => p.book_id === bookId);
  };

  return (
    <section id="bookshelf" className="py-24 relative bg-[#091812] overflow-hidden">
      {/* Subtle Wood and Forest Grain Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(16,39,31,0.9),rgba(9,24,18,1))] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-[#C8A66A] text-xs font-semibold uppercase tracking-[0.25em]">
              <BookOpen className="w-4 h-4" />
              <span>Curated Shelves</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5EBD7]">
              The Grand Bookshelf
            </h2>
            <p className="text-sm sm:text-base text-[#F5EBD7]/70 font-serif max-w-xl">
              Each spine contains a living world. Touch any volume to open its pages and commence your voyage.
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-[#DFCA9B] hover:text-[#F5EBD7] underline-offset-4 hover:underline transition-colors group"
          >
            <span>Browse Complete Library ({books.length})</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-14 scrollbar-none no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-[#C8A66A] text-[#091812] font-bold shadow-lg shadow-[#C8A66A]/20"
                : "bg-[#10271F]/80 text-[#F5EBD7]/70 border border-[#C8A66A]/20 hover:border-[#C8A66A]/50 hover:text-[#F5EBD7]"
            }`}
          >
            All Books
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === cat.slug
                  ? "bg-[#C8A66A] text-[#091812] font-bold shadow-lg shadow-[#C8A66A]/20"
                  : "bg-[#10271F]/80 text-[#F5EBD7]/70 border border-[#C8A66A]/20 hover:border-[#C8A66A]/50 hover:text-[#F5EBD7]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 3D Bookshelf Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8 pt-4">
            {filteredBooks.map((book) => {
              const progress = getProgress(book.id);
              const isHovered = hoveredBookId === book.id;

              return (
                <div
                  key={book.id}
                  className="flex flex-col items-center group relative perspective-1000"
                  onMouseEnter={() => setHoveredBookId(book.id)}
                  onMouseLeave={() => setHoveredBookId(null)}
                >
                  {/* The Physical 3D Book */}
                  <Link
                    href={`/books/${book.slug}`}
                    className="relative w-56 sm:w-60 h-80 sm:h-84 cursor-pointer block transform-style-3d transition-all duration-500 ease-out"
                    style={{
                      transform: isHovered
                        ? "translateY(-16px) rotateY(-18deg) rotateX(4deg) scale(1.03)"
                        : "translateY(0px) rotateY(-5deg) scale(1)",
                    }}
                  >
                    {/* Dynamic Ambient Drop Shadow underneath book */}
                    <div
                      className="absolute -bottom-8 left-4 right-4 h-8 bg-black/80 rounded-full blur-xl transition-all duration-500"
                      style={{
                        transform: isHovered
                          ? "translateY(12px) scale(1.15)"
                          : "translateY(0px) scale(0.9)",
                        opacity: isHovered ? 0.9 : 0.6,
                      }}
                    />

                    {/* Book Spine (3D Left Thickness) */}
                    <div
                      className="absolute left-0 top-0 w-8 h-full rounded-l-sm border-y border-l border-[#C8A66A]/30 origin-left"
                      style={{
                        backgroundColor: book.spine_color || "#10271F",
                        transform: "rotateY(-90deg) translateX(-32px)",
                        boxShadow: "inset 0 0 10px rgba(0,0,0,0.7)",
                      }}
                    >
                      <div className="h-full flex flex-col justify-between items-center py-4">
                        <div className="w-full h-[2px] bg-[#C8A66A]/60" />
                        <div className="rotate-90 text-[#DFCA9B] font-serif text-[10px] tracking-[0.2em] uppercase font-bold whitespace-nowrap opacity-90 drop-shadow">
                          {book.title}
                        </div>
                        <div className="w-full h-[2px] bg-[#C8A66A]/60" />
                      </div>
                    </div>

                    {/* Page Edge (3D Right Edge Stacked Sheets) */}
                    <div
                      className="absolute right-0 top-1.5 bottom-1.5 w-6 bg-[#F5EBD7] book-edge-shadow rounded-r-xs border-y border-[#E8DCC4]"
                      style={{
                        transform: "rotateY(90deg) translateZ(8px) translateX(12px)",
                      }}
                    />

                    {/* Book Front Cover */}
                    <div
                      className="w-full h-full rounded-r-lg overflow-hidden border border-[#C8A66A]/50 relative shadow-2xl flex flex-col justify-between p-5"
                      style={{
                        backgroundColor: book.spine_color || "#10271F",
                        backgroundImage: `
                          linear-gradient(135deg, rgba(200, 166, 106, 0.15) 0%, transparent 60%),
                          url('${book.cover_url}')
                        `,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Darkening Scrim for Title Legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#091812]/95 via-[#091812]/50 to-[#091812]/40" />

                      {/* Light Shimmer Sweep */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                      {/* Top Bar: Genre Badge & Reading Time */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#091812]/80 backdrop-blur-sm border border-[#C8A66A]/40 text-[10px] font-semibold uppercase tracking-wider text-[#DFCA9B]">
                          {book.category?.name || "Volume"}
                        </span>
                        <div className="flex items-center space-x-1 text-[10px] text-[#F5EBD7]/80 bg-[#091812]/70 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3 text-[#C8A66A]" />
                          <span>{book.estimated_reading_time}</span>
                        </div>
                      </div>

                      {/* Bottom Details on Cover */}
                      <div className="relative z-10 space-y-2 mt-auto">
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F5EBD7] leading-tight group-hover:text-[#DFCA9B] transition-colors">
                          {book.title}
                        </h3>
                        <p className="font-serif italic text-xs text-[#DFCA9B]/90">
                          By {book.author}
                        </p>

                        {/* Reading Progress Indicator if active */}
                        {progress && (
                          <div className="pt-2">
                            <div className="flex items-center justify-between text-[10px] text-[#DFCA9B] mb-1">
                              <span>Page {progress.current_page} of {book.total_pages}</span>
                              <span>{progress.percentage}%</span>
                            </div>
                            <div className="w-full h-1 bg-[#25241F]/60 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#C8A66A] to-[#DFCA9B]"
                                style={{ width: `${progress.percentage}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Physical Wooden Bookshelf Bar Underneath */}
                  <div className="w-full max-w-[280px] h-4 mt-2 bg-gradient-to-b from-[#382315] via-[#24170D] to-[#120B06] rounded-sm shadow-xl border-t border-[#61412A] relative">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-black/60" />
                    <div className="absolute inset-x-4 -bottom-2 h-2 bg-black/40 blur-sm" />
                  </div>

                  {/* Metadata and Direct Actions below shelf */}
                  <div className="w-full max-w-[280px] pt-4 px-2 text-center space-y-2">
                    <p className="text-xs text-[#F5EBD7]/60 line-clamp-2 font-serif">
                      {book.description}
                    </p>

                    <div className="flex items-center justify-center space-x-3 pt-1">
                      <Link
                        href={`/read/${book.slug}`}
                        className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C8A66A] to-[#A68446] text-[#091812] text-xs font-bold tracking-wider uppercase hover:brightness-110 shadow-md transition-all flex items-center space-x-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Read Book</span>
                      </Link>
                      <Link
                        href={`/books/${book.slug}`}
                        className="px-3 py-1.5 rounded-full bg-[#10271F] border border-[#C8A66A]/30 text-[#DFCA9B] text-xs font-semibold hover:border-[#C8A66A] transition-colors flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
