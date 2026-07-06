"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import BlockRevealWord from "@/components/animations/BlockRevealWord";

export default function CategoryTile({ slug, label, image, href, isActive = false, textColor, activeColor = "text-white" }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const shouldAnimate = isLoaded && isInView;
  return (
    <Link
      href={href || `/termekek/${slug}`}
      className="block no-underline group h-full"
    >
      <article 
        ref={containerRef}
        className="relative transition-transform duration-300 h-full min-h-[200px] group flex flex-col overflow-visible"
      >

        {/* ── Closed card body — dark gradient background, yellow border ── */}
        <div className={`relative z-2 flex-1 bg-black-mid border-2 transition-all duration-300 rounded-t-lg rounded-br-lg overflow-hidden flex flex-col ${isActive ? "border-accent" : "border-black-mid group-hover:border-accent"
          }`}>
          {/* Image Container */}
          <div 
            className={`z-3 flex items-center justify-center flex-1 p-6 pb-2 relative min-h-[140px] w-full ${!shouldAnimate ? "shimmer-placeholder" : ""}`}
            style={!shouldAnimate ? { backgroundColor: "#1D1D1E" } : {}}
          >
            <Image
              src={image}
              alt={label}
              width={260}
              height={160}
              onLoad={() => setIsLoaded(true)}
              className={`object-contain transition-all duration-300 group-hover:scale-105 max-h-[140px] w-auto h-auto ${
                shouldAnimate ? "opacity-100 blur-0" : "opacity-0 blur-md"
              }`}
            />
          </div>
        </div>

        {/* ── Bottom hanging section ── */}
        <div className="flex items-stretch w-full h-[53px] bg-transparent -mt-[2px] z-2">
          {/* Dark card extension — matching the bottom gradient color */}
          <div className={`flex-1 bg-black-mid border-l-2 border-b-2 transition-all duration-300 rounded-bl-lg z-0 h-[42px] ${isActive ? "border-accent" : "border-black-mid group-hover:border-accent"
            }`} />

          {/* SVG corner — transitions dark → transparent */}
          <svg
            className="shrink-0 h-[41px] w-auto block -ml-[1px]  z-[100] overflow-visible"
            viewBox="0 0 51.92 33.07"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0v33.07c6.37,0,12.47-2.53,16.97-7.03l17.98-17.98c4.5-4.5,10.61-7.03,16.97-7.03V0H0Z"
              fill="#1D1D1E"
            />
            <path
              d="M0,33.07c6.37,0,12.47-2.53,16.97-7.03l17.98-17.98c4.5-4.5,10.61-7.03,16.97-7.03"
              fill="none"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              className={`transition-all duration-300 ${isActive ? "stroke-accent" : "stroke-black-mid group-hover:stroke-accent"
                }`}
            />
          </svg>

          {/* Text container / empty spacer on the right */}
          <div className="shrink flex items-center justify-end -ml-1 pl-2 pr-0 z-3 max-w-[65%] w-min h-[58px] relative">
            {!shouldAnimate && (
              <div 
                className="absolute right-0 h-4 w-20 shimmer-placeholder rounded z-2" 
                style={{ backgroundColor: "#1D1D1E" }}
              />
            )}
            <span className={`uppercase type-h6 leading-[1.15] text-wrap text-right break-words transition-colors duration-300 relative z-1 flex justify-end`}>
              <BlockRevealWord trigger={shouldAnimate} compact={true} textClass={isActive ? activeColor : `font-bold ${textColor}`} colorClass="bg-accent">
                {label}
              </BlockRevealWord>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}