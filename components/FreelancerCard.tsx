import Link from "next/link";
import { MapPin, Star, BadgeCheck } from "lucide-react";

import type { Freelancer } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

export function FreelancerCard({
  freelancer,
  className,
}: Readonly<{
  freelancer: Freelancer;
  className?: string;
}>) {
  return (
    <Link href={`/freelancer/${freelancer.id}`} className={cn("block outline-none", className)}>
      <Card
        className={cn(
          "group/fl relative overflow-hidden cursor-pointer h-full",
          "border border-gigit-ice/80 bg-white p-5",
          "transition-all duration-300 ease-out",
          "hover:shadow-xl hover:shadow-gigit-blue/8 hover:border-gigit-blue/20",
          freelancer.isFeatured && "ring-1 ring-gigit-accent/20"
        )}
      >
      {/* Featured ribbon */}
      {freelancer.isFeatured && (
        <div className="absolute top-0 right-0">
          <div className="relative">
            <div className="absolute top-2 right-2">
              <Badge className="gap-1 bg-gigit-accent text-white border-0 text-[10px] shadow-sm">
                <BadgeCheck className="size-3" />
                Featured
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="flex items-start gap-4">
        {/* Avatar with accent ring for featured */}
        <div className={cn(
          "relative shrink-0 rounded-lg",
          freelancer.isFeatured && "ring-2 ring-gigit-accent/30 ring-offset-2"
        )}>
          <Avatar className="size-14 avatar-square">
            <AvatarImage src={freelancer.avatarUrl} alt={freelancer.name} />
            <AvatarFallback className="text-lg font-semibold bg-gigit-accent-tint text-gigit-accent-dark">
              {freelancer.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name + Role */}
        <div className="min-w-0 flex-1 pr-20">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-base font-semibold font-heading text-foreground">
              {freelancer.name}
            </h3>
            {freelancer.isFeatured && (
              <BadgeCheck className="size-4 shrink-0 text-gigit-accent" />
            )}
          </div>
          <p className="truncate text-sm text-gigit-text-secondary mt-0.5">
            {freelancer.role}
          </p>

          {/* Rating inline */}
          <div className="mt-1.5 inline-flex items-center gap-1">
            <Star className="size-3.5 fill-current text-amber-400" />
            <span className="text-sm font-semibold text-foreground">
              {freelancer.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gigit-text-secondary">
              ({freelancer.reviewCount} ulasan)
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-px w-full bg-gigit-ice" />

      {/* Bottom details */}
      <div className="flex flex-col gap-3">
        {/* Location + Rate */}
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 text-sm text-gigit-text-secondary min-w-0">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{freelancer.location}</span>
          </div>
          <span className="shrink-0 text-sm font-bold text-gigit-navy">
            {freelancer.hourlyRate}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {freelancer.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gigit-accent-tint px-2.5 py-0.5 text-[11px] font-medium text-gigit-accent-dark"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
    </Link>
  );
}
