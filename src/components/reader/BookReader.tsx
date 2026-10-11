"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Bookmark as BookmarkIcon,
  List,
  Type,
  Sun,
  Moon,
  Coffee,
  Maximize,
  Minimize,
  X,
  Volume2,
  VolumeX,
  Sparkles,
} from "lucide-react";
import { Book, BookChapter } from "@/types/database";
import { paginateChapterContent } from "@/lib/docx/parser";

interface BookReaderProps {
  book: Book & { chapters: BookChapter[] };
  initialPage?: number;
}

type ReaderTheme = "ivory" | "sepia" | "midnight";
type FontSize = "sm" | "md" | "lg" | "xl";

export default function BookReader({ book, initialPage = 1 }: BookReaderProps) {
  const router = useRouter();

  // Settings
  const [theme, setTheme] = useState<ReaderTheme>("ivory");
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Reader State
  const [isOpen, setIsOpen] = useState(false);
  const [isOpeningAnim, setIsOpeningAnim] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Pagination calculation
  const wordsPerPageMap = {
    sm: 260,
    md: 200,
    lg: 150,
    xl: 110,
  };

  // Build all pages across all chapters
  const allPages = useMemo(() => {
    const pages: {
      chapterIndex: number;
      chapterTitle: string;
      chapterNumber: number;
      html: string;
      pageNumber: number;
    }[] = [];

    let overallPageNum = 1;

    // Title / Cover Page
    pages.push({
      chapterIndex: -1,
      chapterTitle: "Frontispiece",
      chapterNumber: 0,
      html: `
        <div class="h-full flex flex-col justify-between text-center py-8">
          <div class="space-y-2">
            <span class="text-xs uppercase tracking-[0.3em] font-sans text-[#C8A66A] font-bold">The Living Book Archive</span>
            <div class="w-16 h-[1px] bg-[#C8A66A] mx-auto mt-2"></div>
          </div>
          <div class="my-auto space-y-4">
            <h1 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#10271F] dark:text-[#F5EBD7]">${book.title}</h1>
            <p class="font-serif italic text-lg text-[#B86F50]">By ${book.author}</p>
            <div class="w-24 h-[1px] bg-[#C8A66A]/50 mx-auto"></div>
            <p class="text-xs font-serif max-w-xs mx-auto text-[#25241F]/70 dark:text-[#F5EBD7]/70 italic">${book.description}</p>
          </div>
          <div class="text-[11px] font-sans text-[#25241F]/60 dark:text-[#F5EBD7]/60">
            Published in the Sanctuary • Volume 1
          </div>
        </div>
      `,
      pageNumber: overallPageNum++,
    });

    // Content pages per chapter
    book.chapters.forEach((chapter, chapIdx) => {
      const chapterPages = paginateChapterContent(
        chapter.content_html,
        wordsPerPageMap[fontSize]
      );

      chapterPages.forEach((pageHtml, pIdx) => {
        const header =
          pIdx === 0
            ? `<div class="mb-4 pb-2 border-b border-[#C8A66A]/30 text-center">
                 <span class="text-[11px] uppercase tracking-[0.25em] font-sans text-[#C8A66A] font-bold">Chapter ${chapter.chapter_number}</span>
                 <h2 class="font-serif text-xl sm:text-2xl font-bold text-[#10271F] dark:text-[#F5EBD7] mt-1">${chapter.title}</h2>
               </div>`
            : "";

        pages.push({
          chapterIndex: chapIdx,
          chapterTitle: chapter.title,
          chapterNumber: chapter.chapter_number,
          html: `${header}${pageHtml}`,
          pageNumber: overallPageNum++,
        });
      });
    });

    return pages;
  }, [book, fontSize]);

  const totalPages = allPages.length;
  const [currentPage, setCurrentPage] = useState(
    Math.min(initialPage, totalPages)
  );

  // Resume or save progress
  useEffect(() => {
    // Check local storage for bookmark & progress
    const saved = localStorage.getItem(`living_book_page_${book.id}`);
    if (saved && initialPage === 1) {
      const parsed = parseInt(saved, 10);
      if (parsed > 0 && parsed <= totalPages) {
        setCurrentPage(parsed);
      }
    }
  }, [book.id, totalPages, initialPage]);

  // Save progress on page change
  useEffect(() => {
    localStorage.setItem(`living_book_page_${book.id}`, currentPage.toString());

    // Send progress to API
    const timeout = setTimeout(() => {
      fetch("/api/reading-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_id: book.id,
          current_page: currentPage,
          total_pages: totalPages,
        }),
      }).catch(() => {});
    }, 1000);

    return () => clearTimeout(timeout);
  }, [currentPage, book.id, totalPages]);

  // Initial Book Opening Animation
  useEffect(() => {
    setIsOpeningAnim(true);
    const timer = setTimeout(() => {
      setIsOpen(true);
      setIsOpeningAnim(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        handlePrevPage();
      } else if (e.key === "Escape") {
        if (isFullscreen) {
          document.exitFullscreen?.();
          setIsFullscreen(false);
        } else {
          router.push(`/books/${book.slug}`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const playPageSound = () => {
    if (!soundEnabled) return;
    try {
      // Soft audio synthetic rustle using Web Audio API
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch (e) {}
  };

  // Next Page Handler
  const handleNextPage = () => {
    if (isFlipping) return;
    // On desktop double-page, step 2 pages
    const isDesktop = window.innerWidth >= 1024;
    const step = isDesktop ? 2 : 1;

    if (currentPage + step <= totalPages + 1) {
      setIsFlipping(true);
      setFlipDirection("next");
      playPageSound();

      setTimeout(() => {
        setCurrentPage((prev) => Math.min(totalPages, prev + step));
        setIsFlipping(false);
        setFlipDirection(null);
      }, 500);
    }
  };

  // Prev Page Handler
  const handlePrevPage = () => {
    if (isFlipping) return;
    const isDesktop = window.innerWidth >= 1024;
    const step = isDesktop ? 2 : 1;

    if (currentPage > 1) {
      setIsFlipping(true);
      setFlipDirection("prev");
      playPageSound();

      setTimeout(() => {
        setCurrentPage((prev) => Math.max(1, prev - step));
        setIsFlipping(false);
        setFlipDirection(null);
      }, 500);
    }
  };

  const toggleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        book_id: book.id,
        page_number: currentPage,
        chapter_title: allPages[currentPage - 1]?.chapterTitle || "Bookmark",
      }),
    }).catch(() => {});
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Determine current left and right page objects
  const isDesktopSpread = typeof window !== "undefined" && window.innerWidth >= 1024;
  const leftPageIndex = currentPage % 2 === 0 ? currentPage - 2 : currentPage - 1;
  const rightPageIndex = leftPageIndex + 1;

  const leftPage = allPages[leftPageIndex];
  const rightPage = allPages[rightPageIndex];

  // Theme Styles
  const themeClasses = {
    ivory: "paper-texture text-[#25241F] border-[#E8DCC4]",
    sepia: "paper-texture-sepia text-[#3D2F24] border-[#D8C7A3]",
    midnight: "paper-texture-dark text-[#E8DCC4] border-[#2C2924]",
  }[theme];

  const themePageNumber = {
    ivory: "text-[#25241F]/60",
    sepia: "text-[#3D2F24]/60",
    midnight: "text-[#E8DCC4]/60",
  }[theme];

  return (
    <div className="fixed inset-0 z-50 bg-[#091812] flex flex-col justify-between overflow-hidden select-none">
      {/* Background Dark Forest Atmosphere with Amber Reading Light */}
      <div className="absolute inset-0 bg-radial from-[#153228]/80 via-[#0C1E17] to-[#050D0A] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-96 bg-gradient-to-b from-[#C8A66A]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Floating Silk Bookmark Ribbon */}
      <div
        onClick={toggleBookmark}
        title={isBookmarked ? "Remove Bookmark" : "Bookmark this Page"}
        className={`absolute top-0 right-16 sm:right-28 z-40 w-7 sm:w-8 transition-all duration-300 cursor-pointer ${
          isBookmarked ? "h-28" : "h-16 hover:h-20"
        }`}
      >
        <div
          className={`w-full h-full rounded-b-md shadow-2xl relative transition-colors ${
            isBookmarked
              ? "bg-gradient-to-b from-[#9E2A2B] to-[#7B1E22] border-x border-[#9E2A2B]"
              : "bg-gradient-to-b from-[#C8A66A] to-[#A68446] border-x border-[#DFCA9B]"
          }`}
        >
          <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <BookmarkIcon className="w-3.5 h-3.5 text-white/90 fill-white" />
          </div>
        </div>
      </div>

      {/* Top Floating Control Bar */}
      <header className="relative z-30 px-4 sm:px-8 py-3 flex items-center justify-between border-b border-[#C8A66A]/20 bg-[#091812]/90 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <Link
            href={`/books/${book.slug}`}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#10271F] border border-[#C8A66A]/30 text-xs font-semibold text-[#DFCA9B] hover:text-[#F5EBD7] hover:border-[#C8A66A] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Close Book</span>
          </Link>
          <div className="hidden md:flex flex-col">
            <span className="font-serif text-sm font-bold text-[#F5EBD7] max-w-xs truncate">
              {book.title}
            </span>
            <span className="text-[10px] text-[#C8A66A] font-sans italic">
              {book.author}
            </span>
          </div>
        </div>

        {/* Center: Current Progress */}
        <div className="flex items-center space-x-3">
          <span className="text-xs font-serif text-[#DFCA9B] tracking-wider">
            Page {currentPage} of {totalPages}
          </span>
          <div className="w-24 sm:w-36 h-1.5 bg-[#10271F] rounded-full overflow-hidden border border-[#C8A66A]/30">
            <div
              className="h-full bg-gradient-to-r from-[#C8A66A] to-[#DFCA9B] transition-all duration-300"
              style={{
                width: `${Math.round((currentPage / totalPages) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Right Tool Buttons */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Table of Contents Drawer Toggle */}
          <button
            onClick={() => setShowToc(!showToc)}
            className={`p-2 rounded-full transition-colors ${
              showToc
                ? "bg-[#C8A66A] text-[#091812]"
                : "bg-[#10271F] text-[#DFCA9B] hover:bg-[#10271F]/80 border border-[#C8A66A]/30"
            }`}
            title="Table of Contents"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Typography Controls Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowFontMenu(!showFontMenu)}
              className="p-2 rounded-full bg-[#10271F] text-[#DFCA9B] hover:bg-[#10271F]/80 border border-[#C8A66A]/30"
              title="Typography & Appearance"
            >
              <Type className="w-4 h-4" />
            </button>

            {showFontMenu && (
              <div className="absolute right-0 top-12 w-64 bg-[#10271F] border border-[#C8A66A]/40 rounded-2xl shadow-2xl p-4 z-50 space-y-4 text-xs font-sans">
                {/* Font Size */}
                <div>
                  <span className="text-[#C8A66A] font-semibold block mb-2 uppercase tracking-wider text-[10px]">
                    Font Size
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(["sm", "md", "lg", "xl"] as FontSize[]).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setFontSize(sz)}
                        className={`py-1.5 rounded-lg font-bold uppercase transition-colors ${
                          fontSize === sz
                            ? "bg-[#C8A66A] text-[#091812]"
                            : "bg-[#091812] text-[#F5EBD7]/70 hover:text-[#F5EBD7]"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Mode */}
                <div>
                  <span className="text-[#C8A66A] font-semibold block mb-2 uppercase tracking-wider text-[10px]">
                    Paper Atmosphere
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => setTheme("ivory")}
                      className={`py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1 ${
                        theme === "ivory"
                          ? "bg-[#F5EBD7] text-[#25241F] font-bold shadow-sm"
                          : "bg-[#091812] text-[#F5EBD7]/70"
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span>Ivory</span>
                    </button>
                    <button
                      onClick={() => setTheme("sepia")}
                      className={`py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1 ${
                        theme === "sepia"
                          ? "bg-[#EBDCB9] text-[#3D2F24] font-bold shadow-sm"
                          : "bg-[#091812] text-[#F5EBD7]/70"
                      }`}
                    >
                      <Coffee className="w-3.5 h-3.5" />
                      <span>Sepia</span>
                    </button>
                    <button
                      onClick={() => setTheme("midnight")}
                      className={`py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1 ${
                        theme === "midnight"
                          ? "bg-[#171614] text-[#E8DCC4] font-bold border border-[#C8A66A]/40"
                          : "bg-[#091812] text-[#F5EBD7]/70"
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Night</span>
                    </button>
                  </div>
                </div>

                {/* Audio toggle */}
                <div className="pt-2 border-t border-[#C8A66A]/20 flex items-center justify-between">
                  <span className="text-[#F5EBD7]/80">Page-turn Sound</span>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1 rounded text-[#C8A66A] hover:bg-[#091812]"
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-[#F5EBD7]/40" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-[#10271F] text-[#DFCA9B] hover:bg-[#10271F]/80 border border-[#C8A66A]/30"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main 3D Book Experience Stage */}
      <main className="relative flex-1 flex items-center justify-center px-2 sm:px-6 py-4 perspective-2000 overflow-hidden">
        {/* Book Opening Animation Simulation */}
        {!isOpen && isOpeningAnim && (
          <div className="text-center space-y-4 animate-pulse">
            <Sparkles className="w-10 h-10 text-[#C8A66A] mx-auto animate-spin" />
            <p className="font-serif text-lg text-[#DFCA9B]">
              Opening the leaves of <em>{book.title}</em>...
            </p>
          </div>
        )}

        {isOpen && (
          <div
            className="relative w-full max-w-5xl h-[82vh] max-h-[780px] flex items-center justify-center transform-style-3d transition-transform duration-500"
            style={{
              boxShadow: "0 30px 80px -20px rgba(0, 0, 0, 0.9), 0 0 50px rgba(200, 166, 106, 0.15)",
            }}
          >
            {/* The Hardcover Binding Base (Extends behind pages) */}
            <div
              className="absolute -inset-2 sm:-inset-3 rounded-2xl border-2 border-[#C8A66A]/50 shadow-2xl -z-20"
              style={{
                backgroundColor: book.spine_color || "#10271F",
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(200, 166, 106, 0.15) 0%, rgba(0,0,0,0.6) 100%)`,
              }}
            />

            {/* Left Outer Page Block Edge (Stacked Paper Effect) */}
            <div className="absolute left-[-6px] top-3 bottom-3 w-3 bg-[#E8DCC4] book-edge-shadow rounded-l-xs -z-10" />
            {/* Right Outer Page Block Edge */}
            <div className="absolute right-[-6px] top-3 bottom-3 w-3 bg-[#E8DCC4] book-edge-shadow rounded-r-xs -z-10" />

            {/* Desktop Double-Page Spread */}
            <div className="relative w-full h-full flex rounded-xl overflow-hidden shadow-2xl">
              {/* Left Page (Even Number or Title) */}
              <div
                onClick={handlePrevPage}
                className={`hidden lg:flex flex-1 h-full p-8 sm:p-12 md:p-14 flex-col justify-between relative cursor-pointer group border-r border-[#25241F]/15 ${themeClasses}`}
              >
                {/* Gutter Spine Shadow on Right Edge of Left Page */}
                <div className="absolute right-0 top-0 bottom-0 w-16 spine-shadow-left pointer-events-none" />

                {/* Page Content */}
                <div
                  className="flex-1 font-serif leading-relaxed overflow-hidden"
                  style={{
                    fontSize:
                      fontSize === "sm"
                        ? "0.95rem"
                        : fontSize === "md"
                        ? "1.1rem"
                        : fontSize === "lg"
                        ? "1.25rem"
                        : "1.4rem",
                    lineHeight: "1.75",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: leftPage?.html || "<p class='italic opacity-40 text-center my-auto'>This page intentionally left blank.</p>",
                  }}
                />

                {/* Left Page Footer (Page Number & Chapter Name) */}
                <div className={`pt-4 border-t border-[#25241F]/10 flex items-center justify-between text-xs font-sans ${themePageNumber}`}>
                  <span>{leftPage ? leftPage.pageNumber : ""}</span>
                  <span className="italic truncate max-w-[200px] font-serif">
                    {leftPage?.chapterTitle || book.title}
                  </span>
                </div>

                {/* Left Page Curl Hover Hint & Corner Curl Fold */}
                <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-tr from-black/15 to-transparent rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-2 left-2 w-8 h-8 opacity-0 group-hover:opacity-60 transition-opacity flex items-center justify-center text-[#C8A66A]">
                  <ChevronLeft className="w-5 h-5" />
                </div>
              </div>

              {/* Central Spine Gutter Joint with Headband Cloth */}
              <div className="hidden lg:flex flex-col justify-between items-center w-[4px] h-full bg-gradient-to-r from-black/50 via-black/85 to-black/50 z-20 shadow-inner relative">
                {/* Top Headband Cloth Accent */}
                <div className="w-3 h-1.5 bg-gradient-to-r from-[#DFCA9B] via-[#9E2A2B] to-[#DFCA9B] shadow-xs rounded-b-xs" />
                {/* Bottom Tailband Cloth Accent */}
                <div className="w-3 h-1.5 bg-gradient-to-r from-[#DFCA9B] via-[#9E2A2B] to-[#DFCA9B] shadow-xs rounded-t-xs" />
              </div>

              {/* Right Page (Odd Number) - Active on Mobile as Single Page */}
              <div
                onClick={handleNextPage}
                className={`flex-1 h-full p-8 sm:p-12 md:p-14 flex flex-col justify-between relative cursor-pointer group ${themeClasses}`}
              >
                {/* Gutter Spine Shadow on Left Edge of Right Page */}
                <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-16 spine-shadow-right pointer-events-none" />

                {/* Page Content */}
                <div
                  className="flex-1 font-serif leading-relaxed overflow-hidden"
                  style={{
                    fontSize:
                      fontSize === "sm"
                        ? "0.95rem"
                        : fontSize === "md"
                        ? "1.1rem"
                        : fontSize === "lg"
                        ? "1.25rem"
                        : "1.4rem",
                    lineHeight: "1.75",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: rightPage?.html || "<p class='italic opacity-40 text-center my-auto'>End of volume.</p>",
                  }}
                />

                {/* Right Page Footer */}
                <div className={`pt-4 border-t border-[#25241F]/10 flex items-center justify-between text-xs font-sans ${themePageNumber}`}>
                  <span className="italic truncate max-w-[200px] font-serif">
                    {rightPage?.chapterTitle || book.title}
                  </span>
                  <span>{rightPage ? rightPage.pageNumber : ""}</span>
                </div>

                {/* Right Page Curl Hover Hint & Corner Curl Fold */}
                <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-tl from-black/15 to-transparent rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-60 transition-opacity flex items-center justify-center text-[#C8A66A]">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Simulated 3D Flipping Leaf Overlay */}
            {isFlipping && (
              <div
                className={`absolute inset-0 z-30 pointer-events-none flex transition-all duration-500 ${
                  flipDirection === "next"
                    ? "animate-in fade-in"
                    : "animate-in fade-in"
                }`}
              >
                <div className="w-full h-full bg-black/10 backdrop-blur-[0.5px]" />
              </div>
            )}
          </div>
        )}

        {/* Previous and Next Physical Side Arrows */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="absolute left-2 sm:left-6 z-30 w-12 h-12 rounded-full bg-[#10271F]/90 border border-[#C8A66A]/40 text-[#C8A66A] hover:bg-[#C8A66A] hover:text-[#091812] disabled:opacity-20 disabled:hover:bg-[#10271F] disabled:hover:text-[#C8A66A] flex items-center justify-center shadow-2xl transition-all duration-200"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className="absolute right-2 sm:right-6 z-30 w-12 h-12 rounded-full bg-[#10271F]/90 border border-[#C8A66A]/40 text-[#C8A66A] hover:bg-[#C8A66A] hover:text-[#091812] disabled:opacity-20 disabled:hover:bg-[#10271F] disabled:hover:text-[#C8A66A] flex items-center justify-center shadow-2xl transition-all duration-200"
          aria-label="Next Page"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </main>

      {/* Bottom Floating Navigation Toolbar */}
      <footer className="relative z-30 px-4 sm:px-8 py-3 flex items-center justify-between border-t border-[#C8A66A]/20 bg-[#091812]/90 backdrop-blur-md">
        <div className="flex items-center space-x-2 text-xs font-sans text-[#F5EBD7]/70">
          <span className="hidden sm:inline">Use</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#10271F] border border-[#C8A66A]/30 text-[10px] text-[#DFCA9B]">
            ←
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-[#10271F] border border-[#C8A66A]/30 text-[10px] text-[#DFCA9B]">
            →
          </kbd>
          <span className="hidden sm:inline">or click page margins to turn</span>
        </div>

        {/* Page Jump Slider */}
        <div className="flex items-center space-x-3 w-full max-w-xs sm:max-w-md mx-4">
          <input
            type="range"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
            className="w-full accent-[#C8A66A] cursor-pointer"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs font-sans text-[#DFCA9B]">
          <span>{Math.round((currentPage / totalPages) * 100)}% Complete</span>
        </div>
      </footer>

      {/* Table of Contents Drawer */}
      {showToc && (
        <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-[#091812]/98 border-l border-[#C8A66A]/30 shadow-2xl z-50 p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#C8A66A]/20">
              <div className="flex items-center space-x-2 text-[#C8A66A]">
                <List className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-[#F5EBD7]">
                  Table of Contents
                </h3>
              </div>
              <button
                onClick={() => setShowToc(false)}
                className="p-1 rounded-lg text-[#F5EBD7]/60 hover:text-[#C8A66A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chapters List */}
            <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-2">
              <button
                onClick={() => {
                  setCurrentPage(1);
                  setShowToc(false);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  currentPage === 1
                    ? "bg-[#C8A66A]/20 border border-[#C8A66A] text-[#DFCA9B]"
                    : "bg-[#10271F] text-[#F5EBD7]/80 hover:bg-[#10271F]/80"
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C8A66A] block">
                  Frontispiece
                </span>
                <span className="font-serif font-bold text-sm">Cover & Title Page</span>
              </button>

              {book.chapters.map((chapter) => {
                // Find start page of this chapter
                const firstPageOfChapter = allPages.find(
                  (p) => p.chapterIndex === chapter.chapter_number - 1
                );
                const targetPage = firstPageOfChapter ? firstPageOfChapter.pageNumber : 2;

                return (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      setCurrentPage(targetPage);
                      setShowToc(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      currentPage >= targetPage &&
                      currentPage < targetPage + 4
                        ? "bg-[#C8A66A]/20 border border-[#C8A66A] text-[#DFCA9B]"
                        : "bg-[#10271F] text-[#F5EBD7]/80 hover:bg-[#10271F]/80"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-[#C8A66A] mb-1">
                      <span>Chapter {chapter.chapter_number}</span>
                      <span>Page {targetPage}</span>
                    </div>
                    <span className="font-serif font-bold text-sm block">
                      {chapter.title}
                    </span>
                    <span className="text-xs text-[#F5EBD7]/50 mt-1 block font-sans">
                      {chapter.word_count} words
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#C8A66A]/20 text-center">
            <span className="text-xs text-[#C8A66A] font-serif italic">
              ✦ The Living Book Interactive Reader ✦
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
