import React from "react";
import HeroSection from "@/components/home/HeroSection";
import DailyThoughtSection from "@/components/home/DailyThoughtSection";
import FeaturedBookshelf from "@/components/home/FeaturedBookshelf";
import ContinueReadingSection from "@/components/home/ContinueReadingSection";
import StoryOfDaySection from "@/components/home/StoryOfDaySection";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Living Book — An Immersive Digital Library",
  description:
    "Every Thought Opens a New World. Enter a magical 3D digital library for daily thoughts, stories, and books with realistic physical page turning.",
};

export default function HomePage() {
  const books = db.getBooks({ status: "published" });
  const mostReadBook = db.getMostReadBook() || books[0];
  const categories = db.getCategories();
  const todayThought = db.getTodayThought();
  const previousThoughts = db.getDailyThoughts({ isPublished: true, limit: 6 });
  const featuredStories = db.getStories({ status: "published", featured: true });
  const featuredStory = featuredStories[0] || db.getStories({ status: "published" })[0];
  const userProgress = db.getUserReadingProgress("reader-1");

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Immersive Hero with 3D Hardcover Book (Automatically Most Read) */}
      <HeroSection initialBook={mostReadBook} />

      {/* 2. Continue Reading (if user has active reads) */}
      <ContinueReadingSection initialProgress={userProgress} />

      {/* 3. Daily Thought Section with paper card & handwritten note */}
      <DailyThoughtSection
        initialTodayThought={todayThought}
        previousThoughts={previousThoughts}
      />

      {/* 4. Featured 3D Bookshelf with depth, lift on hover, & filters */}
      <FeaturedBookshelf
        books={books}
        categories={categories}
        userProgress={userProgress}
      />

      {/* 5. Story of the Day with atmospheric illustration */}
      <StoryOfDaySection featuredStory={featuredStory} />
    </div>
  );
}
