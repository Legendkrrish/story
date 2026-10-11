"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  FileUp,
  Search,
} from "lucide-react";
import { Book } from "@/types/database";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBooks = () => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        if (data.books) {
          setBooks(data.books);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you wish to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBooks((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (e) {
      alert("Failed to delete book");
    }
  };

  const handleToggleStatus = async (book: Book) => {
    const newStatus = book.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...book, status: newStatus }),
      });
      if (res.ok) {
        setBooks((prev) =>
          prev.map((b) => (b.id === book.id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (e) {
      alert("Failed to update status");
    }
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#C8A66A]/20">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#F5EBD7]">
            Sanctuary Books ({books.length})
          </h1>
          <p className="text-xs text-[#F5EBD7]/70 font-sans mt-0.5">
            Manage manuscript metadata, upload new volumes, or adjust publication status.
          </p>
        </div>

        <Link
          href="/admin/books/new"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A66A] to-[#A68446] text-[#091812] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg flex items-center space-x-1.5 transition-all w-fit"
        >
          <FileUp className="w-4 h-4" />
          <span>Import Word DOCX</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C8A66A]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter books by title or author..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#10271F] border border-[#C8A66A]/30 text-xs text-[#F5EBD7] placeholder-[#F5EBD7]/40 focus:outline-none focus:border-[#C8A66A]"
        />
      </div>

      {/* Table */}
      <div className="bg-[#10271F] border border-[#C8A66A]/30 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#091812] text-[#DFCA9B] uppercase tracking-wider border-b border-[#C8A66A]/20">
              <tr>
                <th className="py-4 px-6">Book</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Pages</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Reads</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C8A66A]/10 text-[#F5EBD7]/90">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-[#091812]/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded border border-[#C8A66A]/30 shrink-0"
                      />
                      <div>
                        <h3 className="font-serif font-bold text-sm text-[#F5EBD7]">
                          {book.title}
                        </h3>
                        <p className="text-[11px] text-[#DFCA9B]/70 italic">
                          By {book.author}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#091812] border border-[#C8A66A]/30 text-[10px] font-semibold text-[#DFCA9B]">
                      {book.category?.name || "Fiction"}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono">{book.total_pages}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleStatus(book)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                        book.status === "published"
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900"
                          : "bg-amber-950/80 text-amber-300 border border-amber-500/40 hover:bg-amber-900"
                      }`}
                    >
                      {book.status}
                    </button>
                  </td>
                  <td className="py-4 px-4 font-mono">{book.read_count || 0}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/read/${book.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-[#091812] text-[#DFCA9B] hover:text-[#F5EBD7] border border-[#C8A66A]/30 hover:border-[#C8A66A]"
                        title="Open 3D Reader"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(book.id, book.title)}
                        className="p-1.5 rounded-lg bg-[#091812] text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400"
                        title="Delete Book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
