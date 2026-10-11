"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Sparkles,
  Compass,
  User,
  Shield,
  Bookmark,
  Menu,
  X,
  Search,
  LogOut,
  ChevronDown,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import { Book, Story, DailyThought } from "@/types/database";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    books: Book[];
    stories: Story[];
    thoughts: DailyThought[];
  }>({ books: [], stories: [], thoughts: [] });
  const [isSearching, setIsSearching] = useState(false);

  const [userSession, setUserSession] = useState<{
    displayName: string;
    role: string;
    email: string;
  } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Session on mount and pathname change
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.session) {
          setUserSession(data.session);
        } else {
          setUserSession(null);
        }
      })
      .catch(() => setUserSession(null));
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global Keyboard Shortcut: Cmd/Ctrl + K to open search, Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setSearchModalOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Auto focus input when search modal opens
  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
      setSearchResults({ books: [], stories: [], thoughts: [] });
    }
  }, [searchModalOpen]);

  // Live Search Handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ books: [], stories: [], thoughts: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const q = encodeURIComponent(searchQuery.trim());
        const [booksRes, storiesRes, thoughtsRes] = await Promise.all([
          fetch(`/api/books?search=${q}`).then((r) => r.json()),
          fetch(`/api/stories`).then((r) => r.json()),
          fetch(`/api/thoughts`).then((r) => r.json()),
        ]);

        const books: Book[] = booksRes?.books || [];
        const stories: Story[] = (storiesRes?.stories || []).filter(
          (s: Story) =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.author.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const thoughts: DailyThought[] = (thoughtsRes?.thoughts || []).filter(
          (t: DailyThought) =>
            t.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSearchResults({
          books: books.slice(0, 4),
          stories: stories.slice(0, 3),
          thoughts: thoughts.slice(0, 3),
        });
      } catch (e) {
        console.error("Search error:", e);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUserSession(null);
    setUserDropdownOpen(false);
    window.location.href = "/";
  };

  // If reading mode, hide navbar completely for distraction-free immersion
  if (pathname.startsWith("/read/")) {
    return null;
  }

  const navLinks = [
    { href: "/books", label: "Library", icon: BookOpen, badge: null },
    { href: "/thoughts", label: "Daily Thoughts", icon: Sparkles, badge: "Today" },
    { href: "/stories", label: "Stories", icon: Compass, badge: null },
    { href: "/profile", label: "My Shelf", icon: Bookmark, badge: null },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#091812]/92 backdrop-blur-xl border-b border-[#C8A66A]/25 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(200,166,106,0.12)]"
            : "bg-gradient-to-b from-[#091812]/95 via-[#091812]/60 to-transparent py-4 sm:py-5"
        }`}
      >
        {/* Subtle Golden Hairline Accent on top */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#DFCA9B]/40 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* 1. Left: Brand Logo & Sanctuary Insignia */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link
                href="/"
                className="group relative flex items-center transition-transform duration-300 hover:scale-[1.02]"
                title="The Living Book • Sanctuary of Stories"
              >
                <BrandLogo size="md" />
              </Link>
            </div>

            {/* 2. Center: Luxury Frosted Capsule Navigation (Desktop) */}
            <nav className="hidden md:flex items-center p-1 rounded-full bg-[#10271F]/80 border border-[#C8A66A]/30 backdrop-blur-md shadow-inner space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-[#C8A66A]/30 via-[#DFCA9B]/20 to-[#C8A66A]/15 text-[#F5EBD7] border border-[#C8A66A]/60 shadow-[0_0_16px_rgba(200,166,106,0.25)]"
                        : "text-[#F5EBD7]/75 hover:text-[#F5EBD7] hover:bg-[#153328]/50"
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 transition-colors ${
                        isActive
                          ? "text-[#DFCA9B]"
                          : "text-[#C8A66A]/75 group-hover:text-[#C8A66A]"
                      }`}
                    />
                    <span>{link.label}</span>

                    {/* Badge Indicator */}
                    {link.badge && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#C8A66A]/20 text-[#DFCA9B] text-[8px] font-mono tracking-normal border border-[#C8A66A]/40 animate-pulse">
                        ✦
                      </span>
                    )}

                    {/* Active Golden Glow Underdot */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-[#C8A66A] rounded-full shadow-[0_0_6px_#C8A66A]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* 3. Right: Quick Omni-Search, Archivist Shield, & User Avatar */}
            <div className="hidden md:flex items-center space-x-2.5 sm:space-x-3">
              {/* Omni Search Trigger Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#10271F]/80 border border-[#C8A66A]/30 text-xs text-[#DFCA9B]/80 hover:text-[#F5EBD7] hover:border-[#C8A66A] hover:bg-[#10271F] transition-all shadow-sm group"
                title="Quick Search (Ctrl + K)"
              >
                <Search className="w-3.5 h-3.5 text-[#C8A66A] group-hover:scale-110 transition-transform" />
                <span className="hidden lg:inline text-[11px] font-sans">
                  Search...
                </span>
                <kbd className="px-1.5 py-0.5 text-[9px] bg-[#091812] border border-[#C8A66A]/30 text-[#DFCA9B] rounded font-mono shadow-xs">
                  ⌘K
                </kbd>
              </button>

              {/* Archivist Portal Badge */}
              <Link
                href="/admin"
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 shadow-sm ${
                  pathname.startsWith("/admin")
                    ? "bg-gradient-to-r from-[#C8A66A] to-[#DFCA9B] text-[#091812] border-[#DFCA9B] shadow-[0_0_15px_rgba(200,166,106,0.35)]"
                    : "bg-gradient-to-r from-[#143228]/90 to-[#0E241D] text-[#DFCA9B] border-[#C8A66A]/40 hover:border-[#C8A66A] hover:shadow-[0_0_12px_rgba(200,166,106,0.2)]"
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-[#C8A66A]" />
                <span>Archivist Portal</span>
              </Link>

              {/* User Account / Profile Dropdown */}
              {userSession ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#10271F] border border-[#C8A66A]/40 hover:border-[#C8A66A] text-xs transition-all shadow-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#C8A66A] to-[#8F6B2A] flex items-center justify-center text-[10px] font-bold text-[#091812] shadow-xs">
                      {userSession.displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-[#F5EBD7] font-serif max-w-[110px] truncate">
                      {userSession.displayName}
                    </span>
                    <ChevronDown className="w-3 h-3 text-[#C8A66A]/80" />
                  </button>

                  {/* Luxury Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-12 w-64 bg-[#0E241D] border border-[#C8A66A]/40 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      {/* User Header */}
                      <div className="px-3 py-2.5 border-b border-[#C8A66A]/20 mb-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C8A66A] to-[#8F6B2A] flex items-center justify-center text-sm font-bold text-[#091812] shadow-sm">
                            {userSession.displayName.charAt(0).toUpperCase()}
                          </div>
                          <div className="overflow-hidden">
                            <span className="block font-serif font-bold text-xs text-[#F5EBD7] truncate">
                              {userSession.displayName}
                            </span>
                            <span className="block text-[10px] font-sans text-[#C8A66A] uppercase tracking-wider">
                              {userSession.role === "admin"
                                ? "✦ Grand Archivist"
                                : "Reader Explorer"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Links */}
                      <div className="space-y-0.5">
                        <Link
                          href="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-[#F5EBD7]/80 hover:text-[#F5EBD7] hover:bg-[#153328] transition-colors"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-[#C8A66A]" />
                          <span>My Shelf & Progress</span>
                        </Link>
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-[#F5EBD7]/80 hover:text-[#F5EBD7] hover:bg-[#153328] transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-[#C8A66A]" />
                          <span>Archivist Studio</span>
                        </Link>
                        <Link
                          href="/admin/books/new"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-[#F5EBD7]/80 hover:text-[#F5EBD7] hover:bg-[#153328] transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#C8A66A]" />
                          <span>Import Manuscript (.docx)</span>
                        </Link>
                      </div>

                      {/* Sign Out */}
                      <div className="pt-1.5 mt-1 border-t border-[#C8A66A]/15">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-[#B86F50] hover:text-[#F5EBD7] hover:bg-[#7B1E22]/20 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out of Sanctuary</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#C8A66A] via-[#DFCA9B] to-[#C8A66A] text-[#091812] shadow-lg hover:shadow-[#C8A66A]/30 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Enter Sanctuary
                </Link>
              )}
            </div>

            {/* 4. Mobile Right Controls */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-[#C8A66A] hover:bg-[#10271F] rounded-full transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/admin"
                className="p-2 text-[#DFCA9B] hover:bg-[#10271F] rounded-full transition-colors"
                title="Admin Portal"
              >
                <Shield className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#F5EBD7] hover:text-[#C8A66A] hover:bg-[#10271F] rounded-full transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-[#C8A66A]" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 5. Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#091812]/98 border-b border-[#C8A66A]/30 px-5 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top duration-300 backdrop-blur-2xl">
            {/* Mobile Nav Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-serif font-medium transition-colors ${
                      isActive
                        ? "bg-[#C8A66A]/20 text-[#DFCA9B] border border-[#C8A66A]/50"
                        : "text-[#F5EBD7]/85 hover:bg-[#10271F]"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 text-[#C8A66A]" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-[#C8A66A]/20 text-[#DFCA9B] text-[10px] font-sans">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth & Admin Section */}
            <div className="pt-4 border-t border-[#C8A66A]/20 flex flex-col gap-2.5">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 py-3 rounded-2xl bg-[#10271F] border border-[#C8A66A]/40 text-[#DFCA9B] text-xs uppercase tracking-wider font-semibold"
              >
                <Shield className="w-4 h-4 text-[#C8A66A]" />
                <span>Archivist Portal</span>
              </Link>

              {userSession ? (
                <div className="p-3 rounded-2xl bg-[#10271F]/60 border border-[#C8A66A]/20 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-serif font-bold text-[#F5EBD7]">
                      {userSession.displayName}
                    </span>
                    <span className="text-[10px] text-[#C8A66A]">
                      {userSession.role === "admin" ? "Grand Archivist" : "Reader"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-[#B86F50] hover:text-[#C8A66A] font-medium underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#C8A66A] via-[#DFCA9B] to-[#C8A66A] text-[#091812] text-center font-bold text-xs uppercase tracking-wider shadow-md"
                >
                  Enter Sanctuary (Sign In)
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 6. Interactive Omni Search Modal (Command Palette) */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 sm:pt-28 px-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-[#091812] border border-[#C8A66A]/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-5 border-b border-[#C8A66A]/25 flex items-center space-x-3 bg-[#10271F]/80">
              <Search className="w-5 h-5 text-[#C8A66A] shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search manuscripts, authors, thoughts, or stories..."
                className="w-full bg-transparent text-[#F5EBD7] placeholder-[#F5EBD7]/40 text-sm sm:text-base outline-none font-serif"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-[#F5EBD7]/50 hover:text-[#DFCA9B]"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-lg text-[#F5EBD7]/60 hover:text-[#C8A66A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {isSearching ? (
                <div className="py-12 text-center text-xs font-serif text-[#C8A66A] animate-pulse">
                  Searching the ancient codices...
                </div>
              ) : searchQuery &&
                searchResults.books.length === 0 &&
                searchResults.stories.length === 0 &&
                searchResults.thoughts.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="font-serif text-[#F5EBD7]/80 text-base">
                    No manuscripts found matching &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p className="text-xs text-[#C8A66A]/70 font-sans">
                    Try searching for &quot;Archive&quot;, &quot;Solitude&quot;, &quot;Philosophy&quot;, or &quot;Marcus&quot;
                  </p>
                </div>
              ) : !searchQuery ? (
                /* Default Suggested Quick Links */
                <div className="space-y-4">
                  <span className="text-[10px] uppercase tracking-widest text-[#C8A66A] font-bold block">
                    Popular Volumes & Curations
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      onClick={() => {
                        setSearchModalOpen(false);
                        router.push("/read/the-whispering-archive");
                      }}
                      className="p-3 rounded-xl bg-[#10271F] border border-[#C8A66A]/20 hover:border-[#C8A66A] text-left flex items-center space-x-3 transition-colors group"
                    >
                      <BookOpen className="w-4 h-4 text-[#C8A66A]" />
                      <div className="overflow-hidden">
                        <span className="text-xs font-serif font-bold text-[#F5EBD7] block group-hover:text-[#DFCA9B] truncate">
                          The Whispering Archive
                        </span>
                        <span className="text-[10px] text-[#C8A66A]/80 font-sans">
                          Evelyn Vance • 312 Pages
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setSearchModalOpen(false);
                        router.push("/read/the-alchemist-of-solitude");
                      }}
                      className="p-3 rounded-xl bg-[#10271F] border border-[#C8A66A]/20 hover:border-[#C8A66A] text-left flex items-center space-x-3 transition-colors group"
                    >
                      <BookOpen className="w-4 h-4 text-[#C8A66A]" />
                      <div className="overflow-hidden">
                        <span className="text-xs font-serif font-bold text-[#F5EBD7] block group-hover:text-[#DFCA9B] truncate">
                          The Alchemist of Solitude
                        </span>
                        <span className="text-[10px] text-[#C8A66A]/80 font-sans">
                          Marcus Sterling • Most Read
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                /* Results List */
                <div className="space-y-5">
                  {/* Books */}
                  {searchResults.books.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-widest text-[#C8A66A] font-bold block">
                        Books & Manuscripts ({searchResults.books.length})
                      </span>
                      <div className="space-y-1.5">
                        {searchResults.books.map((b) => (
                          <button
                            key={b.id}
                            onClick={() => {
                              setSearchModalOpen(false);
                              router.push(`/read/${b.slug}`);
                            }}
                            className="w-full p-3 rounded-xl bg-[#10271F]/80 hover:bg-[#10271F] border border-[#C8A66A]/20 hover:border-[#C8A66A] flex items-center justify-between text-left transition-all group"
                          >
                            <div className="flex items-center space-x-3">
                              <BookOpen className="w-4 h-4 text-[#C8A66A]" />
                              <div>
                                <span className="font-serif font-bold text-sm text-[#F5EBD7] group-hover:text-[#DFCA9B] block">
                                  {b.title}
                                </span>
                                <span className="text-[11px] text-[#DFCA9B]/70 font-sans">
                                  {b.author} • {b.total_pages} pages
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-[#C8A66A] opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 font-serif">
                              <span>Read</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stories */}
                  {searchResults.stories.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-widest text-[#C8A66A] font-bold block">
                        Short Stories ({searchResults.stories.length})
                      </span>
                      <div className="space-y-1.5">
                        {searchResults.stories.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => {
                              setSearchModalOpen(false);
                              router.push(`/stories/${s.slug}`);
                            }}
                            className="w-full p-3 rounded-xl bg-[#10271F]/80 hover:bg-[#10271F] border border-[#C8A66A]/20 hover:border-[#C8A66A] flex items-center justify-between text-left transition-all group"
                          >
                            <div className="flex items-center space-x-3">
                              <Compass className="w-4 h-4 text-[#C8A66A]" />
                              <div>
                                <span className="font-serif font-bold text-sm text-[#F5EBD7] group-hover:text-[#DFCA9B] block">
                                  {s.title}
                                </span>
                                <span className="text-[11px] text-[#DFCA9B]/70 font-sans">
                                  {s.author} • {s.reading_time_minutes} min read
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#C8A66A] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Daily Thoughts */}
                  {searchResults.thoughts.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-widest text-[#C8A66A] font-bold block">
                        Daily Thoughts ({searchResults.thoughts.length})
                      </span>
                      <div className="space-y-1.5">
                        {searchResults.thoughts.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => {
                              setSearchModalOpen(false);
                              router.push(`/thoughts`);
                            }}
                            className="w-full p-3 rounded-xl bg-[#10271F]/80 hover:bg-[#10271F] border border-[#C8A66A]/20 hover:border-[#C8A66A] text-left transition-all group"
                          >
                            <div className="flex items-start space-x-2.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#C8A66A] shrink-0 mt-0.5" />
                              <div>
                                <p className="font-serif italic text-xs text-[#F5EBD7]/90 group-hover:text-[#F5EBD7] line-clamp-2">
                                  &ldquo;{t.quote}&rdquo;
                                </p>
                                <span className="text-[10px] text-[#C8A66A] font-sans block mt-1">
                                  — {t.author} • {t.category}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer with Keyboard Hint */}
            <div className="p-3 bg-[#0C1E17] border-t border-[#C8A66A]/20 flex items-center justify-between text-[11px] text-[#DFCA9B]/70 font-sans">
              <span>Press <kbd className="px-1 py-0.5 bg-[#10271F] border border-[#C8A66A]/30 rounded">Esc</kbd> to close</span>
              <span className="italic font-serif text-[#C8A66A]">✦ The Living Book Omni Search ✦</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
