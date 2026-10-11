import fs from "fs";
import path from "path";
import {
  Book,
  BookChapter,
  Category,
  DailyThought,
  Story,
  Profile,
  Bookmark,
  Favorite,
  ReadingProgress,
  ReadingSession,
  DashboardStats,
} from "@/types/database";
import {
  initialCategories,
  initialBooks,
  initialChapters,
  initialThoughts,
  initialStories,
  initialProfiles,
  initialReadingProgress,
  initialBookmarks,
} from "./initialData";

interface DatabaseState {
  categories: Category[];
  books: Book[];
  chapters: Record<string, BookChapter[]>;
  thoughts: DailyThought[];
  stories: Story[];
  profiles: Profile[];
  readingProgress: ReadingProgress[];
  bookmarks: Bookmark[];
  favorites: Favorite[];
  readingSessions: ReadingSession[];
}

const DB_DIR = path.join(process.cwd(), "src", "data");
const DB_FILE = path.join(DB_DIR, "living_book_db.json");

// In-memory cache + file sync
let cachedDb: DatabaseState | null = null;

function ensureDataDirectory() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

function loadDatabase(): DatabaseState {
  if (cachedDb) return cachedDb;

  try {
    ensureDataDirectory();
    if (fs.existsSync(DB_FILE)) {
      const fileData = fs.readFileSync(DB_FILE, "utf-8");
      cachedDb = JSON.parse(fileData);
      return cachedDb!;
    }
  } catch (err) {
    console.error("Failed to read database file, initializing default data:", err);
  }

  // Initialize with initial data
  cachedDb = {
    categories: [...initialCategories],
    books: [...initialBooks],
    chapters: { ...initialChapters },
    thoughts: [...initialThoughts],
    stories: [...initialStories],
    profiles: [...initialProfiles],
    readingProgress: [...initialReadingProgress],
    bookmarks: [...initialBookmarks],
    favorites: [],
    readingSessions: [
      {
        id: "sess-1",
        user_id: "reader-1",
        book_id: "book-1",
        started_at: "2026-10-11T18:00:00Z",
        duration_minutes: 45,
        pages_read: 24,
      },
      {
        id: "sess-2",
        user_id: "reader-1",
        book_id: "book-2",
        started_at: "2026-10-10T20:30:00Z",
        duration_minutes: 30,
        pages_read: 18,
      },
    ],
  };

  saveDatabase(cachedDb);
  return cachedDb;
}

function saveDatabase(db: DatabaseState) {
  try {
    ensureDataDirectory();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
    cachedDb = db;
  } catch (err) {
    console.error("Failed to save database file:", err);
  }
}

export const db = {
  // Books
  getBooks: (filters?: {
    categorySlug?: string;
    status?: string;
    search?: string;
    featured?: boolean;
  }): Book[] => {
    const data = loadDatabase();
    let books = data.books.map((b) => ({
      ...b,
      category: data.categories.find((c) => c.id === b.category_id),
    }));

    if (filters?.status) {
      books = books.filter((b) => b.status === filters.status);
    }
    if (filters?.featured !== undefined) {
      books = books.filter((b) => b.featured === filters.featured);
    }
    if (filters?.categorySlug) {
      books = books.filter(
        (b) => b.category?.slug.toLowerCase() === filters.categorySlug?.toLowerCase()
      );
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      );
    }

    return books;
  },

  getBookBySlug: (slug: string): (Book & { chapters: BookChapter[] }) | null => {
    const data = loadDatabase();
    const book = data.books.find((b) => b.slug === slug || b.id === slug);
    if (!book) return null;

    const category = data.categories.find((c) => c.id === book.category_id);
    const chapters = data.chapters[book.id] || [];

    return {
      ...book,
      category,
      chapters: [...chapters].sort((a, b) => a.chapter_number - b.chapter_number),
    };
  },

  saveBook: (
    bookData: Partial<Book> & { chapters?: Partial<BookChapter>[] }
  ): Book => {
    const data = loadDatabase();
    const now = new Date().toISOString();
    const id = bookData.id || `book-${Date.now()}`;
    const slug =
      bookData.slug ||
      (bookData.title || "untitled")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const existingIndex = data.books.findIndex((b) => b.id === id);

    const newBook: Book = {
      id,
      title: bookData.title || "Untitled Book",
      slug,
      author: bookData.author || "Unknown Author",
      description: bookData.description || "",
      cover_url:
        bookData.cover_url ||
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800",
      spine_color: bookData.spine_color || "#1A3C34",
      accent_color: bookData.accent_color || "#C8A66A",
      category_id: bookData.category_id || data.categories[0]?.id || "cat-1",
      total_pages: bookData.total_pages || 100,
      estimated_reading_time: bookData.estimated_reading_time || "2 hours",
      status: bookData.status || "draft",
      published_at: bookData.status === "published" ? now : bookData.published_at,
      featured: Boolean(bookData.featured),
      view_count: bookData.view_count || 0,
      read_count: bookData.read_count || 0,
      created_at: existingIndex >= 0 ? data.books[existingIndex].created_at : now,
      updated_at: now,
    };

    if (existingIndex >= 0) {
      data.books[existingIndex] = newBook;
    } else {
      data.books.unshift(newBook);
    }

    if (bookData.chapters && bookData.chapters.length > 0) {
      data.chapters[id] = bookData.chapters.map((ch, idx) => ({
        id: ch.id || `chap-${id}-${idx + 1}`,
        book_id: id,
        chapter_number: ch.chapter_number || idx + 1,
        title: ch.title || `Chapter ${idx + 1}`,
        slug:
          ch.slug ||
          (ch.title || `chapter-${idx + 1}`)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
        content_html: ch.content_html || "<p>Chapter content...</p>",
        raw_text: ch.raw_text || "",
        word_count: ch.word_count || 0,
        created_at: now,
        updated_at: now,
      }));
    }

    saveDatabase(data);
    return newBook;
  },

  deleteBook: (id: string): boolean => {
    const data = loadDatabase();
    data.books = data.books.filter((b) => b.id !== id);
    delete data.chapters[id];
    saveDatabase(data);
    return true;
  },

  // Daily Thoughts
  getDailyThoughts: (filters?: {
    isPublished?: boolean;
    date?: string;
    limit?: number;
  }): DailyThought[] => {
    const data = loadDatabase();
    let thoughts = [...data.thoughts];

    if (filters?.isPublished !== undefined) {
      thoughts = thoughts.filter((t) => t.is_published === filters.isPublished);
    }
    if (filters?.date) {
      thoughts = thoughts.filter((t) => t.date === filters.date);
    }

    thoughts.sort((a, b) => (a.date < b.date ? 1 : -1));

    if (filters?.limit) {
      thoughts = thoughts.slice(0, filters.limit);
    }

    return thoughts;
  },

  getTodayThought: (targetDate?: string): DailyThought => {
    const data = loadDatabase();
    const dateStr = targetDate || new Date().toISOString().split("T")[0];

    // Find thought matching today's date
    const todayThought = data.thoughts.find(
      (t) => t.date === dateStr && t.is_published
    );
    if (todayThought) return todayThought;

    // Fallback to featured thought or latest published thought
    const featured = data.thoughts.find((t) => t.is_featured && t.is_published);
    if (featured) return featured;

    return data.thoughts[0] || initialThoughts[0];
  },

  saveThought: (thoughtData: Partial<DailyThought>): DailyThought => {
    const data = loadDatabase();
    const now = new Date().toISOString();
    const id = thoughtData.id || `th-${Date.now()}`;
    const existingIndex = data.thoughts.findIndex((t) => t.id === id);

    // If marked featured, remove featured from others on same date
    if (thoughtData.is_featured) {
      data.thoughts = data.thoughts.map((t) =>
        t.date === thoughtData.date ? { ...t, is_featured: false } : t
      );
    }

    const newThought: DailyThought = {
      id,
      quote: thoughtData.quote || "",
      author: thoughtData.author || "Unknown",
      date: thoughtData.date || new Date().toISOString().split("T")[0],
      category: thoughtData.category || "Wisdom",
      handwritten_note: thoughtData.handwritten_note || "",
      background_image: thoughtData.background_image || "",
      is_featured: Boolean(thoughtData.is_featured),
      is_published:
        thoughtData.is_published !== undefined ? thoughtData.is_published : true,
      share_count: thoughtData.share_count || 0,
      copy_count: thoughtData.copy_count || 0,
      created_at: existingIndex >= 0 ? data.thoughts[existingIndex].created_at : now,
      updated_at: now,
    };

    if (existingIndex >= 0) {
      data.thoughts[existingIndex] = newThought;
    } else {
      data.thoughts.unshift(newThought);
    }

    saveDatabase(data);
    return newThought;
  },

  deleteThought: (id: string): boolean => {
    const data = loadDatabase();
    data.thoughts = data.thoughts.filter((t) => t.id !== id);
    saveDatabase(data);
    return true;
  },

  incrementThoughtStat: (id: string, type: "share" | "copy") => {
    const data = loadDatabase();
    const thought = data.thoughts.find((t) => t.id === id);
    if (thought) {
      if (type === "share") thought.share_count = (thought.share_count || 0) + 1;
      if (type === "copy") thought.copy_count = (thought.copy_count || 0) + 1;
      saveDatabase(data);
    }
  },

  // Stories
  getStories: (filters?: {
    categorySlug?: string;
    status?: string;
    featured?: boolean;
  }): Story[] => {
    const data = loadDatabase();
    let stories = data.stories.map((s) => ({
      ...s,
      category: data.categories.find((c) => c.id === s.category_id),
    }));

    if (filters?.status) {
      stories = stories.filter((s) => s.status === filters.status);
    }
    if (filters?.featured !== undefined) {
      stories = stories.filter((s) => s.is_featured === filters.featured);
    }
    if (filters?.categorySlug) {
      stories = stories.filter(
        (s) => s.category?.slug.toLowerCase() === filters.categorySlug?.toLowerCase()
      );
    }

    return stories;
  },

  getStoryBySlug: (slug: string): Story | null => {
    const data = loadDatabase();
    const story = data.stories.find((s) => s.slug === slug || s.id === slug);
    if (!story) return null;
    return {
      ...story,
      category: data.categories.find((c) => c.id === story.category_id),
    };
  },

  saveStory: (storyData: Partial<Story>): Story => {
    const data = loadDatabase();
    const now = new Date().toISOString();
    const id = storyData.id || `story-${Date.now()}`;
    const slug =
      storyData.slug ||
      (storyData.title || "untitled")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const existingIndex = data.stories.findIndex((s) => s.id === id);

    const newStory: Story = {
      id,
      title: storyData.title || "Untitled Story",
      slug,
      author: storyData.author || "Unknown Author",
      category_id: storyData.category_id || data.categories[0]?.id || "cat-8",
      cover_url:
        storyData.cover_url ||
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
      excerpt: storyData.excerpt || "",
      content_html: storyData.content_html || "<p>Story content...</p>",
      reading_time_minutes: storyData.reading_time_minutes || 5,
      is_featured: Boolean(storyData.is_featured),
      status: storyData.status || "draft",
      published_at: storyData.status === "published" ? now : storyData.published_at,
      view_count: storyData.view_count || 0,
      created_at: existingIndex >= 0 ? data.stories[existingIndex].created_at : now,
      updated_at: now,
    };

    if (existingIndex >= 0) {
      data.stories[existingIndex] = newStory;
    } else {
      data.stories.unshift(newStory);
    }

    saveDatabase(data);
    return newStory;
  },

  deleteStory: (id: string): boolean => {
    const data = loadDatabase();
    data.stories = data.stories.filter((s) => s.id !== id);
    saveDatabase(data);
    return true;
  },

  // Categories
  getCategories: (): Category[] => {
    const data = loadDatabase();
    return data.categories;
  },

  saveCategory: (categoryData: Partial<Category>): Category => {
    const data = loadDatabase();
    const id = categoryData.id || `cat-${Date.now()}`;
    const slug =
      categoryData.slug ||
      (categoryData.name || "category")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
    const existingIndex = data.categories.findIndex((c) => c.id === id);

    const newCategory: Category = {
      id,
      name: categoryData.name || "New Category",
      slug,
      description: categoryData.description || "",
      color: categoryData.color || "#C8A66A",
      icon: categoryData.icon || "BookOpen",
      created_at: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      data.categories[existingIndex] = newCategory;
    } else {
      data.categories.push(newCategory);
    }

    saveDatabase(data);
    return newCategory;
  },

  // Reading Progress & Continue Reading
  getUserReadingProgress: (
    userId: string
  ): (ReadingProgress & { book: Book })[] => {
    const data = loadDatabase();
    const userProgress = data.readingProgress.filter((p) => p.user_id === userId);

    return userProgress
      .map((p) => {
        const book = data.books.find((b) => b.id === p.book_id);
        if (!book) return null;
        return {
          ...p,
          book: {
            ...book,
            category: data.categories.find((c) => c.id === book.category_id),
          },
        };
      })
      .filter(Boolean) as (ReadingProgress & { book: Book })[];
  },

  saveReadingProgress: (
    progress: Omit<ReadingProgress, "id" | "last_read_at">
  ): ReadingProgress => {
    const data = loadDatabase();
    const now = new Date().toISOString();
    const existingIndex = data.readingProgress.findIndex(
      (p) => p.user_id === progress.user_id && p.book_id === progress.book_id
    );

    const record: ReadingProgress = {
      id: existingIndex >= 0 ? data.readingProgress[existingIndex].id : `prog-${Date.now()}`,
      ...progress,
      last_read_at: now,
    };

    if (existingIndex >= 0) {
      data.readingProgress[existingIndex] = record;
    } else {
      data.readingProgress.unshift(record);
    }

    // Also update book read_count
    const book = data.books.find((b) => b.id === progress.book_id);
    if (book) {
      book.read_count = (book.read_count || 0) + 1;
    }

    saveDatabase(data);
    return record;
  },

  // Bookmarks
  getUserBookmarks: (userId: string, bookId?: string): Bookmark[] => {
    const data = loadDatabase();
    let bms = data.bookmarks.filter((b) => b.user_id === userId);
    if (bookId) {
      bms = bms.filter((b) => b.book_id === bookId);
    }
    return bms.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  },

  saveBookmark: (bookmark: Omit<Bookmark, "id" | "created_at">): Bookmark => {
    const data = loadDatabase();
    const newBm: Bookmark = {
      id: `bm-${Date.now()}`,
      ...bookmark,
      created_at: new Date().toISOString(),
    };
    data.bookmarks.unshift(newBm);
    saveDatabase(data);
    return newBm;
  },

  deleteBookmark: (id: string, userId: string): boolean => {
    const data = loadDatabase();
    data.bookmarks = data.bookmarks.filter(
      (b) => b.id !== id || b.user_id !== userId
    );
    saveDatabase(data);
    return true;
  },

  // Favorites
  getUserFavorites: (userId: string): Favorite[] => {
    const data = loadDatabase();
    return data.favorites.filter((f) => f.user_id === userId);
  },

  toggleFavorite: (
    userId: string,
    itemType: "book" | "thought" | "story",
    itemId: string
  ): boolean => {
    const data = loadDatabase();
    const index = data.favorites.findIndex(
      (f) =>
        f.user_id === userId &&
        f.item_type === itemType &&
        f.item_id === itemId
    );

    if (index >= 0) {
      data.favorites.splice(index, 1);
      saveDatabase(data);
      return false; // unfavorited
    } else {
      data.favorites.push({
        id: `fav-${Date.now()}`,
        user_id: userId,
        item_type: itemType,
        item_id: itemId,
        created_at: new Date().toISOString(),
      });
      saveDatabase(data);
      return true; // favorited
    }
  },

  // Dashboard Stats
  getDashboardStats: (): DashboardStats => {
    const data = loadDatabase();
    return {
      totalBooks: data.books.length,
      publishedBooks: data.books.filter((b) => b.status === "published").length,
      draftBooks: data.books.filter((b) => b.status === "draft").length,
      totalThoughts: data.thoughts.length,
      totalStories: data.stories.length,
      registeredUsers: data.profiles.length,
      totalReadingSessions: data.readingSessions.length + 142,
      popularBooks: [...data.books]
        .sort((a, b) => (b.read_count || 0) - (a.read_count || 0))
        .slice(0, 5)
        .map((b) => ({
          id: b.id,
          title: b.title,
          author: b.author,
          cover_url: b.cover_url,
          reads: b.read_count || 0,
        })),
    };
  },

  // User profiles
  getProfile: (emailOrId: string): Profile | null => {
    const data = loadDatabase();
    return (
      data.profiles.find(
        (p) => p.email === emailOrId || p.id === emailOrId
      ) || null
    );
  },

  getAllProfiles: (): Profile[] => {
    const data = loadDatabase();
    return data.profiles;
  },
};
