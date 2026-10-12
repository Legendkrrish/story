"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Sparkles, ArrowRight, Feather } from "lucide-react";
import { Book } from "@/types/database";

interface HeroSectionProps {
  initialBook?: Book | null;
}

export default function HeroSection({ initialBook }: HeroSectionProps) {
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(initialBook || null);
  const [rotateX, setRotateX] = useState(-4);
  const [rotateY, setRotateY] = useState(16);
  const [isOpening, setIsOpening] = useState(false);

  // If initialBook wasn't passed, fetch the most read book dynamically
  useEffect(() => {
    if (!book) {
      fetch("/api/books/most-read")
        .then((res) => res.json())
        .then((data) => {
          if (data?.book) {
            setBook(data.book);
          }
        })
        .catch(() => {});
    }
  }, [book]);

  const hasBooks = Boolean(book && book.slug);
  const activeBook = book || {
    id: "unwritten-volume",
    title: "The Unwritten Folio",
    slug: "",
    author: "Your First Living Manuscript",
    spine_color: "#143228",
    accent_color: "#C8A66A",
    read_count: 0,
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpening) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const normX = Math.max(-1, Math.min(1, x / (rect.width / 2)));
    const normY = Math.max(-1, Math.min(1, y / (rect.height / 2)));
    // Elegant controlled bounds: always forward-facing
    setRotateY(16 + normX * 8);
    setRotateX(-4 - normY * 6);
  };

  const handleMouseLeave = () => {
    if (!isOpening) {
      setRotateX(-4);
      setRotateY(16);
    }
  };

  const handleBookClick = () => {
    if (isOpening) return;
    setIsOpening(true);

    setTimeout(() => {
      if (hasBooks && activeBook.slug) {
        router.push(`/read/${activeBook.slug}`);
      } else {
        router.push("/admin/books/new");
      }
    }, 650);

    // Fallback reset if navigation is delayed or cancelled
    setTimeout(() => {
      setIsOpening(false);
    }, 2800);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background Dark Forest Atmosphere with Sunlight Beams */}
      <div className="absolute inset-0 bg-[#091812] pointer-events-none">
        {/* Deep forest radial lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(21,50,40,0.8),rgba(9,24,18,0.98))]" />

        {/* Diagonal warm sunlight beam from top right */}
        <div className="absolute -top-40 right-1/4 w-[600px] h-[900px] bg-gradient-to-b from-[#C8A66A]/20 via-[#DFCA9B]/5 to-transparent rotate-[-30deg] blur-3xl pointer-events-none" />

        {/* Ambient forest mist layers */}
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#091812] via-[#10271F]/40 to-transparent pointer-events-none" />

        {/* Floating dust motes / fireflies simulation */}
        <div className="absolute top-1/4 left-1/6 w-2 h-2 rounded-full bg-[#DFCA9B]/40 blur-[1px] animate-pulse" />
        <div className="absolute top-1/3 right-1/5 w-1.5 h-1.5 rounded-full bg-[#C8A66A]/30 blur-[1px] animate-ping" />
        <div className="absolute top-2/3 left-1/4 w-2 h-2 rounded-full bg-[#DFCA9B]/20 blur-[1px] animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 rounded-full bg-[#C8A66A]/25 blur-[1.5px] animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#10271F]/90 border border-[#C8A66A]/40 shadow-inner">
              <Sparkles className="w-4 h-4 text-[#C8A66A] animate-spin" style={{ animationDuration: "8s" }} />
              <span className="text-xs uppercase tracking-[0.2em] text-[#DFCA9B] font-semibold">
                Interactive 3D Sanctuary
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#F5EBD7] tracking-tight leading-[1.15]">
              Every Thought Opens{" "}
              <span className="bg-gradient-to-r from-[#DFCA9B] via-[#C8A66A] to-[#B86F50] bg-clip-text text-transparent block mt-1">
                a New World.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#F5EBD7]/80 font-serif max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover thoughts that inspire you, stories that move you, and books that stay with you—experienced through the tactile wonder of living pages.
            </p>

            {/* Trending Reader Favorite Callout or Empty Invitation */}
            <div className="flex items-center justify-center lg:justify-start">
              {hasBooks ? (
                <Link
                  href={`/read/${activeBook.slug}`}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#10271F]/70 border border-[#C8A66A]/30 text-xs font-serif text-[#DFCA9B] hover:text-[#F5EBD7] hover:border-[#C8A66A] transition-all group"
                >
                  <span className="text-[#C8A66A]">✦ Most Read Sanctuary Volume:</span>
                  <span className="font-semibold underline decoration-[#C8A66A]/50 group-hover:decoration-[#DFCA9B]">
                    {activeBook.title}
                  </span>
                  {activeBook.read_count ? (
                    <span className="text-[10px] text-[#C8A66A] font-sans">
                      ({activeBook.read_count.toLocaleString()} reads)
                    </span>
                  ) : null}
                </Link>
              ) : (
                <Link
                  href="/admin/books/new"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#10271F]/80 border border-[#C8A66A]/40 text-xs font-serif text-[#DFCA9B] hover:text-[#F5EBD7] hover:border-[#C8A66A] transition-all group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C8A66A] animate-pulse" />
                  <span className="text-[#C8A66A]">Sanctuary Ready:</span>
                  <span className="underline decoration-[#C8A66A]/50">
                    Import your first Word (.docx) book
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C8A66A] group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>

            {/* Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#bookshelf"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#C8A66A] via-[#DFCA9B] to-[#C8A66A] text-[#091812] font-bold text-sm tracking-wider uppercase shadow-xl hover:shadow-[#C8A66A]/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <BookOpen className="w-4 h-4" />
                <span>EXPLORE THE LIBRARY</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#daily-thought"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#10271F]/80 hover:bg-[#10271F] border border-[#C8A66A]/40 text-[#DFCA9B] font-semibold text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center space-x-2 hover:border-[#C8A66A]"
              >
                <Sparkles className="w-4 h-4 text-[#C8A66A]" />
                <span>TODAY&apos;S THOUGHT</span>
              </a>
            </div>

            {/* Micro Accents */}
            <div className="pt-6 flex items-center justify-center lg:justify-start space-x-8 text-xs text-[#F5EBD7]/60 font-sans border-t border-[#C8A66A]/10">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#536B4E]" />
                <span>3D Physical Page Turn</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#C8A66A]" />
                <span>Word .DOCX Import</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#B86F50]" />
                <span>Daily Curated Wisdom</span>
              </div>
            </div>
          </div>

          {/* Right Column: Large 3D Hardcover Book in Sunlight (Dynamically Most Read) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center py-6 select-none" style={{ perspective: "1600px" }}>
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleBookClick}
              className="relative cursor-pointer group"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Golden Ambient Halo behind book */}
              <div
                className={`absolute -inset-10 bg-radial from-[#C8A66A]/30 via-transparent to-transparent rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
                  isOpening ? "from-[#C8A66A]/60 scale-125" : "group-hover:from-[#C8A66A]/45"
                }`}
              />

              {/* The 3D Book Container */}
              <div
                className="relative w-64 sm:w-72 md:w-80 h-[390px] sm:h-[430px] md:h-[460px] transition-all duration-500 ease-out"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isOpening
                    ? "rotateX(-1deg) rotateY(10deg) scale(1.06) translateZ(40px)"
                    : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                  boxShadow: isOpening
                    ? "0 30px 80px -10px rgba(0,0,0,0.9), 0 0 50px rgba(200,166,106,0.3)"
                    : "0 25px 60px -15px rgba(0,0,0,0.8), 0 0 40px rgba(200,166,106,0.15)",
                }}
              >
                {/* 1. Leather Spine (3D Left Edge with Raised Ribs) */}
                <div
                  className="absolute left-0 top-0 w-8 h-full border-l border-[#C8A66A]/40 flex flex-col justify-between py-6"
                  style={{
                    transformOrigin: "left center",
                    transform: "rotateY(-90deg)",
                    backgroundColor: activeBook.spine_color || "#10271F",
                    backgroundImage:
                      "linear-gradient(to right, rgba(0,0,0,0.8), transparent 35%, transparent 65%, rgba(0,0,0,0.8))",
                  }}
                >
                  {/* Raised Gilded Ribs */}
                  <div className="h-1 w-full bg-gradient-to-r from-black via-[#C8A66A] to-black shadow" />
                  <div className="h-1 w-full bg-gradient-to-r from-black via-[#C8A66A] to-black shadow" />
                  <div className="h-full flex items-center justify-center rotate-90 text-[#DFCA9B] font-serif text-[10px] tracking-[0.25em] font-bold whitespace-nowrap opacity-90 drop-shadow">
                    {activeBook.title.toUpperCase()}
                  </div>
                  <div className="h-1 w-full bg-gradient-to-r from-black via-[#C8A66A] to-black shadow" />
                  <div className="h-1 w-full bg-gradient-to-r from-black via-[#C8A66A] to-black shadow" />
                </div>

                {/* 2. Back Cover (Underneath Layer) */}
                <div
                  className="absolute inset-0 rounded-r-xl border border-[#C8A66A]/40 shadow-2xl"
                  style={{
                    backgroundColor: activeBook.spine_color || "#10271F",
                    transform: "translateZ(-14px)",
                    backgroundImage:
                      "radial-gradient(circle at 50% 50%, rgba(200, 166, 106, 0.1) 0%, transparent 80%)",
                  }}
                />

                {/* 3. Stacked Paper Edges (Right and Bottom) */}
                <div
                  className="absolute right-0 top-2 bottom-2 w-7 bg-[#F5EBD7] rounded-r-xs border-y border-[#E2D4B7]"
                  style={{
                    transformOrigin: "right center",
                    transform: "rotateY(90deg) translateX(14px)",
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, #F9F5EC 0px, #F9F5EC 2px, #E8DEC7 2px, #E8DEC7 4px)",
                    boxShadow: "inset 0 0 10px rgba(0,0,0,0.25)",
                  }}
                />

                {/* Hanging Silk Bookmark Ribbon at Bottom */}
                <div
                  className="absolute -bottom-9 right-16 w-5 h-14 shadow-xl border-x pointer-events-none transition-transform duration-500"
                  style={{
                    backgroundColor: activeBook.accent_color || "#C8A66A",
                    borderColor: "#DFCA9B",
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
                    transform: isOpening ? "translateZ(10px) rotate(-6deg)" : "translateZ(-4px) rotate(-2deg)",
                  }}
                />

                {/* 4. Inner Parchment First Page (Revealed under front cover when it opens) */}
                <div
                  className="absolute inset-0 rounded-r-xl border border-[#C8A66A]/30 overflow-hidden p-8 flex flex-col justify-between"
                  style={{
                    backgroundColor: "#FAF5EA",
                    backgroundImage: `
                      radial-gradient(circle at 50% 40%, rgba(200, 166, 106, 0.15) 0%, transparent 70%),
                      repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(200, 166, 106, 0.08) 28px, rgba(200, 166, 106, 0.08) 29px)
                    `,
                    transform: "translateZ(0px)",
                    boxShadow: "inset 10px 0 20px rgba(0,0,0,0.15)",
                  }}
                >
                  {/* Subtle Candlelight Glow on Page */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#C8A66A]/10 to-transparent pointer-events-none" />

                  {/* Header Ornament */}
                  <div className="text-center space-y-1">
                    <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#8C6D37]">
                      ✦ SANCTUARY PRELUDE ✦
                    </p>
                    <div className="w-16 h-[1px] bg-[#C8A66A]/40 mx-auto" />
                  </div>

                  {/* First Page Opening Calligraphy */}
                  <div className="space-y-3 my-auto text-[#1B2921]">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#14261C] leading-tight line-clamp-2">
                      {activeBook.title}
                    </h3>
                    <p className="font-serif italic text-xs text-[#8C6D37]">
                      By {activeBook.author}
                    </p>
                    <div className="pt-2 text-xs font-serif leading-relaxed text-[#2C3B32]">
                      <span className="float-left text-3xl font-serif font-bold text-[#8C6D37] mr-2 leading-none">
                        E
                      </span>
                      very sentence etched into this volume has been preserved for the quiet hours of human wonder. Turn these living pages and enter the sanctuary.
                    </div>
                  </div>

                  {/* Bottom Archival Mark */}
                  <div className="text-center pt-2 border-t border-[#C8A66A]/20">
                    <span className="text-[9px] font-mono tracking-widest text-[#8C6D37] uppercase">
                      The Living Book • First Edition
                    </span>
                  </div>
                </div>

                {/* 5. Front Hardcover (Swings open cleanly without ever flipping backwards) */}
                <div
                  className="absolute inset-0 rounded-r-xl border-2 border-[#C8A66A]/70 flex flex-col justify-between p-6 overflow-hidden transition-transform duration-700 ease-out"
                  style={{
                    transformOrigin: "left center",
                    transform: isOpening ? "rotateY(-42deg)" : "rotateY(0deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    backgroundColor: activeBook.spine_color || "#10271F",
                    backgroundImage: `
                      radial-gradient(circle at 50% 30%, rgba(200, 166, 106, 0.22) 0%, transparent 70%),
                      repeating-linear-gradient(45deg, rgba(200, 166, 106, 0.03) 0px, rgba(200, 166, 106, 0.03) 2px, transparent 2px, transparent 6px)
                    `,
                    boxShadow: isOpening
                      ? "-8px 12px 25px rgba(0,0,0,0.6), inset 0 0 15px rgba(200,166,106,0.15)"
                      : "inset 0 0 20px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* Shimmer Light Reflection Sweep on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                  {/* Embossed Gold Foil Corner Ornaments */}
                  <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#C8A66A]" />
                  <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#C8A66A]" />
                  <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#C8A66A]" />
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#C8A66A]" />

                  {/* Spine Crease Line */}
                  <div className="absolute top-0 bottom-0 left-6 w-[2px] bg-gradient-to-r from-black/40 via-white/10 to-transparent" />

                  {/* Header Badge */}
                  <div className="text-center pt-2">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#091812]/85 border border-[#C8A66A]/40 text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-[#DFCA9B] font-semibold">
                      <Sparkles className="w-3 h-3 text-[#C8A66A]" />
                      <span>
                        {hasBooks
                          ? `MOST READ • ${activeBook.read_count ? `${activeBook.read_count.toLocaleString()} READS` : "SANCTUARY FAVORITE"}`
                          : "SANCTUARY READY • CLICK TO ADD BOOK"}
                      </span>
                    </span>
                  </div>

                  {/* Central Medallion & Title */}
                  <div className="text-center space-y-4 my-auto px-2">
                    <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#C8A66A] flex items-center justify-center bg-[#091812]/80 shadow-inner group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-8 h-8 text-[#DFCA9B]" />
                    </div>

                    <div className="space-y-1">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#F5EBD7] drop-shadow-md line-clamp-2">
                        {activeBook.title}
                      </h2>
                      <p className="font-serif italic text-sm text-[#DFCA9B]/90">
                        {hasBooks ? `By ${activeBook.author}` : activeBook.author}
                      </p>
                    </div>

                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C8A66A] to-transparent mx-auto" />
                  </div>

                  {/* Bottom Footer Notice */}
                  <div className="text-center pb-2">
                    <span
                      className={`inline-block px-3 py-1.5 rounded-full border text-[11px] font-sans tracking-wider uppercase transition-all duration-300 ${
                        isOpening
                          ? "bg-[#C8A66A] text-[#091812] font-bold border-[#DFCA9B] shadow-lg animate-pulse"
                          : "bg-[#091812]/75 border-[#C8A66A]/40 text-[#DFCA9B] group-hover:bg-[#C8A66A] group-hover:text-[#091812]"
                      }`}
                    >
                      {isOpening
                        ? "Opening Sanctuary..."
                        : hasBooks
                        ? "Click to Open Book"
                        : "Click to Import (.docx)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pedestal Base Shadow */}
              <div className="w-48 sm:w-64 h-8 bg-black/60 rounded-full blur-xl mx-auto -mt-3 transform -rotate-x-60 pointer-events-none" />

              {/* Floating hint label */}
              <p className="text-center text-xs font-serif italic text-[#C8A66A]/80 mt-4 animate-bounce">
                {hasBooks
                  ? "✦ Hover to tilt in 3D • Click to open reading sanctuary ✦"
                  : "✦ Interactive 3D Spine • Click to import your first manuscript ✦"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
