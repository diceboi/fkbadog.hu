"use client";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";

export default function CategoryTabs({ activeSlug }) {
  return (
    <section className="bg-[#111111] py-8 border-b border-white/[0.06]">
      <div className="container">
        <p className="section-label mb-4">Kategóriák</p>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
        >
          {categories.map((cat) => {
            const isActive = cat.slug === activeSlug;
            return (
              <Link key={cat.slug} href={`/termekek/${cat.slug}`} className="no-underline">
                <div
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[3px] border cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "border-accent bg-accent/10"
                      : "border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="w-10 h-8 relative shrink-0">
                    <Image src={cat.image} alt={cat.nameFHU} fill className="object-contain" sizes="40px" />
                  </div>
                  <span
                    className={`font-bold text-[12px] tracking-[0.04em] uppercase leading-[1.2] ${
                      isActive ? "text-accent" : "text-white/75"
                    }`}
                  >
                    {cat.nameFHU}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
