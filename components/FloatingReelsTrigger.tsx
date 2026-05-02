"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, X, ChevronRight, GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingReelsTrigger({ className }: { className?: string }) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  
  // High-performance Drag State (uses Refs to avoid re-renders)
  const containerRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  const dragRef = useRef({ 
    startX: 0, startY: 0, 
    initialX: 0, initialY: 0, 
    minX: 0, maxX: 0, minY: 0, maxY: 0,
    isMoved: false 
  });
  
  const [isDragging, setIsDragging] = useState(false);

  // Reset position if the window is resized to prevent getting stuck off-screen
  useEffect(() => {
    const handleResize = () => {
      offset.current = { x: 0, y: 0 };
      if (containerRef.current) {
         containerRef.current.style.transform = `translate(0px, 0px)`;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isVisible) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only allow left click (mouse) or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    if (!containerRef.current) return;
    
    // Measure current position relative to viewport
    const rect = containerRef.current.getBoundingClientRect();

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: offset.current.x,
      initialY: offset.current.y,
      minX: -rect.left, // Left boundary
      maxX: window.innerWidth - rect.right, // Right boundary
      minY: -rect.top, // Top boundary
      maxY: window.innerHeight - rect.bottom, // Bottom boundary
      isMoved: false
    };

    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    let dx = e.clientX - dragRef.current.startX;
    let dy = e.clientY - dragRef.current.startY;

    // Clamp the movement so it cannot go off-screen
    dx = Math.max(dragRef.current.minX, Math.min(dx, dragRef.current.maxX));
    dy = Math.max(dragRef.current.minY, Math.min(dy, dragRef.current.maxY));

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dragRef.current.isMoved = true;
    }

    const newX = dragRef.current.initialX + dx;
    const newY = dragRef.current.initialY + dy;

    offset.current = { x: newX, y: newY };

    // Mutate DOM directly for buttery 60fps dragging (bypasses React render cycle)
    containerRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const target = e.currentTarget as HTMLElement;
    target.releasePointerCapture(e.pointerId);

    // If the widget wasn't dragged, treat it as a click to navigate
    if (!dragRef.current.isMoved) {
      router.push("/reels");
    }
    
    // Reset drag state
    dragRef.current.isMoved = false;
  };

  return (
    <div 
      className={cn(
        "fixed z-50 animate-in fade-in slide-in-from-bottom-4 duration-500",
        "bottom-24 right-4 sm:bottom-6 sm:right-6", // Mobile/Tablet initial position
        "lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:right-12", // Desktop initial position
        className
      )}
    >
      <div
        ref={containerRef}
        className={cn(
          "relative origin-center",
          isDragging ? "cursor-grabbing" : "cursor-grab transition-transform duration-300 hover:scale-105" 
        )}
        style={{
          transform: `translate(${offset.current.x}px, ${offset.current.y}px)`,
          touchAction: "none" // Prevent mobile screen scroll while dragging the widget
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        
        {/* Close Button - Floats outside top right */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsVisible(false);
          }}
          onPointerDown={(e) => e.stopPropagation()} // Stop drag when closing
          className="absolute -top-3 -right-3 lg:-top-4 lg:-right-4 bg-black/40 backdrop-blur-md text-white rounded-full p-1.5 lg:p-2 shadow-md hover:bg-black/70 transition-colors z-20 cursor-pointer"
          aria-label="Close video preview"
        >
          <X className="size-3.5 lg:size-4" />
        </button>

        {/* Drag Handle UX Indicator */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-20 bg-black/30 backdrop-blur-md rounded-full px-1.5 py-0.5 pointer-events-none opacity-60">
          <GripHorizontal className="size-3 lg:size-4 text-white" />
        </div>

        {/* Trigger Container: Portrait Rectangle */}
        <div 
          className={cn(
            "block bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 relative ring-2 ring-transparent transition-colors",
            !isDragging && "hover:ring-gigit-accent/50",
            "w-[100px] h-[150px]", // Mobile size
            "lg:w-[160px] lg:h-[240px]" // Desktop size
          )}
        >
          {/* Autoplaying Video Background */}
          <video 
            src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity",
              !isDragging && "opacity-90 hover:opacity-100"
            )}
          />

          {/* Top Gradient Overlay */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>

          {/* Bottom Action Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gigit-accent/95 backdrop-blur-sm text-white flex items-center justify-center py-1.5 px-1 lg:py-2.5 pointer-events-none">
            <div className="flex items-center gap-1 lg:gap-1.5">
              <div className="bg-white text-gigit-accent rounded-sm p-[2px] lg:p-1">
                <Play className="size-2.5 lg:size-3.5 fill-current" />
              </div>
              <span className="text-[10px] lg:text-xs font-extrabold uppercase tracking-wide leading-none">Video</span>
              <ChevronRight className="size-3 lg:size-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
