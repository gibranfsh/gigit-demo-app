// =============================================================================
// Gigit Demo — Mock Data & TypeScript Interfaces
// =============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Job {
  id: string;
  title: string;
  description: string;
  price: number; // in IDR (Rupiah)
  priceLabel: string; // e.g. "Rp 500.000 / jam"
  location: string;
  duration: string;
  coverImageUrl: string;
  tags: string[];
  providerName: string;
  providerAvatarUrl: string;
  rating: number; // 1-5
  reviewCount: number;
  isNew?: boolean;
  isTopMatch?: boolean;
}

export interface Freelancer {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  location: string;
  hourlyRate: string;
  tags: string[];
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  jobCount: number;
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const categories: Category[] = [
  { id: "cat-1", name: "Olahraga & Fitness", icon: "dumbbell", jobCount: 342 },
  { id: "cat-2", name: "Fotografi", icon: "camera", jobCount: 218 },
  { id: "cat-3", name: "Pendidikan", icon: "graduation-cap", jobCount: 567 },
  { id: "cat-4", name: "Kecantikan", icon: "scissors", jobCount: 189 },
  { id: "cat-5", name: "Desain & Kreatif", icon: "palette", jobCount: 423 },
  { id: "cat-6", name: "Teknologi", icon: "code", jobCount: 651 },
  { id: "cat-7", name: "Musik", icon: "music", jobCount: 134 },
  { id: "cat-8", name: "Kesehatan", icon: "heart-pulse", jobCount: 276 },
  { id: "cat-9", name: "Kuliner", icon: "chef-hat", jobCount: 198 },
  { id: "cat-10", name: "Otomotif", icon: "car", jobCount: 87 },
];

// ---------------------------------------------------------------------------
// Jobs (Services) — covers all PRD example queries + extras
// ---------------------------------------------------------------------------

export const jobs: Job[] = [
  // ---- PRD Query: "Coach padel 500k 1 jam BSD" ----
  {
    id: "job-1",
    title: "Coach Padel Privat",
    description:
      "Pelatihan padel privat untuk semua level. Termasuk peralatan dan lapangan.",
    price: 500000,
    priceLabel: "Rp 500.000 / jam",
    location: "BSD, Tangerang Selatan",
    duration: "1 jam",
    coverImageUrl: "https://picsum.photos/seed/padel-court/600/400",
    tags: ["Padel", "Olahraga", "Privat"],
    providerName: "Rizky Pratama",
    providerAvatarUrl: "https://i.pravatar.cc/150?u=rizky-padel",
    rating: 4.9,
    reviewCount: 87,
    isTopMatch: true,
  },
  // ---- PRD Query: "Personal trainer 300k Jakarta Selatan" ----
  {
    id: "job-2",
    title: "Personal Trainer",
    description:
      "Program latihan personal disesuaikan dengan tujuan fitness Anda. Home visit atau gym.",
    price: 300000,
    priceLabel: "Rp 300.000 / sesi",
    location: "Jakarta Selatan",
    duration: "1 jam",
    coverImageUrl: "https://picsum.photos/seed/personal-trainer/600/400",
    tags: ["Fitness", "Personal Trainer", "Home Visit"],
    providerName: "Andi Saputra",
    providerAvatarUrl: "https://i.pravatar.cc/150?u=andi-trainer",
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
  },
  // ---- PRD Query: "Private yoga class 1 juta Bali" ----
  {
    id: "job-3",
    title: "Private Yoga Class",
    description:
      "Sesi yoga privat di villa atau pantai. Hatha, Vinyasa, dan Yin yoga tersedia.",
    price: 1000000,
    priceLabel: "Rp 1.000.000 / sesi",
    location: "Bali",
    duration: "1.5 jam",
    coverImageUrl: "https://picsum.photos/seed/yoga-bali/600/400",
    tags: ["Yoga", "Wellness", "Privat"],
    providerName: "Made Suryani",
    providerAvatarUrl: "https://i.pravatar.cc/150?u=made-yoga",
    rating: 5.0,
    reviewCount: 56,
    isTopMatch: true,
  },
  // ---- PRD Query: "Photographer prewedding 5 juta Bandung" ----
  {
    id: "job-4",
    title: "Photographer Prewedding",
    description:
      "Paket foto prewedding outdoor/indoor di Bandung. Termasuk editing & 50 foto.",
    price: 5000000,
    priceLabel: "Rp 5.000.000 / paket",
    location: "Bandung",
    duration: "4 jam",
    coverImageUrl: "https://picsum.photos/seed/prewedding/600/400",
    tags: ["Fotografi", "Prewedding", "Outdoor"],
    providerName: "Dian Kusumo",
    providerAvatarUrl: "https://i.pravatar.cc/150?u=dian-photo",
    rating: 4.7,
    reviewCount: 203,
  },
  // ---- PRD Query: "Math tutor SMA 150k per session" ----
  {
    id: "job-5",
    title: "Math Tutor SMA",
    description:
      "Les matematika SMA untuk persiapan ujian, UTBK, dan olimpiade. Online & offline.",
    price: 150000,
    priceLabel: "Rp 150.000 / sesi",
    location: "Online / Jabodetabek",
    duration: "1.5 jam",
    coverImageUrl: "https://picsum.photos/seed/math-tutor/600/400",
    tags: ["Pendidikan", "Matematika", "SMA"],
    providerName: "Siti Rahma",
    providerAvatarUrl: "https://i.pravatar.cc/150?u=siti-tutor",
    rating: 4.9,
    reviewCount: 312,
    isNew: true,
  },
  // ---- PRD Query: "Barber home service 100k Jakarta" ----
  {
    id: "job-6",
    title: "Barber Home Service",
    description:
      "Potong rambut pria profesional ke rumah Anda. Termasuk styling & grooming.",
    price: 100000,
    priceLabel: "Rp 100.000 / sesi",
    location: "Jakarta",
    duration: "45 menit",
    coverImageUrl: "https://picsum.photos/seed/barber-shop/600/400",
    tags: ["Kecantikan", "Barber", "Home Service"],
    providerName: "Fajar Hidayat",
    providerAvatarUrl: "https://i.pravatar.cc/150?u=fajar-barber",
    rating: 4.6,
    reviewCount: 89,
  },

  // ---- Additional jobs for a richer Explore page ----
  {
    id: "job-7",
    title: "Guru Piano Privat",
    description:
      "Belajar piano dari dasar hingga mahir. Cocok untuk anak-anak & dewasa.",
    price: 250000,
    priceLabel: "Rp 250.000 / sesi",
    location: "Jakarta Barat",
    duration: "1 jam",
    coverImageUrl: "https://picsum.photos/seed/piano-lesson/600/400",
    tags: ["Musik", "Piano", "Privat"],
    providerName: "Kevin Wijaya",
    providerAvatarUrl: "https://i.pravatar.cc/150?u=kevin-piano",
    rating: 4.8,
    reviewCount: 67,
  },
  {
    id: "job-8",
    title: "UI/UX Designer Freelance",
    description:
      "Desain UI/UX untuk aplikasi mobile & web. Figma, prototyping, dan user research.",
    price: 2000000,
    priceLabel: "Rp 2.000.000 / project",
    location: "Remote",
    duration: "Per project",
    coverImageUrl: "https://picsum.photos/seed/uiux-design/600/400",
    tags: ["Desain", "UI/UX", "Remote"],
    providerName: "Putri Ayu",
    providerAvatarUrl: "https://i.pravatar.cc/150?u=putri-design",
    rating: 4.9,
    reviewCount: 145,
    isTopMatch: true,
  },
  {
    id: "job-9",
    title: "Jasa Makeup Artist",
    description:
      "Makeup profesional untuk acara spesial, wisuda, dan pemotretan.",
    price: 750000,
    priceLabel: "Rp 750.000 / sesi",
    location: "Surabaya",
    duration: "2 jam",
    coverImageUrl: "https://picsum.photos/seed/makeup-artist/600/400",
    tags: ["Kecantikan", "Makeup", "Event"],
    providerName: "Anisa Dewi",
    providerAvatarUrl: "https://i.pravatar.cc/150?u=anisa-mua",
    rating: 4.7,
    reviewCount: 178,
  },
  {
    id: "job-10",
    title: "Web Developer Fullstack",
    description:
      "Pembuatan website custom dengan Next.js, React, dan Node.js.",
    price: 5000000,
    priceLabel: "Rp 5.000.000 / project",
    location: "Remote",
    duration: "Per project",
    coverImageUrl: "https://picsum.photos/seed/web-developer/600/400",
    tags: ["Teknologi", "Web", "Fullstack"],
    providerName: "Budi Santoso",
    providerAvatarUrl: "https://i.pravatar.cc/150?u=budi-dev",
    rating: 4.8,
    reviewCount: 92,
    isNew: true,
  },
  {
    id: "job-11",
    title: "Chef Privat untuk Event",
    description:
      "Jasa chef pribadi untuk dinner party, arisan, dan acara keluarga.",
    price: 1500000,
    priceLabel: "Rp 1.500.000 / event",
    location: "Jakarta",
    duration: "3-4 jam",
    coverImageUrl: "https://picsum.photos/seed/private-chef/600/400",
    tags: ["Kuliner", "Chef", "Event"],
    providerName: "Bambang Eko",
    providerAvatarUrl: "https://i.pravatar.cc/150?u=bambang-chef",
    rating: 4.9,
    reviewCount: 43,
  },
  {
    id: "job-12",
    title: "Detailing Mobil Premium",
    description:
      "Cuci & poles mobil premium home service. Paint correction & coating tersedia.",
    price: 350000,
    priceLabel: "Rp 350.000 / sesi",
    location: "Jakarta Selatan",
    duration: "2-3 jam",
    coverImageUrl: "https://picsum.photos/seed/car-detailing/600/400",
    tags: ["Otomotif", "Detailing", "Home Service"],
    providerName: "Rendi Kurniawan",
    providerAvatarUrl: "https://i.pravatar.cc/150?u=rendi-detail",
    rating: 4.5,
    reviewCount: 65,
  },
];

// ---------------------------------------------------------------------------
// Freelancers
// ---------------------------------------------------------------------------

export const freelancers: Freelancer[] = [
  {
    id: "fl-1",
    name: "Rizky Pratama",
    role: "Padel Coach",
    avatarUrl: "https://i.pravatar.cc/150?u=rizky-padel",
    rating: 4.9,
    reviewCount: 87,
    location: "BSD, Tangerang Selatan",
    hourlyRate: "Rp 500.000/jam",
    tags: ["Padel", "Olahraga"],
    isFeatured: true,
  },
  {
    id: "fl-2",
    name: "Andi Saputra",
    role: "Personal Trainer",
    avatarUrl: "https://i.pravatar.cc/150?u=andi-trainer",
    rating: 4.8,
    reviewCount: 124,
    location: "Jakarta Selatan",
    hourlyRate: "Rp 300.000/sesi",
    tags: ["Fitness", "Home Visit"],
  },
  {
    id: "fl-3",
    name: "Made Suryani",
    role: "Yoga Instructor",
    avatarUrl: "https://i.pravatar.cc/150?u=made-yoga",
    rating: 5.0,
    reviewCount: 56,
    location: "Bali",
    hourlyRate: "Rp 1.000.000/sesi",
    tags: ["Yoga", "Wellness"],
    isFeatured: true,
  },
  {
    id: "fl-4",
    name: "Dian Kusumo",
    role: "Photographer",
    avatarUrl: "https://i.pravatar.cc/150?u=dian-photo",
    rating: 4.7,
    reviewCount: 203,
    location: "Bandung",
    hourlyRate: "Rp 5.000.000/paket",
    tags: ["Fotografi", "Prewedding"],
    isFeatured: true,
  },
  {
    id: "fl-5",
    name: "Siti Rahma",
    role: "Math Tutor",
    avatarUrl: "https://i.pravatar.cc/150?u=siti-tutor",
    rating: 4.9,
    reviewCount: 312,
    location: "Online / Jabodetabek",
    hourlyRate: "Rp 150.000/sesi",
    tags: ["Pendidikan", "Matematika"],
  },
  {
    id: "fl-6",
    name: "Fajar Hidayat",
    role: "Barber",
    avatarUrl: "https://i.pravatar.cc/150?u=fajar-barber",
    rating: 4.6,
    reviewCount: 89,
    location: "Jakarta",
    hourlyRate: "Rp 100.000/sesi",
    tags: ["Kecantikan", "Barber"],
  },
  {
    id: "fl-7",
    name: "Putri Ayu",
    role: "UI/UX Designer",
    avatarUrl: "https://i.pravatar.cc/150?u=putri-design",
    rating: 4.9,
    reviewCount: 145,
    location: "Remote",
    hourlyRate: "Rp 2.000.000/project",
    tags: ["Desain", "UI/UX"],
    isFeatured: true,
  },
  {
    id: "fl-8",
    name: "Kevin Wijaya",
    role: "Piano Teacher",
    avatarUrl: "https://i.pravatar.cc/150?u=kevin-piano",
    rating: 4.8,
    reviewCount: 67,
    location: "Jakarta Barat",
    hourlyRate: "Rp 250.000/sesi",
    tags: ["Musik", "Piano"],
  },
  {
    id: "fl-9",
    name: "Anisa Dewi",
    role: "Makeup Artist",
    avatarUrl: "https://i.pravatar.cc/150?u=anisa-mua",
    rating: 4.7,
    reviewCount: 178,
    location: "Surabaya",
    hourlyRate: "Rp 750.000/sesi",
    tags: ["Kecantikan", "Makeup"],
  },
  {
    id: "fl-10",
    name: "Budi Santoso",
    role: "Fullstack Developer",
    avatarUrl: "https://i.pravatar.cc/150?u=budi-dev",
    rating: 4.8,
    reviewCount: 92,
    location: "Remote",
    hourlyRate: "Rp 5.000.000/project",
    tags: ["Teknologi", "Web"],
    isFeatured: true,
  },
];

// ---------------------------------------------------------------------------
// Search helper — simple keyword-based filtering
// ---------------------------------------------------------------------------

export function searchData(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return { jobs: [], freelancers: [] };

  const tokens = q.split(/\s+/);

  const matchesTokens = (text: string) => {
    const lower = text.toLowerCase();
    return tokens.some((token) => lower.includes(token));
  };

  const filteredJobs = jobs.filter(
    (job) =>
      matchesTokens(job.title) ||
      matchesTokens(job.description) ||
      matchesTokens(job.location) ||
      matchesTokens(job.priceLabel) ||
      matchesTokens(job.duration) ||
      job.tags.some((tag) => matchesTokens(tag))
  );

  const filteredFreelancers = freelancers.filter(
    (fl) =>
      matchesTokens(fl.name) ||
      matchesTokens(fl.role) ||
      matchesTokens(fl.location) ||
      fl.tags.some((tag) => matchesTokens(tag))
  );

  return { jobs: filteredJobs, freelancers: filteredFreelancers };
}
