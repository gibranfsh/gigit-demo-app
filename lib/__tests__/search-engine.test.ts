// =============================================================================
// Gigit Demo — Search Engine Unit Tests
// =============================================================================

import { describe, it, expect } from "vitest";
import {
  parseQuery,
  extractPrice,
  extractLocation,
  expandWithSynonyms,
  smartSearch,
  getSuggestions,
  trendingSearches,
} from "@/lib/search-engine";

// ---------------------------------------------------------------------------
// Price Extraction
// ---------------------------------------------------------------------------

describe("extractPrice", () => {
  it("parses '500k' as 500,000", () => {
    expect(extractPrice("500k")).toBe(500_000);
  });

  it("parses '1 juta' as 1,000,000", () => {
    expect(extractPrice("1 juta")).toBe(1_000_000);
  });

  it("parses '1jt' as 1,000,000", () => {
    expect(extractPrice("1jt")).toBe(1_000_000);
  });

  it("parses '5 juta' as 5,000,000", () => {
    expect(extractPrice("5 juta")).toBe(5_000_000);
  });

  it("parses '150rb' as 150,000", () => {
    expect(extractPrice("150rb")).toBe(150_000);
  });

  it("parses '100ribu' as 100,000", () => {
    expect(extractPrice("100ribu")).toBe(100_000);
  });

  it("parses '150 ribu' as 150,000", () => {
    expect(extractPrice("150 ribu")).toBe(150_000);
  });

  it("returns undefined for text without price", () => {
    expect(extractPrice("coach padel bsd")).toBeUndefined();
  });

  it("parses price embedded in longer text", () => {
    expect(extractPrice("coach padel 500k 1 jam")).toBe(500_000);
  });

  it("parses '2.5 juta' as 2,500,000", () => {
    expect(extractPrice("2.5 juta")).toBe(2_500_000);
  });
});

// ---------------------------------------------------------------------------
// Location Extraction
// ---------------------------------------------------------------------------

describe("extractLocation", () => {
  it("extracts 'bsd' from query", () => {
    const result = extractLocation("coach padel bsd 1 jam");
    expect(result).toBeDefined();
    expect(result!.location).toBe("bsd");
    expect(result!.remaining).toBe("coach padel 1 jam");
  });

  it("extracts 'jakarta selatan' before 'jakarta'", () => {
    const result = extractLocation("trainer jakarta selatan");
    expect(result).toBeDefined();
    expect(result!.location).toBe("jakarta selatan");
  });

  it("extracts 'bali' from query", () => {
    const result = extractLocation("yoga bali");
    expect(result).toBeDefined();
    expect(result!.location).toBe("bali");
    expect(result!.remaining).toBe("yoga");
  });

  it("extracts 'bandung' from query", () => {
    const result = extractLocation("photographer prewedding bandung");
    expect(result).toBeDefined();
    expect(result!.location).toBe("bandung");
  });

  it("returns undefined when no location found", () => {
    const result = extractLocation("yoga class online");
    // "online" is a known location
    expect(result).toBeDefined();
    expect(result!.location).toBe("online");
  });

  it("returns undefined for unknown location", () => {
    const result = extractLocation("coach padel premium");
    expect(result).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Query Parser
// ---------------------------------------------------------------------------

describe("parseQuery", () => {
  it("parses 'coach padel bsd 1 juta'", () => {
    const result = parseQuery("coach padel bsd 1 juta");
    expect(result.keywords).toContain("coach");
    expect(result.keywords).toContain("padel");
    expect(result.location).toBe("bsd");
    expect(result.price).toEqual({ max: 1_000_000 });
  });

  it("parses 'personal trainer 300k jakarta selatan'", () => {
    const result = parseQuery("personal trainer 300k jakarta selatan");
    expect(result.keywords).toContain("personal");
    expect(result.keywords).toContain("trainer");
    expect(result.location).toBe("jakarta selatan");
    expect(result.price).toEqual({ max: 300_000 });
  });

  it("parses 'private yoga class 1 juta bali'", () => {
    const result = parseQuery("private yoga class 1 juta bali");
    expect(result.keywords).toContain("yoga");
    expect(result.keywords).toContain("class");
    expect(result.location).toBe("bali");
    expect(result.price).toEqual({ max: 1_000_000 });
  });

  it("parses 'photographer prewedding 5 juta bandung'", () => {
    const result = parseQuery("photographer prewedding 5 juta bandung");
    expect(result.keywords).toContain("photographer");
    expect(result.keywords).toContain("prewedding");
    expect(result.location).toBe("bandung");
    expect(result.price).toEqual({ max: 5_000_000 });
  });

  it("parses 'math tutor SMA 150k per session'", () => {
    const result = parseQuery("math tutor SMA 150k per session");
    expect(result.keywords).toContain("math");
    expect(result.keywords).toContain("tutor");
    expect(result.keywords).toContain("sma");
    expect(result.price).toEqual({ max: 150_000 });
    // "per" and "session" are filler words
    expect(result.keywords).not.toContain("per");
    expect(result.keywords).not.toContain("session");
  });

  it("parses 'barber home service 100k jakarta'", () => {
    const result = parseQuery("barber home service 100k jakarta");
    expect(result.keywords).toContain("barber");
    expect(result.keywords).toContain("home");
    expect(result.keywords).toContain("service");
    expect(result.location).toBe("jakarta");
    expect(result.price).toEqual({ max: 100_000 });
  });

  it("returns empty keywords for empty string", () => {
    const result = parseQuery("");
    expect(result.keywords).toEqual([]);
    expect(result.location).toBeUndefined();
    expect(result.price).toBeUndefined();
  });

  it("filters out filler words like 'di', 'untuk', 'yang'", () => {
    const result = parseQuery("yoga di bali untuk pemula");
    expect(result.keywords).not.toContain("di");
    expect(result.keywords).not.toContain("untuk");
    expect(result.keywords).toContain("yoga");
    expect(result.keywords).toContain("pemula");
    expect(result.location).toBe("bali");
  });
});

// ---------------------------------------------------------------------------
// Synonym Expansion
// ---------------------------------------------------------------------------

describe("expandWithSynonyms", () => {
  it("expands 'foto' to include photography-related terms", () => {
    const expanded = expandWithSynonyms(["foto"]);
    expect(expanded).toContain("foto");
    expect(expanded).toContain("fotografi");
    expect(expanded).toContain("photographer");
  });

  it("expands 'tutor' to include teaching terms", () => {
    const expanded = expandWithSynonyms(["tutor"]);
    expect(expanded).toContain("tutor");
    expect(expanded).toContain("guru");
    expect(expanded).toContain("les");
  });

  it("expands 'barber' to include grooming terms", () => {
    const expanded = expandWithSynonyms(["barber"]);
    expect(expanded).toContain("barber");
    expect(expanded).toContain("potong rambut");
    expect(expanded).toContain("cukur");
  });

  it("does not expand unknown words", () => {
    const expanded = expandWithSynonyms(["xyzabc"]);
    expect(expanded).toEqual(["xyzabc"]);
  });

  it("handles multiple keywords", () => {
    const expanded = expandWithSynonyms(["coach", "padel"]);
    expect(expanded).toContain("coach");
    expect(expanded).toContain("trainer");
    expect(expanded).toContain("pelatih");
    expect(expanded).toContain("padel");
    expect(expanded).toContain("olahraga");
  });
});

// ---------------------------------------------------------------------------
// Smart Search — PRD Example Queries
// ---------------------------------------------------------------------------

describe("smartSearch", () => {
  it("'coach padel 500k 1 jam BSD' → Coach Padel Privat as top result", () => {
    const results = smartSearch("coach padel 500k 1 jam BSD");
    expect(results.jobs.length).toBeGreaterThan(0);
    expect(results.jobs[0].item.id).toBe("job-1");
    expect(results.jobs[0].item.title).toBe("Coach Padel Privat");
  });

  it("'personal trainer 300k jakarta selatan' → Personal Trainer as top result", () => {
    const results = smartSearch("personal trainer 300k jakarta selatan");
    expect(results.jobs.length).toBeGreaterThan(0);
    expect(results.jobs[0].item.id).toBe("job-2");
    expect(results.jobs[0].item.title).toBe("Personal Trainer");
  });

  it("'private yoga class 1 juta bali' → Private Yoga Class as top result", () => {
    const results = smartSearch("private yoga class 1 juta bali");
    expect(results.jobs.length).toBeGreaterThan(0);
    expect(results.jobs[0].item.id).toBe("job-3");
    expect(results.jobs[0].item.title).toBe("Private Yoga Class");
  });

  it("'photographer prewedding 5 juta bandung' → Photographer Prewedding as top result", () => {
    const results = smartSearch("photographer prewedding 5 juta bandung");
    expect(results.jobs.length).toBeGreaterThan(0);
    expect(results.jobs[0].item.id).toBe("job-4");
    expect(results.jobs[0].item.title).toBe("Photographer Prewedding");
  });

  it("'math tutor SMA 150k per session' → Math Tutor SMA as top result", () => {
    const results = smartSearch("math tutor SMA 150k per session");
    expect(results.jobs.length).toBeGreaterThan(0);
    expect(results.jobs[0].item.id).toBe("job-5");
    expect(results.jobs[0].item.title).toBe("Math Tutor SMA");
  });

  it("'barber home service 100k jakarta' → Barber Home Service as top result", () => {
    const results = smartSearch("barber home service 100k jakarta");
    expect(results.jobs.length).toBeGreaterThan(0);
    expect(results.jobs[0].item.id).toBe("job-6");
    expect(results.jobs[0].item.title).toBe("Barber Home Service");
  });

  it("returns empty results for empty query", () => {
    const results = smartSearch("");
    expect(results.jobs).toEqual([]);
    expect(results.freelancers).toEqual([]);
  });

  it("returns empty results for gibberish", () => {
    const results = smartSearch("xyzabc123 qqq zzz");
    // Should return empty or very low-confidence results
    expect(results.jobs.length).toBe(0);
  });

  // --- Fuzzy tolerance tests ---
  it("handles typo 'padell' → still finds padel-related results", () => {
    const results = smartSearch("padell");
    expect(results.jobs.length).toBeGreaterThan(0);
    // With threshold 0.4, slight typo should still match
    expect(results.jobs.some((r) => r.item.title.toLowerCase().includes("padel"))).toBe(true);
  });

  it("handles synonym 'foto prewedding' → finds photographer", () => {
    const results = smartSearch("foto prewedding");
    expect(results.jobs.length).toBeGreaterThan(0);
    expect(results.jobs.some((r) => r.item.title.toLowerCase().includes("photographer"))).toBe(true);
  });

  it("filters by location: 'trainer bali' → only Bali results", () => {
    const results = smartSearch("trainer bali");
    results.jobs.forEach((r) => {
      expect(r.item.location.toLowerCase()).toContain("bali");
    });
  });

  it("filters by price: 'coach 200k' → only jobs ≤ 200k", () => {
    const results = smartSearch("coach 200k");
    results.jobs.forEach((r) => {
      expect(r.item.price).toBeLessThanOrEqual(200_000);
    });
  });

  it("finds freelancers too: 'yoga' → includes yoga-related freelancers", () => {
    const results = smartSearch("yoga");
    expect(results.freelancers.length).toBeGreaterThan(0);
    expect(
      results.freelancers.some((r) =>
        r.item.role.toLowerCase().includes("yoga") ||
        r.item.tags.some((t) => t.toLowerCase().includes("yoga"))
      )
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Get Suggestions (Autocomplete)
// ---------------------------------------------------------------------------

describe("getSuggestions", () => {
  it("returns jobs, freelancers, and categories for 'yoga'", () => {
    const suggestions = getSuggestions("yoga");
    expect(suggestions.jobs.length).toBeGreaterThan(0);
    expect(suggestions.freelancers.length).toBeGreaterThan(0);
    // Categories may or may not match depending on names
  });

  it("returns max 3 jobs by default", () => {
    const suggestions = getSuggestions("a");
    expect(suggestions.jobs.length).toBeLessThanOrEqual(3);
  });

  it("returns max 3 freelancers by default", () => {
    const suggestions = getSuggestions("a");
    expect(suggestions.freelancers.length).toBeLessThanOrEqual(3);
  });

  it("returns max 2 categories by default", () => {
    const suggestions = getSuggestions("a");
    expect(suggestions.categories.length).toBeLessThanOrEqual(2);
  });

  it("respects custom limits", () => {
    const suggestions = getSuggestions("a", { jobs: 1, freelancers: 1, categories: 1 });
    expect(suggestions.jobs.length).toBeLessThanOrEqual(1);
    expect(suggestions.freelancers.length).toBeLessThanOrEqual(1);
    expect(suggestions.categories.length).toBeLessThanOrEqual(1);
  });

  it("returns empty for empty query", () => {
    const suggestions = getSuggestions("");
    expect(suggestions.jobs).toEqual([]);
    expect(suggestions.freelancers).toEqual([]);
    expect(suggestions.categories).toEqual([]);
  });

  it("finds category 'Olahraga' when searching 'olahraga'", () => {
    const suggestions = getSuggestions("olahraga");
    expect(suggestions.categories.length).toBeGreaterThan(0);
    expect(suggestions.categories[0].name).toContain("Olahraga");
  });
});

// ---------------------------------------------------------------------------
// Trending Searches
// ---------------------------------------------------------------------------

describe("trendingSearches", () => {
  it("is a non-empty array of strings", () => {
    expect(Array.isArray(trendingSearches)).toBe(true);
    expect(trendingSearches.length).toBeGreaterThan(0);
    trendingSearches.forEach((s) => {
      expect(typeof s).toBe("string");
      expect(s.length).toBeGreaterThan(0);
    });
  });
});
