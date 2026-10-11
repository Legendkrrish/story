"use client";

import React from "react";
import Link from "next/link";
import { Compass, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Story } from "@/types/database";

interface StoryOfDaySectionProps {
  featuredStory?: Story | null;
}

export default function StoryOfDaySection({
  featuredStory,
}: StoryOfDaySectionProps) {
  if (!featuredStory) return null;

  return (
    <section className="py-24 bg-[#091812] relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(21,50,40,0.6),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center space-x-2 text-[#C8A66A] text-xs font-semibold uppercase tracking-[0.25em]">
            <Compass className="w-4 h-4" />
            <span>Featured Tale</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F5EBD7]">
            Story of the Day
          </h2>
          <p className="text-sm sm:text-base text-[#F5EBD7]/70 font-serif max-w-lg mx-auto">
            A complete literary journey designed to be savored in a single sitting.
          </p>
        </div>

        {/* Large Immersive Story Card */}
        <div className="relative rounded-3xl overflow-hidden border border-[#C8A66A]/40 bg-[#10271F] shadow-2xl grid grid-cols-1 lg:grid-cols-12 group">
          {/* Left Column: Large Atmospheric Illustration */}
          <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[480px] overflow-hidden">
            <img
              src={featuredStory.cover_url}
              alt={featuredStory.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10271F] via-transparent to-black/30 lg:bg-gradient-to-r lg:from-transparent lg:to-[#10271F]" />

            {/* Floating Badge */}
            <div className="absolute top-6 left-6 z-10 flex items-center space-x-2">
              <span className="px-3.5 py-1 rounded-full bg-[#091812]/80 backdrop-blur-md border border-[#C8A66A]/50 text-xs font-bold uppercase tracking-wider text-[#DFCA9B] shadow-md flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A66A]" />
                <span>Selected Fable</span>
              </span>
            </div>
          </div>

          {/* Right Column: Story Storytelling Content */}
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6 bg-[#10271F]">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-xs text-[#C8A66A] font-sans">
                <span className="uppercase tracking-wider font-semibold">
                  {featuredStory.category?.name || "Short Fiction"}
                </span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{featuredStory.reading_time_minutes} min read</span>
                </div>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F5EBD7] group-hover:text-[#DFCA9B] transition-colors leading-tight">
                {featuredStory.title}
              </h3>

              <p className="font-serif italic text-sm text-[#DFCA9B]">
                Written by {featuredStory.author}
              </p>

              <div className="w-16 h-[2px] bg-[#C8A66A]/40" />

              <p className="font-serif text-sm sm:text-base text-[#F5EBD7]/80 leading-relaxed">
                {featuredStory.excerpt}
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href={`/stories/${featuredStory.slug}`}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#C8A66A] to-[#A68446] text-[#091812] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg transition-all flex items-center justify-center space-x-2 group/btn"
              >
                <span>READ THIS STORY</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/stories"
                className="text-xs text-[#DFCA9B]/80 hover:text-[#F5EBD7] font-semibold uppercase tracking-wider underline-offset-4 hover:underline"
              >
                Explore All Stories →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
