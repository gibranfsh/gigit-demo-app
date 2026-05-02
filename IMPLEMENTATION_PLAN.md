# Gigit Frontend Demo: Complete Implementation Plan

This document expands on Section 5 of the PRD to provide a step-by-step technical roadmap for building the Gigit frontend demo.

## Target Folder Structure
Once the project is initialized and components are built, the Next.js App Router structure will look like this:

```text
Gigit-Demo-App/
├── app/
│   ├── globals.css          # Global styles & Theme CSS Variables
│   ├── layout.tsx           # Root layout (includes ThemeWrapper)
│   ├── page.tsx             # Landing / Home page (hero + quick explore)
│   └── explore/
│       └── page.tsx         # Dedicated Explore / Search Results page
├── components/
│   ├── ui/                  # Shadcn primitives (button, input, card, etc.)
│   ├── ThemeWrapper.tsx     # Client component to handle ?theme= url parameter
│   ├── SearchBar.tsx        # Search input with autocomplete dropdown
│   ├── SearchDropdown.tsx   # Autocomplete overlay (recent, trending, suggestions)
│   ├── ExploreFilters.tsx   # Sidebar filter panel (category, price, location, rating)
│   ├── SortDropdown.tsx     # Sort selector (relevance, price, rating, newest)
│   ├── ResultsTabs.tsx      # Tabs: Semua | Layanan | Freelancer
│   ├── JobCard.tsx          # Card for service listings
│   ├── FreelancerCard.tsx   # Card for freelancer profiles
│   └── CategoryPill.tsx     # Pill/chip for categories
├── lib/
│   ├── data.ts              # Dummy data, TypeScript interfaces & search/filter helpers
│   ├── search-engine.ts     # Fuse.js smart search, query parser, synonym map, localStorage helpers
│   └── utils.ts             # Tailwind class merger (from Shadcn)
├── public/                  # Static assets (if any)
├── tailwind.config.ts       # Tailwind theme mappings
└── package.json
```

## Phase 1: Project Initialization & Setup ✅
**Goal:** Establish the foundation of the Next.js application.
- [x] Initialize Next.js (App Router) with TypeScript, Tailwind CSS, and ESLint.
  - Used: `npx create-next-app@latest --typescript --tailwind --eslint --app --yes --disable-git`
  - Next.js 16.2.4 / React 19.2.4 / Tailwind v4
- [x] Initialize `shadcn-ui` for high-quality accessible UI components.
  - Used: `npx shadcn@latest init --yes --defaults --force`
  - Installed components: `button`, `input`, `badge`, `card`, `avatar`
- [x] Install utility libraries (`lucide-react` included via Shadcn).
- [x] Clean up default Next.js boilerplate from `app/page.tsx` and `app/globals.css`.
- [x] Configure `next.config.ts` to whitelist external image domains (pravatar, randomuser, picsum, unsplash).

## Phase 2: Design System & URL-Differentiated Theming ✅
**Goal:** Implement the dual color palettes (Version A and Version B) with a seamless URL-based switching mechanism.
- [x] **CSS Variables:** Defined semantic color variables in `app/globals.css`.
  - `:root` = Version A (Earthy & Grounded: Navy #0D3B7A, Blue #1B5FC0, Olive #7B9E3A).
  - `.theme-b` class = Version B (Bold & Electric: Midnight #07254F, Blue #1B5FC0, Hot Pink #FF3E8A).
  - Added custom `--gigit-*` tokens for brand-specific colors beyond Shadcn semantics.
- [x] **Tailwind Configuration:** Mapped Gigit colors via Tailwind v4's `@theme inline` block.
- [x] **Theme Wrapper Component:** Created `components/ThemeWrapper.tsx` that reads `?theme=b` via `useSearchParams()`.
  - If `theme=b` → applies `.theme-b` class to `<html>`.
  - If absent or `theme=a` → uses default `:root` (Version A).
- [x] **Typography:** Configured Google Fonts via `next/font/google` with `display: "swap"`.
  - **Poppins** (weights 400, 500, 600, 700) — used for headings, logo, and brand elements (`--font-heading`).
  - **Inter** — used for body text, descriptions, and UI labels (`--font-sans`).
  - Both loaded via CSS variables (`--font-poppins`, `--font-inter`) mapped in the `@theme inline` block.

## Phase 3: Mock Data Generation ✅
**Goal:** Create rich, realistic dummy data using the recommended free stock photo sources.
- [x] Created `lib/data.ts` file.
- [x] **Defined TypeScript Interfaces:**
  - `Job` (id, title, description, price, priceLabel, location, duration, coverImageUrl, tags, providerName, providerAvatarUrl, rating, reviewCount, isNew?, isTopMatch?)
  - `Freelancer` (id, name, role, avatarUrl, rating, reviewCount, location, hourlyRate, tags, isFeatured?)
  - `Category` (id, name, icon, jobCount)
- [x] **Populated Dummy Data Arrays:**
  - 10 categories (Olahraga, Fotografi, Pendidikan, Kecantikan, Desain, Teknologi, Musik, Kesehatan, Kuliner, Otomotif)
  - 12 jobs (6 covering PRD queries + 6 extras for rich Explore page)
  - 10 freelancers (linked to their respective services, 5 marked as featured)
  - Avatars via `i.pravatar.cc`, cover images via `picsum.photos`
  - All 6 PRD example queries covered with matching data
- [x] **Search Helper:** Created `searchData()` function for simple keyword-based filtering across jobs & freelancers.

## Phase 4: Core Component Development ✅
**Goal:** Build out the individual, reusable UI blocks.
- [x] **Install Shadcn Primitives:** Install required components via CLI (`button`, `input`, `badge`, `card`, `avatar`).
- [x] **Build `SearchBar.tsx`:** A prominent, clean text input with a search icon and natural language placeholder.
- [x] **Build `JobCard.tsx`:** A visually appealing card showing the job cover image, title, price, location, and a "New" or "Hot" badge. Include subtle hover animations.
- [x] **Build `FreelancerCard.tsx`:** A profile card with an avatar, name, role, and star rating.
- [x] **Build `CategoryPill.tsx`:** Interactive chips for browsing categories.

## Phase 5: Page Assembly ✅
**Goal:** Construct the main application layout (`app/page.tsx`).
- [x] **Header / Navigation:** Build a simple, sticky top nav with the "GIGIT" logo and a mock user profile avatar.
- [x] **Hero Section:** Create an engaging hero area featuring the Search Bar and a dynamic, themed background pattern.
- [x] **Explore View Layout:** Implement a grid/feed style layout combining:
  - "Recommended Jobs" (horizontal scroll or vertical list).
  - "Trending Categories" (wrapping pill list).
  - "Featured Freelancers" (grid/horizontal scroll).

## Phase 6: Smart Search Logic Implementation ✅
**Goal:** Bring the search bar to life using client-side filtering of the dummy data.
- [x] Wrap the `page.tsx` or a sub-component in a Client Component to handle state (`useState`).
- [x] Create a `searchQuery` state bound to the `SearchBar` input.
- [x] **Filtering Logic:** Write a function that filters the `Jobs` and `Freelancers` arrays based on keywords in the `searchQuery` matching their title, role, or location.
- [x] **Dynamic View Swapping:**
  - If `searchQuery` is empty -> Show **Explore View**.
  - If `searchQuery` has text -> Show **Search Results View** (a clean grid of the filtered job/freelancer cards).

## Phase 7: Polish & Micro-Animations ✅
**Goal:** Deliver the "WOW" factor required for the client presentation.
- [x] **Hover Effects:** Add smooth scaling (`hover:scale-[1.02]`) and shadow transitions to all cards.
- [x] **Responsive QA:** Test layout on mobile widths to ensure padding, font sizes, and touch targets (buttons/cards) feel like a native app experience.
- [x] **Theme QA:** Thoroughly test the `?theme=b` toggle to ensure no hardcoded colors break the illusion of the dynamic color palettes.

---

## Phase 8: Smart Search Engine (Fuse.js + Query Parser) ✅
**Goal:** Replace the naive `string.includes()` search with a production-grade fuzzy search that handles natural language queries like "coach padel bsd 1 juta".

**Architecture:** Two-layer search — Query Parser (extracts intent) + Fuse.js (fuzzy matching).

- [x] **Install Fuse.js:** `npm install fuse.js` (~15KB, lightweight client-side fuzzy search).
- [x] **Build `lib/search-engine.ts`:** Central search module containing:
  - **`parseQuery(raw: string)`** — Extracts structured intent from natural language:
    - Price extraction: `500k` → 500K, `1 juta`/`1jt` → 1M, `150rb` → 150K.
    - Location detection: match against known locations (BSD, Jakarta, Bali, Bandung, etc.).
    - Remaining tokens → keywords for fuzzy search.
    - Returns `{ keywords: string[], location?: string, price?: { max: number } }`.
  - **`synonymMap`** — Expands keywords for broader matching:
    - `foto` → `[fotografi, photographer, photography]`
    - `tutor` → `[guru, les, pengajar]`
    - `barber` → `[potong rambut, cukur]`
    - `trainer` → `[pelatih, coach]`
  - **Fuse.js instance** — Configured with weighted keys:
    - `title` (weight: 3), `tags` (weight: 2), `description` (weight: 1), `providerName` (weight: 1).
    - `threshold: 0.4`, `includeScore: true`, `useExtendedSearch: true`.
  - **`smartSearch(query: string)`** — Full pipeline: parse → expand synonyms → Fuse.js search → post-filter by location/price → return scored results.
  - **`getSuggestions(query: string)`** — Lightweight version for autocomplete: returns `{ jobs: Job[], freelancers: Freelancer[], categories: Category[] }` (max 3+3+2 items).
- [x] **Add `trendingSearches: string[]`** — Static array in `lib/search-engine.ts`.
- [x] **Add synonym map** — In `lib/search-engine.ts`.
- [x] **Test queries:** Verify all 6 PRD example queries return correct top results (50/50 tests passing):
  - "coach padel 500k 1 jam BSD" → Coach Padel Privat ✅
  - "personal trainer 300k jakarta selatan" → Personal Trainer ✅
  - "private yoga class 1 juta bali" → Private Yoga Class ✅
  - "photographer prewedding 5 juta bandung" → Photographer Prewedding ✅
  - "math tutor SMA 150k per session" → Math Tutor SMA ✅
  - "barber home service 100k jakarta" → Barber Home Service ✅

## Phase 9: Search Autocomplete Experience ✅
**Goal:** Transform the SearchBar into a Tokopedia/Google-style autocomplete with a text-only dropdown overlay.

**UX:** Text-only suggestions, segmented by type, bold match highlighting, keyboard navigation.

- [x] **Build `SearchDropdown.tsx`:** A dropdown overlay rendered below the SearchBar.
  - **On focus (empty input):** Show two sections:
    - "Pencarian Terakhir" — Recent searches from `localStorage` (max 5, with Lucide `Clock` icon).
    - "Trending" — From `trendingSearches[]` (with Lucide `TrendingUp` icon).
  - **On typing (debounced 200ms):** Show segmented live suggestions via `getSuggestions()`:
    - **Layanan** — Job title + location (max 3, with Lucide `Search` icon).
    - **Freelancer** — Name + role (max 3, with Lucide `User` icon).
    - **Kategori** — Name + job count (max 2, with Lucide `Folder` icon).
  - **Bold match highlighting** — Bold the typed portion in each suggestion.
  - **Keyboard navigation** — Arrow keys to move, Enter to select, Escape to close.
  - **Click outside to dismiss** — `useRef` + `useEffect` click-outside listener.
  - **Z-index: z-40** (below navbar z-50, above page content).
- [x] **Enhance `SearchBar.tsx`:**
  - Integrate `SearchDropdown` as child component.
  - On suggestion click → `router.push('/explore?q={suggestion}')`.
  - On Enter / "Cari" click → `router.push('/explore?q={query}')`.
  - On submit → save to `localStorage` recent searches.
  - **Homepage version:** Full autocomplete enabled (`enableAutocomplete={true}`).
  - **Explore page navbar version:** Simple input, no autocomplete dropdown (`enableAutocomplete={false}`).
- [x] **`localStorage` helpers in `lib/search-engine.ts`:**
  - `getRecentSearches(): string[]` — Read from `localStorage`.
  - `addRecentSearch(query: string)` — Prepend to list, dedupe, cap at 5.
  - `clearRecentSearches()` — Clear all.
- [x] **Updated `app/page.tsx`:** Removed inline search results view — homepage is now a pure landing page. SearchBar navigates to `/explore` on submit.


## Phase 10: Dedicated Explore Page ✅
**Goal:** Build `/explore` — a dual-purpose page that serves as both a search results view AND a distinct browse experience.

**URL Structure:** `/explore?q={query}`

### A. Search Results View (when `?q=` is present)
- [x] **Create `app/explore/page.tsx`:** Client Component reading URL search params (wrapped in `Suspense`).
- [x] **Results Header Bar:**
  - Query echo: "Menampilkan X hasil untuk 'yoga'".
  - Active filter chips (removable, click x to clear).
- [x] **Tabs:** "Semua" | "Layanan" | "Freelancer" with accent color underline.
- [x] **Sort dropdown:** Native `<select>` with custom chevron — Paling Relevan, Rating Tertinggi, Harga Terendah/Tertinggi, Terbaru.
- [x] **Build `ExploreFilters.tsx`:** Airbnb-style **inline Popover popovers** using Shadcn/Base UI:
  - `[Kategori ▾]` — Checkbox list popover with job counts.
  - `[Harga ▾]` — Min/Max input popover with "Terapkan" button.
  - `[Lokasi ▾]` — Checkbox list popover (from `getUniqueLocations()`).
  - `[Rating ▾]` — Star selector popover (≥ 4.5, 4.0, 3.5, 3.0).
  - Active filter count badges on triggers, active state highlighting.
  - "Hapus Semua" button clears all filter params.
- [x] **Results Grid:** 3-column desktop, 2-column tablet, 1-column mobile.
- [x] **No Results State:** Search icon + suggestion links.

### B. Distinct Browse View (when NO `?q=`)
- [x] **"Trending Sekarang"** — 4-column grid of clickable trending search cards.
- [x] **"Jelajahi Kategori"** — CategoryPill grid (click → `/explore?q={name}`).
- [x] **"Freelancer Pilihan"** — Horizontal scrollable carousel with snap scrolling.
- [x] **"Layanan Populer"** — Full grid of JobCards.

### C. Shared Navbar on Explore Page
- [x] Sticky navbar with compact SearchBar (no autocomplete, submit-only).
- [x] Navbar compact style via className overrides for smaller height.

## Phase 11: Final Integration QA ✅
**Goal:** Ensure the complete search → explore flow is seamless and presentation-ready.

- [x] **End-to-end flow:** Homepage → type query → see autocomplete → click suggestion → `/explore?q=...` → filtered results with correct ranking.
- [x] **Smart search validation:** All 6 PRD example queries return correct top match (50/50 unit tests passing).
- [x] **Fuzzy tolerance:** Typos like "padell", "yoaga", "fotografer" still return relevant results (tested in search-engine.test.ts).
- [x] **Filter flow:** Apply category + price + location filters → results update → removable chips → "Hapus Semua" clears all.
- [x] **Theme persistence:** `?theme=b` preserved across SearchBar navigation, explore page logo link, trending links, category clicks, and no-results suggestions.
- [x] **Mobile QA:** Grid is responsive (3→2→1 columns), touch targets are proper button elements with cursor-pointer.
- [x] **Keyboard a11y:** SearchDropdown supports Arrow keys, Enter to select, Escape to close; ARIA combobox/listbox roles applied.
- [x] **Edge cases:** Empty submit blocked (`if (!q) return`), special characters handled (`encodeURIComponent`), no results shows suggestions.
- [x] **Performance:** Fuse.js indexes are lazy-init singletons (memoized), Next.js Image uses native lazy-loading, autocomplete debounced at 200ms.
- [x] **Test suite:** All 55 tests passing (50 search engine + 5 component tests). Fixed JobCard "Baru" assertion and SearchBar useRouter mock.
## Phase 12: Color Palette & Shape Alignment (Client Reference Compliance) ✅
**Goal:** Strictly align the UI's color application and border-radius shapes with the client's provided `gigit_two_palette_versions.html` design reference.

- [x] **CSS Theme Additions:** Added `--gigit-navy-muted`, `--gigit-blue-muted`, and `--gigit-accent-muted` to `globals.css` for both Version A and B. Added `.avatar-square` utility class.
- [x] **Nav, Footer, Logo (Deep Navy / Midnight):**
  - Changed Navbar background to `bg-gigit-navy` on both `page.tsx` and `explore/page.tsx`. Links use `text-gigit-navy-muted`.
  - Changed Footer background to `bg-gigit-navy`. Footer text uses muted colors.
  - Logo text is now white (`text-white`) with the "IT" accent colored (`text-gigit-accent`).
- [x] **Hero Section (Navy + SVG):**
  - Constrained Hero to a card-like layout with `rounded-2xl` (`16px`) instead of full-width.
  - Applied `bg-gigit-navy` instead of the off-white gradient.
  - Implemented geometric SVG background matching the client's `.hero-geo` pattern.
- [x] **Primary Actions & CTAs (Brand Blue & Accent):**
  - Main app buttons ("Daftar Jadi Mitra") use `bg-gigit-blue` with `hover:bg-gigit-accent`.
  - Hero CTA ("Cari") uses `bg-gigit-blue` matching the client reference.
- [x] **Cards, Modals, & Banners:**
  - Card containers remain `bg-white`.
  - Avatars in JobCard and FreelancerCard are now `rounded-lg` (8px) via `.avatar-square` CSS override.
  - Tags use `gigit-accent-tint` bg with `gigit-accent-dark` text.
- [x] **Tags, Active States, & Chips:**
  - `CategoryPill` active state uses `bg-gigit-accent`, hover uses `gigit-accent-light` border and `gigit-accent-tint` bg.
  - Job/freelancer tags use `gigit-accent-tint` + `gigit-accent-dark` consistently.
- [x] **Page Background & Inputs:**
  - Page background uses `gigit-off-white` (`#F5F8FE`).
  - Form inputs use white bg with `gigit-ice` borders.

## Phase 13: "Fat Footer" Multi-Column Redesign ✅
**Goal:** Upgrade the minimalistic footer to a high-trust, multi-column "Fat Footer" as analyzed by `@ui-ux-pro-max` and requested by the client.
- [x] **Structure & Grid:** Implemented a responsive 6-column grid (`components/Footer.tsx`). Left 2 cols for branding/metrics, right 4 cols for link lists (Kategori, Perusahaan, Dukungan, Legal).
- [x] **Branding Column:** Added company logo, descriptive paragraph, and trust metrics ("10K+ Freelancer", "50K+ Layanan Selesai", "4.8 Rating Rata-rata").
- [x] **Links & Styling:** All links use `text-gigit-navy-muted` with `hover:text-white` and `transition-colors duration-200`.
- [x] **Bottom Bar:** Added copyright text with `border-t border-white/10` separator. SVG social media icons (LinkedIn, Twitter/X, Facebook, Instagram) with hover-to-white transition.
- [x] **Shared Component:** Extracted to `components/Footer.tsx` — used in both `app/page.tsx` and `app/explore/page.tsx`.

## Phase 14: Header / Navbar Enhancements ✅
**Goal:** Transform the simple sticky header into a fully-featured marketplace navigation hub.
- [x] **Navigation Links:** Added "Jelajahi", "Kategori", "Cara Kerja" links visible on desktop with rounded-lg hover backgrounds (`hover:bg-white/5`).
- [x] **Authentication State UI:** Guest state shows "Masuk" text link + "Daftar Jadi Mitra" CTA. Logged-in state (toggle via `MOCK_LOGGED_IN`) shows notification bell with red dot + user avatar dropdown (Profile, Settings, Logout).
- [x] **Interaction & Scroll:** Scroll-activated shadow (`shadow-lg shadow-gigit-navy/30`) via `useEffect` scroll listener.
- [x] **Mobile Menu:** Full hamburger menu with animated slide-in for nav links, theme switcher, and auth buttons.
- [x] **Theme Switcher:** Compact "A" / "B" pill buttons with active state highlight (`bg-white/10 text-white`).
- [x] **Shared Component:** Extracted to `components/Navbar.tsx` with `variant` prop ("homepage" | "explore"). Homepage shows full hero; explore shows compact embedded SearchBar.
- [x] **Shared Usage:** Both `app/page.tsx` and `app/explore/page.tsx` now use `<Navbar>` and `<Footer>`, eliminating code duplication.

## Phase 15: Homepage Auto-Carousel ✅
**Goal:** Implement a dynamic, auto-sliding carousel in the Hero or Featured section to showcase top services immediately, increasing conversion focus.
- [x] **Component Setup:** Integrated Shadcn UI's Carousel component (`npx shadcn@latest add carousel`) and the `embla-carousel-autoplay` plugin.
- [x] **Dummy Data & Imagery:** Curated 4 high-quality Unsplash stock photos representing top categories (Fotografi Pernikahan Premium, Pelatih Padel, Desain UI/UX Modern, Personal Trainer).
- [x] **UX Behaviors:** Configured carousel to auto-play every 5 seconds with `stopOnInteraction: true`. Pause on hover implemented via `onMouseEnter`/`onMouseLeave`. Added manual left/right navigation arrows and interactive dot indicators syncing with Embla's `scrollSnapList`.
- [x] **Styling:** Applied `cursor-pointer`, a `bg-gradient-to-t from-black/80` overlay for text readability, bold white typography, and hover scale effect (`group-hover:scale-105`) on the background images.
- [x] **Integration:** Inserted `<HeroCarousel />` prominently below the main search hero section on the homepage (`app/page.tsx`).

## Phase 16: Dedicated Detail Pages (Routing) ✅
**Goal:** Create dynamic detail routes for Jobs and Freelancers so users can click through cards.
- [x] **Job Detail (`/job/[id]`):** Created a robust page layout (`app/job/[id]/page.tsx`) with a large cover image, comprehensive description block with inclusions, a provider mini-profile section, and a sticky "Pesan Layanan" CTA sidebar.
- [x] **Freelancer Detail (`/freelancer/[id]`):** Created a profile page (`app/freelancer/[id]/page.tsx`) with an overlapping square avatar, bio section, skill tags, stats grid, and a nested grid of services (JobCards) offered by the freelancer.
- [x] **Routing Logic:** Updated `JobCard` and `FreelancerCard` components by wrapping their contents in a `<Link>` component to enable smooth client-side navigation to these dynamic routes.

## Phase 17: Dedicated Auth Pages ✅
**Goal:** Implement high-fidelity Login and Register pages.
- [x] **Layout:** Built a modern split-screen layout. Left side: Marketing imagery (stock photo) with value prop overlay. Right side: Auth form card.
- [x] **Login Page (`/login`):** Implemented Email/Password inputs, "Lupa Password" link, Social Login mock buttons (Google, Apple/GitHub).
- [x] **Register Page (`/register`):** Implemented Name, Email, Password inputs, "Daftar sebagai Freelancer/Klien" toggle, "Sudah punya akun? Masuk" link.
- [x] **Form UX:** Added clear placeholders, password visibility toggles, and submit button loading states with `Suspense` boundary for Next.js params.
