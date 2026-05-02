import type * as React from "react";
import {
  Camera,
  Car,
  ChefHat,
  Code,
  Dumbbell,
  GraduationCap,
  HeartPulse,
  Music,
  Palette,
  Scissors,
} from "lucide-react";

import type { Category } from "@/lib/data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "dumbbell": Dumbbell,
  "camera": Camera,
  "graduation-cap": GraduationCap,
  "scissors": Scissors,
  "palette": Palette,
  "code": Code,
  "music": Music,
  "heart-pulse": HeartPulse,
  "chef-hat": ChefHat,
  "car": Car,
};

export function CategoryPill({
  category,
  className,
  isActive = false,
  onClick,
}: Readonly<{
  category: Category;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}>) {
  const Icon = iconMap[category.icon] ?? Camera;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full px-4 py-2 cursor-pointer",
        "text-sm font-medium",
        "transition-all duration-200 ease-out",
        "border",
        isActive
          ? "border-gigit-accent bg-gigit-accent text-white shadow-md shadow-gigit-accent/20"
          : [
              "border-gigit-ice bg-white text-foreground",
              "hover:border-gigit-accent-light hover:bg-gigit-accent-tint",
              "hover:shadow-sm",
            ],
        "active:scale-[0.97]",
        className
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center size-7 rounded-full",
          isActive
            ? "bg-white/20"
            : "bg-gigit-accent-tint"
        )}
      >
        <Icon
          className={cn(
            "size-3.5",
            isActive ? "text-white" : "text-gigit-accent"
          )}
        />
      </span>

      <span className="whitespace-nowrap">{category.name}</span>

      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums",
          isActive
            ? "bg-white/20 text-white"
            : "bg-gigit-ice/60 text-gigit-text-secondary"
        )}
      >
        {category.jobCount}
      </span>
    </button>
  );
}
