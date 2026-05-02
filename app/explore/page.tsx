"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  TrendingUp,
  Users,
  Briefcase,
  X,
  SlidersHorizontal,
  Star,
  MapPin,
  Tag,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { JobCard } from "@/components/JobCard";
import { FreelancerCard } from "@/components/FreelancerCard";
import { CategoryPill } from "@/components/CategoryPill";
import { ExploreFilters, type FilterState } from "@/components/ExploreFilters";
import {
  smartSearch,
  trendingSearches,
  getUniqueLocations,
} from "@/lib/search-engine";
import { jobs, freelancers, categories } from "@/lib/data";

// ---------------------------------------------------------------------------
// Sort options
// ---------------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: "relevance", label: "Paling Relevan" },
  { value: "rating", label: "Rating Tertinggi" },
  { value: "price_asc", label: "Harga Terendah" },
  { value: "price_desc", label: "Harga Tertinggi" },
  { value: "newest", label: "Terbaru" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

// ---------------------------------------------------------------------------
// Tab options
// ---------------------------------------------------------------------------

type TabKey = "all" | "layanan" | "freelancer";

// ---------------------------------------------------------------------------
// Inner component that uses useSearchParams
// ---------------------------------------------------------------------------

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("q") ?? "";
  const hasQuery = query.trim().length > 0;

  // Preserve theme param across navigation
  const theme = searchParams.get("theme");
  const themeParam = theme ? `&theme=${theme}` : "";

  // Local UI state
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>("relevance");
  const [filters, setFilters] = useState<FilterState>({});

  // All locations for filter dropdown
  const allLocations = useMemo(() => getUniqueLocations(), []);

  // --- Search results ---
  const searchResults = useMemo(() => {
    if (!hasQuery) return null;
    return smartSearch(query);
  }, [query, hasQuery]);

  // --- Apply post-filters + sort ---
  const filteredJobs = useMemo(() => {
    if (!searchResults) return [];
    let items = searchResults.jobs.map((r) => r.item);

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      items = items.filter((job) =>
        job.tags.some((t) =>
          filters.categories!.some(
            (c) => c.toLowerCase() === t.toLowerCase()
          )
        )
      );
    }

    // Location filter
    if (filters.locations && filters.locations.length > 0) {
      items = items.filter((job) =>
        filters.locations!.some((loc) =>
          job.location.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    // Price range
    if (filters.priceMin !== undefined) {
      items = items.filter((job) => job.price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      items = items.filter((job) => job.price <= filters.priceMax!);
    }

    // Rating
    if (filters.minRating !== undefined) {
      items = items.filter((job) => job.rating >= filters.minRating!);
    }

    // Sort
    switch (sortKey) {
      case "rating":
        items.sort((a, b) => b.rating - a.rating);
        break;
      case "price_asc":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        items.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        items = items.filter((j) => j.isNew).concat(items.filter((j) => !j.isNew));
        break;
      // relevance: already sorted by Fuse score
    }

    return items;
  }, [searchResults, filters, sortKey]);

  const filteredFreelancers = useMemo(() => {
    if (!searchResults) return [];
    let items = searchResults.freelancers.map((r) => r.item);

    if (filters.minRating !== undefined) {
      items = items.filter((fl) => fl.rating >= filters.minRating!);
    }
    if (filters.locations && filters.locations.length > 0) {
      items = items.filter((fl) =>
        filters.locations!.some((loc) =>
          fl.location.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    switch (sortKey) {
      case "rating":
        items.sort((a, b) => b.rating - a.rating);
        break;
    }

    return items;
  }, [searchResults, filters, sortKey]);

  // --- Active filter count ---
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories?.length) count++;
    if (filters.locations?.length) count++;
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) count++;
    if (filters.minRating !== undefined) count++;
    return count;
  }, [filters]);

  // --- Handle search from compact navbar bar ---
  const handleNavSearch = useCallback(
    (q: string) => {
      if (!q.trim()) return;
      router.push(`/explore?q=${encodeURIComponent(q.trim())}`);
    },
    [router]
  );

  // --- Total result counts ---
  const jobCount = filteredJobs.length;
  const flCount = filteredFreelancers.length;
  const totalCount = jobCount + flCount;

  // Featured data for browse view
  const featuredFreelancers = freelancers.filter((fl) => fl.isFeatured);
  const popularJobs = jobs.slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── Shared Navbar (Phase 14) ─── */}
      <Navbar variant="explore" searchQuery={query} />

      {/* ─── Main Content ─── */}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {hasQuery ? (
          /* ═══════════════════════════════════════════════
             SEARCH RESULTS VIEW
             ═══════════════════════════════════════════════ */
          <div className="space-y-6">
            {/* Results header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gigit-text-secondary">
                <Briefcase className="size-4" />
                <span>
                  Menampilkan{" "}
                  <strong className="text-foreground">{totalCount}</strong>{" "}
                  hasil untuk &quot;{query}&quot;
                </span>
              </div>

              {/* Filter bar + Sort */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <ExploreFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  locations={allLocations}
                  categories={categories}
                />

                {/* Sort select */}
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-select" className="text-xs text-gigit-text-secondary whitespace-nowrap hidden sm:block">
                    Urutkan:
                  </label>
                  <select
                    id="sort-select"
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value as SortKey)}
                    className={cn(
                      "h-9 rounded-lg border border-gigit-ice bg-white px-3 pr-8 text-sm font-medium text-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-gigit-blue/30",
                      "cursor-pointer appearance-none",
                      "bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%235A89C2%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat"
                    )}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active filter chips */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {filters.categories?.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 rounded-full bg-gigit-accent-tint px-3 py-1 text-xs font-medium text-gigit-accent-dark"
                    >
                      <Tag className="size-3" />
                      {cat}
                      <button
                        type="button"
                        onClick={() =>
                          setFilters((f) => ({
                            ...f,
                            categories: f.categories?.filter((c) => c !== cat),
                          }))
                        }
                        className="ml-0.5 cursor-pointer hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                  {filters.locations?.map((loc) => (
                    <span
                      key={loc}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-gigit-blue"
                    >
                      <MapPin className="size-3" />
                      {loc}
                      <button
                        type="button"
                        onClick={() =>
                          setFilters((f) => ({
                            ...f,
                            locations: f.locations?.filter((l) => l !== loc),
                          }))
                        }
                        className="ml-0.5 cursor-pointer hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                  {filters.minRating !== undefined && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                      <Star className="size-3" />
                      ≥ {filters.minRating}
                      <button
                        type="button"
                        onClick={() => setFilters((f) => ({ ...f, minRating: undefined }))}
                        className="ml-0.5 cursor-pointer hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  )}
                  {(filters.priceMin !== undefined || filters.priceMax !== undefined) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gigit-accent-bg px-3 py-1 text-xs font-medium text-gigit-accent-dark border border-gigit-accent/20">
                      Rp {filters.priceMin?.toLocaleString("id-ID") ?? "0"} – {filters.priceMax?.toLocaleString("id-ID") ?? "∞"}
                      <button
                        type="button"
                        onClick={() => setFilters((f) => ({ ...f, priceMin: undefined, priceMax: undefined }))}
                        className="ml-0.5 cursor-pointer hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setFilters({})}
                    className="text-xs font-medium text-gigit-text-secondary hover:text-destructive transition-colors cursor-pointer"
                  >
                    Hapus Semua
                  </button>
                </div>
              )}

              {/* Tabs */}
              <div className="flex items-center gap-1 border-b border-gigit-ice">
                {([
                  { key: "all" as TabKey, label: "Semua", count: totalCount },
                  { key: "layanan" as TabKey, label: "Layanan", count: jobCount },
                  { key: "freelancer" as TabKey, label: "Freelancer", count: flCount },
                ]).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "relative px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer",
                      activeTab === tab.key
                        ? "text-gigit-accent"
                        : "text-gigit-text-secondary hover:text-foreground"
                    )}
                  >
                    {tab.label}
                    <span className={cn(
                      "ml-1.5 text-xs",
                      activeTab === tab.key ? "text-gigit-accent" : "text-gigit-text-secondary/60"
                    )}>
                      {tab.count}
                    </span>
                    {activeTab === tab.key && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gigit-accent rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Results grid */}
            {(activeTab === "all" || activeTab === "layanan") && jobCount > 0 && (
              <section>
                {activeTab === "all" && (
                  <h3 className="text-base font-semibold font-heading text-foreground mb-4">
                    Layanan
                  </h3>
                )}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </section>
            )}

            {(activeTab === "all" || activeTab === "freelancer") && flCount > 0 && (
              <section>
                {activeTab === "all" && (
                  <h3 className="text-base font-semibold font-heading text-foreground mb-4 mt-8">
                    Freelancer
                  </h3>
                )}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredFreelancers.map((fl) => (
                    <FreelancerCard key={fl.id} freelancer={fl} />
                  ))}
                </div>
              </section>
            )}

            {/* No results */}
            {totalCount === 0 && (
              <div className="text-center py-20">
                <Search className="mx-auto size-12 text-gigit-ice mb-4" />
                <p className="text-lg font-medium text-foreground">
                  Tidak ada hasil untuk &quot;{query}&quot;
                </p>
                <p className="mt-2 text-sm text-gigit-text-secondary">
                  Coba kata kunci lain:
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {trendingSearches.slice(0, 4).map((s) => (
                    <Link
                      key={s}
                      href={`/explore?q=${encodeURIComponent(s)}${themeParam}`}
                      className="rounded-full border border-gigit-ice bg-white px-3 py-1.5 text-sm font-medium text-foreground/80 hover:border-gigit-accent-light hover:bg-gigit-accent-tint transition-colors cursor-pointer"
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ═══════════════════════════════════════════════
             BROWSE VIEW (no query)
             ═══════════════════════════════════════════════ */
          <div className="space-y-12">
            {/* Trending searches */}
            <section>
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="size-5 text-gigit-accent" />
                <h2 className="text-lg font-semibold font-heading text-foreground">
                  Trending Sekarang
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {trendingSearches.map((s) => (
                  <Link
                    key={s}
                    href={`/explore?q=${encodeURIComponent(s)}${themeParam}`}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border border-gigit-ice bg-white p-4",
                      "text-sm font-medium text-foreground",
                      "transition-all duration-200 ease-out",
                      "hover:border-gigit-accent-light hover:bg-gigit-accent-tint hover:shadow-sm",
                      "cursor-pointer"
                    )}
                  >
                    <Search className="size-4 text-gigit-text-secondary shrink-0" />
                    <span className="truncate">{s}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Categories */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="size-5 text-gigit-accent" />
                  <h2 className="text-lg font-semibold font-heading text-foreground">
                    Jelajahi Kategori
                  </h2>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {categories.map((cat) => (
                  <CategoryPill
                    key={cat.id}
                    category={cat}
                    isActive={false}
                    onClick={() =>
                      router.push(`/explore?q=${encodeURIComponent(cat.name)}${themeParam}`)
                    }
                  />
                ))}
              </div>
            </section>

            {/* Featured freelancers */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-gigit-accent" />
                  <h2 className="text-lg font-semibold font-heading text-foreground">
                    Freelancer Pilihan
                  </h2>
                </div>
              </div>
              <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-thin -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 snap-x snap-mandatory">
                {featuredFreelancers.map((fl) => (
                  <div key={fl.id} className="min-w-[280px] max-w-[320px] shrink-0 snap-start">
                    <FreelancerCard freelancer={fl} />
                  </div>
                ))}
              </div>
            </section>

            {/* Popular services */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Briefcase className="size-5 text-gigit-accent" />
                  <h2 className="text-lg font-semibold font-heading text-foreground">
                    Layanan Populer
                  </h2>
                </div>
                <Link
                  href="/explore?q="
                  className="inline-flex items-center gap-1 text-sm font-medium text-gigit-blue hover:text-gigit-navy transition-colors cursor-pointer"
                >
                  Lihat Semua
                  <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {popularJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ─── Shared Fat Footer (Phase 13) ─── */}
      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page wrapper with Suspense for useSearchParams
// ---------------------------------------------------------------------------

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-pulse text-gigit-text-secondary">Memuat...</div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
