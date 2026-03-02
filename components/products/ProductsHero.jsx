"use client";
import Image from "next/image";
import Link from "next/link";

export default function ProductsHero({ title, breadcrumbs, bgImage }) {
  return (
    <section className="relative h-[320px] flex items-end overflow-hidden bg-black-dark">

      {/* Background image */}
      {bgImage && (
        <Image src={bgImage} alt={title} fill className="object-cover opacity-25" priority />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0.5) 100%)" }}
      />

      {/* Content */}
      <div className="container relative z-[2] pb-12">
        {breadcrumbs && (
          <div className="flex gap-2 items-center mb-3">
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
        <h1 className="display-heading text-white" style={{ fontSize: "clamp(44px, 8vw, 96px)" }}>
          {title}
        </h1>
      </div>
    </section>
  );
}
