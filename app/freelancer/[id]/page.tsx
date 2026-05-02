import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { 
  ChevronLeft, 
  MapPin, 
  Star, 
  Share2, 
  MessageSquare,
  Briefcase,
  Trophy
} from "lucide-react";

import { freelancers, jobs } from "@/lib/data";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JobCard } from "@/components/JobCard";
import { FloatingReelsTrigger } from "@/components/FloatingReelsTrigger";

interface FreelancerProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: FreelancerProfilePageProps) {
  const { id } = await params;
  const freelancer = freelancers.find((f) => f.id === id) || freelancers.find(f => f.name.toLowerCase().replace(/\s+/g, '-') === id);
  if (!freelancer) return { title: "Freelancer Not Found" };
  return { title: `${freelancer.name} | Gigit` };
}

export default async function FreelancerProfilePage({ params }: FreelancerProfilePageProps) {
  const { id } = await params;
  
  // Find freelancer by ID or by name slug (from JobCard dummy link)
  const freelancer = freelancers.find((f) => f.id === id) || freelancers.find(f => f.name.toLowerCase().replace(/\s+/g, '-') === id);

  if (!freelancer) {
    notFound();
  }

  // Find jobs that belong to this freelancer
  let freelancerJobs = jobs.filter(j => j.providerName === freelancer.name);
  
  // For demo: if no matching jobs, just take 3 random jobs to make the page look good
  if (freelancerJobs.length === 0) {
    freelancerJobs = jobs.slice(0, 3);
  }

  // Generate a random background image for cover
  const coverImage = `https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop&seed=${freelancer.id}`;

  return (
    <div className="flex flex-col min-h-screen bg-gigit-off-white">
      <Suspense fallback={<div className="h-16 bg-gigit-navy" />}>
        <Navbar variant="explore" />
      </Suspense>

      <main className="flex-1 pb-16">
        {/* Cover Image Header */}
        <div className="w-full h-[25vh] sm:h-[30vh] relative bg-gigit-navy">
          <Image
            src={coverImage}
            alt="Cover"
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gigit-navy/80 via-transparent to-transparent" />
          
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
            
            {/* Left Column: Profile Info (Overlapping Cover) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gigit-ice overflow-hidden p-6 sm:p-8 flex flex-col items-center text-center">
                
                <Avatar className="size-28 sm:size-32 border-4 border-white shadow-md avatar-square mb-4">
                  <AvatarImage src={freelancer.avatarUrl} alt={freelancer.name} />
                  <AvatarFallback className="text-3xl">{freelancer.name.slice(0, 1)}</AvatarFallback>
                </Avatar>

                {freelancer.isFeatured && (
                  <Badge className="bg-gigit-accent text-white border-0 shadow-sm mb-3">
                    Top Freelancer
                  </Badge>
                )}

                <h1 className="text-2xl font-bold font-heading text-foreground mb-1">
                  {freelancer.name}
                </h1>
                <p className="text-gigit-text-secondary mb-4">{freelancer.role}</p>

                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm mb-6">
                  <span className="flex items-center gap-1.5 text-foreground font-medium">
                    <Star className="size-4 text-amber-400 fill-current" />
                    {freelancer.rating.toFixed(1)} 
                    <span className="text-gigit-text-secondary font-normal">({freelancer.reviewCount} ulasan)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-gigit-text-secondary">
                    <MapPin className="size-4" />
                    {freelancer.location}
                  </span>
                </div>

                <div className="w-full space-y-3">
                  <button className="w-full rounded-xl bg-gigit-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-gigit-accent cursor-pointer flex items-center justify-center gap-2">
                    <MessageSquare className="size-4" /> Hubungi
                  </button>
                  <button className="w-full rounded-xl border border-gigit-ice bg-white px-4 py-2.5 text-sm font-semibold text-gigit-navy transition-colors duration-200 hover:bg-gigit-off-white cursor-pointer flex items-center justify-center gap-2">
                    <Share2 className="size-4" /> Bagikan Profil
                  </button>
                </div>

                <hr className="w-full border-gigit-ice my-6" />

                {/* Stats */}
                <div className="w-full grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-xs text-gigit-text-secondary mb-1 flex items-center gap-1">
                      <Briefcase className="size-3" /> Job Selesai
                    </p>
                    <p className="font-semibold text-foreground">150+</p>
                  </div>
                  <div>
                    <p className="text-xs text-gigit-text-secondary mb-1 flex items-center gap-1">
                      <Trophy className="size-3" /> Rate
                    </p>
                    <p className="font-semibold text-foreground">{freelancer.hourlyRate}</p>
                  </div>
                </div>

                <hr className="w-full border-gigit-ice my-6" />

                {/* Skills/Tags */}
                <div className="w-full text-left">
                  <h3 className="text-sm font-bold font-heading text-foreground mb-3">Keahlian</h3>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.tags.map(tag => (
                      <span key={tag} className="rounded-full bg-gigit-off-white border border-gigit-ice px-3 py-1 text-xs font-medium text-gigit-text-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Bio & Services List */}
            <div className="lg:col-span-2">
              {/* Bio Section */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gigit-ice mb-8">
                <h2 className="text-xl font-bold font-heading mb-4 text-foreground">Tentang Saya</h2>
                <p className="text-gigit-text-secondary leading-relaxed whitespace-pre-wrap">
                  Halo, saya {freelancer.name}. Saya memiliki pengalaman lebih dari 5 tahun di bidang {freelancer.role}. Saya sangat berdedikasi untuk memberikan hasil kerja terbaik yang memenuhi kebutuhan dan ekspektasi klien saya.
                  {"\n\n"}
                  Selama karir saya, saya telah menangani berbagai macam proyek dari klien lokal maupun internasional dengan tingkat kepuasan yang tinggi. Mari bekerja sama untuk mewujudkan proyek Anda!
                </p>
              </div>

              {/* Services Offered */}
              <div>
                <h2 className="text-xl font-bold font-heading mb-6 text-foreground flex items-center gap-2">
                  Layanan yang Ditawarkan
                  <Badge className="bg-gigit-navy text-white rounded-full px-2">{freelancerJobs.length}</Badge>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {freelancerJobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
      <FloatingReelsTrigger />
    </div>
  );
}
