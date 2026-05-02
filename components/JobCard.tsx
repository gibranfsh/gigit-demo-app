import Image from "next/image";
import Link from "next/link";
import { Flame, MapPin, Clock3, Star, Zap } from "lucide-react";

import type { Job } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function JobCard({
  job,
  className,
}: Readonly<{ job: Job; className?: string }>) {
  return (
    <Link href={`/job/${job.id}`} className={cn("block outline-none", className)}>
      <Card
        className={cn(
          "group/card relative overflow-hidden p-0 cursor-pointer h-full",
          "border border-gigit-ice/80 bg-white",
          "transition-all duration-300 ease-out",
          "hover:shadow-xl hover:shadow-gigit-blue/8 hover:border-gigit-blue/20"
        )}
      >
      {/* Cover Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={job.coverImageUrl}
          alt={job.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.04]"
        />

        {/* Gradient overlay for better badge contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Status Badge */}
        {job.isNew && (
          <Badge className="absolute top-3 left-3 gap-1 bg-gigit-blue text-white border-0 shadow-md">
            <Zap className="size-3" />
            Baru
          </Badge>
        )}
        {job.isTopMatch && (
          <Badge className="absolute top-3 left-3 gap-1 bg-gigit-accent text-white border-0 shadow-md">
            <Flame className="size-3" />
            Top Match
          </Badge>
        )}

        {/* Price Tag - floating */}
        <div className="absolute bottom-3 right-3 rounded-lg bg-white/95 backdrop-blur-sm px-3 py-1.5 shadow-md">
          <span className="text-sm font-bold text-gigit-navy">
            {job.priceLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-base font-semibold font-heading text-foreground leading-snug">
          {job.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {job.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gigit-accent-tint px-2.5 py-0.5 text-[11px] font-medium text-gigit-accent-dark"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta: Location + Duration */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gigit-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{job.location}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5 shrink-0" />
            {job.duration}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gigit-ice" />

        {/* Provider row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="size-7 border border-gigit-ice avatar-square">
              <AvatarImage src={job.providerAvatarUrl} alt={job.providerName} />
              <AvatarFallback className="text-[10px] font-medium">
                {job.providerName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-sm font-medium text-foreground/80">
              {job.providerName}
            </span>
          </div>

          {/* Rating */}
          <div className="inline-flex items-center gap-1 shrink-0">
            <Star className="size-3.5 fill-current text-amber-400" />
            <span className="text-sm font-semibold text-foreground">
              {job.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gigit-text-secondary">
              ({job.reviewCount})
            </span>
          </div>
        </div>
      </div>
    </Card>
    </Link>
  );
}
