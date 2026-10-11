import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  Compass,
  Users,
  Eye,
  FileUp,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardOverview() {
  const stats = db.getDashboardStats();
  const recentBooks = db.getBooks().slice(0, 4);

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#C8A66A]/20">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5EBD7]">
            Sanctuary Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#F5EBD7]/70 font-sans mt-1">
            Real-time platform metrics, reading sessions, and manuscript publication status.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/books/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A66A] to-[#A68446] text-[#091812] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg flex items-center space-x-1.5 transition-all"
          >
            <FileUp className="w-4 h-4" />
            <span>Import Word DOCX</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-sans">
        <div className="bg-[#10271F] border border-[#C8A66A]/30 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-[#C8A66A]">
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#091812] px-2 py-0.5 rounded-full border border-[#C8A66A]/20">
              {stats.publishedBooks} Published
            </span>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-[#F5EBD7]">
              {stats.totalBooks}
            </div>
            <div className="text-xs text-[#F5EBD7]/60 mt-1">
              Total Volumes ({stats.draftBooks} in Draft)
            </div>
          </div>
        </div>

        <div className="bg-[#10271F] border border-[#C8A66A]/30 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-[#DFCA9B]">
            <Sparkles className="w-5 h-5 text-[#C8A66A]" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#091812] px-2 py-0.5 rounded-full border border-[#C8A66A]/20">
              Curated
            </span>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-[#F5EBD7]">
              {stats.totalThoughts}
            </div>
            <div className="text-xs text-[#F5EBD7]/60 mt-1">
              Daily Thoughts Scheduled
            </div>
          </div>
        </div>

        <div className="bg-[#10271F] border border-[#C8A66A]/30 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-[#DFCA9B]">
            <Compass className="w-5 h-5 text-[#C8A66A]" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#091812] px-2 py-0.5 rounded-full border border-[#C8A66A]/20">
              Fables
            </span>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-[#F5EBD7]">
              {stats.totalStories}
            </div>
            <div className="text-xs text-[#F5EBD7]/60 mt-1">
              Short Stories in Library
            </div>
          </div>
        </div>

        <div className="bg-[#10271F] border border-[#C8A66A]/30 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between text-[#DFCA9B]">
            <TrendingUp className="w-5 h-5 text-[#C8A66A]" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#091812] px-2 py-0.5 rounded-full border border-[#C8A66A]/20">
              Live
            </span>
          </div>
          <div>
            <div className="text-3xl font-serif font-bold text-[#F5EBD7]">
              {stats.totalReadingSessions}
            </div>
            <div className="text-xs text-[#F5EBD7]/60 mt-1">
              Interactive 3D Sessions
            </div>
          </div>
        </div>
      </div>

      {/* Popular Books & Recent Additions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Read Volumes */}
        <div className="bg-[#10271F] border border-[#C8A66A]/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#C8A66A]/15">
            <h2 className="font-serif text-lg font-bold text-[#F5EBD7] flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-[#C8A66A]" />
              <span>Most Popular Volumes</span>
            </h2>
            <Link
              href="/admin/books"
              className="text-xs text-[#C8A66A] hover:underline"
            >
              Manage all →
            </Link>
          </div>

          <div className="space-y-3">
            {stats.popularBooks.map((book, idx) => (
              <div
                key={book.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#091812]/80 border border-[#C8A66A]/20 hover:border-[#C8A66A]/40 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-serif font-bold text-sm text-[#C8A66A] w-5">
                    #{idx + 1}
                  </span>
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-9 h-12 object-cover rounded border border-[#C8A66A]/40"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#F5EBD7] line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="font-sans text-[11px] text-[#DFCA9B]/70">
                      By {book.author}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-[#DFCA9B]">
                    {book.reads} reads
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations Guide */}
        <div className="bg-[#10271F] border border-[#C8A66A]/30 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="pb-3 border-b border-[#C8A66A]/15">
            <h2 className="font-serif text-lg font-bold text-[#F5EBD7] flex items-center space-x-2">
              <FileUp className="w-4 h-4 text-[#C8A66A]" />
              <span>Word Manuscript Importer</span>
            </h2>
          </div>

          <p className="text-xs text-[#F5EBD7]/80 leading-relaxed font-sans">
            You do not need to format books manually. Upload your Microsoft Word (.docx) document:
          </p>

          <ol className="text-xs text-[#DFCA9B] space-y-2 font-sans list-decimal list-inside pl-1">
            <li>Headings are automatically parsed into numbered chapters.</li>
            <li>Italics, boldface, blockquotes, and paragraphs are preserved.</li>
            <li>Review and tweak in the live preview editor before publishing.</li>
            <li>Dynamic pagination ensures smooth double-page 3D turning.</li>
          </ol>

          <div className="pt-2">
            <Link
              href="/admin/books/new"
              className="w-full py-3 rounded-xl bg-[#C8A66A] text-[#091812] text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 hover:brightness-110 shadow-md transition-all"
            >
              <span>Launch DOCX Importer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
