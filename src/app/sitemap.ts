import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();

  const books = db.getBooks({ status: "published" });
  const stories = db.getStories({ status: "published" });
  const categories = db.getCategories();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, priority: 1.0 },
    { url: `${baseUrl}/books`, lastModified: now, priority: 0.9 },
    { url: `${baseUrl}/thoughts`, lastModified: now, priority: 0.9 },
    { url: `${baseUrl}/stories`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: now, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, priority: 0.3 },
  ];

  const bookRoutes: MetadataRoute.Sitemap = books.map((b) => ({
    url: `${baseUrl}/books/${b.slug}`,
    lastModified: new Date(b.updated_at),
    priority: 0.8,
  }));

  const readRoutes: MetadataRoute.Sitemap = books.map((b) => ({
    url: `${baseUrl}/read/${b.slug}`,
    lastModified: new Date(b.updated_at),
    priority: 0.9,
  }));

  const storyRoutes: MetadataRoute.Sitemap = stories.map((s) => ({
    url: `${baseUrl}/stories/${s.slug}`,
    lastModified: new Date(s.updated_at),
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/categories/${c.slug}`,
    lastModified: now,
    priority: 0.6,
  }));

  return [...staticRoutes, ...bookRoutes, ...readRoutes, ...storyRoutes, ...categoryRoutes];
}
