export type PublicationStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color?: string;
  icon?: string;
  created_at: string;
}

export interface BookChapter {
  id: string;
  book_id: string;
  chapter_number: number;
  title: string;
  slug: string;
  content_html: string;
  raw_text: string;
  word_count: number;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  cover_url: string;
  spine_color?: string;
  accent_color?: string;
  category_id: string;
  category?: Category;
  total_pages: number;
  estimated_reading_time: string;
  status: PublicationStatus;
  published_at?: string;
  scheduled_for?: string;
  featured: boolean;
  view_count?: number;
  read_count?: number;
  created_at: string;
  updated_at: string;
  chapters?: BookChapter[];
}

export interface DailyThought {
  id: string;
  quote: string;
  author: string;
  date: string; // YYYY-MM-DD
  category: string;
  handwritten_note?: string;
  background_image?: string;
  is_featured: boolean;
  is_published: boolean;
  scheduled_for?: string;
  share_count: number;
  copy_count: number;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  title: string;
  slug: string;
  author: string;
  category_id: string;
  category?: Category;
  cover_url: string;
  excerpt: string;
  content_html: string;
  reading_time_minutes: number;
  is_featured: boolean;
  status: PublicationStatus;
  published_at?: string;
  scheduled_for?: string;
  view_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  role: 'admin' | 'reader';
  bio?: string;
  favorite_genre?: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  book_id: string;
  chapter_id?: string;
  page_number: number;
  chapter_title?: string;
  note?: string;
  quote?: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  item_type: 'book' | 'thought' | 'story';
  item_id: string;
  created_at: string;
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  book_id: string;
  current_chapter_id?: string;
  current_page: number;
  total_pages: number;
  percentage: number;
  last_read_at: string;
}

export interface ReadingSession {
  id: string;
  user_id?: string;
  book_id: string;
  started_at: string;
  duration_minutes: number;
  pages_read: number;
}

export interface DashboardStats {
  totalBooks: number;
  publishedBooks: number;
  draftBooks: number;
  totalThoughts: number;
  totalStories: number;
  registeredUsers: number;
  totalReadingSessions: number;
  popularBooks: {
    id: string;
    title: string;
    author: string;
    cover_url: string;
    reads: number;
  }[];
}

export interface ParsedChapter {
  chapter_number: number;
  title: string;
  content_html: string;
  raw_text: string;
  word_count: number;
}

export interface DocxImportResult {
  title: string;
  author: string;
  description: string;
  chapters: ParsedChapter[];
  totalWords: number;
  estimatedReadingTime: string;
}
