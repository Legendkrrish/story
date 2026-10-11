import React from "react";
import Link from "next/link";
import { BookOpen, Sparkles, Clock, Search, ArrowRight, Eye } from "lucide-react";
import { db } from "@/lib/db";

interface BooksPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Grand Library — All Volumes",
  description: "Browse the complete collection of living books, philosophical treatises, and enchanted fiction.",
};

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const { category, search } = await searchParams;
  const categories = db.getCategories();
  const books = db.getBooks({
    categorySlug: category,
    search: search,
    status: "published",
  });

  return (
    <div className="min-h-screen bg-[#091812] pt-28 pb-24 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(21,50,40,0.8),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#10271F] border border-[#C8A66A]/30 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFCA9B]">
            <BookOpen className="w-4 h-4 text-[#C8A66A]" />
            <span>The Living Archives</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#F5EBD7]">
            The Grand Library
          </h1>
          <p className="text-base text-[#F5EBD7]/70 font-serif max-w-2xl mx-auto">
            Step between the shadowed shelves. Every manuscript is bound with care, waiting to be drawn into the light.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-[#10271F]/80 border border-[#C8A66A]/30 rounded-2xl p-4 sm:p-6 mb-12 shadow-xl backdrop-blur-sm space-y-4">
          {/* Search Box */}
          <form method="GET" action="/books" className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A66A]" />
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="Search by title, author, or keyword..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] placeholder-[#F5EBD7]/40 text-sm focus:outline-none focus:border-[#C8A66A] transition-colors"
            />
          </form>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            <Link
              href="/books"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                !category
                  ? "bg-[#C8A66A] text-[#091812]"
                  : "bg-[#091812] text-[#F5EBD7]/70 hover:text-[#F5EBD7] border border-[#C8A66A]/20"
              }`}
            >
              All Volumes ({books.length})
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/books?category=${cat.slug}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  category === cat.slug
                    ? "bg-[#C8A66A] text-[#091812]"
                    : "bg-[#091812] text-[#F5EBD7]/70 hover:text-[#F5EBD7] border border-[#C8A66A]/20"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <div className="text-center py-24 space-y-4 paper-texture rounded-2xl border border-[#C8A66A]/40 text-[#25241F] max-w-lg mx-auto p-12">
            <Sparkles className="w-12 h-12 text-[#C8A66A] mx-auto" />
            <h3 className="font-serif text-2xl font-bold">No Manuscripts Found</h3>
            <p className="font-serif text-sm text-[#25241F]/70">
              No volumes matched your search query in this corridor.
            </p>
            <Link
              href="/books"
              className="inline-block px-5 py-2 rounded-full bg-[#10271F] text-[#F5EBD7] text-xs font-bold uppercase tracking-wider"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-[#10271F]/90 rounded-2xl overflow-hidden border border-[#C8A66A]/30 shadow-xl hover:border-[#C8A66A] transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Book Card Cover Banner */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10271F] via-[#10271F]/40 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full bg-[#091812]/80 backdrop-blur-sm border border-[#C8A66A]/40 text-[10px] font-bold uppercase tracking-wider text-[#DFCA9B]">
                      {book.category?.name || "Archive"}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#DFCA9B]">
                    <div className="flex items-center space-x-1 bg-[#091812]/70 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      <Clock className="w-3.5 h-3.5 text-[#C8A66A]" />
                      <span>{book.estimated_reading_time}</span>
                    </div>
                    <span className="bg-[#091812]/70 px-2.5 py-1 rounded-full backdrop-blur-sm text-[11px]">
                      {book.total_pages} Pages
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F5EBD7] group-hover:text-[#DFCA9B] transition-colors leading-snug">
                      {book.title}
                    </h3>
                    <p className="font-serif italic text-sm text-[#DFCA9B]">
                      By {book.author}
                    </p>
                    <p className="text-xs text-[#F5EBD7]/70 font-serif line-clamp-3 leading-relaxed pt-1">
                      {book.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#C8A66A]/15 flex items-center justify-between gap-2">
                    <Link
                      href={`/read/${book.slug}`}
                      className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-[#C8A66A] to-[#A68446] text-[#091812] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-md transition-all text-center flex items-center justify-center space-x-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read 3D Book</span>
                    </Link>

                    <Link
                      href={`/books/${book.slug}`}
                      className="px-3.5 py-2.5 rounded-full bg-[#091812] border border-[#C8A66A]/30 text-[#DFCA9B] hover:border-[#C8A66A] transition-colors text-xs font-semibold"
                      title="Inspect Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
