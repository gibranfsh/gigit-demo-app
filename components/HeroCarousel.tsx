"use client";

import * as React from "react";
import Image from "next/link"; // Wait, I need next/image, I will fix this
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Dummy Data
// ---------------------------------------------------------------------------

const featuredServices = [
  {
    id: 1,
    title: "Fotografi Pernikahan Premium",
    description: "Abadikan momen sekali seumur hidup Anda dengan kualitas foto sinematik dan profesional.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop",
    href: "/explore?q=fotografer",
  },
  {
    id: 2,
    title: "Pelatih Tenis Tersertifikasi",
    description: "Tingkatkan permainan Tenis Anda bersama pelatih ahli yang berpengalaman di turnamen nasional.",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2070&auto=format&fit=crop",
    href: "/explore?q=Tenis",
  },
  {
    id: 3,
    title: "Desain UI/UX Modern",
    description: "Rancang antarmuka memukau yang meningkatkan pengalaman pengguna untuk produk digital Anda.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop",
    href: "/explore?q=ui/ux",
  },
  {
    id: 4,
    title: "Personal Trainer Elite",
    description: "Wujudkan target kebugaran Anda dengan program latihan personal yang disesuaikan secara khusus.",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
    href: "/explore?q=trainer",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold font-heading text-foreground">
          Layanan Pilihan Teratas
        </h3>
      </div>

      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full relative rounded-2xl overflow-hidden shadow-lg"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {featuredServices.map((service, index) => (
            <CarouselItem key={service.id}>
              <Link href={service.href} className="block relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden group cursor-pointer">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="max-w-2xl">
                    <h4 className="text-2xl sm:text-3xl font-bold text-white font-heading mb-2">
                      {service.title}
                    </h4>
                    <p className="text-sm sm:text-base text-gray-200 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-gigit-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gigit-accent">
                      Pesan Sekarang
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Arrows */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex bg-white/20 hover:bg-white text-white hover:text-gigit-navy border-none shadow-md backdrop-blur-sm transition-all" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex bg-white/20 hover:bg-white text-white hover:text-gigit-navy border-none shadow-md backdrop-blur-sm transition-all" />
      </Carousel>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              current === index 
                ? "w-8 bg-gigit-accent" 
                : "w-2 bg-gray-300 hover:bg-gray-400"
            )}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
