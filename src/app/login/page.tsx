"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Key, Mail, ArrowRight } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      if (data.profile?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
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
          <div className="flex justify-center mb-2">
            <BrandLogo size="lg" showText={false} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#F5EBD7]">
            Sanctuary Sign In
          </h1>
          <p className="text-xs text-[#F5EBD7]/70 font-serif">
            Enter your credentials to access your reading progress and personal shelf.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#10271F]/90 border border-[#C8A66A]/40 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
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
                Secret Password
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C8A66A] to-[#A68446] text-[#091812] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg transition-all flex items-center justify-center space-x-2 mt-2 disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Sanctuary"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-[#F5EBD7]/60 pt-4 border-t border-[#C8A66A]/15">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="text-[#C8A66A] font-semibold underline hover:text-[#DFCA9B]"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
