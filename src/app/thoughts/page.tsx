import React from "react";
import Link from "next/link";
import { Sparkles, Calendar, Quote, Bookmark, Share2 } from "lucide-react";
import { db } from "@/lib/db";
import DailyThoughtSection from "@/components/home/DailyThoughtSection";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Daily Thoughts & Meditations — The Living Book",
  description: "A chronological archive of daily inspirations, philosophical reflections, and timeless words.",
};

export default function ThoughtsArchivePage() {
  const allThoughts = db.getDailyThoughts({ isPublished: true });
  const todayThought = db.getTodayThought();

  return (
    <div className="min-h-screen bg-[#091812] pt-28 pb-24 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(21,50,40,0.8),transparent)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#10271F] border border-[#C8A66A]/30 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFCA9B]">
            <Sparkles className="w-4 h-4 text-[#C8A66A]" />
            <span>Chronicles of Wisdom</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#F5EBD7]">
            Daily Thoughts Archive
          </h1>
          <p className="text-base text-[#F5EBD7]/70 font-serif max-w-xl mx-auto">
            Every dawn brings a new contemplation. Journey backward through earlier days and rediscover enduring truths.
          </p>
        </div>

        {/* Featured Reflection of Today (if any) */}
        {todayThought && (
          <div className="mb-20">
            <DailyThoughtSection initialTodayThought={todayThought} />
          </div>
        )}

        {/* All Archive Cards Grid */}
        <div className="pt-8 border-t border-[#C8A66A]/20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl font-bold text-[#F5EBD7] flex items-center space-x-2">
              <span>Historical Reflections ({allThoughts.length})</span>
            </h2>
            <Link
              href="/admin/thoughts"
              className="text-xs font-semibold text-[#DFCA9B] hover:text-[#F5EBD7] underline"
            >
              Archivist Portal →
            </Link>
          </div>

          {allThoughts.length === 0 ? (
            <div className="text-center py-20 space-y-4 rounded-3xl border border-[#C8A66A]/30 bg-[#10271F]/80 p-8 sm:p-14 max-w-lg mx-auto shadow-2xl backdrop-blur-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#091812] border border-[#C8A66A]/40 flex items-center justify-center mx-auto text-[#C8A66A] shadow-inner">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif text-2xl font-bold text-[#F5EBD7]">
                  The Chronicle Awaits Today’s Meditation
                </h3>
                <p className="font-serif text-sm text-[#F5EBD7]/70 italic leading-relaxed">
                  All reflections have been cleared. Head to the Archivist Portal to record your first daily thought.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/admin/thoughts"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#C8A66A] to-[#DFCA9B] text-[#091812] text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#C8A66A]/30 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish First Thought</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {allThoughts.map((item) => (
                <div
                  key={item.id}
                  className="paper-texture text-[#25241F] rounded-2xl p-8 border border-[#C8A66A]/40 shadow-xl relative flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Header: Date & Tag */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#25241F]/15 text-xs font-sans">
                    <div className="flex items-center space-x-1.5 text-[#25241F]/70">
                      <Calendar className="w-3.5 h-3.5 text-[#B86F50]" />
                      <span>{item.date}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#10271F]/10 border border-[#25241F]/20 text-[10px] font-bold uppercase tracking-wider text-[#10271F]">
                      {item.category}
                    </span>
                  </div>

                  {/* Quote */}
                  <div className="py-6 space-y-4">
                    <blockquote className="font-serif text-xl sm:text-2xl text-[#10271F] font-medium leading-relaxed">
                      “{item.quote}”
                    </blockquote>
                    <p className="font-serif font-bold text-base text-[#B86F50] italic">
                      — {item.author}
                    </p>
                    {item.handwritten_note && (
                      <p className="font-sans text-lg text-[#536B4E] italic select-none">
                        ~ {item.handwritten_note}
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-[#25241F]/15 flex items-center justify-between text-xs text-[#25241F]/60">
                    <span>Echo #{item.id.replace("th-", "")}</span>
                    <span className="text-[10px] font-sans uppercase tracking-wider font-semibold text-[#536B4E]">
                      The Living Sanctuary
                    </span>
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
