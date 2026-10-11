import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Compass, Clock, ArrowLeft, Bookmark, Share2 } from "lucide-react";
import { db } from "@/lib/db";

interface StoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = db.getStoryBySlug(slug);
  if (!story) return { title: "Story Not Found" };

  return {
    title: `${story.title} by ${story.author}`,
    description: story.excerpt,
  };
}

export default async function StoryDetailPage({
  params,
}: StoryDetailPageProps) {
  const { slug } = await params;
  const story = db.getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#091812] pt-28 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(21,50,40,0.8),transparent)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link
          href="/stories"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#DFCA9B] hover:text-[#F5EBD7] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Stories</span>
        </Link>

        {/* Paper Manuscript Container */}
        <article className="paper-texture text-[#25241F] rounded-3xl p-8 sm:p-14 lg:p-16 border border-[#C8A66A]/40 shadow-2xl relative">
          {/* Header Banner */}
          <div className="text-center space-y-4 pb-8 border-b border-[#25241F]/15">
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B86F50]">
              <Compass className="w-4 h-4" />
              <span>{story.category?.name || "Short Tale"}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#10271F] leading-tight">
              {story.title}
            </h1>

            <p className="font-serif italic text-lg text-[#B86F50]">
              By {story.author}
            </p>

            <div className="flex items-center justify-center space-x-4 text-xs font-sans text-[#25241F]/60 pt-2">
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{story.reading_time_minutes} minute read</span>
              </div>
              <span>•</span>
              <span>The Living Book Sanctuary</span>
            </div>
          </div>

          {/* Cover Illustration Accent */}
          <div className="my-8 rounded-2xl overflow-hidden shadow-lg border border-[#C8A66A]/30 max-h-96">
            <img
              src={story.cover_url}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Story Body with Dropcap and Serif Typography */}
          <div
            className="prose prose-lg max-w-none font-serif text-[#10271F] leading-relaxed sm:leading-loose space-y-6 pt-4 text-lg sm:text-xl"
            dangerouslySetInnerHTML={{ __html: story.content_html }}
          />

          {/* Story Footer */}
          <div className="mt-14 pt-8 border-t border-[#25241F]/15 flex items-center justify-between text-xs font-sans text-[#25241F]/70">
            <span className="font-serif italic">Finis • The Living Book</span>
            <Link
              href="/stories"
              className="font-bold text-[#B86F50] hover:text-[#10271F] underline"
            >
              Read Another Story →
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
