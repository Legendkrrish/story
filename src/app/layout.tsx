import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Caveat, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingParticles from "@/components/effects/FloatingParticles";
import AmbientSoundscape from "@/components/effects/AmbientSoundscape";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | The Living Book",
    default: "The Living Book — An Immersive Digital Library for Daily Thoughts, Stories & Books",
  },
  description:
    "Enter a magical 3D digital library where books come alive. Discover daily inspirational thoughts, explore short stories, and read full books with realistic physical page turning.",
  keywords: [
    "3D book reader",
    "digital library",
    "daily thoughts",
    "interactive books",
    "page flip",
    "literature",
    "inspirational quotes",
  ],
  authors: [{ name: "The Living Book" }],
  openGraph: {
    title: "The Living Book — An Immersive Digital Library",
    description: "Every Thought Opens a New World. Experience books as physical living objects.",
    siteName: "The Living Book",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${caveat.variable} ${plusJakarta.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#091812] text-[#F5EBD7] font-sans selection:bg-[#C8A66A]/30 selection:text-[#F5EBD7]">
        <FloatingParticles />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <AmbientSoundscape />
        <Footer />
      </body>
    </html>
  );
}
