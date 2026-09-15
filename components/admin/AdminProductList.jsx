"use client";

import { useState, useEffect, useMemo, useContext, useCallback } from "react";
import { AdminContext } from "@/app/admin/AdminContext";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
  AlertTriangle,
  RefreshCw,
  Coins
} from "lucide-react";
import AdminProductModal from "./AdminProductModal";

export default function AdminProductList() {
  const { searchTerm, setSearchTerm, isModalOpen, setIsModalOpen, editingProduct, setEditingProduct } = useContext(AdminContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableExists, setTableExists] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deletingId, setDeletingId] = useState(null);

  // Termékek betöltése a Supabase products táblából
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        // Ha nem létezik még a products tábla (404 vagy nem található hiba)
        if (error.code === "PGRST205" || error.code === "42P01" || error.message?.includes("not find")) {
          setTableExists(false);
        }
        setProducts([]);
      } else {
        setTableExists(true);
        setProducts(data || []);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    const handleProductsChanged = () => fetchProducts();
    window.addEventListener("products:changed", handleProductsChanged);
    return () => window.removeEventListener("products:changed", handleProductsChanged);
  }, [fetchProducts]);

  // Aktív állapot azonnali váltása
  const toggleActiveStatus = async (product) => {
    const nextStatus = !product.aktiv;

    // Optimista frissítés
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, aktiv: nextStatus } : p))
    );

    try {
      const { error } = await supabase
        .from("products")
        .update({ aktiv: nextStatus, updated_at: new Date().toISOString() })
        .eq("id", product.id);

      if (error) {
        console.error("Hiba az állapot módosításakor:", error);
        // Visszaállítás hiba esetén
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, aktiv: product.aktiv } : p))
        );
      } else {
        window.dispatchEvent(new CustomEvent("products:changed"));
      }
    } catch (err) {
      console.error(err);
      fetchProducts();
    }
  };

  // Termék törlése
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Biztosan törölni szeretnéd a következő terméket: "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        alert("Hiba történt a törlés során: " + error.message);
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        window.dispatchEvent(new CustomEvent("products:changed"));
      }
    } catch (err) {
      alert("Hiba: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Kategóriák kinyerése
  const categories = useMemo(() => {
    const cats = new Set();
    products.forEach((p) => {
      if (p.kategoria) cats.add(p.kategoria);
    });
    return Array.from(cats);
  }, [products]);

  // Szűrt lista
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Szöveges kereső
      const matchSearch =
        !searchTerm ||
        p.megnevezes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cikkszam?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.kategoria?.toLowerCase().includes(searchTerm.toLowerCase());

      // Kategória szűrő
      const matchCategory =
        selectedCategory === "ALL" || p.kategoria === selectedCategory;

      // Státusz szűrő
      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && p.aktiv) ||
        (statusFilter === "INACTIVE" && !p.aktiv);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchTerm, selectedCategory, statusFilter]);

  return (
    <div className="p-6 space-y-6">
      {/* Figyelmeztetés ha még nem futott le az SQL migráció */}
      {!tableExists && (
        <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                A `products` tábla még nem készült el a Supabase-ben
              </h3>
              <p className="text-xs text-amber-800 mt-1 max-w-2xl leading-relaxed">
                Elkészítettük a <span className="font-mono font-bold bg-amber-200/60 px-1.5 py-0.5 rounded">supabase_products_migration.sql</span> fájlt a projekt gyökerében. 
                Másold be a tartalmát a <strong>Supabase Dashboard &rarr; SQL Editor</strong> felületére, és kattints a <strong>Run</strong> gombra a tábla és mintaadatok létrehozásához.
              </p>
            </div>
          </div>
          <button
            onClick={fetchProducts}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Újraellenőrzés</span>
          </button>
        </div>
      )}

      {/* Szűrősáv és Gombok */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Keresőmező */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Keresés név, cikkszám..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-black outline-hidden"
            />
          </div>

          {/* Kategória szűrő */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium outline-hidden"
          >
            <option value="ALL">Minden kategória</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Állapot szűrő */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium outline-hidden"
          >
            <option value="ALL">Minden státusz</option>
            <option value="ACTIVE">Csak aktív termékek</option>
            <option value="INACTIVE">Csak inaktív termékek</option>
          </select>

          <button
            onClick={fetchProducts}
            title="Lista frissítése"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Új termék gomb */}
        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#1D1D1E] text-[#d6df27] hover:bg-black rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Új termék rögzítése</span>
        </button>
      </div>

      {/* Táblázat nézet */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50/80 font-bold text-gray-700 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Termék</th>
                <th className="px-4 py-3.5">Kategória</th>
                <th className="px-4 py-3.5">Ár (Nettó / Bruttó)</th>
                <th className="px-4 py-3.5">Bevonat árak</th>
                <th className="px-4 py-3.5">Készlet</th>
                <th className="px-4 py-3.5 text-center">Aktív</th>
                <th className="px-4 py-3.5 text-right">Műveletek</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                      <span>Termékek betöltése a Supabase-ből...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Package className="w-8 h-8 text-gray-300 stroke-1" />
                      <p className="font-semibold text-gray-700">Nem található termék a megadott feltételekkel.</p>
                      <button
                        onClick={() => {
                          setEditingProduct(null);
                          setIsModalOpen(true);
                        }}
                        className="mt-2 text-xs text-black font-bold underline cursor-pointer"
                      >
                        Hozd létre az első terméket most &rarr;
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const netto = Number(p.netto_ar) || 0;
                  const afa = Number(p.afa_kulcs) || 27;
                  const brutto = Math.round(netto * (1 + afa / 100));

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-gray-50/70 transition-colors group"
                    >
                      {/* Termék Kép + Cím + Cikkszám */}
                      <td className="px-4 py-3 max-w-[260px]">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 shrink-0 overflow-hidden flex items-center justify-center relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.termekkep_link || "/placeholder.png"}
                              alt={p.megnevezes}
                              className="w-full h-full object-contain p-0.5"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.png";
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-gray-900 truncate" title={p.megnevezes}>
                              {p.megnevezes}
                            </div>
                            <div className="text-[11px] font-mono text-gray-500 truncate flex items-center gap-1">
                              <span>{p.cikkszam || "—"}</span>
                              {p.garancia && (
                                <span className="text-[9px] bg-gray-100 px-1 rounded text-gray-600">
                                  {p.garancia}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Kategória */}
                      <td className="px-4 py-3 text-gray-700">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-800">
                          {p.kategoria || "Egyéb"}
                        </span>
                      </td>

                      {/* Nettó / Bruttó Ár */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-extrabold text-gray-900">
                          {netto.toLocaleString("hu-HU")} Ft <span className="text-[10px] text-gray-500 font-normal">netto</span>
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-700">
                          {brutto.toLocaleString("hu-HU")} Ft <span className="text-[10px] text-gray-400 font-normal">bruttó</span>
                        </div>
                      </td>

                      {/* Lemez Bevonat árak */}
                      <td className="px-4 py-3 text-[11px]">
                        {p.fenyes_ar || p.standard_matt_ar || p.ultra_matt_ar || p.alucink_ar ? (
                          <div className="flex flex-col gap-0.5 font-mono">
                            {p.fenyes_ar && (
                              <span className="text-gray-700">
                                Fényes: <strong className="text-gray-900">{Number(p.fenyes_ar).toLocaleString("hu-HU")} Ft</strong>
                              </span>
                            )}
                            {p.standard_matt_ar && (
                              <span className="text-gray-700">
                                Matt: <strong className="text-gray-900">{Number(p.standard_matt_ar).toLocaleString("hu-HU")} Ft</strong>
                              </span>
                            )}
                            {p.ultra_matt_ar && (
                              <span className="text-gray-700">
                                Ultra M.: <strong className="text-gray-900">{Number(p.ultra_matt_ar).toLocaleString("hu-HU")} Ft</strong>
                              </span>
                            )}
                            {p.alucink_ar && (
                              <span className="text-gray-700">
                                Alucink: <strong className="text-gray-900">{Number(p.alucink_ar).toLocaleString("hu-HU")} Ft</strong>
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">Nincs megadva</span>
                        )}
                      </td>

                      {/* Készlet & Kiszerelés */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-bold text-gray-900">
                          {p.keszlet ?? 0} {p.mennyisegi_egyseg || "db"}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {p.utanrendelheto ? "Utánrendelhető" : "Kifutó termék"}
                        </div>
                      </td>

                      {/* Aktív kapcsoló */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleActiveStatus(p)}
                          className="cursor-pointer inline-flex items-center justify-center p-1 rounded-md hover:bg-gray-100 transition-colors"
                          title={p.aktiv ? "Kattints az elrejtéshez" : "Kattints a közzétételhez"}
                        >
                          {p.aktiv ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Aktív
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                              <XCircle className="w-3 h-3 text-gray-400" />
                              Inaktív
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Műveletek */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                            title="Szerkesztés"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(p.id, p.megnevezes)}
                            disabled={deletingId === p.id}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer disabled:opacity-40"
                            title="Törlés"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Termék Létrehozó & Szerkesztő Modal */}
      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        productToEdit={editingProduct}
        onSaved={fetchProducts}
      />
    </div>
  );
}
