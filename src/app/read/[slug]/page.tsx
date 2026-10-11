import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import BookReader from "@/components/reader/BookReader";

interface ReadPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = db.getBookBySlug(slug);
  if (!book) return { title: "Book Not Found" };

  return {
    title: `Reading: ${book.title}`,
    description: `Read ${book.title} by ${book.author} in the interactive 3D digital reader.`,
  };
}

export default async function ReadPage({ params, searchParams }: ReadPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;

  const book = db.getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  // Increment book view count
  db.incrementBookViewCount(book.id);

  const initialPageNumber = page ? parseInt(page, 10) || 1 : 1;

  return <BookReader book={book} initialPage={initialPageNumber} />;
}
