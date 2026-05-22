"use client";
import { useEffect, useRef, useState } from "react";

function BlockRevealWord({ children, colorClass, textClass, delay }) {
  return (
    <span className="relative inline-block overflow-hidden px-1 md:px-2 pb-1 -mb-1">
      <span className={`inline-block opacity-0 animate-block-reveal-text ${textClass}`} style={{ animationDelay: delay }}>
        {children}
      </span>
      <span className={`absolute inset-0 ${colorClass} animate-block-reveal-mask`} style={{ animationDelay: delay, transform: "translateX(-101%)" }} />
    </span>
  );
}

export default function Hero() {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  }, []);

  return (
    <div className="w-full bg-black-mid p-4 xl:p-8 ">
      <section
        ref={sectionRef}
        className="hero-section relative bg-black flex flex-col rounded-lg overflow-hidden min-h-[calc(100vh-4rem)] w-full"
      >
        {/* Video background – fills entire section, behind the navbar */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            src="/hero-background.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-[0.55]"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.15) 100%)",
            }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-5 flex-1 flex flex-col justify-center items-center px-8 pb-12 mx-auto w-full pt-32">
          <div className="inline-flex items-center gap-1.5 text-white/65 font-semibold text-[11px] tracking-[0.14em] uppercase mb-[18px] fade-in-up">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Csurgó és környéke</span>
          </div>

          <h1 className="type-h1 text-center flex flex-col items-center justify-center gap-2 md:gap-3">
            <span className="sr-only">Bádogos és Tetőfedő anyag Kereskedés</span>

            {/* Asztali / Tablet: Egybefüggő nagy blokkok */}
            <div className="hidden sm:flex flex-col items-center gap-2 md:gap-3" aria-hidden="true">
              <BlockRevealWord textClass="text-accent" colorClass="bg-accent" delay="100ms">Bádogos és</BlockRevealWord>
              <BlockRevealWord textClass="text-accent" colorClass="bg-accent" delay="300ms">Tetőfedő anyag</BlockRevealWord>
              <BlockRevealWord textClass="text-white" colorClass="bg-white" delay="500ms">Kereskedés</BlockRevealWord>
            </div>

            {/* Mobil: Szavankénti bontás a sortörés miatt */}
            <div className="flex sm:hidden flex-col items-center gap-2" aria-hidden="true">
              <span className="flex flex-wrap justify-center gap-x-2">
                <BlockRevealWord textClass="text-accent" colorClass="bg-accent" delay="100ms">Bádogos</BlockRevealWord>
                <BlockRevealWord textClass="text-accent" colorClass="bg-accent" delay="100ms">és</BlockRevealWord>
              </span>
              <span className="flex flex-wrap justify-center gap-x-2">
                <BlockRevealWord textClass="text-accent" colorClass="bg-accent" delay="300ms">Tetőfedő</BlockRevealWord>
                <BlockRevealWord textClass="text-accent" colorClass="bg-accent" delay="300ms">anyag</BlockRevealWord>
              </span>
              <span className="flex flex-wrap justify-center gap-x-2">
                <BlockRevealWord textClass="text-white" colorClass="bg-white" delay="500ms">Kereskedés</BlockRevealWord>
              </span>
            </div>
          </h1>
        </div>
      </section>
    </div>
  );
}
