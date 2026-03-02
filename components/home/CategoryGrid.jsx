"use client";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";

const featured = [
  { key: "accessories", label: "Kiegészítők" },
  { key: "classic-series", label: "Tetőfedő anyagok" },
  { key: "trapezoid-sheets", label: "Bádogos termékek" },
];

export default function CategoryGrid() {
  const cats = featured
    .map((f) => ({ ...f, cat: categories.find((c) => c.slug === f.key) }))
    .filter((f) => f.cat);

  return (
    <section className="bg-black-dark">
      <div className="container">
        <p className="section-label mb-4 pt-16">Termékkategóriák</p>

        <div className="grid gap-3 pb-16" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {cats.map(({ key, label, cat }) => (
            <Link key={key} href={`/termekek/${cat.slug}`} className="no-underline">
              <div className="relative h-[220px] bg-black-mid rounded-[4px] overflow-hidden border border-white/[0.06] cursor-pointer transition-colors duration-200 hover:border-accent">
                <Image
                  src={cat.image}
                  alt={label}
                  fill
                  className="object-contain p-5"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }}
                >
                  <span className="font-extrabold text-base tracking-[0.05em] uppercase text-white">
                    {label}
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* "Összes kategória" card */}
          <Link href="/termekek" className="no-underline">
            <div className="relative h-[220px] bg-accent rounded-[4px] overflow-hidden flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 hover:bg-accent-dark">
              <span className="font-black text-[18px] tracking-[0.05em] uppercase text-black text-center leading-[1.2]">
                Összes<br />kategória
              </span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-black">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
