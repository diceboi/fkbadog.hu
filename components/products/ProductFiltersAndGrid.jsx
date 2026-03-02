"use client";
import { useState, useMemo } from "react";
import ProductCard from "@/components/products/ProductCard";

const SORT_OPTIONS = [
  { value: "name-asc", label: "A–Z sorrendben" },
  { value: "name-desc", label: "Z–A sorrendben" },
  { value: "price-asc", label: "Ár: alacsony → magas" },
  { value: "price-desc", label: "Ár: magas → alacsony" },
];

const inputCls = "bg-white/[0.05] border border-white/10 rounded-[3px] text-white outline-none";

export default function ProductFiltersAndGrid({ products }) {
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState("name-asc");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const maxPossible = Math.max(...products.map((p) => p.price), 100000);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);
    if (sortBy === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name, "hu"));
    if (sortBy === "name-desc") list.sort((a, b) => b.name.localeCompare(a.name, "hu"));
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, search, minPrice, maxPrice, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex gap-8 items-start">

      {/* Filters sidebar */}
      <aside className="w-[220px] shrink-0 bg-black-mid border border-white/[0.06] rounded-[4px] p-6 sticky top-[100px] max-[900px]:hidden">

        {/* Search */}
        <div className="mb-6">
          <label className="section-label mb-2 block">Keresés</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Terméknév, cikkszám..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className={`${inputCls} w-full py-2 pl-3 pr-9 text-[13px]`}
            />
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-40 text-white"
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        </div>

        {/* Price range */}
        <div className="mb-6">
          <label className="section-label mb-2 block">Ár (Ft)</label>
          <div className="flex gap-2 mb-2.5">
            <input type="number" value={minPrice}
              onChange={(e) => { setMinPrice(+e.target.value); setPage(1); }}
              min={0} max={maxPrice}
              className={`${inputCls} w-1/2 py-1.5 px-2 text-[12px]`}
            />
            <input type="number" value={maxPrice}
              onChange={(e) => { setMaxPrice(+e.target.value); setPage(1); }}
              min={minPrice}
              className={`${inputCls} w-1/2 py-1.5 px-2 text-[12px]`}
            />
          </div>
          <input
            type="range" min={0} max={maxPossible} value={maxPrice}
            onChange={(e) => { setMaxPrice(+e.target.value); setPage(1); }}
            className="w-full accent-accent"
          />
          <p className="text-[11px] text-white/35 mt-1">Max: {maxPrice.toLocaleString("hu-HU")} Ft</p>
        </div>

        {/* Extras */}
        <div>
          <label className="section-label mb-1 block">Egyéb</label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-accent" />
            <span className="text-[13px] text-white/65">Csak raktáron</span>
          </label>
        </div>
      </aside>

      {/* Grid */}
      <div className="flex-1 min-w-0">

        {/* Sort + count */}
        <div className="flex justify-between items-center mb-5">
          <p className="text-white/45 text-[13px]">{filtered.length} termék</p>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="bg-black-mid border border-white/10 text-white text-[13px] py-2 px-3 rounded-[3px] cursor-pointer outline-none"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {paginated.length === 0 ? (
          <div className="text-center py-20 text-white/35">
            <p className="text-lg mb-2">Nincs találat</p>
            <p className="text-[13px]">Próbálj más keresési feltételt.</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 max-[1100px]:grid-cols-3 max-[700px]:grid-cols-2 gap-3 mb-8">
            {paginated.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="bg-transparent border border-white/15 text-white py-2 px-3 rounded-[3px] text-[13px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:border-white/30"
            >← Előző</button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i} onClick={() => setPage(i + 1)}
                className={`border border-white/15 py-2 px-3.5 rounded-[3px] text-[13px] cursor-pointer transition-all ${
                  page === i + 1 ? "bg-accent text-black font-bold" : "bg-transparent text-white hover:border-white/30"
                }`}
              >{i + 1}</button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="bg-transparent border border-white/15 text-white py-2 px-3 rounded-[3px] text-[13px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:border-white/30"
            >Következő →</button>
          </div>
        )}
      </div>
    </div>
  );
}
