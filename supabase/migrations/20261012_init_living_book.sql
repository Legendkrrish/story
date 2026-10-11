-- THE LIVING BOOK: Supabase PostgreSQL Schema & Security Policies
-- Migration: 20261012_init_living_book.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'reader' CHECK (role IN ('admin', 'reader')),
  bio TEXT,
  favorite_genre TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#C8A66A',
  icon TEXT DEFAULT 'BookOpen',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Books Table
CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  author TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  spine_color TEXT DEFAULT '#1A3C34',
  accent_color TEXT DEFAULT '#C8A66A',
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  total_pages INT NOT NULL DEFAULT 1,
  estimated_reading_time TEXT DEFAULT '1 hour',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INT NOT NULL DEFAULT 0,
  read_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Book Chapters Table
CREATE TABLE IF NOT EXISTS book_chapters (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content_html TEXT NOT NULL,
  raw_text TEXT NOT NULL,
  word_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(book_id, chapter_number)
);

-- 5. Daily Thoughts Table
CREATE TABLE IF NOT EXISTS daily_thoughts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL DEFAULT 'Wisdom',
  handwritten_note TEXT,
  background_image TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  scheduled_for TIMESTAMPTZ,
  share_count INT NOT NULL DEFAULT 0,
  copy_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Short Stories Table
CREATE TABLE IF NOT EXISTS stories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  author TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  cover_url TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content_html TEXT NOT NULL,
  reading_time_minutes INT NOT NULL DEFAULT 5,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  view_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_id TEXT REFERENCES book_chapters(id) ON DELETE CASCADE,
  page_number INT NOT NULL DEFAULT 1,
  chapter_title TEXT,
  note TEXT,
  quote TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('book', 'thought', 'story')),
  item_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

-- 9. Reading Progress Table
CREATE TABLE IF NOT EXISTS reading_progress (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  current_chapter_id TEXT REFERENCES book_chapters(id) ON DELETE SET NULL,
  current_page INT NOT NULL DEFAULT 1,
  total_pages INT NOT NULL DEFAULT 1,
  percentage INT NOT NULL DEFAULT 0,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- 10. Reading Sessions Table
CREATE TABLE IF NOT EXISTS reading_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  book_id TEXT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_minutes INT NOT NULL DEFAULT 1,
  pages_read INT NOT NULL DEFAULT 1
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category_id);
CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON book_chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_daily_thoughts_date ON daily_thoughts(date);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_progress_user ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
-- Categories: Anyone can read, only admin can modify
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can modify categories" ON categories FOR ALL USING (is_admin());

-- Books: Public can read published books; Admin can do all
CREATE POLICY "Public can view published books" ON books FOR SELECT USING (status = 'published' OR is_admin());
CREATE POLICY "Admins can modify books" ON books FOR ALL USING (is_admin());

-- Book Chapters: Public can view chapters of published books
CREATE POLICY "Public can view chapters of published books" ON book_chapters FOR SELECT USING (
  EXISTS (SELECT 1 FROM books WHERE books.id = book_chapters.book_id AND (books.status = 'published' OR is_admin()))
);
CREATE POLICY "Admins can modify chapters" ON book_chapters FOR ALL USING (is_admin());

-- Daily Thoughts: Public can view published thoughts
CREATE POLICY "Public can view published thoughts" ON daily_thoughts FOR SELECT USING (is_published = true OR is_admin());
CREATE POLICY "Admins can modify thoughts" ON daily_thoughts FOR ALL USING (is_admin());

-- Stories: Public can view published stories
CREATE POLICY "Public can view published stories" ON stories FOR SELECT USING (status = 'published' OR is_admin());
CREATE POLICY "Admins can modify stories" ON stories FOR ALL USING (is_admin());

-- Bookmarks: Users can read/modify their own
CREATE POLICY "Users can manage own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- Favorites: Users can manage own favorites
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Reading Progress: Users can manage own progress
CREATE POLICY "Users can manage own progress" ON reading_progress FOR ALL USING (auth.uid() = user_id);

-- Reading Sessions: Anyone can log a reading session
CREATE POLICY "Anyone can insert reading sessions" ON reading_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view reading sessions" ON reading_sessions FOR SELECT USING (is_admin());
