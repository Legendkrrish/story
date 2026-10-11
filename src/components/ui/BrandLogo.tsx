"use client";

import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function BrandLogo({
  size = "md",
  showText = true,
  className = "",
}: BrandLogoProps) {
  const dimensions = {
    sm: { box: "w-8 h-8", svg: 22, text: "text-base", sub: "text-[9px]" },
    md: { box: "w-11 h-11", svg: 28, text: "text-lg sm:text-xl", sub: "text-[10px]" },
    lg: { box: "w-14 h-14", svg: 36, text: "text-2xl", sub: "text-xs" },
  }[size];

  return (
    <div className={`flex items-center space-x-3.5 group select-none ${className}`}>
      {/* Ornate Artisanal Insignia Medallion */}
      <div className={`relative ${dimensions.box} shrink-0`}>
        {/* Subtle Ambient Gold Glow Behind Emblem */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#DFCA9B]/30 via-[#C8A66A]/20 to-transparent blur-[6px] group-hover:from-[#DFCA9B]/50 group-hover:blur-md transition-all duration-500" />

        {/* Outer Medallion Frame */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-b from-[#143328] via-[#0E241D] to-[#07130F] p-[1.5px] shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] group-hover:shadow-[0_4px_24px_rgba(200,166,106,0.35)] transition-all duration-500">
          {/* Dual Concentric Gold Border Layer */}
          <div className="w-full h-full rounded-[10px] bg-gradient-to-b from-[#10271F] to-[#091812] border border-[#C8A66A]/60 flex items-center justify-center relative overflow-hidden group-hover:border-[#DFCA9B] transition-colors duration-300">
            {/* Corner Filigree Accents */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[#C8A66A]/70" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-[#C8A66A]/70" />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-[#C8A66A]/70" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-[#C8A66A]/70" />

            {/* Subtle Diagonal Shimmer Sweep on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

            {/* Handcrafted Vector Icon: Open Living Book with Rising Celestial Starlight */}
            <svg
              width={dimensions.svg}
              height={dimensions.svg}
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transform group-hover:scale-105 transition-transform duration-300"
            >
              <defs>
                {/* Antique Gold Metallic Gradient */}
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF2C6" />
                  <stop offset="35%" stopColor="#DFCA9B" />
                  <stop offset="70%" stopColor="#C8A66A" />
                  <stop offset="100%" stopColor="#8F6B2A" />
                </linearGradient>

                {/* Soft Inner Glow */}
                <linearGradient id="starGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF8E7" />
                  <stop offset="100%" stopColor="#C8A66A" />
                </linearGradient>

                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Radiant Light Beams Rising From Book */}
              <g opacity="0.85" filter="url(#glowFilter)">
                <line x1="20" y1="14" x2="20" y2="8" stroke="url(#goldGradient)" strokeWidth="1" strokeLinecap="round" />
                <line x1="16" y1="15" x2="13" y2="11" stroke="url(#goldGradient)" strokeWidth="0.8" strokeLinecap="round" />
                <line x1="24" y1="15" x2="27" y2="11" stroke="url(#goldGradient)" strokeWidth="0.8" strokeLinecap="round" />
              </g>

              {/* Celestial 8-Point Star Rising from Spine */}
              <path
                d="M20 7.5 L21.2 11.2 L25 12.5 L21.2 13.8 L20 17.5 L18.8 13.8 L15 12.5 L18.8 11.2 Z"
                fill="url(#starGlow)"
                className="group-hover:rotate-45 transition-transform duration-700 origin-center"
              />

              {/* Floating Magic Sparks */}
              <circle cx="12" cy="14" r="0.75" fill="#FFF2C6" opacity="0.9" />
              <circle cx="28" cy="14" r="0.75" fill="#FFF2C6" opacity="0.9" />
              <circle cx="20" cy="5" r="0.85" fill="#FFF2C6" />

              {/* Book Spine Center Crest */}
              <path
                d="M20 19 L20 33.5"
                stroke="url(#goldGradient)"
                strokeWidth="1.6"
                strokeLinecap="round"
              />

              {/* Left Pages Arc */}
              <path
                d="M20 19 C15 17 9 17 6 19 C5.5 19.3 5 19.8 5 20.5 L5 30.5 C5 31.2 5.5 31.7 6.2 31.5 C10 30 15 30.5 20 33"
                stroke="url(#goldGradient)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Right Pages Arc */}
              <path
                d="M20 19 C25 17 31 17 34 19 C34.5 19.3 35 19.8 35 20.5 L35 30.5 C35 31.2 34.5 31.7 33.8 31.5 C30 30 25 30.5 20 33"
                stroke="url(#goldGradient)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Inner Decorative Page Lines */}
              <path
                d="M8.5 23 C12 21.5 16 22 18.5 23.5"
                stroke="url(#goldGradient)"
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M8.5 26 C12 24.5 16 25 18.5 26.5"
                stroke="url(#goldGradient)"
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M31.5 23 C28 21.5 24 22 21.5 23.5"
                stroke="url(#goldGradient)"
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.6"
              />
              <path
                d="M31.5 26 C28 24.5 24 25 21.5 26.5"
                stroke="url(#goldGradient)"
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-serif tracking-[0.18em] ${dimensions.text} font-bold bg-gradient-to-r from-[#FFF5DE] via-[#DFCA9B] to-[#C8A66A] bg-clip-text text-transparent group-hover:brightness-110 transition-all drop-shadow-sm`}
          >
            THE LIVING BOOK
          </span>
          <span
            className={`${dimensions.sub} uppercase tracking-[0.28em] text-[#C8A66A]/80 font-sans -mt-0.5 flex items-center space-x-1`}
          >
            <span>Sanctuary of Stories</span>
            <span className="text-[#DFCA9B] text-[8px]">✦</span>
          </span>
        </div>
      )}
    </div>
  );
}
