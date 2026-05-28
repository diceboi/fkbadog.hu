"use client";
import { useState, useMemo } from "react";
import ProductCard from "@/components/products/ProductCard";

const SORT_OPTIONS = [
  { value: "name-asc", label: "A–Z sorrendben" },
  { value: "name-desc", label: "Z–A sorrendben" },
  { value: "price-asc", label: "Ár: alacsony → magas" },
  { value: "price-desc", label: "Ár: magas → alacsony" },
];

export default function ProductFiltersAndGrid({ products }) {
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortBy, setSortBy] = useState("name-asc");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const maxPossible = useMemo(() => {
    return Math.max(...products.map((p) => p.price), 100000);
  }, [products]);

  // Collapsible state for filters
  const [openFilters, setOpenFilters] = useState({
    price: true,
    brand: false,
    material: false,
    color: false,
    stock: false,
  });

  const toggleFilter = (key) => {
    setOpenFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Checkbox option states
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Dynamic filter lists from current products
  const uniqueBrands = useMemo(() => {
    return [...new Set(products.map((p) => p.brand).filter(Boolean))];
  }, [products]);

  const uniqueMaterials = useMemo(() => {
    return [...new Set(products.map((p) => p.specs?.Anyag).filter(Boolean))];
  }, [products]);

  const uniqueColors = useMemo(() => {
    return [...new Set(products.map((p) => p.specs?.Szín).filter(Boolean))];
  }, [products]);

  // Filtered and sorted products list
  const filtered = useMemo(() => {
    let list = [...products];

    // Search query
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    // Price range
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // Brands
    if (selectedBrands.length > 0) {
      list = list.filter((p) => selectedBrands.includes(p.brand));
    }

    // Materials
    if (selectedMaterials.length > 0) {
      list = list.filter((p) => selectedMaterials.includes(p.specs?.Anyag));
    }

    // Colors
    if (selectedColors.length > 0) {
      list = list.filter((p) => selectedColors.includes(p.specs?.Szín));
    }

    // Stock
    if (onlyInStock) {
      list = list.filter((p) => p.stock > 0);
    }

    // Sorting
    if (sortBy === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name, "hu"));
    if (sortBy === "name-desc") list.sort((a, b) => b.name.localeCompare(a.name, "hu"));
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, search, minPrice, maxPrice, selectedBrands, selectedMaterials, selectedColors, onlyInStock, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      <style>{`
        .slider-thumb-transparent::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          pointer-events: auto;
        }
        .slider-thumb-transparent::-moz-range-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          pointer-events: auto;
        }
      `}</style>

      {/* Filters Sidebar */}
      <aside className="lg:col-span-1 w-full lg:sticky lg:top-[100px] z-20">
        {/* Search Input Pill */}
        <div className="relative flex items-center mb-6 h-12">
          <input
            type="text"
            placeholder="KERESÉS"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 h-full bg-white text-black font-semibold placeholder-black/50 text-[13px] tracking-wider px-5 rounded-l-full outline-none"
          />
          <div className="h-full relative w-12 flex items-center justify-center bg-white rounded-r-full overflow-visible shrink-0 pr-1">
            <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition-all cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </div>

        {/* Custom Filter Card */}
        <div className="relative w-full mr-8 lg:mr-0 w-[calc(100%-2rem)] lg:w-full rounded-lg border-2 border-[#3b82f6] bg-[#1d1d1e] overflow-visible flex flex-col shadow-xl">
          
          {/* Absolute Notched Tab on the Right */}
          <svg
            width="32"
            height="142"
            viewBox="0 0 32 142"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-12 left-full -ml-[2px] z-10 select-none pointer-events-none"
          >
            <path
              d="M0 0 C 15 0, 30 15, 30 30 L 30 112 C 30 127, 15 142, 0 142"
              stroke="#3b82f6"
              strokeWidth="2"
              fill="#1d1d1e"
            />
            <foreignObject x="0" y="20" width="30" height="100">
              <div className="flex flex-col items-center justify-center text-white/80 font-black text-[10px] tracking-[0.2em] leading-[1.3] pt-2">
                <span>S</span>
                <span>Z</span>
                <span>Ű</span>
                <span>R</span>
                <span>Ő</span>
              </div>
            </foreignObject>
          </svg>

          {/* ── TOP SECTION (White Background, collapsible Price Filter) ── */}
          <div className="bg-white text-black p-5 rounded-t-[6px] border-b border-black/10">
            <div
              onClick={() => toggleFilter("price")}
              className="flex justify-between items-center cursor-pointer hover:text-[#3b82f6] transition-colors pb-3"
            >
              <span className="uppercase text-[12px] tracking-[0.1em] font-extrabold text-black">ÁR</span>
              <svg
                className={`w-3.5 h-3.5 transform transition-transform duration-200 ${
                  openFilters.price ? "rotate-180" : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            {openFilters.price && (
              <div className="pt-2 pb-1">
                {/* Range labels */}
                <div className="flex justify-between text-[11px] font-bold text-black/60 mb-2">
                  <span>{minPrice.toLocaleString("hu-HU")} Ft</span>
                  <span>{maxPrice.toLocaleString("hu-HU")} Ft</span>
                </div>

                {/* Slider Track and Handles */}
                <div className="relative w-full h-[6px] bg-black/10 rounded-full my-6 flex items-center">
                  <div
                    className="absolute h-full bg-[#d6df27] rounded-full"
                    style={{
                      left: `${(minPrice / maxPossible) * 100}%`,
                      right: `${100 - (maxPrice / maxPossible) * 100}%`,
                    }}
                  />

                  {/* Left Range Input */}
                  <input
                    type="range"
                    min="0"
                    max={maxPossible}
                    value={minPrice}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), maxPrice - 100);
                      setMinPrice(val);
                      setPage(1);
                    }}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer slider-thumb-transparent z-30"
                  />

                  {/* Right Range Input */}
                  <input
                    type="range"
                    min="0"
                    max={maxPossible}
                    value={maxPrice}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), minPrice + 100);
                      setMaxPrice(val);
                      setPage(1);
                    }}
                    className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none cursor-pointer slider-thumb-transparent z-30"
                  />

                  {/* Custom Left Handle */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#d6df27] text-black font-extrabold text-[9px] px-2 py-0.5 rounded-full pointer-events-none shadow-md z-40"
                    style={{ left: `${(minPrice / maxPossible) * 100}%` }}
                  >
                    {minPrice}
                  </div>

                  {/* Custom Right Handle */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#d6df27] text-black font-extrabold text-[9px] px-2 py-0.5 rounded-full pointer-events-none shadow-md z-40"
                    style={{ left: `${(maxPrice / maxPossible) * 100}%` }}
                  >
                    {maxPrice}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── BOTTOM SECTION (Dark Background, Collapsible Filters) ── */}
          <div className="bg-[#1d1d1e] text-white p-5 rounded-b-[6px]">
            
            {/* Gyártó (Brand) Filter */}
            {uniqueBrands.length > 0 && (
              <div className="border-b border-white/[0.08] last:border-0">
                <div
                  onClick={() => toggleFilter("brand")}
                  className="flex justify-between items-center py-3.5 cursor-pointer hover:text-[#d6df27] transition-colors"
                >
                  <span className="uppercase text-[12px] tracking-[0.1em] font-semibold text-white/90">Gyártó</span>
                  <svg
                    className={`w-3 h-3 transform transition-transform duration-200 ${
                      openFilters.brand ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>

                {openFilters.brand && (
                  <div className="pb-4 flex flex-col gap-2 pt-1">
                    {uniqueBrands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2.5 cursor-pointer text-white/70 hover:text-white transition-colors text-[13px]">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBrands((prev) => [...prev, brand]);
                            } else {
                              setSelectedBrands((prev) => prev.filter((b) => b !== brand));
                            }
                            setPage(1);
                          }}
                          className="accent-[#d6df27] rounded"
                        />
                        <span>{brand}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Anyag (Material) Filter */}
            {uniqueMaterials.length > 0 && (
              <div className="border-b border-white/[0.08] last:border-0">
                <div
                  onClick={() => toggleFilter("material")}
                  className="flex justify-between items-center py-3.5 cursor-pointer hover:text-[#d6df27] transition-colors"
                >
                  <span className="uppercase text-[12px] tracking-[0.1em] font-semibold text-white/90">Anyag</span>
                  <svg
                    className={`w-3 h-3 transform transition-transform duration-200 ${
                      openFilters.material ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>

                {openFilters.material && (
                  <div className="pb-4 flex flex-col gap-2 pt-1">
                    {uniqueMaterials.map((mat) => (
                      <label key={mat} className="flex items-center gap-2.5 cursor-pointer text-white/70 hover:text-white transition-colors text-[13px]">
                        <input
                          type="checkbox"
                          checked={selectedMaterials.includes(mat)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMaterials((prev) => [...prev, mat]);
                            } else {
                              setSelectedMaterials((prev) => prev.filter((m) => m !== mat));
                            }
                            setPage(1);
                          }}
                          className="accent-[#d6df27] rounded"
                        />
                        <span>{mat}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Szín (Color) Filter */}
            {uniqueColors.length > 0 && (
              <div className="border-b border-white/[0.08] last:border-0">
                <div
                  onClick={() => toggleFilter("color")}
                  className="flex justify-between items-center py-3.5 cursor-pointer hover:text-[#d6df27] transition-colors"
                >
                  <span className="uppercase text-[12px] tracking-[0.1em] font-semibold text-white/90">Szín</span>
                  <svg
                    className={`w-3 h-3 transform transition-transform duration-200 ${
                      openFilters.color ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>

                {openFilters.color && (
                  <div className="pb-4 flex flex-col gap-2 pt-1">
                    {uniqueColors.map((color) => (
                      <label key={color} className="flex items-center gap-2.5 cursor-pointer text-white/70 hover:text-white transition-colors text-[13px]">
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedColors((prev) => [...prev, color]);
                            } else {
                              setSelectedColors((prev) => prev.filter((c) => c !== color));
                            }
                            setPage(1);
                          }}
                          className="accent-[#d6df27] rounded"
                        />
                        <span>{color}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Raktárkészlet (Stock) Filter */}
            <div className="border-b border-white/[0.08] last:border-0">
              <div
                onClick={() => toggleFilter("stock")}
                className="flex justify-between items-center py-3.5 cursor-pointer hover:text-[#d6df27] transition-colors"
              >
                <span className="uppercase text-[12px] tracking-[0.1em] font-semibold text-white/90">Raktárkészlet</span>
                <svg
                  className={`w-3 h-3 transform transition-transform duration-200 ${
                    openFilters.stock ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              {openFilters.stock && (
                <div className="pb-4 flex flex-col gap-2 pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer text-white/70 hover:text-white transition-colors text-[13px]">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => {
                        setOnlyInStock(e.target.checked);
                        setPage(1);
                      }}
                      className="accent-[#d6df27] rounded"
                    />
                    <span>Csak raktáron</span>
                  </label>
                </div>
              )}
            </div>

          </div>
        </div>
      </aside>

      {/* Products Grid (4 columns) */}
      <div className="lg:col-span-4 min-w-0">
        {/* Sort + Count Header */}
        <div className="flex justify-between items-center mb-5">
          <p className="text-white/45 text-[13px]">{filtered.length} termék</p>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="bg-black-mid border border-white/10 text-white text-[13px] py-2 px-3 rounded-[3px] cursor-pointer outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {paginated.length === 0 ? (
          <div className="text-center py-20 text-white/35">
            <p className="text-lg mb-2">Nincs találat</p>
            <p className="text-[13px]">Próbálj más keresési feltételt.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {paginated.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-transparent border border-white/15 text-white py-2 px-3 rounded-[3px] text-[13px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:border-white/30"
            >
              ← Előző
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`border border-white/15 py-2 px-3.5 rounded-[3px] text-[13px] cursor-pointer transition-all ${
                  page === i + 1
                    ? "bg-accent text-black font-bold"
                    : "bg-transparent text-white hover:border-white/30"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="bg-transparent border border-white/15 text-white py-2 px-3 rounded-[3px] text-[13px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors hover:border-white/30"
            >
              Következő →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
