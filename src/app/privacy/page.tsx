import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — The Living Book",
  description: "Privacy policy and data protection principles for The Living Book.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#091812] pt-28 pb-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-[#DFCA9B] hover:text-[#F5EBD7] mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <article className="paper-texture text-[#25241F] rounded-3xl p-8 sm:p-14 border border-[#C8A66A]/40 shadow-2xl space-y-6">
          <h1 className="font-serif text-3xl font-bold text-[#10271F] pb-4 border-b border-[#25241F]/15">
            Privacy Policy
          </h1>

          <div className="font-serif text-base space-y-4 text-[#10271F]">
            <p>
              At <strong>The Living Book</strong>, we treat your privacy with the same sanctity as a quiet reading room. We collect only what is strictly necessary to preserve your reading progress and bookmarks.
            </p>

            <h2 className="font-serif text-xl font-bold pt-2">1. Information We Store</h2>
            <p>
              When you create an account, we store your email address and display name. Your reading progress (the page you last turned) and your bookmarks are saved so you can resume where you left off.
            </p>

            <h2 className="font-serif text-xl font-bold pt-2">2. Local Storage</h2>
            <p>
              For visitors without accounts, reading progress is preserved locally within your browser cache using standard Web Storage APIs.
            </p>

            <h2 className="font-serif text-xl font-bold pt-2">3. Third Parties</h2>
            <p>
              We do not sell, rent, or monetize your reading habits. There are no tracking pixels or invasive advertising scripts embedded into our pages.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
