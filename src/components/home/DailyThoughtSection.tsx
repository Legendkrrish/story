"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Copy,
  Check,
  Share2,
  Bookmark,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react";
import { DailyThought } from "@/types/database";

interface DailyThoughtSectionProps {
  initialTodayThought?: DailyThought;
  previousThoughts?: DailyThought[];
}

export default function DailyThoughtSection({
  initialTodayThought,
  previousThoughts = [],
}: DailyThoughtSectionProps) {
  const [currentThought, setCurrentThought] = useState<DailyThought | null>(
    initialTodayThought || null
  );
  const [archive, setArchive] = useState<DailyThought[]>(previousThoughts);
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  useEffect(() => {
    if (!initialTodayThought) {
      fetch("/api/thoughts?today=true")
        .then((res) => res.json())
        .then((data) => {
          if (data.thought) {
            setCurrentThought(data.thought);
          }
        })
        .catch(console.error);

      fetch("/api/thoughts?limit=6")
        .then((res) => res.json())
        .then((data) => {
          if (data.thoughts) {
            setArchive(data.thoughts);
          }
        })
        .catch(console.error);
    }
  }, [initialTodayThought]);

  const handleCopy = async () => {
    if (!currentThought) return;
    const text = `"${currentThought.quote}" — ${currentThought.author}\nDiscovered on The Living Book`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Track stat
    fetch(`/api/thoughts/${currentThought.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "copy" }),
    }).catch(() => {});
  };

  const handleShare = async () => {
    if (!currentThought) return;
    const shareData = {
      title: "Daily Thought — The Living Book",
      text: `"${currentThought.quote}" — ${currentThought.author}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    }

    fetch(`/api/thoughts/${currentThought.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "share" }),
    }).catch(() => {});
  };

  const handleToggleFavorite = async () => {
    if (!currentThought) return;
    setIsFavorited(!isFavorited);

    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: "thought",
          itemId: currentThought.id,
        }),
      });
    } catch (e) {
      // rollback if failed
      setIsFavorited((prev) => !prev);
    }
  };

  if (!currentThought) {
    return null;
  }

  // Format display date
  const displayDate = new Date(currentThought.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section id="daily-thought" className="py-24 relative overflow-hidden bg-[#091812]">
      {/* Ambient Forest & Leaf Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(16,39,31,0.7),transparent)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center space-x-2 text-[#C8A66A] text-xs font-semibold uppercase tracking-[0.25em]">
            <Sparkles className="w-4 h-4" />
            <span>Today’s Living Reflection</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5EBD7]">
            Words for the Journey
          </h2>
          <p className="text-sm sm:text-base text-[#F5EBD7]/70 font-serif max-w-xl mx-auto">
            Each day offers a singular spark of insight. Reflect, collect, and let it shape your quiet hours.
          </p>
        </div>

        {/* The Paper-Textured Card */}
        <div className="relative group max-w-3xl mx-auto">
          {/* Card Backing Shadow & Layered Sheets */}
          <div className="absolute -inset-1.5 bg-[#C8A66A]/20 rounded-3xl blur-md" />
          <div className="absolute inset-0 translate-x-2 translate-y-2 bg-[#E8DCC4] rounded-2xl -z-10 shadow-lg transform rotate-[0.7deg]" />
          <div className="absolute inset-0 -translate-x-1 translate-y-1 bg-[#DFCA9B] rounded-2xl -z-20 shadow-md transform -rotate-[0.5deg]" />

          {/* Main Ivory Paper Card */}
          <div className="relative paper-texture text-[#25241F] rounded-2xl p-8 sm:p-12 md:p-14 border border-[#C8A66A]/40 shadow-2xl overflow-hidden">
            {/* Paper Corner Embellishments */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#C8A66A]/60" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#C8A66A]/60" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#C8A66A]/60" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#C8A66A]/60" />

            {/* Date and Category Tag with Wax Seal Accent */}
            <div className="flex items-center justify-between pb-8 border-b border-[#25241F]/15 text-xs font-sans">
              <div className="flex items-center space-x-2 text-[#25241F]/80 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#B86F50]" />
                <span>{displayDate}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Antique Wax Seal Stamp */}
                <div 
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-[#A84832] to-[#782818] border border-[#DFCA9B] shadow-md flex items-center justify-center text-[#F5EBD7] text-[10px] select-none"
                  title="Sanctuary Authenticity Seal"
                >
                  ⚜
                </div>
                <span className="px-3 py-1 rounded-full bg-[#10271F]/10 border border-[#25241F]/20 text-[11px] font-semibold uppercase tracking-wider text-[#10271F]">
                  {currentThought.category}
                </span>
              </div>
            </div>

            {/* Large Watermark Quote Icon */}
            <div className="absolute top-12 right-10 text-[#C8A66A]/15 pointer-events-none select-none">
              <Quote className="w-24 h-24 sm:w-32 sm:h-32" />
            </div>

            {/* Main Quote Content */}
            <div className="py-8 sm:py-10 space-y-6 relative z-10 text-center">
              <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#10271F] font-medium leading-relaxed sm:leading-relaxed">
                “{currentThought.quote}”
              </blockquote>

              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-[1px] bg-[#C8A66A]" />
                <cite className="font-serif font-bold text-lg sm:text-xl text-[#B86F50] tracking-wide not-italic">
                  {currentThought.author}
                </cite>
                <div className="w-8 h-[1px] bg-[#C8A66A]" />
              </div>

              {/* Handwritten Accent */}
              {currentThought.handwritten_note && (
                <div className="pt-2">
                  <p className="font-sans text-xl sm:text-2xl text-[#536B4E] italic tracking-wide transform -rotate-1 select-none">
                    ~ {currentThought.handwritten_note}
                  </p>
                </div>
              )}
            </div>

            {/* Interactive Actions Toolbar */}
            <div className="pt-8 border-t border-[#25241F]/15 flex items-center justify-between flex-wrap gap-4 text-xs font-sans">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#25241F]/5 hover:bg-[#25241F]/10 text-[#25241F] font-semibold transition-colors"
                  title="Copy thought to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-700" />
                      <span className="text-green-800">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#25241F]/70" />
                      <span>Copy Reflection</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#25241F]/5 hover:bg-[#25241F]/10 text-[#25241F] font-semibold transition-colors"
                  title="Share thought"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#25241F]/70" />
                  <span>{shareFeedback ? "Link Copied!" : "Share"}</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg transition-colors font-semibold ${
                    isFavorited
                      ? "bg-[#C8A66A] text-[#10271F] shadow-sm"
                      : "bg-[#25241F]/5 hover:bg-[#25241F]/10 text-[#25241F]"
                  }`}
                  title="Save to favorites"
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 ${
                      isFavorited ? "fill-current" : "text-[#25241F]/70"
                    }`}
                  />
                  <span>{isFavorited ? "Saved to Shelf" : "Save"}</span>
                </button>

                <Link
                  href="/thoughts"
                  className="text-xs font-semibold text-[#B86F50] hover:text-[#10271F] underline ml-2 transition-colors"
                >
                  View Archive →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Thoughts Archive Carousel */}
        {archive.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#C8A66A]/15">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-bold text-[#F5EBD7] flex items-center space-x-2">
                <span>Echoes of Earlier Days</span>
              </h3>
              <Link
                href="/thoughts"
                className="text-xs text-[#C8A66A] hover:text-[#DFCA9B] uppercase tracking-wider font-semibold"
              >
                Full Archive ({archive.length}) →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {archive.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setCurrentThought(item);
                    window.scrollTo({
                      top: document.getElementById("daily-thought")?.offsetTop || 0,
                      behavior: "smooth",
                    });
                  }}
                  className="paper-texture text-[#25241F] rounded-xl p-6 border border-[#C8A66A]/30 shadow-md cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="text-[11px] text-[#25241F]/60 font-sans mb-2 flex items-center justify-between">
                      <span>{item.date}</span>
                      <span className="text-[#B86F50] font-semibold">
                        {item.category}
                      </span>
                    </div>
                    <p className="font-serif text-sm text-[#10271F] line-clamp-3 leading-relaxed">
                      “{item.quote}”
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#25241F]/10 flex items-center justify-between text-xs">
                    <span className="font-serif italic font-semibold text-[#B86F50]">
                      — {item.author}
                    </span>
                    <span className="text-[10px] text-[#536B4E] uppercase tracking-wider font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Read In Focus ↑
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
