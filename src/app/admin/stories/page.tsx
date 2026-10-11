"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  Plus,
  Trash2,
  Edit,
  Eye,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Story, Category } from "@/types/database";

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Editor Modal
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState(
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800"
  );
  const [categoryId, setCategoryId] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [readingTime, setReadingTime] = useState(5);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<"published" | "draft">("published");

  const fetchData = () => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data) => {
        if (data.stories) setStories(data.stories);
      });

    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0 && !categoryId) {
            setCategoryId(data.categories[0].id);
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenNew = () => {
    setEditingId(null);
    setTitle("");
    setAuthor("");
    setExcerpt("");
    setContentHtml("<p>Begin writing the tale...</p>");
    setReadingTime(5);
    setIsFeatured(false);
    setStatus("published");
    setIsEditing(true);
  };

  const handleEdit = (story: Story) => {
    setEditingId(story.id);
    setTitle(story.title);
    setAuthor(story.author);
    setCoverUrl(story.cover_url);
    setCategoryId(story.category_id);
    setExcerpt(story.excerpt);
    setContentHtml(story.content_html);
    setReadingTime(story.reading_time_minutes);
    setIsFeatured(story.is_featured);
    setStatus(story.status as any);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        id: editingId || undefined,
        title,
        author,
        cover_url: coverUrl,
        category_id: categoryId,
        excerpt,
        content_html: contentHtml,
        reading_time_minutes: readingTime,
        is_featured: isFeatured,
        status,
      };

      const res = await fetch(
        editingId ? `/api/stories/${editingId}` : "/api/stories",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setIsEditing(false);
        fetchData();
      }
    } catch (e) {
      alert("Failed to save story");
    }
  };

  const handleDelete = async (id: string, storyTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${storyTitle}"?`)) return;
    try {
      const res = await fetch(`/api/stories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStories((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      alert("Failed to delete story");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#C8A66A]/20">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#F5EBD7]">
            Short Story Management
          </h1>
          <p className="text-xs text-[#F5EBD7]/70 font-sans mt-0.5">
            Craft, edit, and feature concise literary fables for single-session reading.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C8A66A] to-[#A68446] text-[#091812] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg flex items-center space-x-1.5 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Story</span>
        </button>
      </div>

      {isEditing && (
        <div className="bg-[#10271F] border border-[#C8A66A]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#C8A66A]/20">
            <h2 className="font-serif text-xl font-bold text-[#F5EBD7]">
              {editingId ? "Edit Story" : "Compose New Story"}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs text-[#DFCA9B] hover:text-[#F5EBD7]"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Story Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="The Clockmaker of Winterfold"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A]"
                />
              </div>

              <div>
                <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Rowan Thorne"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Reading Time (Minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  value={readingTime}
                  onChange={(e) => setReadingTime(parseInt(e.target.value, 10) || 5)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A]"
                />
              </div>

              <div>
                <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Cover Illustration URL
              </label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A]"
              />
            </div>

            <div>
              <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Excerpt / Intro Hook
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A compelling one-sentence hook..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#F5EBD7] focus:outline-none focus:border-[#C8A66A]"
              />
            </div>

            <div>
              <label className="block text-[#DFCA9B] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Story HTML Body Content
              </label>
              <textarea
                rows={8}
                value={contentHtml}
                onChange={(e) => setContentHtml(e.target.value)}
                className="w-full font-mono text-xs px-4 py-3 rounded-xl bg-[#091812] border border-[#C8A66A]/30 text-[#DFCA9B] focus:outline-none focus:border-[#C8A66A]"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="featStory"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#C8A66A]"
              />
              <label htmlFor="featStory" className="text-[#F5EBD7] cursor-pointer">
                Feature as &quot;Story of the Day&quot; on Homepage
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
                Save Story
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-[#10271F] border border-[#C8A66A]/30 rounded-2xl p-5 shadow-xl flex items-center gap-5 justify-between"
          >
            <div className="flex items-center space-x-4">
              <img
                src={story.cover_url}
                alt={story.title}
                className="w-16 h-20 object-cover rounded-lg border border-[#C8A66A]/30 shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-[10px] text-[#C8A66A]">
                  <span>{story.reading_time_minutes} min read</span>
                  {story.is_featured && (
                    <span className="px-1.5 py-0.5 rounded bg-[#C8A66A] text-[#091812] font-bold">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="font-serif font-bold text-base text-[#F5EBD7]">
                  {story.title}
                </h3>
                <p className="text-xs text-[#DFCA9B]/70 italic">By {story.author}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <Link
                href={`/stories/${story.slug}`}
                target="_blank"
                className="p-1.5 rounded-lg bg-[#091812] text-[#DFCA9B] hover:border-[#C8A66A] border border-[#C8A66A]/30"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleEdit(story)}
                className="p-1.5 rounded-lg bg-[#091812] text-[#C8A66A] hover:border-[#C8A66A] border border-[#C8A66A]/30"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(story.id, story.title)}
                className="p-1.5 rounded-lg bg-[#091812] text-red-400 border border-red-500/30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
