"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userSession, setUserSession] = useState<{
    displayName: string;
    role: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check session
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

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUserSession(null);
    window.location.href = "/";
  };

  // If reading full screen mode, keep navbar hidden
  if (pathname.startsWith("/read/")) {
    return null;
  }

  const navLinks = [
    { href: "/books", label: "Library", icon: BookOpen },
    { href: "/thoughts", label: "Daily Thoughts", icon: Sparkles },
    { href: "/stories", label: "Stories", icon: Compass },
    { href: "/profile", label: "My Shelf", icon: Bookmark },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#091812]/90 backdrop-blur-md border-b border-[#C8A66A]/20 py-3 shadow-2xl"
          : "bg-gradient-to-b from-[#091812]/95 via-[#091812]/60 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="text-decoration-none">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#C8A66A]/20 text-[#DFCA9B] border border-[#C8A66A]/40 shadow-sm"
                      : "text-[#F5EBD7]/80 hover:text-[#F5EBD7] hover:bg-[#10271F]/60"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#C8A66A]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Admin Link */}
            <Link
              href="/admin"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                pathname.startsWith("/admin")
                  ? "bg-[#C8A66A] text-[#10271F] border-[#C8A66A] font-semibold"
                  : "bg-[#10271F]/80 text-[#C8A66A] border-[#C8A66A]/30 hover:border-[#C8A66A] hover:bg-[#10271F]"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Archivist Portal</span>
            </Link>

            {/* User Session */}
            {userSession ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#10271F] border border-[#C8A66A]/30 text-sm hover:border-[#C8A66A] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#C8A66A]" />
                  <span className="text-xs text-[#F5EBD7] max-w-[100px] truncate">
                    {userSession.displayName}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-full hover:bg-[#10271F] text-[#F5EBD7]/60 hover:text-[#C8A66A] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#C8A66A] to-[#A68446] text-[#091812] hover:brightness-110 shadow-md hover:shadow-[#C8A66A]/20 transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/admin"
              className="p-2 text-[#C8A66A] hover:bg-[#10271F] rounded-lg"
              title="Admin"
            >
              <Shield className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F5EBD7] hover:text-[#C8A66A] hover:bg-[#10271F] rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#091812]/98 border-b border-[#C8A66A]/20 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? "bg-[#C8A66A]/20 text-[#DFCA9B] border border-[#C8A66A]/40"
                    : "text-[#F5EBD7]/80 hover:bg-[#10271F]"
                }`}
              >
                <Icon className="w-5 h-5 text-[#C8A66A]" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-4 border-t border-[#C8A66A]/10 flex flex-col gap-2">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#10271F] border border-[#C8A66A]/40 text-[#C8A66A] text-sm font-medium"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
            {userSession ? (
              <div className="flex items-center justify-between px-2 pt-2">
                <span className="text-sm text-[#F5EBD7]/80">
                  Signed in as <strong>{userSession.displayName}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-[#B86F50] underline hover:text-[#C8A66A]"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C8A66A] to-[#A68446] text-[#091812] text-center font-bold text-sm"
              >
                Sign In to Personal Library
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
