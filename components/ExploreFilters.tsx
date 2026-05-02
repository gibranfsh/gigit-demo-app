"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Star, MapPin, Tag, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FilterState = {
  categories?: string[];
  locations?: string[];
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
};

type ExploreFiltersProps = {
  filters: FilterState;
  onFiltersChange: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  locations: string[];
  categories: Category[];
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ExploreFilters({
  filters,
  onFiltersChange,
  locations,
  categories,
}: ExploreFiltersProps) {
  // --- Category filter ---
  const toggleCategory = (name: string) => {
    onFiltersChange((prev) => {
      const current = prev.categories ?? [];
      const exists = current.includes(name);
      return {
        ...prev,
        categories: exists
          ? current.filter((c) => c !== name)
          : [...current, name],
      };
    });
  };

  // --- Location filter ---
  const toggleLocation = (loc: string) => {
    onFiltersChange((prev) => {
      const current = prev.locations ?? [];
      const exists = current.includes(loc);
      return {
        ...prev,
        locations: exists
          ? current.filter((l) => l !== loc)
          : [...current, loc],
      };
    });
  };

  // --- Price state (local until applied) ---
  const [localPriceMin, setLocalPriceMin] = useState("");
  const [localPriceMax, setLocalPriceMax] = useState("");

  const applyPrice = () => {
    onFiltersChange((prev) => ({
      ...prev,
      priceMin: localPriceMin ? Number(localPriceMin) : undefined,
      priceMax: localPriceMax ? Number(localPriceMax) : undefined,
    }));
  };

  // --- Rating filter ---
  const setRating = (rating: number) => {
    onFiltersChange((prev) => ({
      ...prev,
      minRating: prev.minRating === rating ? undefined : rating,
    }));
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* ── Kategori ── */}
      <Popover>
        <PopoverTrigger
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium",
            "transition-colors duration-200 cursor-pointer",
            filters.categories?.length
              ? "border-gigit-accent bg-gigit-accent-tint text-gigit-accent-dark"
              : "border-gigit-ice bg-white text-foreground/80 hover:border-gigit-accent-light hover:bg-gigit-off-white"
          )}
        >
          <Tag className="size-4" />
          Kategori
          {filters.categories?.length ? (
            <span className="ml-0.5 rounded-full bg-gigit-accent px-1.5 text-xs text-white">
              {filters.categories.length}
            </span>
          ) : null}
          <ChevronDown className="size-3.5 opacity-60" />
        </PopoverTrigger>
        <PopoverContent align="start" className="z-30 w-56 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gigit-text-secondary/70 mb-2">
            Kategori
          </p>
          <div className="max-h-48 overflow-y-auto scrollbar-thin space-y-1">
            {categories.map((cat) => {
              const isChecked = filters.categories?.includes(cat.name) ?? false;
              return (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gigit-off-white cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(cat.name)}
                    className="size-4 rounded border-gigit-ice text-gigit-accent focus:ring-gigit-accent/30 cursor-pointer"
                  />
                  <span className="flex-1">{cat.name}</span>
                  <span className="text-xs text-gigit-text-secondary">{cat.jobCount}</span>
                </label>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* ── Harga ── */}
      <Popover>
        <PopoverTrigger
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium",
            "transition-colors duration-200 cursor-pointer",
            filters.priceMin !== undefined || filters.priceMax !== undefined
              ? "border-gigit-accent bg-gigit-accent-tint text-gigit-accent-dark"
              : "border-gigit-ice bg-white text-foreground/80 hover:border-gigit-accent-light hover:bg-gigit-off-white"
          )}
        >
          <DollarSign className="size-4" />
          Harga
          <ChevronDown className="size-3.5 opacity-60" />
        </PopoverTrigger>
        <PopoverContent align="start" className="z-30 w-64 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gigit-text-secondary/70 mb-3">
            Rentang Harga (Rp)
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={localPriceMin}
              onChange={(e) => setLocalPriceMin(e.target.value)}
              className="h-9 w-full rounded-lg border border-gigit-ice bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gigit-blue/30"
            />
            <span className="text-gigit-text-secondary">–</span>
            <input
              type="number"
              placeholder="Max"
              value={localPriceMax}
              onChange={(e) => setLocalPriceMax(e.target.value)}
              className="h-9 w-full rounded-lg border border-gigit-ice bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gigit-blue/30"
            />
          </div>
          <button
            type="button"
            onClick={applyPrice}
            className="mt-3 w-full rounded-lg bg-gigit-blue py-2 text-sm font-semibold text-white hover:bg-gigit-navy transition-colors cursor-pointer"
          >
            Terapkan
          </button>
        </PopoverContent>
      </Popover>

      {/* ── Lokasi ── */}
      <Popover>
        <PopoverTrigger
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium",
            "transition-colors duration-200 cursor-pointer",
            filters.locations?.length
              ? "border-gigit-accent bg-gigit-accent-tint text-gigit-accent-dark"
              : "border-gigit-ice bg-white text-foreground/80 hover:border-gigit-accent-light hover:bg-gigit-off-white"
          )}
        >
          <MapPin className="size-4" />
          Lokasi
          {filters.locations?.length ? (
            <span className="ml-0.5 rounded-full bg-gigit-blue px-1.5 text-xs text-white">
              {filters.locations.length}
            </span>
          ) : null}
          <ChevronDown className="size-3.5 opacity-60" />
        </PopoverTrigger>
        <PopoverContent align="start" className="z-30 w-56 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gigit-text-secondary/70 mb-2">
            Lokasi
          </p>
          <div className="max-h-48 overflow-y-auto scrollbar-thin space-y-1">
            {locations.map((loc) => {
              const isChecked = filters.locations?.includes(loc) ?? false;
              return (
                <label
                  key={loc}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gigit-off-white cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleLocation(loc)}
                    className="size-4 rounded border-gigit-ice text-gigit-blue focus:ring-gigit-blue/30 cursor-pointer"
                  />
                  <span>{loc}</span>
                </label>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* ── Rating ── */}
      <Popover>
        <PopoverTrigger
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium",
            "transition-colors duration-200 cursor-pointer",
            filters.minRating !== undefined
              ? "border-gigit-accent bg-gigit-accent-tint text-gigit-accent-dark"
              : "border-gigit-ice bg-white text-foreground/80 hover:border-gigit-accent-light hover:bg-gigit-off-white"
          )}
        >
          <Star className="size-4" />
          Rating
          <ChevronDown className="size-3.5 opacity-60" />
        </PopoverTrigger>
        <PopoverContent align="start" className="z-30 w-48 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gigit-text-secondary/70 mb-2">
            Rating Minimum
          </p>
          <div className="space-y-1">
            {[4.5, 4.0, 3.5, 3.0].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setRating(rating)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm",
                  "transition-colors duration-150 cursor-pointer",
                  filters.minRating === rating
                    ? "bg-amber-50 text-amber-700 font-medium"
                    : "hover:bg-gigit-off-white text-foreground/80"
                )}
              >
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-3.5",
                        i < Math.floor(rating)
                          ? "fill-amber-400 text-amber-400"
                          : i < rating
                            ? "fill-amber-400/50 text-amber-400"
                            : "text-gray-200"
                      )}
                    />
                  ))}
                </div>
                <span>≥ {rating}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
