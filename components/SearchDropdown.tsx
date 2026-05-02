"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, Clock, TrendingUp, User, Folder, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  getSuggestions,
  getRecentSearches,
  clearRecentSearches,
  trendingSearches,
  type SuggestionResults,
} from "@/lib/search-engine";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SuggestionItem = {
  id: string;
  type: "recent" | "trending" | "job" | "freelancer" | "category";
  label: string;
  sublabel?: string;
  value: string;
};

type SearchDropdownProps = {
  query: string;
  isOpen: boolean;
  onSelect: (value: string) => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

// ---------------------------------------------------------------------------
// Bold Match Highlight
// ---------------------------------------------------------------------------

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const tokens = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  // Build a regex to match any of the query tokens
  const escaped = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="font-semibold text-foreground">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SearchDropdown({
  query,
  isOpen,
  onSelect,
  onClose,
  inputRef,
}: SearchDropdownProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<SuggestionResults>({
    jobs: [],
    freelancers: [],
    categories: [],
  });

  // --- Debounced suggestions fetch ---
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions({ jobs: [], freelancers: [], categories: [] });
      return;
    }

    const timer = setTimeout(() => {
      setSuggestions(getSuggestions(query));
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // --- Build flat list of suggestions for keyboard navigation ---
  const items = useMemo<SuggestionItem[]>(() => {
    const result: SuggestionItem[] = [];

    if (!query.trim()) {
      // Empty state: show recent + trending
      const recent = getRecentSearches();
      recent.forEach((s, i) =>
        result.push({
          id: `recent-${i}`,
          type: "recent",
          label: s,
          value: s,
        })
      );
      trendingSearches.forEach((s, i) =>
        result.push({
          id: `trending-${i}`,
          type: "trending",
          label: s,
          value: s,
        })
      );
    } else {
      // Typing state: show segmented suggestions
      suggestions.jobs.forEach((job) =>
        result.push({
          id: `job-${job.id}`,
          type: "job",
          label: job.title,
          sublabel: job.location,
          value: job.title,
        })
      );
      suggestions.freelancers.forEach((fl) =>
        result.push({
          id: `fl-${fl.id}`,
          type: "freelancer",
          label: fl.name,
          sublabel: fl.role,
          value: fl.name,
        })
      );
      suggestions.categories.forEach((cat) =>
        result.push({
          id: `cat-${cat.id}`,
          type: "category",
          label: cat.name,
          sublabel: `${cat.jobCount} layanan`,
          value: cat.name,
        })
      );
    }

    return result;
  }, [query, suggestions]);

  // --- Reset active index on items change ---
  useEffect(() => {
    setActiveIndex(-1);
  }, [items]);

  // --- Click outside to close ---
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose, inputRef]);

  // --- Keyboard navigation ---
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || items.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
          break;
        case "Enter":
          if (activeIndex >= 0 && activeIndex < items.length) {
            e.preventDefault();
            onSelect(items[activeIndex].value);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [isOpen, items, activeIndex, onSelect, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // --- Scroll active item into view ---
  useEffect(() => {
    if (activeIndex >= 0) {
      const el = dropdownRef.current?.querySelector(
        `[data-index="${activeIndex}"]`
      );
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  // --- Don't render if closed or nothing to show ---
  if (!isOpen) return null;

  const hasRecent = !query.trim() && getRecentSearches().length > 0;
  const hasTrending = !query.trim() && trendingSearches.length > 0;
  const hasResults = query.trim() && items.length > 0;
  const noResults = query.trim() && items.length === 0 && query.length >= 2;

  if (!hasRecent && !hasTrending && !hasResults && !noResults) return null;

  // --- Get section icons ---
  const iconForType = (type: SuggestionItem["type"]) => {
    switch (type) {
      case "recent":
        return <Clock className="size-4 shrink-0 text-gigit-text-secondary" />;
      case "trending":
        return <TrendingUp className="size-4 shrink-0 text-gigit-accent" />;
      case "job":
        return <Search className="size-4 shrink-0 text-gigit-blue" />;
      case "freelancer":
        return <User className="size-4 shrink-0 text-gigit-blue" />;
      case "category":
        return <Folder className="size-4 shrink-0 text-gigit-accent" />;
    }
  };

  // --- Group items by type for section headers ---
  const sections: Array<{
    title: string;
    type: SuggestionItem["type"];
    items: SuggestionItem[];
    startIndex: number;
    showClear?: boolean;
  }> = [];

  let currentIdx = 0;

  if (!query.trim()) {
    const recentItems = items.filter((i) => i.type === "recent");
    if (recentItems.length > 0) {
      sections.push({
        title: "Pencarian Terakhir",
        type: "recent",
        items: recentItems,
        startIndex: currentIdx,
        showClear: true,
      });
      currentIdx += recentItems.length;
    }

    const trendingItems = items.filter((i) => i.type === "trending");
    if (trendingItems.length > 0) {
      sections.push({
        title: "Trending",
        type: "trending",
        items: trendingItems,
        startIndex: currentIdx,
      });
      currentIdx += trendingItems.length;
    }
  } else {
    const jobItems = items.filter((i) => i.type === "job");
    if (jobItems.length > 0) {
      sections.push({
        title: "Layanan",
        type: "job",
        items: jobItems,
        startIndex: currentIdx,
      });
      currentIdx += jobItems.length;
    }

    const flItems = items.filter((i) => i.type === "freelancer");
    if (flItems.length > 0) {
      sections.push({
        title: "Freelancer",
        type: "freelancer",
        items: flItems,
        startIndex: currentIdx,
      });
      currentIdx += flItems.length;
    }

    const catItems = items.filter((i) => i.type === "category");
    if (catItems.length > 0) {
      sections.push({
        title: "Kategori",
        type: "category",
        items: catItems,
        startIndex: currentIdx,
      });
    }
  }

  return (
    <div
      ref={dropdownRef}
      role="listbox"
      aria-label="Saran pencarian"
      className={cn(
        "absolute left-0 right-0 top-full mt-2 z-40",
        "rounded-2xl bg-white border border-gigit-ice",
        "shadow-xl shadow-black/8",
        // Smooth enter animation
        "animate-in fade-in-0 slide-in-from-top-2 duration-200 ease-out",
        // Respect reduced motion
        "motion-reduce:animate-none"
      )}
    >
      <div className="max-h-[360px] overflow-y-auto py-2 scrollbar-thin">
        {sections.map((section) => (
          <div key={section.type} className="mb-1 last:mb-0">
            {/* Section Header */}
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gigit-text-secondary/70">
                {section.title}
              </span>
              {section.showClear && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearRecentSearches();
                    onClose();
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-gigit-text-secondary hover:text-destructive transition-colors duration-200 cursor-pointer"
                >
                  <X className="size-3" />
                  Hapus
                </button>
              )}
            </div>

            {/* Section Items */}
            {section.items.map((item, i) => {
              const globalIndex = section.startIndex + i;
              const isActive = globalIndex === activeIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  data-index={globalIndex}
                  onClick={() => onSelect(item.value)}
                  onMouseEnter={() => setActiveIndex(globalIndex)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5",
                    "text-left text-sm",
                    "transition-colors duration-150 ease-out",
                    "cursor-pointer",
                    isActive
                      ? "bg-gigit-accent-bg text-foreground"
                      : "text-foreground/80 hover:bg-gigit-off-white"
                  )}
                >
                  {iconForType(item.type)}

                  <div className="flex-1 min-w-0">
                    <span className="block truncate">
                      <HighlightMatch text={item.label} query={query} />
                    </span>
                    {item.sublabel && (
                      <span className="block truncate text-xs text-gigit-text-secondary mt-0.5">
                        {item.sublabel}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}

        {/* No results state */}
        {noResults && (
          <div className="px-4 py-6 text-center text-sm text-gigit-text-secondary">
            <p className="font-medium">Tidak ditemukan saran untuk &quot;{query}&quot;</p>
            <p className="mt-1 text-xs">Tekan Enter untuk mencari</p>
          </div>
        )}
      </div>

      {/* Live region for screen readers */}
      <div className="sr-only" aria-live="polite">
        {items.length > 0
          ? `${items.length} saran ditemukan`
          : noResults
            ? "Tidak ada saran"
            : ""}
      </div>
    </div>
  );
}
