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
    price: false,
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
          (p.sku && p.sku.toLowerCase().includes(q)),
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
    if (sortBy === "name-asc")
      list.sort((a, b) => a.name.localeCompare(b.name, "hu"));
    if (sortBy === "name-desc")
      list.sort((a, b) => b.name.localeCompare(a.name, "hu"));
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [
    products,
    search,
    minPrice,
    maxPrice,
    selectedBrands,
    selectedMaterials,
    selectedColors,
    onlyInStock,
    sortBy,
  ]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-8">
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
      <aside className="lg:col-span-1 w-full h-full relative">
        <div className="sticky top-[120px] z-20 w-full">
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </div>

        {/* Custom Filter Card */}
        <div className="relative w-full mr-8 lg:mr-0 lg:w-full flex flex-col drop-shadow-xl z-20">
          
          {/* Cutout Header */}
          <div className="flex items-end w-full h-[40px] relative z-10 -mb-[2px]">
            {/* Left Block */}
            <div className="w-[80px] h-full bg-[#1d1d1e] border-t-2 border-l-2 border-white/10 rounded-tl-[8px]" />
            
            {/* SVG Curve */}
            <svg
              className="shrink-0 h-[40px] w-auto block -ml-[1px] z-[100] scale-y-[-1]"
              viewBox="0 0 51.92 33.07"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0,0v33.07c6.37,0,12.47-2.53,16.97-7.03l17.98-17.98c4.5-4.5,10.61-7.03,16.97-7.03V0H0Z" fill="#1D1D1E" />
              <path d="M0,33.07c6.37,0,12.47-2.53,16.97-7.03l17.98-17.98c4.5-4.5,10.61-7.03,16.97-7.03" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
            
            {/* Empty Text Area */}
            <div className="flex-1 h-full relative">
              <div className="absolute inset-0 flex items-start justify-end pr-3 pt-2">
                <span className="text-white/60 font-black text-[12px] tracking-[0.2em] uppercase">SZŰRŐ</span>
              </div>
            </div>
          </div>

          {/* Main Body */}
          <div className="bg-[#1d1d1e] border-l-2 border-r-2 border-b-2 border-white/10 rounded-b-[8px] rounded-tr-[8px] flex flex-col relative z-0 overflow-hidden">
            
            {/* Top Right Border (covers the transparent part of the header) */}
            <div className="absolute top-0 right-0 border-t-2 border-white/10 rounded-tr-[8px] pointer-events-none" style={{ left: '142px' }} />

            {/* ÁR (Price) Filter */}
            <div className={`transition-colors duration-300 ${openFilters.price ? "bg-white text-black" : "bg-transparent text-white"} border-b border-white/[0.08] last:border-0`}>
              <div
                onClick={() => toggleFilter("price")}
                className={`flex justify-between items-center cursor-pointer transition-colors px-5 ${openFilters.price ? "py-5 hover:text-black/70" : "py-4 hover:text-[#d6df27]"}`}
              >
                <span className={`uppercase text-[12px] tracking-[0.1em] ${openFilters.price ? "font-extrabold text-black" : "font-semibold text-white/90"}`}>
                  ÁR
                </span>
                <svg
                  className={`w-3.5 h-3.5 transform transition-transform duration-200 ${openFilters.price ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              {openFilters.price && (
                <div className="px-5 pb-6 pt-1">
                  <div className="flex justify-between text-[11px] font-bold text-black/60 mb-2">
                    <span>{minPrice.toLocaleString("hu-HU")} Ft</span>
                    <span>{maxPrice.toLocaleString("hu-HU")} Ft</span>
                  </div>

                  <div className="relative w-full h-[6px] bg-black/10 rounded-full my-6 flex items-center">
                    <div
                      className="absolute h-full bg-[#d6df27] rounded-full"
                      style={{
                        left: `${(minPrice / maxPossible) * 100}%`,
                        right: `${100 - (maxPrice / maxPossible) * 100}%`,
                      }}
                    />
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
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#d6df27] text-black font-extrabold text-[9px] px-2 py-0.5 rounded-full pointer-events-none shadow-md z-40"
                      style={{ left: `${(minPrice / maxPossible) * 100}%` }}
                    >
                      {minPrice}
                    </div>
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

            {/* Gyártó (Brand) Filter */}
            {uniqueBrands.length > 0 && (
              <div className={`transition-colors duration-300 ${openFilters.brand ? "bg-white text-black" : "bg-transparent text-white"} border-b border-white/[0.08] last:border-0`}>
                <div
                  onClick={() => toggleFilter("brand")}
                  className={`flex justify-between items-center cursor-pointer transition-colors px-5 ${openFilters.brand ? "py-5 hover:text-black/70" : "py-4 hover:text-[#d6df27]"}`}
                >
                  <span className={`uppercase text-[12px] tracking-[0.1em] ${openFilters.brand ? "font-extrabold text-black" : "font-semibold text-white/90"}`}>
                    Gyártó
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 transform transition-transform duration-200 ${openFilters.brand ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>

                {openFilters.brand && (
                  <div className="px-5 pb-6 flex flex-col gap-2 pt-1">
                    {uniqueBrands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-2.5 cursor-pointer text-black/70 hover:text-black transition-colors text-[13px]"
                      >
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
              <div className={`transition-colors duration-300 ${openFilters.material ? "bg-white text-black" : "bg-transparent text-white"} border-b border-white/[0.08] last:border-0`}>
                <div
                  onClick={() => toggleFilter("material")}
                  className={`flex justify-between items-center cursor-pointer transition-colors px-5 ${openFilters.material ? "py-5 hover:text-black/70" : "py-4 hover:text-[#d6df27]"}`}
                >
                  <span className={`uppercase text-[12px] tracking-[0.1em] ${openFilters.material ? "font-extrabold text-black" : "font-semibold text-white/90"}`}>
                    Anyag
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 transform transition-transform duration-200 ${openFilters.material ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>

                {openFilters.material && (
                  <div className="px-5 pb-6 flex flex-col gap-2 pt-1">
                    {uniqueMaterials.map((mat) => (
                      <label
                        key={mat}
                        className="flex items-center gap-2.5 cursor-pointer text-black/70 hover:text-black transition-colors text-[13px]"
                      >
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
              <div className={`transition-colors duration-300 ${openFilters.color ? "bg-white text-black" : "bg-transparent text-white"} border-b border-white/[0.08] last:border-0`}>
                <div
                  onClick={() => toggleFilter("color")}
                  className={`flex justify-between items-center cursor-pointer transition-colors px-5 ${openFilters.color ? "py-5 hover:text-black/70" : "py-4 hover:text-[#d6df27]"}`}
                >
                  <span className={`uppercase text-[12px] tracking-[0.1em] ${openFilters.color ? "font-extrabold text-black" : "font-semibold text-white/90"}`}>
                    Szín
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 transform transition-transform duration-200 ${openFilters.color ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>

                {openFilters.color && (
                  <div className="px-5 pb-6 flex flex-col gap-2 pt-1">
                    {uniqueColors.map((color) => (
                      <label
                        key={color}
                        className="flex items-center gap-2.5 cursor-pointer text-black/70 hover:text-black transition-colors text-[13px]"
                      >
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
            <div className={`transition-colors duration-300 ${openFilters.stock ? "bg-white text-black" : "bg-transparent text-white"} border-b border-white/[0.08] last:border-0`}>
              <div
                onClick={() => toggleFilter("stock")}
                className={`flex justify-between items-center cursor-pointer transition-colors px-5 ${openFilters.stock ? "py-5 hover:text-black/70" : "py-4 hover:text-[#d6df27]"}`}
              >
                <span className={`uppercase text-[12px] tracking-[0.1em] ${openFilters.stock ? "font-extrabold text-black" : "font-semibold text-white/90"}`}>
                  Raktárkészlet
                </span>
                <svg
                  className={`w-3.5 h-3.5 transform transition-transform duration-200 ${openFilters.stock ? "rotate-180" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              {openFilters.stock && (
                <div className="px-5 pb-6 flex flex-col gap-2 pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer text-black/70 hover:text-black transition-colors text-[13px]">
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
