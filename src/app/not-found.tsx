import React from "react";
import Link from "next/link";
import { BookOpen, Compass, ArrowLeft, Sparkles } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#091812] flex flex-col justify-between text-[#F5EBD7] relative overflow-hidden selection:bg-[#C8A66A] selection:text-[#091812]">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial from-[#153228]/80 via-[#0C1E17] to-[#050D0A] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C8A66A]/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="relative z-10 px-6 sm:px-12 py-8 flex items-center justify-between border-b border-[#C8A66A]/15 backdrop-blur-xs">
        <BrandLogo size="md" />
        <Link
          href="/"
          className="text-xs font-serif text-[#DFCA9B] hover:text-[#F5EBD7] flex items-center space-x-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Entryway</span>
        </Link>
      </header>

      {/* Main 404 Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-6 py-16 text-center my-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#10271F] border border-[#C8A66A]/40 text-[#DFCA9B] text-xs font-sans tracking-widest uppercase mb-8">
          <Sparkles className="w-3.5 h-3.5 text-[#C8A66A] animate-pulse" />
          <span>Lost in the Stacks • Folio 404</span>
        </div>

        <div className="relative mb-6">
          <span className="font-serif text-8xl sm:text-9xl font-bold tracking-widest text-[#C8A66A]/20 select-none block">
            404
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5EBD7] -mt-10 sm:-mt-14 relative z-10">
            A Page Lost to Time
          </h1>
        </div>

        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C8A66A] to-transparent mx-auto mb-6" />

        <p className="font-serif text-base sm:text-lg text-[#F5EBD7]/70 italic leading-relaxed mb-10 max-w-lg mx-auto">
          The manuscript or reading chamber you seek has dissolved into the shadows of the deep archive, or the shelf has been rearranged by the Grand Archivist.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/books"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-[#C8A66A] to-[#DFCA9B] text-[#091812] font-semibold text-sm hover:shadow-[0_0_30px_rgba(200,166,106,0.4)] transition-all flex items-center justify-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore Grand Library</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#10271F] border border-[#C8A66A]/40 text-[#DFCA9B] hover:text-[#F5EBD7] hover:border-[#C8A66A] font-semibold text-sm transition-all flex items-center justify-center space-x-2"
          >
            <Compass className="w-4 h-4" />
            <span>Return to Sanctuary</span>
          </Link>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="relative z-10 px-6 py-6 text-center border-t border-[#C8A66A]/10 text-xs font-serif text-[#C8A66A]/60 italic">
        ✦ The Living Book • Digital Archive & Literary Sanctuary ✦
      </footer>
    </div>
  );
}
