"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Calendar,
  Star,
  Quote,
} from "lucide-react";
import { DailyThought } from "@/types/database";

export default function AdminThoughtsPage() {
  const [thoughts, setThoughts] = useState<DailyThought[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal/drawer state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("Wisdom");
  const [handwrittenNote, setHandwrittenNote] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const fetchThoughts = () => {
    fetch("/api/thoughts")
      .then((res) => res.json())
      .then((data) => {
        if (data.thoughts) setThoughts(data.thoughts);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchThoughts();
  }, []);

  const handleOpenNew = () => {
    setEditingId(null);
    setQuote("");
    setAuthor("");
    setDate(new Date().toISOString().split("T")[0]);
    setCategory("Wisdom");
    setHandwrittenNote("");
    setIsFeatured(false);
    setIsPublished(true);
    setIsEditing(true);
  };

  const handleEdit = (t: DailyThought) => {
    setEditingId(t.id);
    setQuote(t.quote);
    setAuthor(t.author);
    setDate(t.date);
    setCategory(t.category);
    setHandwrittenNote(t.handwritten_note || "");
    setIsFeatured(t.is_featured);
    setIsPublished(t.is_published);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: editingId || undefined,
        quote,
        author,
        date,
        category,
        handwritten_note: handwrittenNote,
        is_featured: isFeatured,
        is_published: isPublished,
      };

      const res = await fetch(
        editingId ? `/api/thoughts/${editingId}` : "/api/thoughts",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setIsEditing(false);
        fetchThoughts();
      }
    } catch (e) {
      alert("Failed to save thought");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this thought?")) return;
    try {
      const res = await fetch(`/api/thoughts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setThoughts((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (e) {
      alert("Failed to delete thought");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#C8A66A]/20">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#F5EBD7]">
            Daily Thoughts & Scheduling
          </h1>
          <p className="text-xs text-[#F5EBD7]/70 font-sans mt-0.5">
            Curate inspirational quotes, schedule upcoming dates, and designate featured reflections.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A66A] to-[#A68446] text-[#091812] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg flex items-center space-x-1.5 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Reflection</span>
        </button>
      </div>

      {/* Editor Modal */}
      {isEditing && (
        <div className="bg-[#10271F] border border-[#C8A66A]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#C8A66A]/20">
            <h2 className="font-serif text-xl font-bold text-[#F5EBD7]">
              {editingId ? "Edit Daily Reflection" : "Create New Reflection"}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs text-[#DFCA9B] hover:text-[#F5EBD7]"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Quote / Contemplation *
              </label>
              <textarea
                rows={3}
                required
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Write the inspirational thought or passage..."
                className="w-full px-4 py-3 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="E.g. Marcus Aurelius"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A]"
                />
              </div>

              <div>
                <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Publication Date *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A]"
                />
              </div>

              <div>
                <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="E.g. Stoicism, Solitude, Wonder"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Handwritten Accent / Personal Whisper (Caveat Font)
              </label>
              <input
                type="text"
                value={handwrittenNote}
                onChange={(e) => setHandwrittenNote(e.target.value)}
                placeholder="E.g. Hold this truth close on restless days."
                className="w-full px-4 py-2.5 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A]"
              />
            </div>

            <div className="flex items-center space-x-6 pt-2">
              <label className="flex items-center space-x-2 cursor-pointer text-[#F5EBD7]">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#C8A66A]"
                />
                <span>Designate as Featured for this Date</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer text-[#F5EBD7]">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 accent-[#C8A66A]"
                />
                <span>Published & Active</span>
              </label>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-[#091812] text-[#DFCA9B]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-[#C8A66A] text-[#091812] font-bold uppercase tracking-wider"
              >
                Save Reflection
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Thoughts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {thoughts.map((item) => (
          <div
            key={item.id}
            className="paper-texture text-[#25241F] rounded-2xl p-6 border border-[#C8A66A]/40 shadow-xl relative flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#25241F]/15 text-xs font-sans">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-[#B86F50]" />
                  <span>{item.date}</span>
                  {item.is_featured && (
                    <span className="px-2 py-0.5 rounded-full bg-[#C8A66A] text-[#091812] font-bold text-[9px] uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                </div>
                <span className="text-[#536B4E] font-bold">{item.category}</span>
              </div>

              <div className="py-4 space-y-3">
                <p className="font-serif text-lg font-medium text-[#10271F] leading-snug">
                  “{item.quote}”
                </p>
                <p className="font-serif italic font-bold text-sm text-[#B86F50]">
                  — {item.author}
                </p>
                {item.handwritten_note && (
                  <p className="font-sans text-base text-[#536B4E] italic">
                    ~ {item.handwritten_note}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#25241F]/15 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3 text-[11px] text-[#25241F]/60">
                <span>{item.copy_count || 0} copies</span>
                <span>•</span>
                <span>{item.share_count || 0} shares</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1.5 rounded-lg bg-[#25241F]/10 hover:bg-[#25241F]/20 text-[#10271F]"
                  title="Edit"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
