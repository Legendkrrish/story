"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Upload, Copy, Check, Sparkles } from "lucide-react";

export default function AdminMediaPage() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const curatedAssets = [
    {
      title: "Ancient Manuscript Texture",
      category: "Textures",
      url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Solitude & Warm Lantern",
      category: "Book Cover",
      url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Old Pine Wood Mist",
      category: "Environment",
      url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Celestial Shoreline",
      category: "Book Cover",
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Clockwork Escapement",
      category: "Illustration",
      url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Perennial Philosophy Garden",
      category: "Book Cover",
      url: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Starry Nightfall Whispers",
      category: "Story Cover",
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Beacon Tower Sentinel",
      category: "Story Cover",
      url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between pb-6 border-b border-[#C8A66A]/20">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#F5EBD7]">
            Sanctuary Media Library
          </h1>
          <p className="text-xs text-[#F5EBD7]/70 font-sans mt-0.5">
            Curated photographic book covers, paper grain overlays, and decorative assets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {curatedAssets.map((asset, idx) => (
          <div
            key={idx}
            className="bg-[#10271F] border border-[#C8A66A]/30 rounded-2xl overflow-hidden shadow-xl group hover:border-[#C8A66A] transition-all flex flex-col justify-between"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={asset.url}
                alt={asset.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#091812]/80 text-[10px] uppercase font-bold text-[#DFCA9B] border border-[#C8A66A]/30">
                {asset.category}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <h3 className="font-serif font-bold text-sm text-[#F5EBD7] truncate">
                {asset.title}
              </h3>

              <button
                onClick={() => handleCopy(asset.url)}
                className="w-full py-2 rounded-xl bg-[#091812] border border-[#C8A66A]/30 hover:border-[#C8A66A] text-xs font-semibold text-[#DFCA9B] flex items-center justify-center space-x-1.5 transition-colors"
              >
                {copiedUrl === asset.url ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">URL Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#C8A66A]" />
                    <span>Copy Asset URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
