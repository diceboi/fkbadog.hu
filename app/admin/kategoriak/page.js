"use client";

import { useEffect, useState } from "react";
import AdminHero from "@/components/admin/AdminHero";
import { supabase } from "@/lib/supabase";
import { Layers, RefreshCw, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminKategoriakPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("products").select("kategoria");
      if (!error && data) {
        const counts = {};
        data.forEach((row) => {
          const cat = row.kategoria || "Egyéb";
          counts[cat] = (counts[cat] || 0) + 1;
        });
        const list = Object.entries(counts).map(([name, count]) => ({
          name,
          count,
        }));
        setCategories(list);
      }
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <AdminHero
        customTitle="Kategóriák áttekintése"
        customSubtitle="A products táblában szereplő kategóriák és a hozzájuk rendelt termékek száma."
      />

      <div className="p-6 space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Összesen {categories.length} kategória található
          </p>
          <button
            onClick={fetchCategories}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Frissítés</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-xs text-gray-400">
              Kategóriák betöltése...
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full py-12 text-center text-xs text-gray-500">
              Még nincsenek kategóriák a termékeknél.
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.name}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">{cat.name}</h3>
                    <p className="text-[11px] text-gray-500">{cat.count} termék</p>
                  </div>
                </div>

                <Link
                  href={`/admin/termekek`}
                  className="p-2 text-gray-400 hover:text-black rounded-lg transition-colors"
                  title="Ugrás a termékekhez"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
