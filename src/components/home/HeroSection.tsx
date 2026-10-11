"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { Book } from "@/types/database";

interface HeroSectionProps {
  initialBook?: Book | null;
}

export default function HeroSection({ initialBook }: HeroSectionProps) {
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(initialBook || null);
  const [rotateX, setRotateX] = useState(-5);
  const [rotateY, setRotateY] = useState(15);
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

  const activeBook = book || {
    id: "book-2",
    title: "The Alchemist of Solitude",
    slug: "the-alchemist-of-solitude",
    author: "Marcus Sterling",
    spine_color: "#4B2E1E",
    accent_color: "#DFCA9B",
    read_count: 612,
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpening) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateY((x / rect.width) * 35);
    setRotateX(-(y / rect.height) * 25);
  };

  const handleMouseLeave = () => {
    if (!isOpening) {
      setRotateX(-5);
      setRotateY(15);
    }
  };

  const handleBookClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      router.push(`/read/${activeBook.slug}`);
    }, 700);
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

            {/* Trending Reader Favorite Callout */}
            <div className="flex items-center justify-center lg:justify-start">
              <Link
                href={`/read/${activeBook.slug}`}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#10271F]/70 border border-[#C8A66A]/30 text-xs font-serif text-[#DFCA9B] hover:text-[#F5EBD7] hover:border-[#C8A66A] transition-all group"
              >
                <span className="text-[#C8A66A]">✦ Most Read Sanctuary Volume:</span>
                <span className="font-semibold underline decoration-[#C8A66A]/50 group-hover:decoration-[#DFCA9B]">
                  {activeBook.title}
                </span>
                {activeBook.read_count && (
                  <span className="text-[10px] text-[#C8A66A] font-sans">
                    ({activeBook.read_count.toLocaleString()} reads)
                  </span>
                )}
              </Link>
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
          <div className="lg:col-span-5 flex flex-col items-center justify-center perspective-1500 py-6">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleBookClick}
              className="relative cursor-pointer group select-none transition-all"
              style={{
                perspective: "1800px",
              }}
            >
              {/* Halo sunlight behind book */}
              <div className="absolute -inset-8 bg-radial from-[#C8A66A]/25 via-transparent to-transparent rounded-full blur-2xl group-hover:from-[#C8A66A]/40 transition-all duration-500" />

              {/* The 3D Book Container */}
              <div
                className="relative w-64 sm:w-72 md:w-80 h-[380px] sm:h-[420px] md:h-[450px] transform-style-3d transition-transform duration-300 ease-out"
                style={{
                  transform: isOpening
                    ? "rotateY(-70deg) translateZ(80px) scale(1.08)"
                    : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                  boxShadow: "0 25px 60px -15px rgba(0,0,0,0.8), 0 0 40px rgba(200,166,106,0.15)",
                }}
              >
                {/* Book Spine (3D Left Edge with Raised Ribs) */}
                <div
                  className="absolute left-0 top-0 w-12 h-full border-l border-[#C8A66A]/40 origin-left flex flex-col justify-between py-6"
                  style={{
                    backgroundColor: activeBook.spine_color || "#10271F",
                    backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.7), transparent 30%, transparent 70%, rgba(0,0,0,0.7))",
                    transform: "rotateY(-90deg) translateX(-48px)",
                  }}
                >
                  {/* Raised Leather Spine Ribs */}
                  <div className="h-1 w-full bg-gradient-to-r from-black/80 via-[#C8A66A]/80 to-black/80 shadow-md" />
                  <div className="h-1 w-full bg-gradient-to-r from-black/80 via-[#C8A66A]/80 to-black/80 shadow-md" />
                  <div className="h-full flex items-center justify-center rotate-90 text-[#DFCA9B] font-serif text-[11px] tracking-[0.25em] font-semibold whitespace-nowrap opacity-90 drop-shadow">
                    {activeBook.title.toUpperCase()}
                  </div>
                  <div className="h-1 w-full bg-gradient-to-r from-black/80 via-[#C8A66A]/80 to-black/80 shadow-md" />
                  <div className="h-1 w-full bg-gradient-to-r from-black/80 via-[#C8A66A]/80 to-black/80 shadow-md" />
                </div>

                {/* Hanging Silk Bookmark Ribbon at Bottom */}
                <div
                  className="absolute -bottom-8 right-16 w-5 h-12 shadow-xl rounded-b-xs border-x transform -rotate-2 -z-10 pointer-events-none"
                  style={{
                    backgroundColor: activeBook.accent_color || "#C8A66A",
                    borderColor: "#DFCA9B",
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
                  }}
                />

                {/* Visible Stacked Paper Block (Right & Bottom Edges) */}
                <div
                  className="absolute right-0 top-2 bottom-2 w-7 bg-[#F5EBD7] book-edge-shadow rounded-r-sm border-y border-[#E8DCC4]"
                  style={{
                    transform: "rotateY(90deg) translateZ(10px) translateX(14px)",
                  }}
                />

                {/* Front Hardcover */}
                <div
                  className={`w-full h-full rounded-r-xl overflow-hidden border-2 border-[#C8A66A]/60 flex flex-col justify-between p-6 relative transition-transform duration-700 ${
                    isOpening ? "origin-left -rotate-y-120" : ""
                  }`}
                  style={{
                    backgroundColor: activeBook.spine_color || "#10271F",
                    backgroundImage: `
                      radial-gradient(circle at 50% 30%, rgba(200, 166, 106, 0.22) 0%, transparent 70%),
                      repeating-linear-gradient(45deg, rgba(200, 166, 106, 0.03) 0px, rgba(200, 166, 106, 0.03) 2px, transparent 2px, transparent 6px)
                    `,
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

                  {/* Header Badge: Automatically Displays Most Read Stats */}
                  <div className="text-center pt-2">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#091812]/80 border border-[#C8A66A]/40 text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-[#DFCA9B] font-semibold">
                      <Sparkles className="w-3 h-3 text-[#C8A66A]" />
                      <span>
                        MOST READ • {activeBook.read_count ? `${activeBook.read_count.toLocaleString()} READS` : "SANCTUARY FAVORITE"}
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
                        By {activeBook.author}
                      </p>
                    </div>

                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C8A66A] to-transparent mx-auto" />
                  </div>

                  {/* Bottom Footer Notice */}
                  <div className="text-center pb-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#091812]/70 border border-[#C8A66A]/40 text-[11px] font-sans text-[#DFCA9B] tracking-wider uppercase group-hover:bg-[#C8A66A] group-hover:text-[#091812] transition-colors">
                      {isOpening ? "Opening Pages..." : "Click to Open Book"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pedestal Base Shadow */}
              <div className="w-48 sm:w-64 h-8 bg-black/60 rounded-full blur-xl mx-auto -mt-3 transform -rotate-x-60" />

              {/* Floating hint label */}
              <p className="text-center text-xs font-serif italic text-[#C8A66A]/80 mt-4 animate-bounce">
                ✦ Hover to tilt in 3D • Click to read most read volume ✦
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
