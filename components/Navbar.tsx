"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Bell, Menu, X, ChevronDown, User, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/SearchBar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NavbarVariant = "homepage" | "explore";

type NavbarProps = {
  variant?: NavbarVariant;
  /** Current search query (for explore compact search bar). */
  searchQuery?: string;
};

// ---------------------------------------------------------------------------
// Mock auth state — toggle to show logged-in vs guest UI
// ---------------------------------------------------------------------------

const MOCK_LOGGED_IN = false; // flip to true to demo the logged-in state

const mockUser = {
  name: "Gibran",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
};

// ---------------------------------------------------------------------------
// Navigation links
// ---------------------------------------------------------------------------

const navLinks = [
  { label: "Jelajahi", href: "/explore" },
  { label: "Kategori", href: "/explore" },
  { label: "Cara Kerja", href: "#" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Navbar({ variant = "homepage", searchQuery = "" }: NavbarProps) {
  const searchParams = useSearchParams();
  const theme = searchParams.get("theme");
  const themeParam = theme ? `?theme=${theme}` : "";

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Scroll listener for subtle shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on click outside
  const closeMenus = useCallback(() => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    if (userMenuOpen || mobileMenuOpen) {
      document.addEventListener("click", closeMenus);
      return () => document.removeEventListener("click", closeMenus);
    }
  }, [userMenuOpen, mobileMenuOpen, closeMenus]);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 bg-gigit-navy transition-shadow duration-300",
        scrolled && "shadow-lg shadow-gigit-navy/30"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* ── Left: Logo + Nav Links ── */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href={`/${themeParam}`} className="flex items-center gap-1 shrink-0">
            <span className="text-2xl font-bold tracking-tight font-heading">
              <span className="text-white">GIG</span>
              <span className="text-gigit-accent">IT</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={`${link.href}${themeParam}`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gigit-navy-muted hover:text-white hover:bg-white/5 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Center: Compact search (explore variant only) ── */}
        {variant === "explore" && (
          <div className="flex-1 max-w-xl mx-2 sm:mx-0">
            <SearchBar
              enableAutocomplete={true}
              showSuggestions={false}
              defaultQuery={searchQuery}
              placeholder="Cari layanan..."
              className="[&_input]:h-10 [&_input]:md:h-10 [&_input]:text-sm [&_button]:py-1.5 [&_button]:px-3 [&_button]:md:py-1.5 [&_button]:md:px-3"
            />
          </div>
        )}

        {/* ── Right: Auth / Actions ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme switcher — subtle, always visible on desktop */}
          <div className="hidden lg:flex items-center gap-1 mr-1">
            <Link
              href={`/${themeParam === "?theme=b" ? "" : ""}`}
              className={cn(
                "rounded-md px-2 py-1 text-xs font-medium transition-colors duration-200",
                !theme
                  ? "bg-white/10 text-white"
                  : "text-gigit-navy-muted hover:text-white"
              )}
            >
              A
            </Link>
            <Link
              href="/?theme=b"
              className={cn(
                "rounded-md px-2 py-1 text-xs font-medium transition-colors duration-200",
                theme === "b"
                  ? "bg-white/10 text-white"
                  : "text-gigit-navy-muted hover:text-white"
              )}
            >
              B
            </Link>
          </div>

          {MOCK_LOGGED_IN ? (
            /* ─── Logged-in state ─── */
            <>
              {/* Notification bell */}
              <button
                type="button"
                className="relative rounded-lg p-2 text-gigit-navy-muted hover:text-white hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="size-5" />
                {/* Red dot */}
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-gigit-navy" />
              </button>

              {/* User avatar dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <Avatar className="size-8 avatar-square">
                    <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
                    <AvatarFallback className="text-xs font-semibold bg-gigit-accent-tint text-gigit-accent-dark">
                      {mockUser.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className={cn(
                    "size-3.5 text-gigit-navy-muted transition-transform duration-200",
                    userMenuOpen && "rotate-180"
                  )} />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-gigit-ice bg-white p-1.5 shadow-xl shadow-gigit-navy/10 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-gigit-ice mb-1">
                      <p className="text-sm font-semibold text-foreground">{mockUser.name}</p>
                      <p className="text-xs text-gigit-text-secondary">Freelancer</p>
                    </div>
                    <Link href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-gigit-off-white transition-colors duration-150 cursor-pointer">
                      <User className="size-4 text-gigit-text-secondary" />
                      Profil Saya
                    </Link>
                    <Link href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-gigit-off-white transition-colors duration-150 cursor-pointer">
                      <Settings className="size-4 text-gigit-text-secondary" />
                      Pengaturan
                    </Link>
                    <div className="border-t border-gigit-ice mt-1 pt-1">
                      <button type="button" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 cursor-pointer">
                        <LogOut className="size-4" />
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* ─── Guest state ─── */
            <>
              <Link
                href={`/login${themeParam}`}
                className="hidden sm:inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gigit-navy-muted hover:text-white transition-colors duration-200"
              >
                Masuk
              </Link>
              <Link
                href={`/login${themeParam}`}
                className="hidden sm:flex items-center rounded-xl bg-gigit-blue px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gigit-accent cursor-pointer"
              >
                Daftar Jadi Mitra
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden rounded-lg p-2 text-gigit-navy-muted hover:text-white hover:bg-white/5 transition-colors duration-200 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Menu ─── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-gigit-navy animate-in slide-in-from-top-2 duration-200">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={`${link.href}${themeParam}`}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gigit-navy-muted hover:text-white hover:bg-white/5 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}


            {/* Theme switcher mobile */}
            <div className="flex items-center gap-2 pt-3 border-t border-white/10 mt-3">
              <span className="text-xs text-gigit-navy-muted">Theme:</span>
              <Link
                href="/"
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-medium transition-colors duration-200",
                  !theme ? "bg-white/10 text-white" : "text-gigit-navy-muted hover:text-white"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Version A
              </Link>
              <Link
                href="/?theme=b"
                className={cn(
                  "rounded-md px-2 py-1 text-xs font-medium transition-colors duration-200",
                  theme === "b" ? "bg-white/10 text-white" : "text-gigit-navy-muted hover:text-white"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Version B
              </Link>
            </div>

            {/* Guest mobile auth */}
            {!MOCK_LOGGED_IN && (
              <div className="flex gap-2 pt-3 border-t border-white/10 mt-3">
                <Link
                  href={`/login${themeParam}`}
                  className="flex-1 rounded-lg border border-white/20 px-3 py-2 text-center text-sm font-medium text-white hover:bg-white/5 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href={`/login${themeParam}`}
                  className="flex-1 rounded-lg bg-gigit-blue px-3 py-2 text-center text-sm font-semibold text-white hover:bg-gigit-accent transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
