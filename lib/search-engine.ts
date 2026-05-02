// =============================================================================
// Gigit Demo — Smart Search Engine
// Two-layer architecture: Query Parser + Fuse.js Fuzzy Search
// =============================================================================

import Fuse, { type IFuseOptions } from "fuse.js";
import { jobs, freelancers, categories, type Job, type Freelancer, type Category } from "./data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ParsedQuery {
  keywords: string[];
  location?: string;
  price?: { max: number };
  raw: string;
}

export interface SearchResults {
  jobs: ScoredResult<Job>[];
  freelancers: ScoredResult<Freelancer>[];
}

export interface ScoredResult<T> {
  item: T;
  score: number; // 0 = perfect match, 1 = no match
}

export interface SuggestionResults {
  jobs: Job[];
  freelancers: Freelancer[];
  categories: Category[];
}

// ---------------------------------------------------------------------------
// Trending Searches (static data)
// ---------------------------------------------------------------------------

export const trendingSearches: string[] = [
  "Coach Padel",
  "Personal Trainer",
  "Yoga Class",
  "Photographer Prewedding",
  "Math Tutor",
  "Barber Home Service",
  "UI/UX Designer",
  "Makeup Artist",
];

// ---------------------------------------------------------------------------
// Known Locations (extracted from data for matching)
// ---------------------------------------------------------------------------

const KNOWN_LOCATIONS: string[] = [
  "bsd",
  "tangerang selatan",
  "jakarta selatan",
  "jakarta barat",
  "jakarta",
  "jabodetabek",
  "bali",
  "bandung",
  "surabaya",
  "remote",
  "online",
];

// Sort by length descending so "jakarta selatan" matches before "jakarta"
const SORTED_LOCATIONS = [...KNOWN_LOCATIONS].sort((a, b) => b.length - a.length);

// ---------------------------------------------------------------------------
// Synonym Map — expands search terms for broader matching
// ---------------------------------------------------------------------------

const synonymMap: Record<string, string[]> = {
  foto: ["fotografi", "photographer", "photography", "foto"],
  fotografi: ["foto", "photographer", "photography"],
  photographer: ["foto", "fotografi", "photography"],
  tutor: ["guru", "les", "pengajar", "tutor"],
  guru: ["tutor", "les", "pengajar"],
  les: ["tutor", "guru", "pengajar"],
  barber: ["potong rambut", "cukur", "barber"],
  cukur: ["barber", "potong rambut"],
  trainer: ["pelatih", "coach", "trainer"],
  pelatih: ["trainer", "coach"],
  coach: ["trainer", "pelatih", "coach"],
  makeup: ["mua", "makeup artist", "tata rias", "makeup"],
  mua: ["makeup", "makeup artist", "tata rias"],
  developer: ["programmer", "coder", "fullstack", "developer"],
  programmer: ["developer", "coder", "fullstack"],
  yoga: ["yoga", "wellness", "meditation"],
  piano: ["piano", "musik", "keyboard"],
  padel: ["padel", "olahraga"],
  desain: ["design", "desain", "kreatif"],
  design: ["desain", "design", "kreatif"],
  chef: ["chef", "masak", "kuliner", "koki"],
  detailing: ["detailing", "poles", "cuci mobil"],
  mobil: ["otomotif", "mobil", "car"],
};

// ---------------------------------------------------------------------------
// Price Extraction — Parse Indonesian price expressions
// ---------------------------------------------------------------------------

/**
 * Regex patterns for Indonesian price expressions:
 * - "500k" → 500,000
 * - "1jt" / "1 juta" → 1,000,000
 * - "150rb" / "150 ribu" → 150,000
 * - "100ribu" → 100,000
 */
const PRICE_PATTERNS: Array<{ regex: RegExp; multiplier: number }> = [
  // "1 juta" / "1juta" / "5 jt" / "5jt"
  { regex: /(\d+(?:[.,]\d+)?)\s*(?:juta|jt)\b/gi, multiplier: 1_000_000 },
  // "500k"
  { regex: /(\d+(?:[.,]\d+)?)\s*k\b/gi, multiplier: 1_000 },
  // "150rb" / "150 ribu" / "100ribu"
  { regex: /(\d+(?:[.,]\d+)?)\s*(?:ribu|rb)\b/gi, multiplier: 1_000 },
];

export function extractPrice(text: string): number | undefined {
  for (const { regex, multiplier } of PRICE_PATTERNS) {
    // Reset regex lastIndex for global flag
    regex.lastIndex = 0;
    const match = regex.exec(text);
    if (match) {
      const numStr = match[1].replace(",", ".");
      const num = parseFloat(numStr);
      if (!isNaN(num)) {
        return num * multiplier;
      }
    }
  }
  return undefined;
}

/**
 * Remove matched price tokens from the input so they don't pollute keyword search.
 */
function removePriceTokens(text: string): string {
  let cleaned = text;
  for (const { regex } of PRICE_PATTERNS) {
    regex.lastIndex = 0;
    cleaned = cleaned.replace(regex, " ");
  }
  return cleaned;
}

// ---------------------------------------------------------------------------
// Location Extraction
// ---------------------------------------------------------------------------

export function extractLocation(text: string): { location: string; remaining: string } | undefined {
  const lower = text.toLowerCase();
  for (const loc of SORTED_LOCATIONS) {
    const idx = lower.indexOf(loc);
    if (idx !== -1) {
      // Check word boundary: the character before and after should be a space or start/end
      const before = idx === 0 || /\s/.test(lower[idx - 1]);
      const after = idx + loc.length >= lower.length || /\s/.test(lower[idx + loc.length]);
      if (before && after) {
        const remaining = (text.substring(0, idx) + text.substring(idx + loc.length))
          .replace(/\s+/g, " ")
          .trim();
        return { location: loc, remaining };
      }
    }
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Query Parser
// ---------------------------------------------------------------------------

export function parseQuery(raw: string): ParsedQuery {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { keywords: [], raw: trimmed };
  }

  let working = trimmed;
  let priceMax: number | undefined;
  let location: string | undefined;

  // 1. Extract price
  priceMax = extractPrice(working);
  if (priceMax !== undefined) {
    working = removePriceTokens(working);
  }

  // 2. Extract location
  const locResult = extractLocation(working);
  if (locResult) {
    location = locResult.location;
    working = locResult.remaining;
  }

  // 3. Clean up filler words
  const fillerWords = new Set([
    "per", "jam", "sesi", "session", "bulan", "paket",
    "di", "untuk", "yang", "dan", "atau", "ke",
    "murah", "terdekat", "terbaik", "bagus",
  ]);

  // 4. Extract keywords (remaining tokens minus filler words, pure numbers, and empty strings)
  const keywords = working
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 0 && !fillerWords.has(token) && !/^\d+$/.test(token));

  return {
    keywords,
    location,
    price: priceMax !== undefined ? { max: priceMax } : undefined,
    raw: trimmed,
  };
}

// ---------------------------------------------------------------------------
// Synonym Expansion
// ---------------------------------------------------------------------------

export function expandWithSynonyms(keywords: string[]): string[] {
  const expanded = new Set<string>(keywords);
  for (const keyword of keywords) {
    const syns = synonymMap[keyword];
    if (syns) {
      for (const syn of syns) {
        expanded.add(syn);
      }
    }
  }
  return Array.from(expanded);
}

// ---------------------------------------------------------------------------
// Fuse.js Instances (memoized)
// ---------------------------------------------------------------------------

const jobFuseOptions: IFuseOptions<Job> = {
  keys: [
    { name: "title", weight: 3 },
    { name: "tags", weight: 2 },
    { name: "description", weight: 1 },
    { name: "providerName", weight: 1 },
  ],
  threshold: 0.4,
  includeScore: true,
  ignoreLocation: true,
  findAllMatches: true,
};

const freelancerFuseOptions: IFuseOptions<Freelancer> = {
  keys: [
    { name: "name", weight: 2 },
    { name: "role", weight: 3 },
    { name: "tags", weight: 2 },
  ],
  threshold: 0.4,
  includeScore: true,
  ignoreLocation: true,
  findAllMatches: true,
};

const categoryFuseOptions: IFuseOptions<Category> = {
  keys: [
    { name: "name", weight: 3 },
  ],
  threshold: 0.3,
  includeScore: true,
  ignoreLocation: true,
};

let _jobFuse: Fuse<Job> | null = null;
let _freelancerFuse: Fuse<Freelancer> | null = null;
let _categoryFuse: Fuse<Category> | null = null;

function getJobFuse(): Fuse<Job> {
  if (!_jobFuse) _jobFuse = new Fuse(jobs, jobFuseOptions);
  return _jobFuse;
}

function getFreelancerFuse(): Fuse<Freelancer> {
  if (!_freelancerFuse) _freelancerFuse = new Fuse(freelancers, freelancerFuseOptions);
  return _freelancerFuse;
}

function getCategoryFuse(): Fuse<Category> {
  if (!_categoryFuse) _categoryFuse = new Fuse(categories, categoryFuseOptions);
  return _categoryFuse;
}

// ---------------------------------------------------------------------------
// Location Matching Helper
// ---------------------------------------------------------------------------

function locationMatches(itemLocation: string, queryLocation: string): boolean {
  const itemLower = itemLocation.toLowerCase();
  const queryLower = queryLocation.toLowerCase();
  // Flexible: "bsd" matches "BSD, Tangerang Selatan"
  // "jakarta" matches "Jakarta", "Jakarta Selatan", "Jakarta Barat"
  return itemLower.includes(queryLower) || queryLower.includes(itemLower);
}

// ---------------------------------------------------------------------------
// Smart Search — Full Pipeline
// ---------------------------------------------------------------------------

export function smartSearch(rawQuery: string): SearchResults {
  const parsed = parseQuery(rawQuery);

  if (parsed.keywords.length === 0 && !parsed.location && !parsed.price) {
    return { jobs: [], freelancers: [] };
  }

  // Expand keywords with synonyms
  const expandedKeywords = expandWithSynonyms(parsed.keywords);

  // --- Search using individual keywords and merge scores ---
  // This approach is more robust than a single concatenated search string
  // because Fuse.js handles single words better than long multi-word strings.
  let jobResults: ScoredResult<Job>[];
  let freelancerResults: ScoredResult<Freelancer>[];

  if (expandedKeywords.length > 0) {
    // Search each keyword individually and aggregate best scores per item
    const jobScoreMap = new Map<string, { item: Job; scores: number[] }>();
    const flScoreMap = new Map<string, { item: Freelancer; scores: number[] }>();

    for (const kw of expandedKeywords) {
      // Search jobs
      const jobHits = getJobFuse().search(kw);
      for (const hit of jobHits) {
        const entry = jobScoreMap.get(hit.item.id) ?? { item: hit.item, scores: [] };
        entry.scores.push(hit.score ?? 1);
        jobScoreMap.set(hit.item.id, entry);
      }
      // Search freelancers
      const flHits = getFreelancerFuse().search(kw);
      for (const hit of flHits) {
        const entry = flScoreMap.get(hit.item.id) ?? { item: hit.item, scores: [] };
        entry.scores.push(hit.score ?? 1);
        flScoreMap.set(hit.item.id, entry);
      }
    }

    // Calculate final score: average of best scores, weighted by how many keywords matched
    jobResults = Array.from(jobScoreMap.values()).map(({ item, scores }) => ({
      item,
      score: Math.min(...scores) * (1 - (scores.length - 1) * 0.1), // bonus for more keyword matches
    }));
    freelancerResults = Array.from(flScoreMap.values()).map(({ item, scores }) => ({
      item,
      score: Math.min(...scores) * (1 - (scores.length - 1) * 0.1),
    }));
  } else {
    // No keywords, but we have location/price filters — include all items
    jobResults = jobs.map((item) => ({ item, score: 0.5 }));
    freelancerResults = freelancers.map((item) => ({ item, score: 0.5 }));
  }

  // --- Post-filter by location ---
  if (parsed.location) {
    jobResults = jobResults.filter((r) => locationMatches(r.item.location, parsed.location!));
    freelancerResults = freelancerResults.filter((r) =>
      locationMatches(r.item.location, parsed.location!)
    );
  }

  // --- Post-filter by price (jobs only — freelancers use hourlyRate string) ---
  if (parsed.price) {
    jobResults = jobResults.filter((r) => r.item.price <= parsed.price!.max);
  }

  // --- Boost topMatch / featured items ---
  jobResults = jobResults.map((r) => ({
    ...r,
    score: r.item.isTopMatch ? r.score * 0.8 : r.score,
  }));
  freelancerResults = freelancerResults.map((r) => ({
    ...r,
    score: r.item.isFeatured ? r.score * 0.8 : r.score,
  }));

  // --- Sort by score ascending (lower = better) ---
  jobResults.sort((a, b) => a.score - b.score);
  freelancerResults.sort((a, b) => a.score - b.score);

  return { jobs: jobResults, freelancers: freelancerResults };
}

// ---------------------------------------------------------------------------
// Get Suggestions — Lightweight autocomplete version
// ---------------------------------------------------------------------------

export function getSuggestions(
  query: string,
  limits: { jobs?: number; freelancers?: number; categories?: number } = {}
): SuggestionResults {
  const maxJobs = limits.jobs ?? 3;
  const maxFreelancers = limits.freelancers ?? 3;
  const maxCategories = limits.categories ?? 2;

  const trimmed = query.trim();
  if (!trimmed) {
    return { jobs: [], freelancers: [], categories: [] };
  }

  const jobResults = getJobFuse().search(trimmed, { limit: maxJobs });
  const freelancerResults = getFreelancerFuse().search(trimmed, { limit: maxFreelancers });
  const categoryResults = getCategoryFuse().search(trimmed, { limit: maxCategories });

  return {
    jobs: jobResults.map((r) => r.item),
    freelancers: freelancerResults.map((r) => r.item),
    categories: categoryResults.map((r) => r.item),
  };
}

// ---------------------------------------------------------------------------
// Recent Searches — localStorage helpers
// ---------------------------------------------------------------------------

const RECENT_SEARCHES_KEY = "gigit_recent_searches";
const MAX_RECENT_SEARCHES = 5;

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) return parsed.slice(0, MAX_RECENT_SEARCHES);
    return [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  if (typeof window === "undefined") return;
  const trimmed = query.trim();
  if (!trimmed) return;
  try {
    const current = getRecentSearches();
    // Remove existing duplicate (case-insensitive)
    const filtered = current.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
    // Prepend new search
    const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Silently fail
  }
}

// ---------------------------------------------------------------------------
// Unique Locations — for the Explore page filter sidebar
// ---------------------------------------------------------------------------

export function getUniqueLocations(): string[] {
  const locationSet = new Set<string>();
  for (const job of jobs) {
    locationSet.add(job.location);
  }
  for (const fl of freelancers) {
    locationSet.add(fl.location);
  }
  return Array.from(locationSet).sort();
}
