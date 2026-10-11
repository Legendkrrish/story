import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Shield,
  BookOpen,
  FileUp,
  Sparkles,
  Compass,
  Image as ImageIcon,
  Users,
  LogOut,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { getCurrentSession } from "@/lib/auth/session";
import BrandLogo from "@/components/ui/BrandLogo";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Archivist Portal — Admin Dashboard",
  description: "Manage books, upload Word manuscripts, schedule daily thoughts, and oversee readers.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  // If user is not logged in or not admin, redirect to login
  if (!session || session.role !== "admin") {
    redirect("/login?redirect=/admin");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard Overview", icon: Shield },
    { href: "/admin/books", label: "Books & Manuscripts", icon: BookOpen },
    { href: "/admin/books/new", label: "Import Word DOCX", icon: FileUp, highlight: true },
    { href: "/admin/thoughts", label: "Daily Thoughts", icon: Sparkles },
    { href: "/admin/stories", label: "Short Stories", icon: Compass },
    { href: "/admin/media", label: "Media Library", icon: ImageIcon },
    { href: "/admin/users", label: "Users & Activity", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#07130E] text-[#F5EBD7] flex flex-col md:flex-row pt-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#091812] border-r border-[#C8A66A]/20 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Header */}
          <Link href="/" className="inline-block">
            <BrandLogo size="sm" />
          </Link>

          {/* Nav links */}
          <nav className="space-y-1.5 font-sans text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-medium transition-all ${
                    item.highlight
                      ? "bg-[#C8A66A]/20 text-[#DFCA9B] border border-[#C8A66A]/50 hover:bg-[#C8A66A]/30"
                      : "text-[#F5EBD7]/80 hover:bg-[#10271F] hover:text-[#DFCA9B]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-[#C8A66A]" />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span className="px-1.5 py-0.5 rounded bg-[#C8A66A] text-[#091812] text-[9px] font-bold">
                      NEW
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Return to site */}
        <div className="pt-8 border-t border-[#C8A66A]/15 space-y-3 font-sans text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#10271F] text-[#DFCA9B] hover:text-[#F5EBD7] transition-colors"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Sanctuary</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-[#10271F]/50 text-[#B86F50] hover:text-red-400 hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
