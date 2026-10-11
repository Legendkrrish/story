"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Sparkles, Feather, Compass, Heart, Globe, Share2, Mail } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

export default function Footer() {
  const pathname = usePathname();

  // Hide in reading view
  if (pathname.startsWith("/read/")) {
    return null;
  }

  return (
    <footer className="relative bg-[#07130E] border-t border-[#C8A66A]/20 pt-16 pb-12 overflow-hidden">
      {/* Decorative Forest Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#153228]/40 to-transparent pointer-events-none blur-2xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#C8A66A]/10">
          {/* Column 1: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <BrandLogo size="md" />
            </Link>
            <p className="text-sm text-[#F5EBD7]/70 leading-relaxed font-serif max-w-sm">
              An immersive digital haven where every story is a physical object brought to life. Turn the pages of timeless thoughts, mastercrafted fiction, and wisdom from ancient horizons.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#10271F] border border-[#C8A66A]/30 flex items-center justify-center text-[#C8A66A] hover:bg-[#C8A66A] hover:text-[#091812] transition-colors"
                aria-label="Community"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#10271F] border border-[#C8A66A]/30 flex items-center justify-center text-[#C8A66A] hover:bg-[#C8A66A] hover:text-[#091812] transition-colors"
                aria-label="Repository"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@thelivingbook.com"
                className="w-8 h-8 rounded-full bg-[#10271F] border border-[#C8A66A]/30 flex items-center justify-center text-[#C8A66A] hover:bg-[#C8A66A] hover:text-[#091812] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Explore Library */}
          <div className="space-y-3">
            <h3 className="font-serif text-[#C8A66A] text-sm uppercase tracking-wider font-semibold flex items-center space-x-2">
              <Compass className="w-4 h-4" />
              <span>Explore Library</span>
            </h3>
            <ul className="space-y-2 text-sm text-[#F5EBD7]/70 font-sans">
              <li>
                <Link href="/books" className="hover:text-[#DFCA9B] transition-colors">
                  All Volumes
                </Link>
              </li>
              <li>
                <Link href="/books?category=inspirational" className="hover:text-[#DFCA9B] transition-colors">
                  Inspirational
                </Link>
              </li>
              <li>
                <Link href="/books?category=philosophy" className="hover:text-[#DFCA9B] transition-colors">
                  Philosophy & Wisdom
                </Link>
              </li>
              <li>
                <Link href="/books?category=mystery" className="hover:text-[#DFCA9B] transition-colors">
                  Shadows & Mystery
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-[#DFCA9B] transition-colors">
                  Short Fables
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Daily Reflections */}
          <div className="space-y-3">
            <h3 className="font-serif text-[#C8A66A] text-sm uppercase tracking-wider font-semibold flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Daily Thoughts</span>
            </h3>
            <ul className="space-y-2 text-sm text-[#F5EBD7]/70 font-sans">
              <li>
                <Link href="/thoughts" className="hover:text-[#DFCA9B] transition-colors">
                  Today’s Reflection
                </Link>
              </li>
              <li>
                <Link href="/thoughts" className="hover:text-[#DFCA9B] transition-colors">
                  Chronicles Archive
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#DFCA9B] transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#DFCA9B] transition-colors">
                  Continue Reading
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Sanctuary & Policies */}
          <div className="space-y-3">
            <h3 className="font-serif text-[#C8A66A] text-sm uppercase tracking-wider font-semibold flex items-center space-x-2">
              <Feather className="w-4 h-4" />
              <span>Sanctuary</span>
            </h3>
            <ul className="space-y-2 text-sm text-[#F5EBD7]/70 font-sans">
              <li>
                <Link href="/about" className="hover:text-[#DFCA9B] transition-colors">
                  About The Living Book
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#DFCA9B] transition-colors">
                  Archivist Portal (Admin)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#DFCA9B] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#DFCA9B] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F5EBD7]/50 font-sans gap-4">
          <p>
            © 2026 The Living Book. Handcrafted with reverence for paper, ink, and human curiosity.
          </p>
          <p className="flex items-center space-x-1">
            <span>Written for seekers of light and quiet hours</span>
            <Heart className="w-3.5 h-3.5 text-[#B86F50] fill-[#B86F50]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
