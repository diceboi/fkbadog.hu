"use client";

import React, { useEffect, useRef, useState } from "react";

export default function BlockRevealWord({
  children,
  textClass = "",
  colorClass = "bg-accent",
  delay = "0ms",
}) {
  const [hasRevealed, setHasRevealed] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealed) {
          setHasRevealed(true);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before it fully comes into view from bottom
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasRevealed]);

  return (
    <span
      ref={containerRef}
      className="relative inline-block overflow-hidden px-1 md:px-2 pt-2 md:pt-4 pb-1 -mt-2 md:-mt-4 -mb-1"
    >
      {/* The text itself */}
      <span
        className={`inline-block opacity-0 ${textClass} ${
          hasRevealed ? "animate-block-reveal-text" : ""
        }`}
        style={{ animationDelay: delay }}
      >
        {children}
      </span>

      {/* The reveal block */}
      <span
        className={`absolute inset-0 w-full h-full ${colorClass} ${
          hasRevealed ? "animate-block-reveal-mask" : ""
        }`}
        style={{ animationDelay: delay, transform: "translateX(-101%)" }}
      />
    </span>
  );
}
