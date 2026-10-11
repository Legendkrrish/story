import React from "react";
import Link from "next/link";
import { BookOpen, Sparkles, Feather, Compass, Heart } from "lucide-react";

export const metadata = {
  title: "About The Living Book — Design Vision & Philosophy",
  description:
    "An inquiry into digital craftsmanship: turning cold screens into tactile, living sanctuaries of paper, ink, and human curiosity.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#091812] pt-28 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(21,50,40,0.8),transparent)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <article className="paper-texture text-[#25241F] rounded-3xl p-8 sm:p-14 lg:p-16 border border-[#C8A66A]/40 shadow-2xl relative space-y-8">
          <div className="text-center space-y-3 pb-8 border-b border-[#25241F]/15">
            <span className="text-xs uppercase font-sans tracking-[0.25em] text-[#C8A66A] font-bold">
              The Living Archive Manifesto
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#10271F]">
              Why We Built a Living Book
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-[#B86F50]">
              “The soul does not remember pixels. It remembers the weight of paper and the silence between lines.”
            </p>
          </div>

          <div className="font-serif text-lg leading-relaxed text-[#10271F] space-y-6">
            <p className="first-letter-dropcap">I</p>
            <p>
              n our rush to digitize human literature, we turned books into endless vertical scrolling feeds. We stripped away the spine, discarded the deckled edges, and flattened paper into monochrome pixels. Reading became consumption rather than communion.
            </p>

            <p>
              <strong>The Living Book</strong> was founded upon a different premise: that the physical architecture of a book is not an accident of history, but an intimate ritual. When your hands turn a physical page, your mind marks a threshold. You travel from what was known to what is about to be discovered.
            </p>

            <blockquote className="border-l-4 border-[#C8A66A] pl-5 py-2 my-6 font-serif italic text-xl text-[#B86F50] bg-[#25241F]/5 rounded-r-xl">
              “Every thought opens a new world. Carry a living book, and you carry an entire horizon in your pocket.”
            </blockquote>

            <h2 className="font-serif text-2xl font-bold text-[#10271F] pt-4">
              The Craftsmanship
            </h2>
            <p>
              We combined cutting-edge 3D physics transforms, warm ivory vellum colorations (`#F5EBD7`), natural paper textures, and ambient gutter spine shadows. When you import a normal Microsoft Word (.docx) document, our typesetting engine automatically creates balanced leaves that bend, cast shadows, and respond to your touch.
            </p>

            <h2 className="font-serif text-2xl font-bold text-[#10271F] pt-4">
              Enter the Sanctuary
            </h2>
            <p>
              Whether you are here for thirty seconds to read the daily contemplation or staying for an hour to finish an ancient chapter, welcome. The fire is lit, the tea is poured, and the pages are alive.
            </p>
          </div>

          <div className="pt-8 border-t border-[#25241F]/15 flex items-center justify-between flex-wrap gap-4 text-xs font-sans">
            <Link
              href="/books"
              className="px-6 py-3 rounded-full bg-[#10271F] text-[#F5EBD7] font-bold uppercase tracking-wider hover:bg-[#C8A66A] hover:text-[#091812] transition-colors"
            >
              Explore the Library
            </Link>

            <Link
              href="/admin/books/new"
              className="text-[#B86F50] font-bold underline"
            >
              Import Your Own Word Manuscript →
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
