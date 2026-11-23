"use client";

import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface OpportunityImageGalleryProps {
  imageLinks?: string[] | null;
  title: string;
  compact?: boolean;
}

export function OpportunityImageGallery({
  imageLinks,
  title,
  compact = false,
}: OpportunityImageGalleryProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const links = Array.isArray(imageLinks) ? imageLinks.slice(0, 5) : [];
  if (links.length === 0) return null;

  function scroll(direction: "left" | "right") {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: scroller.clientWidth * (direction === "left" ? -0.75 : 0.75),
      behavior: "smooth",
    });
  }

  return (
    <div
      className="relative"
      onClick={(event) => event.stopPropagation()}
    >
      <div
        ref={scrollerRef}
        className={`flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          compact ? "rounded-2xl" : "rounded-3xl"
        }`}
        aria-label={`Images for ${title}`}
      >
        {links.map((link, index) => (
          // External image URLs are user supplied and must remain compatible with arbitrary hosts.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${link}-${index}`}
            src={link}
            alt={links.length === 1 ? title : `${title} image ${index + 1}`}
            loading="lazy"
            className={`shrink-0 snap-start snap-always object-cover ${
              compact
                ? "h-32 w-48 rounded-2xl"
                : "h-64 w-[min(32rem,85%)] rounded-3xl sm:h-72"
            }`}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ))}
      </div>
      {links.length > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              scroll("left");
            }}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/70 bg-slate-950/65 p-2 text-white shadow-md backdrop-blur-sm transition hover:bg-slate-950/80 focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label={`Scroll images for ${title} left`}
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              scroll("right");
            }}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/70 bg-slate-950/65 p-2 text-white shadow-md backdrop-blur-sm transition hover:bg-slate-950/80 focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label={`Scroll images for ${title} right`}
          >
            <FiChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}
