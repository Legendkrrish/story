import React from "react";
import Link from "next/link";
import { Compass, Clock, ArrowRight, Sparkles, Feather } from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Short Stories & Fables — The Living Book",
  description: "Bite-sized literary journeys crafted for quiet reflective moments.",
};

export default function StoriesPage() {
  const stories = db.getStories({ status: "published" });

  return (
    <div className="min-h-screen bg-[#091812] pt-28 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(21,50,40,0.8),transparent)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#10271F] border border-[#C8A66A]/30 text-xs font-semibold uppercase tracking-[0.2em] text-[#DFCA9B]">
            <Compass className="w-4 h-4 text-[#C8A66A]" />
            <span>Short Fables & Tales</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#F5EBD7]">
            Sanctuary Stories
          </h1>
          <p className="text-base text-[#F5EBD7]/70 font-serif max-w-xl mx-auto">
            Brief passages into the mysterious, the transcendent, and the deeply human.
          </p>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-20 space-y-4 rounded-3xl border border-[#C8A66A]/30 bg-[#10271F]/80 p-8 sm:p-14 max-w-lg mx-auto shadow-2xl backdrop-blur-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#091812] border border-[#C8A66A]/40 flex items-center justify-center mx-auto text-[#C8A66A] shadow-inner">
              <Feather className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif text-2xl font-bold text-[#F5EBD7]">
                The Storyteller’s Folio Awaits
              </h3>
              <p className="font-serif text-sm text-[#F5EBD7]/70 italic leading-relaxed">
                All sample fables have been cleared. Head to the Archivist Portal to compose and publish your original short stories.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/admin/stories"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#C8A66A] to-[#DFCA9B] text-[#091812] text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-[#C8A66A]/30 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Write Short Story</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((story) => (
              <div
                key={story.id}
                className="bg-[#10271F]/90 rounded-2xl overflow-hidden border border-[#C8A66A]/30 shadow-xl hover:border-[#C8A66A] transition-all group flex flex-col justify-between"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={story.cover_url}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10271F] via-[#10271F]/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-[#091812]/80 backdrop-blur-sm border border-[#C8A66A]/40 text-[10px] font-bold uppercase tracking-wider text-[#DFCA9B]">
                      {story.category?.name || "Tale"}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center space-x-1 text-xs text-[#DFCA9B] bg-[#091812]/70 px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-[#C8A66A]" />
                    <span>{story.reading_time_minutes} min read</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-bold text-[#F5EBD7] group-hover:text-[#DFCA9B] transition-colors">
                      {story.title}
                    </h3>
                    <p className="font-serif italic text-xs text-[#DFCA9B]/90">
                      By {story.author}
                    </p>
                    <p className="font-serif text-sm text-[#F5EBD7]/70 line-clamp-3 pt-1">
                      {story.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#C8A66A]/15">
                    <Link
                      href={`/stories/${story.slug}`}
                      className="inline-flex items-center space-x-2 text-xs font-bold text-[#DFCA9B] uppercase tracking-wider hover:text-[#F5EBD7] group/btn"
                    >
                      <span>Read Full Story</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
