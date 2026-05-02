import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { 
  ChevronLeft, 
  MapPin, 
  Clock3, 
  Star, 
  Share2, 
  Heart,
  CheckCircle2,
  ShieldCheck,
  CalendarDays
} from "lucide-react";

import { jobs } from "@/lib/data";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = jobs.find((j) => j.id === id);
  if (!job) return { title: "Job Not Found" };
  return { title: `${job.title} | Gigit` };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    notFound();
  }

  // Dummy inclusions
  const inclusions = [
    "Konsultasi awal gratis",
    "Peralatan lengkap disediakan",
    "Jaminan kepuasan 100%",
    "Revisi atau garansi layanan"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gigit-off-white">
      <Suspense fallback={<div className="h-16 bg-gigit-navy" />}>
        <Navbar variant="explore" />
      </Suspense>

      <main className="flex-1 pb-16">
        {/* Cover Image Header */}
        <div className="w-full h-[30vh] sm:h-[40vh] relative bg-gigit-navy">
          <Image
            src={job.coverImageUrl}
            alt={job.title}
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gigit-navy/90 via-transparent to-transparent" />
          
          <div className="absolute top-6 left-4 sm:left-6 lg:left-8 z-10">
            <Link 
              href="/explore" 
              className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="size-4" />
              Kembali
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Content Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Main Title Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gigit-ice">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {job.tags.map(tag => (
                    <Badge key={tag} className="bg-gigit-accent-tint text-gigit-accent-dark hover:bg-gigit-accent-tint border-0">
                      {tag}
                    </Badge>
                  ))}
                  {job.isTopMatch && (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">
                      Top Match
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground mb-4">
                  {job.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gigit-text-secondary">
                  <span className="flex items-center gap-2">
                    <Star className="size-4 text-amber-400 fill-current" />
                    <span className="font-medium text-foreground">{job.rating.toFixed(1)}</span>
                    <span>({job.reviewCount} ulasan)</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock3 className="size-4" />
                    {job.duration}
                  </span>
                </div>
              </div>

              {/* Description & Details */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gigit-ice space-y-8">
                <section>
                  <h2 className="text-xl font-bold font-heading mb-4 text-foreground">Deskripsi Layanan</h2>
                  <p className="text-gigit-text-secondary leading-relaxed whitespace-pre-wrap">
                    {job.description}
                    {"\n\n"}Layanan ini dirancang khusus untuk memberikan pengalaman terbaik dengan standar profesionalisme tinggi. Kami memastikan setiap detail diperhatikan untuk memenuhi ekspektasi Anda.
                  </p>
                </section>

                <hr className="border-gigit-ice" />

                <section>
                  <h2 className="text-xl font-bold font-heading mb-4 text-foreground">Apa yang Anda Dapatkan</h2>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gigit-text-secondary">
                        <CheckCircle2 className="size-5 text-gigit-accent shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Provider Mini Profile */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gigit-ice">
                <h2 className="text-xl font-bold font-heading mb-6 text-foreground">Profil Penyedia Layanan</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar className="size-16 avatar-square border border-gigit-ice">
                    <AvatarImage src={job.providerAvatarUrl} alt={job.providerName} />
                    <AvatarFallback className="text-xl">{job.providerName.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">{job.providerName}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gigit-text-secondary">
                      <span className="flex items-center gap-1">
                        <Star className="size-4 text-amber-400 fill-current" />
                        {job.rating.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="size-4 text-emerald-500" />
                        Terverifikasi
                      </span>
                    </div>
                  </div>
                  <Link 
                    href={`/freelancer/${job.providerName.toLowerCase().replace(/\s+/g, '-')}`} // Using a dummy ID logic for demo
                    className="w-full sm:w-auto mt-4 sm:mt-0 rounded-xl border border-gigit-ice bg-white px-4 py-2 text-sm font-semibold text-gigit-navy hover:bg-gigit-off-white transition-colors text-center cursor-pointer"
                  >
                    Lihat Profil
                  </Link>
                </div>
              </div>

            </div>

            {/* Right Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-xl shadow-gigit-navy/5 border border-gigit-ice overflow-hidden">
                <div className="p-6">
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gigit-text-secondary mb-1">Mulai dari</p>
                    <h2 className="text-3xl font-bold font-heading text-gigit-navy">{job.priceLabel.split(' / ')[0]}</h2>
                    <p className="text-sm text-gigit-text-secondary mt-1">per {job.priceLabel.split(' / ')[1]}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gigit-text-secondary flex items-center gap-2"><CalendarDays className="size-4" /> Estimasi Pengerjaan</span>
                      <span className="font-medium text-foreground">{job.duration}</span>
                    </div>
                  </div>

                  <button className="w-full rounded-xl bg-gigit-blue px-4 py-3.5 text-sm font-semibold text-white shadow-md transition-colors duration-200 hover:bg-gigit-accent cursor-pointer mb-3 flex items-center justify-center gap-2">
                    Pesan Layanan
                  </button>
                  <button className="w-full rounded-xl border border-gigit-ice bg-white px-4 py-3 text-sm font-semibold text-gigit-navy transition-colors duration-200 hover:bg-gigit-off-white cursor-pointer flex items-center justify-center gap-2">
                    Tanya Penjual
                  </button>
                </div>
                
                <div className="bg-gigit-off-white px-6 py-4 border-t border-gigit-ice flex items-center justify-between text-sm text-gigit-text-secondary">
                  <button className="flex items-center gap-1.5 hover:text-gigit-navy transition-colors">
                    <Heart className="size-4" /> Simpan
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-gigit-navy transition-colors">
                    <Share2 className="size-4" /> Bagikan
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
