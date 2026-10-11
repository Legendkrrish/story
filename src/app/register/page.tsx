"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, User, Key, Mail, Sparkles, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("Inspirational");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, email, password, favoriteGenre }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      router.push("/profile");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#091812] pt-28 pb-20 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(21,50,40,0.8),transparent)] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center space-y-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#10271F] border border-[#C8A66A]/50 flex items-center justify-center mx-auto shadow-xl">
            <Sparkles className="w-6 h-6 text-[#C8A66A]" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#F5EBD7]">
            Begin Your Passage
          </h1>
          <p className="text-xs text-[#F5EBD7]/70 font-serif">
            Create your personalized reading library to sync bookmarks and track progress across devices.
          </p>
        </div>

        <div className="bg-[#10271F]/90 border border-[#C8A66A]/40 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Seeker Name / Moniker
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A66A]" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="E.g. Elena the Wanderer"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] placeholder-[#F5EBD7]/40 focus:outline-none focus:border-[#C8A66A] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A66A]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="reader@thelivingbook.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] placeholder-[#F5EBD7]/40 focus:outline-none focus:border-[#C8A66A] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A66A]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] placeholder-[#F5EBD7]/40 focus:outline-none focus:border-[#C8A66A] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Primary Literary Interest
              </label>
              <select
                value={favoriteGenre}
                onChange={(e) => setFavoriteGenre(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A] transition-colors"
              >
                <option value="Inspirational">Inspirational & Courage</option>
                <option value="Philosophy">Philosophy & Quietude</option>
                <option value="Mystery">Mystery & Forgotten Vaults</option>
                <option value="Fiction">Fiction & Human Destiny</option>
                <option value="Poetry">Poetry & Star-songs</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C8A66A] to-[#A68446] text-[#091812] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-50"
            >
              <span>{loading ? "Creating..." : "Inscribe My Name"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-[#F5EBD7]/60 pt-2 border-t border-[#C8A66A]/20">
            Already registered?{" "}
            <Link
              href="/login"
              className="text-[#C8A66A] font-semibold underline hover:text-[#DFCA9B]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
