import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service — The Living Book",
  description: "Terms of service for visitors and readers of The Living Book.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>

          <div className="font-serif text-base space-y-4 text-[#10271F]">
            <p>
              By entering <strong>The Living Book</strong>, you agree to treat the sanctuary and its fellow readers with courtesy and respect.
            </p>

            <h2 className="font-serif text-xl font-bold pt-2">1. Intellectual Property</h2>
            <p>
              The original stories, essays, and manuscripts published here remain the intellectual property of their respective creators and authors.
            </p>

            <h2 className="font-serif text-xl font-bold pt-2">2. Reader Conduct</h2>
            <p>
              Accounts engaged in malicious behavior or unauthorized scraping will have their access revoked.
            </p>

            <h2 className="font-serif text-xl font-bold pt-2">3. Living Experience</h2>
            <p>
              We strive to keep the physical animations smooth and delightful across all modern devices.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
