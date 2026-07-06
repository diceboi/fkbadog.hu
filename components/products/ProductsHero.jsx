"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BlockRevealWord from "@/components/animations/BlockRevealWord";

export default function ProductsHero({ title, breadcrumbs, bgImage }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const words = title ? title.split(" ") : [];

  return (
    <div className="w-full p-4 xl:p-8">
      <section className="relative flex flex-col rounded-lg overflow-hidden min-h-[320px] md:min-h-[400px] w-full">

        {/* Background image & gradient overlay */}
        <div
          className={`absolute inset-0 ${!isLoaded ? "shimmer-placeholder-dark" : ""}`}
          style={!isLoaded ? { backgroundColor: "#1D1D1E" } : {}}
        >
          {bgImage && (
            <Image
              src={bgImage}
              alt={title}
              fill
              onLoad={() => setIsLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 ${isLoaded ? "opacity-[0.45] blur-0" : "opacity-0 blur-md"
                }`}
              priority
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.15) 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-5 flex-1 flex flex-col justify-center items-center px-8 pb-12 mx-auto w-full pt-28 md:pt-36">
          {breadcrumbs && (
            <div className="flex flex-wrap gap-2 items-center justify-center mb-6 fade-in-up">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.label} className="flex items-center gap-2">
                  {i > 0 && <span className="text-white/30">/</span>}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-white/50 font-bold text-[13px] tracking-[0.08em] uppercase no-underline transition-colors duration-200 hover:text-accent"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-accent font-bold text-[13px] tracking-[0.08em] uppercase">
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}

          <h1 className="type-h1 text-center flex flex-wrap justify-center gap-x-2.5 md:gap-x-3.5 leading-[1]">
            <span className="sr-only">{title}</span>
            {words.map((word, index) => {
              const isAccent = index % 2 === 0;
              const delay = `${100 + index * 200}ms`;
              return (
                <BlockRevealWord
                  key={index}
                  textClass={`${isAccent ? "text-accent" : "text-white"} leading-[1]`}
                  colorClass={isAccent ? "bg-accent" : "bg-white"}
                  delay={delay}
                >
                  {word}
                </BlockRevealWord>
              );
            })}
          </h1>
        </div>
      </section>
    </div>
  );
}
