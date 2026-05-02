"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { SearchDropdown } from "@/components/SearchDropdown";
import { addRecentSearch, trendingSearches } from "@/lib/search-engine";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SearchBarProps = {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  /** Callback for live query updates (used by homepage for any reactive UI). */
  onQueryChange?: (query: string) => void;
  /** Show the popular search pills below the bar. */
  showSuggestions?: boolean;
  /** Enable the autocomplete dropdown (true on homepage, false in explore nav). */
  enableAutocomplete?: boolean;
  /** Initial query value (used on explore page to restore from URL). */
  defaultQuery?: string;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SearchBar({
  className,
  inputClassName,
  placeholder = "Cari layanan, mis: Coach padel 500k 1 jam BSD",
  onQueryChange,
  showSuggestions = true,
  enableAutocomplete = true,
  defaultQuery = "",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(defaultQuery);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- Handle input change ---
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onQueryChange?.(value);
      if (enableAutocomplete) {
        setIsDropdownOpen(true);
      }
    },
    [onQueryChange, enableAutocomplete]
  );

  // --- Handle search submit (Enter key or button click) ---
  const handleSubmit = useCallback(
    (searchQuery?: string) => {
      const q = (searchQuery ?? query).trim();
      if (!q) return;

      addRecentSearch(q);
      setIsDropdownOpen(false);

      // Navigate to explore page with query, preserving theme param
      const theme = searchParams.get("theme");
      const themeParam = theme ? `&theme=${theme}` : "";
      router.push(`/explore?q=${encodeURIComponent(q)}${themeParam}`);
    },
    [query, router, searchParams]
  );

  // --- Handle suggestion selection from dropdown ---
  const handleSelect = useCallback(
    (value: string) => {
      setQuery(value);
      onQueryChange?.(value);
      setIsDropdownOpen(false);
      handleSubmit(value);
    },
    [onQueryChange, handleSubmit]
  );

  // --- Handle key down on input ---
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !isDropdownOpen) {
        e.preventDefault();
        handleSubmit();
      }
      // If dropdown is open, ArrowDown/Up/Enter/Escape are handled by SearchDropdown
    },
    [handleSubmit, isDropdownOpen]
  );

  // --- Handle focus ---
  const handleFocus = useCallback(() => {
    if (enableAutocomplete) {
      setIsDropdownOpen(true);
    }
  }, [enableAutocomplete]);

  return (
    <div className={cn("w-full", className)}>
      {/* Search Input Container */}
      <div className="relative">
        <div
          className={cn(
            "group/search relative flex items-center",
            "rounded-2xl bg-white/95 backdrop-blur-sm",
            "ring-1 ring-gigit-ice shadow-sm",
            "focus-within:ring-2 focus-within:ring-gigit-blue/40 focus-within:shadow-lg focus-within:shadow-gigit-blue/5",
            "transition-all duration-300 ease-out"
          )}
        >
          <Search className="pointer-events-none absolute left-5 size-5 text-gigit-text-secondary transition-colors duration-200 group-focus-within/search:text-gigit-blue" />

          <Input
            ref={inputRef}
            className={cn(
              "h-14 rounded-2xl border-0 bg-transparent pl-13 pr-14 sm:pr-28 text-base font-medium text-foreground placeholder:text-gigit-text-secondary/60",
              "focus-visible:ring-0 focus-visible:border-transparent",
              "md:h-16 md:text-lg",
              inputClassName
            )}
            type="search"
            placeholder={placeholder}
            aria-label="Search for services"
            aria-expanded={isDropdownOpen}
            aria-autocomplete={enableAutocomplete ? "list" : "none"}
            aria-controls={enableAutocomplete ? "search-dropdown" : undefined}
            role="combobox"
            autoComplete="off"
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
          />

          {/* Search Button CTA */}
          <button
            type="button"
            className={cn(
              "absolute right-2 flex items-center gap-2",
              "rounded-xl bg-gigit-blue px-5 py-2.5",
              "text-sm font-semibold text-white",
              "transition-all duration-200 ease-out",
              "hover:bg-gigit-navy hover:shadow-md",
              "active:scale-[0.98]",
              "cursor-pointer",
              "md:px-6 md:py-3"
            )}
            aria-label="Search"
            onClick={() => handleSubmit()}
          >
            <Search className="size-4" />
            <span className="hidden sm:inline">Cari</span>
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {enableAutocomplete && (
          <SearchDropdown
            query={query}
            isOpen={isDropdownOpen}
            onSelect={handleSelect}
            onClose={() => setIsDropdownOpen(false)}
            inputRef={inputRef}
          />
        )}
      </div>

      {/* Popular Searches */}
      {showSuggestions && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gigit-text-secondary">
            <Sparkles className="size-3.5" />
            Populer:
          </span>
          {trendingSearches.slice(0, 6).map((search) => (
            <button
              key={search}
              type="button"
              onClick={() => handleSelect(search)}
              className={cn(
                "rounded-full border border-gigit-ice bg-white/80 px-3 py-1",
                "text-xs font-medium text-foreground/80",
                "transition-all duration-200 ease-out",
                "hover:border-gigit-accent-light hover:bg-gigit-accent-tint hover:text-foreground",
                "cursor-pointer"
              )}
            >
              {search}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
