"use client";
import Link from "next/link";
import { categories } from "@/data/categories";
import CategoryTile from "./CategoryTile";

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
    <section className="bg-transparent xl:px-8 lg:px-8 md:px-4 px-2 relative z-1">
      <p className="text-cream type-h5 uppercase mb-4">Termékkategóriák</p>

      <div
        className="grid gap-4 pb-16"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {cats.map(({ key, label, cat }) => (
          <CategoryTile
            key={key}
            slug={cat.slug}
            label={label}
            image={cat.image}
          />
        ))}

        {/* "Összes kategória" card */}
        <Link href="/termekek" className="no-underline block">
          <div
            className="relative bg-accent overflow-hidden flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 hover:opacity-90"
            style={{ aspectRatio: "16 / 10" }}
          >
            <span className="font-black text-[18px] tracking-[0.05em] uppercase text-black text-center leading-[1.2]">
              Összes
              <br />
              kategória
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
