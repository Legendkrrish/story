"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Bookmark, ArrowRight, Clock } from "lucide-react";
import { Book, ReadingProgress } from "@/types/database";

interface ContinueReadingSectionProps {
  initialProgress?: (ReadingProgress & { book: Book })[];
}

export default function ContinueReadingSection({
  initialProgress = [],
}: ContinueReadingSectionProps) {
  const [items, setItems] = useState<(ReadingProgress & { book: Book })[]>(
    initialProgress
  );

  useEffect(() => {
    if (initialProgress.length === 0) {
      fetch("/api/reading-progress")
        .then((res) => res.json())
        .then((data) => {
          if (data.progress && data.progress.length > 0) {
            setItems(data.progress);
          }
        })
        .catch(console.error);
    }
  }, [initialProgress]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[#07130E] border-y border-[#C8A66A]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 text-[#C8A66A] text-xs font-semibold uppercase tracking-wider">
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Resume Journey</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F5EBD7]">
              Continue Reading
            </h2>
          </div>
          <Link
            href="/profile"
            className="text-xs font-semibold text-[#DFCA9B] hover:text-[#F5EBD7] uppercase tracking-wider"
          >
            All Saved ({items.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.slice(0, 2).map((item) => {
            const book = item.book;
            if (!book) return null;

            return (
              <div
                key={item.id}
                className="bg-[#10271F]/90 rounded-2xl p-5 border border-[#C8A66A]/30 shadow-lg flex flex-col sm:flex-row items-center gap-5 hover:border-[#C8A66A] transition-all group"
              >
                {/* Book Mini Cover */}
                <div className="w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-[#C8A66A]/40 shadow-md relative">
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Information & Progress Bar */}
                <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-between text-xs text-[#C8A66A]">
                    <span className="font-medium uppercase tracking-wider text-[10px]">
                      {book.category?.name || "Book"}
                    </span>
                    <span className="text-[#F5EBD7]/60 text-[11px]">
                      Last read recently
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#F5EBD7] group-hover:text-[#DFCA9B] transition-colors">
                    {book.title}
                  </h3>

                  <p className="text-xs font-serif italic text-[#DFCA9B]/80">
                    By {book.author}
                  </p>

                  <div className="pt-2 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[#F5EBD7]/80">
                      <span>
                        Page <strong>{item.current_page}</strong> of{" "}
                        {item.total_pages}
                      </span>
                      <span className="font-bold text-[#C8A66A]">
                        {item.percentage}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#091812] rounded-full overflow-hidden border border-[#C8A66A]/20">
                      <div
                        className="h-full bg-gradient-to-r from-[#C8A66A] to-[#DFCA9B] rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-center sm:justify-start">
                    <Link
                      href={`/read/${book.slug}?page=${item.current_page}`}
                      className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#C8A66A] text-[#091812] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-sm transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Resume at Page {item.current_page}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
