import React from "react";
import Link from "next/link";
import {
  Bookmark,
  BookOpen,
  Clock,
  Sparkles,
  User,
  LogOut,
  ChevronRight,
  Heart,
} from "lucide-react";
import { getCurrentSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Personal Shelf — The Living Book",
  description: "Your sanctuary of saved volumes, active bookmarks, and reading progress.",
};

export default async function ProfilePage() {
  const session = await getCurrentSession();
  const userId = session?.userId || "reader-1"; // Show demo reader shelf if guest

  const profile = db.getProfile(userId) || {
    id: "reader-1",
    email: "reader@thelivingbook.com",
    display_name: "Rowan the Seeker",
    role: "reader" as const,
    favorite_genre: "Mystery",
    created_at: new Date().toISOString(),
  };

  const readingProgress = db.getUserReadingProgress(userId);
  const bookmarks = db.getUserBookmarks(userId);
  const favorites = db.getUserFavorites(userId);

  return (
    <div className="min-h-screen bg-[#091812] pt-28 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(21,50,40,0.8),transparent)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Profile Header Banner */}
        <div className="bg-[#10271F]/90 border border-[#C8A66A]/40 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md mb-12 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-[#091812] border-2 border-[#C8A66A] flex items-center justify-center text-3xl font-serif text-[#DFCA9B] shadow-xl">
              {profile.display_name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#091812] border border-[#C8A66A]/30 text-[10px] font-bold uppercase tracking-wider text-[#C8A66A]">
                <span>Role: {profile.role}</span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#F5EBD7]">
                {profile.display_name}
              </h1>
              <p className="text-xs text-[#DFCA9B]/80 font-sans">
                {profile.email} • Sanctuary Reader
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {profile.role === "admin" && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-full bg-[#C8A66A] text-[#091812] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-md"
              >
                Admin Dashboard
              </Link>
            )}
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-[#091812] border border-[#C8A66A]/30 text-xs text-[#DFCA9B] hover:text-[#F5EBD7] hover:border-[#C8A66A] flex items-center space-x-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>

        {/* Section 1: In Progress Reads */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#F5EBD7] flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-[#C8A66A]" />
              <span>In Progress Volumes ({readingProgress.length})</span>
            </h2>
            <Link
              href="/books"
              className="text-xs text-[#DFCA9B] hover:text-[#F5EBD7] uppercase tracking-wider font-semibold"
            >
              Browse Library →
            </Link>
          </div>

          {readingProgress.length === 0 ? (
            <div className="p-8 text-center bg-[#10271F]/50 rounded-2xl border border-[#C8A66A]/20 text-[#DFCA9B]">
              <p className="font-serif">You have no active reading sessions yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {readingProgress.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#10271F] rounded-2xl p-6 border border-[#C8A66A]/30 shadow-lg flex items-center gap-5 hover:border-[#C8A66A] transition-colors"
                >
                  <img
                    src={item.book.cover_url}
                    alt={item.book.title}
                    className="w-20 h-28 object-cover rounded-lg border border-[#C8A66A]/40 shadow-md"
                  />
                  <div className="flex-1 space-y-2">
                    <span className="text-[10px] text-[#C8A66A] uppercase tracking-wider font-bold block">
                      {item.book.category?.name || "Book"}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#F5EBD7] line-clamp-1">
                      {item.book.title}
                    </h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-[#DFCA9B]">
                        <span>Page {item.current_page} of {item.total_pages}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#091812] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#C8A66A] to-[#DFCA9B]"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      href={`/read/${item.book.slug}?page=${item.current_page}`}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-[#DFCA9B] hover:text-[#F5EBD7] pt-1"
                    >
                      <span>Resume Reading</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Bookmarks */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#F5EBD7] flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-[#C8A66A] fill-current" />
              <span>Silk Ribbon Bookmarks ({bookmarks.length})</span>
            </h2>
          </div>

          {bookmarks.length === 0 ? (
            <div className="p-8 text-center bg-[#10271F]/50 rounded-2xl border border-[#C8A66A]/20 text-[#DFCA9B]">
              <p className="font-serif">No pages ribbon-marked yet. Tap the ribbon bookmark in the 3D reader.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="paper-texture text-[#25241F] rounded-2xl p-6 border border-[#C8A66A]/40 shadow-lg relative flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#25241F]/60">
                      <span>{new Date(bm.created_at).toLocaleDateString()}</span>
                      <span className="font-bold text-[#9E2A2B]">Page {bm.page_number}</span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#10271F]">
                      {bm.chapter_title || "Marked Passage"}
                    </h3>
                    {bm.quote && (
                      <blockquote className="font-serif italic text-sm text-[#25241F]/80 border-l-2 border-[#C8A66A] pl-3 py-1">
                        “{bm.quote}”
                      </blockquote>
                    )}
                    {bm.note && (
                      <p className="text-xs font-sans text-[#536B4E]">
                        Note: {bm.note}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#25241F]/15 flex items-center justify-between">
                    <Link
                      href={`/read/${bm.book_id}?page=${bm.page_number}`}
                      className="text-xs font-bold text-[#10271F] hover:text-[#9E2A2B] underline"
                    >
                      Jump to Page {bm.page_number} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
