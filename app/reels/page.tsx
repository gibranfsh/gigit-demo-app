"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { X, Heart, MessageCircle, Share2, MoreHorizontal, ExternalLink, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";

// --- Dummy Reels Data ---
const reelsData = [
  {
    id: "r1",
    type: "video",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Behind the scenes: Wedding Shoot 📸",
    description: "Setting up the perfect lighting for golden hour. It's all about catching that natural glow!",
    author: { name: "Budi Santoso", avatar: "https://i.pravatar.cc/150?u=budi" },
    likes: 1245,
    comments: 89,
    shares: 42,
    relatedJobId: "job-1", 
  },
  {
    id: "r2",
    type: "image",
    src: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=1080&auto=format&fit=crop",
    title: "Morning Yoga Flow 🧘‍♀️",
    description: "Start your day right with 15 mins of mobility work.",
    author: { name: "Siti Aminah", avatar: "https://i.pravatar.cc/150?u=siti" },
    likes: 340,
    comments: 12,
    shares: 5,
    relatedJobId: "job-3",
  },
  {
    id: "r3",
    type: "carousel",
    src: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1080&auto=format&fit=crop"
    ],
    title: "UI/UX Redesign Process 🎨",
    description: "Swipe to see the before and after of our latest fintech client dashboard.",
    author: { name: "Rina Kartika", avatar: "https://i.pravatar.cc/150?u=rina" },
    likes: 562,
    comments: 34,
    shares: 11,
    relatedFreelancerId: "freelancer-2",
  },
  {
    id: "r4",
    type: "video",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    title: "Padel Basics: The Bandeja 🎾",
    description: "Mastering the bandeja is crucial for keeping the net. Here is a quick breakdown.",
    author: { name: "Agus Pratama", avatar: "https://i.pravatar.cc/150?u=agus" },
    likes: 892,
    comments: 45,
    shares: 112,
    relatedJobId: "job-2",
  }
];

export default function ReelsPage() {
  const router = useRouter();
  
  return (
    <div className="bg-black min-h-screen w-full overflow-hidden relative flex justify-center">
      {/* Close Button - Global */}
      <button 
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-50 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-md transition-all cursor-pointer"
      >
        <X className="size-6" />
      </button>

      {/* Reel Container: Mobile full width, Desktop centered max-w-md */}
      <div className="w-full max-w-md h-[100dvh] bg-zinc-900 relative shadow-2xl overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {reelsData.map((reel, index) => (
          <ReelItem key={reel.id} reel={reel} isActive={true} />
        ))}
      </div>
      
      {/* Desktop side decoration/blur */}
      <div className="hidden lg:block absolute inset-0 z-[-1]">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center blur-3xl opacity-30"></div>
      </div>
    </div>
  );
}

// Sub-component for individual Reel
function ReelItem({ reel, isActive }: { reel: any, isActive: boolean }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isLiked, setIsLiked] = useState(false);

  // Intersection Observer to play/pause video when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (videoRef.current) {
            videoRef.current.play().catch(() => setIsPlaying(false)); // Autoplay policy catch
            setIsPlaying(true);
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.7 } // 70% of the item must be visible
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlide < reel.src.length - 1) setCurrentSlide(curr => curr + 1);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlide > 0) setCurrentSlide(curr => curr - 1);
  };

  return (
    <div className="w-full h-full snap-start snap-always relative bg-black flex items-center justify-center group">
      
      {/* MEDIA LAYER */}
      <div className="absolute inset-0 w-full h-full cursor-pointer" onClick={reel.type === 'video' ? togglePlay : undefined}>
        {reel.type === 'video' && (
          <video 
            ref={videoRef}
            src={reel.src}
            className="w-full h-full object-cover"
            loop
            muted // Muted for autoplay policies initially
            playsInline
          />
        )}
        
        {reel.type === 'image' && (
          <img src={reel.src} alt={reel.title} className="w-full h-full object-cover" />
        )}

        {reel.type === 'carousel' && (
          <div className="w-full h-full relative">
            <img src={reel.src[currentSlide]} alt={reel.title} className="w-full h-full object-cover transition-all duration-300" />
            {/* Carousel Controls */}
            {currentSlide > 0 && (
              <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full backdrop-blur-sm">
                <ChevronLeft className="size-5" />
              </button>
            )}
            {currentSlide < reel.src.length - 1 && (
              <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full backdrop-blur-sm">
                <ChevronRight className="size-5" />
              </button>
            )}
            {/* Carousel Dots */}
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 z-10">
              {reel.src.map((_: any, idx: number) => (
                <div key={idx} className={`h-1 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-4' : 'bg-white/40 w-1'}`} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Play/Pause Overlay indicator (fades out) */}
      {reel.type === 'video' && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-black/40 p-4 rounded-full backdrop-blur-md">
            <Play className="size-10 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* GRADIENT OVERLAY (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10"></div>

      {/* CONTENT LAYER */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between z-20">
        
        {/* Left Side: Info */}
        <div className="flex-1 pr-12 pb-2">
          {/* Author */}
          <div className="flex items-center gap-2 mb-3">
            <div className="size-10 rounded-full border border-white/20 overflow-hidden shrink-0">
              <img src={reel.author.avatar} alt={reel.author.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-white font-semibold text-sm drop-shadow-md">{reel.author.name}</span>
            <button className="text-xs font-semibold bg-white text-black px-3 py-1 rounded-full ml-2">Ikuti</button>
          </div>
          
          {/* Title & Description */}
          <h2 className="text-white font-bold text-lg mb-1 drop-shadow-md leading-tight">{reel.title}</h2>
          <p className="text-white/90 text-sm drop-shadow-md line-clamp-2">{reel.description}</p>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex flex-col items-center gap-6 pb-4">
          
          <button onClick={() => setIsLiked(!isLiked)} className="flex flex-col items-center gap-1 group">
            <div className={`p-3 rounded-full bg-black/20 backdrop-blur-sm transition-colors ${isLiked ? 'text-red-500' : 'text-white group-hover:bg-black/40'}`}>
              <Heart className={`size-7 ${isLiked ? 'fill-red-500' : ''}`} />
            </div>
            <span className="text-white text-xs font-medium drop-shadow-md">{isLiked ? reel.likes + 1 : reel.likes}</span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="p-3 rounded-full bg-black/20 backdrop-blur-sm text-white transition-colors group-hover:bg-black/40">
              <MessageCircle className="size-7" />
            </div>
            <span className="text-white text-xs font-medium drop-shadow-md">{reel.comments}</span>
          </button>

          <button className="flex flex-col items-center gap-1 group">
            <div className="p-3 rounded-full bg-black/20 backdrop-blur-sm text-white transition-colors group-hover:bg-black/40">
              <Share2 className="size-7" />
            </div>
            <span className="text-white text-xs font-medium drop-shadow-md">{reel.shares}</span>
          </button>

          {/* View Details Call to Action */}
          <Link 
            href={reel.relatedJobId ? `/job/${reel.relatedJobId}` : `/freelancer/${reel.relatedFreelancerId}`}
            className="flex flex-col items-center gap-1 mt-2 group cursor-pointer"
          >
            <div className="p-3 rounded-full bg-gigit-accent text-white shadow-lg shadow-gigit-accent/30 animate-pulse-slow">
              <ExternalLink className="size-6" />
            </div>
            <span className="text-white text-[10px] uppercase font-bold tracking-wider drop-shadow-md text-center max-w-[60px] leading-tight">Lihat Detail</span>
          </Link>

        </div>
      </div>

    </div>
  );
}
