import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Compass, ArrowLeft, Clock } from "lucide-react";
import { db } from "@/lib/db";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = db.getCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return { title: "Category Not Found" };

  return {
    title: `${cat.name} — Category Showcase`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = db.getCategories();
  const cat = categories.find((c) => c.slug === slug);

  if (!cat) {
    notFound();
  }

  const books = db.getBooks({ categorySlug: slug, status: "published" });
  const stories = db.getStories({ categorySlug: slug, status: "published" });

  return (
    <div className="min-h-screen bg-[#091812] pt-28 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(21,50,40,0.8),transparent)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link
          href="/books"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#DFCA9B] hover:text-[#F5EBD7] mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grand Library</span>
        </Link>

        {/* Category Header */}
        <div className="bg-[#10271F]/90 border border-[#C8A66A]/40 rounded-3xl p-8 sm:p-12 shadow-2xl mb-14 text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C8A66A] font-bold">
            Corridor of Specialization
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#F5EBD7]">
            {cat.name}
          </h1>
          <p className="font-serif text-base text-[#F5EBD7]/80 max-w-xl mx-auto">
            {cat.description}
          </p>
        </div>

        {/* Books Section */}
        <div className="space-y-8 mb-16">
          <h2 className="font-serif text-2xl font-bold text-[#F5EBD7] flex items-center space-x-2 pb-3 border-b border-[#C8A66A]/20">
            <BookOpen className="w-5 h-5 text-[#C8A66A]" />
            <span>Volumes in {cat.name} ({books.length})</span>
          </h2>

          {books.length === 0 ? (
            <p className="text-sm text-[#DFCA9B]/60 italic font-serif">
              No volumes currently shelved in this category.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-[#10271F] rounded-2xl p-5 border border-[#C8A66A]/30 shadow-lg flex flex-col justify-between group hover:border-[#C8A66A] transition-all"
                >
                  <div className="space-y-3">
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="w-full h-48 object-cover rounded-xl border border-[#C8A66A]/30"
                    />
                    <h3 className="font-serif font-bold text-lg text-[#F5EBD7] group-hover:text-[#DFCA9B] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs font-serif italic text-[#DFCA9B]">
                      By {book.author}
                    </p>
                    <p className="text-xs text-[#F5EBD7]/70 font-serif line-clamp-2">
                      {book.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#C8A66A]/15 flex items-center justify-between">
                    <Link
                      href={`/read/${book.slug}`}
                      className="px-4 py-1.5 rounded-full bg-[#C8A66A] text-[#091812] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-sm"
                    >
                      Read 3D
                    </Link>
                    <Link
                      href={`/books/${book.slug}`}
                      className="text-xs text-[#DFCA9B] underline"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stories Section */}
        {stories.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#F5EBD7] flex items-center space-x-2 pb-3 border-b border-[#C8A66A]/20">
              <Compass className="w-5 h-5 text-[#C8A66A]" />
              <span>Short Stories in {cat.name} ({stories.length})</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="bg-[#10271F] rounded-2xl p-5 border border-[#C8A66A]/30 shadow-lg flex items-center gap-4"
                >
                  <img
                    src={story.cover_url}
                    alt={story.title}
                    className="w-16 h-20 object-cover rounded-lg border border-[#C8A66A]/30 shrink-0"
                  />
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-base text-[#F5EBD7]">
                      {story.title}
                    </h3>
                    <p className="text-xs font-serif italic text-[#DFCA9B]">
                      By {story.author}
                    </p>
                    <Link
                      href={`/stories/${story.slug}`}
                      className="text-xs font-bold text-[#C8A66A] hover:underline block pt-1"
                    >
                      Read Story →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
