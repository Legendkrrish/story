# THE LIVING BOOK — An Immersive Digital Library

> *"Every Thought Opens a New World."*

**The Living Book** is a production-ready, full-stack digital storytelling sanctuary where books and daily reflections exist as tactile, physical objects brought to life. Rather than reading flat digital feeds, visitors experience books with authentic 3D hardcover bindings, warm ivory paper (`#F5EBD7`), realistic spine gutter shadows, silk ribbon bookmarks, and interactive physical page turning.

---

## 🌟 Key Features

### 1. The Magical Library Homepage
- **Immersive 3D Hero Book**: Centered hardcover volume that rotates dynamically with cursor 3D perspective and smoothly opens into a physical reading experience on click.
- **Atmospheric Environment**: Deep forest palette (`#10271F`, `#091812`), warm sunlight filtering through branches, and floating dust motes.
- **Daily Thought Section**: Today's curated thought on a textured ivory card with author, date, handwritten accent (Caveat font), copy to clipboard, share, and save to favorites.
- **3D Featured Bookshelf**: Wooden shelves with books displaying realistic spine thickness, perspective shadows, and hover lift effects. Includes genre filtering.
- **Continue Reading Shelf**: Visual progress indicators and 1-click resume reading buttons for in-progress volumes.
- **Story of the Day**: Selected literary fable with large atmospheric illustration.

### 2. The Realistic 3D Book Reader (Core Feature)
- **Book Opening Sequence**: Smooth camera approach and 180° front cover swing around the spine into the reading spread.
- **Authentic Paper Aesthetics**: Warm Ivory paper (`#F5EBD7`), natural paper grain, soft stacked paper edge shadows, and deep center gutter spine shadows simulating real book bindings.
- **Interactive Page Turning**:
  - Double-page spread on desktop (left page even, right page odd) and single-page mobile layout.
  - Click right page / right arrow / spacebar to turn forward with realistic curl and traveling shadow.
  - Click left page / left arrow to turn backward.
  - Page jump slider and progress percentage.
- **Minimal Floating Reading Toolbar**:
  - Table of Contents drawer with chapter links and word counts.
  - Silk Ribbon Bookmark with drop-down animation.
  - Font Size Controls (Small, Medium, Large, Extra Large).
  - Atmosphere Themes: Warm Ivory Paper, Sepia Candlelight, Midnight Forest.
  - Fullscreen mode & page-turn sound toggle.
  - Automatic progress saving to local storage and database.

### 3. Microsoft Word (.docx) to Book Conversion
- **Automatic Document Ingestion**: Admin can upload normal `.docx`, `.txt`, or `.md` files without manual HTML formatting.
- **Intelligent Chapter Parsing**: Detects Heading 1/2/3 styles (or chapter headers) and divides the manuscript into structured, numbered chapters.
- **Typography Preservation**: Preserves boldface, italics, blockquotes, lists, and paragraph spacing with strict HTML sanitization.
- **Live Preview Editor**: Allows administrators to review, modify chapter titles, adjust content, and inspect the real paper preview before publishing.
- **Automatic Pagination**: Splits chapters into readable pages without cutting words or sentences.
- **Preloaded Sample**: Built-in 1-click sample DOCX test (`the-forgotten-sanctuary.docx`) for instant testing.

### 4. Daily Thoughts Management
- Admin CRUD with date scheduling and timezone support.
- Single primary featured thought per date with archive access.
- Social sharing and clipboard copying analytics.

### 5. Secure Admin Dashboard (`/admin`)
- Role-based server-side session authentication.
- Real-time statistics: Total Books, Published vs Drafts, Thoughts, Stories, Registered Readers, and Interactive 3D Reading Sessions.
- Full Book Management (publish, draft, edit, delete).
- Story Management for standalone short fables.
- Curated Media Library for book covers and illustrations.
- Registered Seekers (user) directory.

### 6. User Accounts & Personal Shelf (`/profile`)
- User registration and login.
- Personal shelf displaying in-progress books with progress bars.
- Silk ribbon bookmarks with direct page jump links.
- Public visitors can read seamlessly without an account.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, TypeScript)
- **Styling**: Tailwind CSS v4, custom 3D CSS perspective transforms, and paper textures
- **Document Processing**: `mammoth` (Word .docx parsing) & `sanitize-html`
- **Icons**: `lucide-react`
- **Database Architecture**:
  - Unified persistent storage layer in `src/data/living_book_db.json` for zero-configuration, instant local development and testing.
  - Full production Supabase PostgreSQL migration schema (`supabase/migrations/20261012_init_living_book.sql`) with Row Level Security (RLS) policies.
  - Official `@supabase/supabase-js` client and server adapters.

---

## 🚀 Getting Started

### 1. Installation & Local Setup

```bash
# Clone or navigate to the project directory
cd "d:/STORY BOOKS WEB"

# Install dependencies (already completed)
npm install

# Build the project
npm run build

# Start the application
npm start
# (or: npx next start -p 3001)
```

The site will be available at:
`http://localhost:3000` (or `http://localhost:3001`)

### 2. Default Login Credentials

#### Administrator (Archivist Portal)
- **URL**: `http://localhost:3001/login` (or `/admin`)
- **Email**: `admin@thelivingbook.com`
- **Password**: `admin123`
*(There is also a convenient "Admin Login" button on the login screen to fill these automatically).*

#### Reader Account (Personal Library)
- **Email**: `reader@thelivingbook.com`
- **Password**: `reader123`
*(Or create a new account on the `/register` page).*

---

## 📁 Project Structure

```
d:/STORY BOOKS WEB/
├── public/
│   └── sample-documents/
│       ├── the-forgotten-sanctuary.docx   # Test Word document for admin import
│       └── the-golden-astrolabe.md       # Test Markdown document
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Cinematic Magical Library Homepage
│   │   ├── layout.tsx                   # Editorial typography & base styling
│   │   ├── globals.css                  # 3D perspective, paper textures, spine shadows
│   │   ├── books/
│   │   │   ├── page.tsx                 # Library catalogue with category filters
│   │   │   └── [slug]/page.tsx          # Book showcase & 3D cover inspection
│   │   ├── read/[slug]/page.tsx         # Fullscreen 3D Book Reading Interface
│   │   ├── thoughts/page.tsx            # Daily Thoughts Archive
│   │   ├── stories/                     # Short stories collection & reader
│   │   ├── categories/[slug]/page.tsx   # Category corridor showcase
│   │   ├── login/page.tsx               # Sign in with demo credential pills
│   │   ├── register/page.tsx            # Seeker account registration
│   │   ├── profile/page.tsx             # Personal shelf & saved bookmarks
│   │   ├── admin/
│   │   │   ├── page.tsx                 # Admin Overview & real-time metrics
│   │   │   ├── books/page.tsx           # Book catalogue management
│   │   │   ├── books/new/page.tsx       # Word DOCX Import & Preview Editor
│   │   │   ├── thoughts/page.tsx        # Daily thoughts CRUD & scheduler
│   │   │   ├── stories/page.tsx         # Story editor & featured status
│   │   │   ├── media/page.tsx           # Curated book cover assets
│   │   │   └── users/page.tsx           # Reader directory & activity
│   │   ├── sitemap.ts                   # Dynamic SEO sitemap
│   │   ├── robots.ts                    # SEO robots.txt
│   │   └── api/                         # Backend API routes for books, thoughts, docx, auth
│   ├── components/
│   │   ├── layout/                      # Navbar & Footer
│   │   ├── home/                        # HeroSection, Bookshelf, DailyThought, StoryOfDay
│   │   └── reader/
│   │       └── BookReader.tsx           # 3D Double-Page physical book reader
│   ├── lib/
│   │   ├── db/                          # Persistent storage repository & seed data
│   │   ├── docx/                        # Mammoth Word parser & chapter splitter
│   │   ├── auth/                        # Session management & role verification
│   │   └── supabase/                    # Supabase browser & server clients
│   └── types/
│       └── database.ts                  # TypeScript interfaces for all entities
└── supabase/
    └── migrations/
        └── 20261012_init_living_book.sql # Supabase PostgreSQL schema with RLS
```

---

## 🗄️ Supabase Deployment (Optional)

To connect this application to a remote cloud Supabase project:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the SQL Editor in Supabase and paste the contents of `supabase/migrations/20261012_init_living_book.sql`. Run the migration.
3. Update `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
4. Deploy to Vercel:
   ```bash
   npx vercel
   ```

---

## ✨ Design Philosophy

- **Deep Forest Green** (`#10271F`) & **Midnight Green** (`#091812`) evoke the serenity of an ancient library under starlight.
- **Warm Ivory Paper** (`#F5EBD7`) and **Antique Gold** (`#C8A66A`) replicate centuries-old vellum.
- **Physical Depth**: Inner spine gutter gradients replicate the natural curvature of paper bound into leather bindings.
