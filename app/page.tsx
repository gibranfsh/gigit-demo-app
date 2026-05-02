"use client";

import { useState, Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { JobCard } from "@/components/JobCard";
import { FreelancerCard } from "@/components/FreelancerCard";
import { CategoryPill } from "@/components/CategoryPill";
import { HeroCarousel } from "@/components/HeroCarousel";
import {
  jobs,
  freelancers,
  categories,
} from "@/lib/data";
import { ArrowRight, TrendingUp, Users, Briefcase } from "lucide-react";

function HomeContent() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const featuredFreelancers = freelancers.filter((fl) => fl.isFeatured);
  const recommendedJobs = jobs.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── Shared Navbar (Phase 14) ─── */}
      <Navbar variant="homepage" />

      {/* ─── Hero Section — Dark navy card with SVG geo, per client ref ─── */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="relative mx-auto max-w-7xl rounded-2xl bg-gigit-navy">
          {/* Background container with overflow hidden to clip the SVG but not the search dropdown */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            {/* Geometric SVG background — exactly matching client .hero-geo */}
            <svg
              className="absolute right-[-16px] top-[-16px] opacity-10"
              width="180"
              height="180"
              viewBox="0 0 180 180"
              aria-hidden="true"
            >
              <rect x="20" y="20" width="140" height="140" rx="8" fill="none" stroke="#fff" strokeWidth="1.2" />
              <rect x="50" y="50" width="80" height="80" rx="4" fill="none" stroke="#fff" strokeWidth="0.8" />
              <line x1="20" y1="90" x2="160" y2="90" stroke="#fff" strokeWidth="0.7" />
              <line x1="90" y1="20" x2="90" y2="160" stroke="#fff" strokeWidth="0.7" />
              <circle cx="90" cy="90" r="20" fill="#fff" fillOpacity="0.15" />
            </svg>
          </div>

          <div className="relative z-20 px-6 py-14 sm:px-10 sm:py-18 lg:py-22 text-center">
            <h2 className="text-3xl font-bold font-heading text-white sm:text-4xl lg:text-5xl leading-tight">
              Temukan{" "}
              <span className="text-gigit-accent">Jasa Terbaik</span>
              <br />
              di Sekitar Anda
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gigit-navy-muted max-w-xl mx-auto">
              Cari dan temukan freelancer, coach, tutor, dan penyedia jasa profesional lainnya.
            </p>

            {/* Search Bar — navigates to /explore on submit */}
            <div className="mt-8 sm:mt-10">
              <SearchBar enableAutocomplete={true} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Content: Explore View ─── */}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        {/* ─── Featured Carousel (Phase 15) ─── */}
        <HeroCarousel />

        <div className="space-y-14 mt-10">
            {/* Trending Categories */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-gigit-accent" />
                  <h3 className="text-lg font-semibold font-heading text-foreground">
                    Kategori Trending
                  </h3>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {categories.map((cat) => (
                  <CategoryPill
                    key={cat.id}
                    category={cat}
                    isActive={activeCategory === cat.id}
                    onClick={() =>
                      setActiveCategory(
                        activeCategory === cat.id ? null : cat.id
                      )
                    }
                  />
                ))}
              </div>
            </section>

            {/* Recommended Jobs */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Briefcase className="size-5 text-gigit-accent" />
                  <h3 className="text-lg font-semibold font-heading text-foreground">
                    Rekomendasi untuk Anda
                  </h3>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-medium text-gigit-blue hover:text-gigit-navy transition-colors duration-200 cursor-pointer"
                >
                  Lihat Semua
                  <ArrowRight className="size-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>

            {/* Featured Freelancers */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-gigit-accent" />
                  <h3 className="text-lg font-semibold font-heading text-foreground">
                    Freelancer Unggulan
                  </h3>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-medium text-gigit-blue hover:text-gigit-navy transition-colors duration-200 cursor-pointer"
                >
                  Lihat Semua
                  <ArrowRight className="size-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featuredFreelancers.map((fl) => (
                  <FreelancerCard key={fl.id} freelancer={fl} />
                ))}
              </div>
            </section>

            {/* All Jobs Grid */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold font-heading text-foreground">
                  Jelajahi Semua Layanan
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>
          </div>
      </main>

      {/* ─── Shared Fat Footer (Phase 13) ─── */}
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gigit-navy" />}>
      <HomeContent />
    </Suspense>
  );
}
