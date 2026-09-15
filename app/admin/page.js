import AdminHero from "@/components/admin/AdminHero";
import Link from "next/link";
import { Package, Layers, ExternalLink, ArrowRight, ShieldCheck, Sparkles, Database } from "lucide-react";

export const metadata = {
  title: "Vezérlőpult – FK Bádog Admin",
};

export default function AdminDashboardPage() {
  return (
    <>
      <AdminHero
        customTitle="Vezérlőpult"
        customSubtitle="Üdvözlünk az FK Bádog adminisztrációs felületén! Kezeld közvetlenül a Supabase termékadatbázist."
      />

      <div className="p-6 space-y-6 max-w-6xl">
        {/* Stat / Quick links cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link
            href="/admin/termekek"
            className="group p-5 bg-white rounded-2xl border border-gray-200 hover:border-black transition-all shadow-xs flex flex-col justify-between hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#1D1D1E] text-[#d6df27] flex items-center justify-center font-bold">
                <Package className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
            </div>

            <div className="mt-4">
              <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-black">
                Termékek kezelése
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Kattints a teljes terméklista megtekintéséhez, új termékek felviteléhez és árak szerkesztéséhez.
              </p>
            </div>
          </Link>

          <Link
            href="/admin/kategoriak"
            className="group p-5 bg-white rounded-2xl border border-gray-200 hover:border-black transition-all shadow-xs flex flex-col justify-between hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
            </div>

            <div className="mt-4">
              <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-black">
                Kategóriák áttekintése
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                A felvitt termékek kategóriáinak és csoportosításának megtekintése.
              </p>
            </div>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="group p-5 bg-white rounded-2xl border border-gray-200 hover:border-emerald-600 transition-all shadow-xs flex flex-col justify-between hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <ExternalLink className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="mt-4">
              <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-emerald-700">
                Élő Webáruház
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Nyisd meg a vásárlói felületet új lapon az éles változtatások ellenőrzéséhez.
              </p>
            </div>
          </Link>
        </div>

        {/* Információs kártya a Supabase integrációról */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1D1D1E] flex items-center justify-center text-[#d6df27] shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-950 flex items-center gap-2">
                <span>Közvetlen Supabase Kapcsolat</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Éles kapcsolat
                </span>
              </h3>
              <p className="text-xs text-gray-600 mt-1 max-w-xl leading-relaxed">
                Minden művelet (új termék mentése, meglévő módosítása, aktív státusz kapcsolása és a képfeltöltés) azonnal a Supabase felhő adatbázisban és Storage-ben kerül rögzítésre. A webáruház látogatói késleltetés nélkül a friss adatokat látják.
              </p>
            </div>
          </div>

          <Link
            href="/admin/termekek"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1D1D1E] text-[#d6df27] hover:bg-black rounded-xl text-xs font-bold shrink-0 transition-all shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Termékek kezelése &rarr;</span>
          </Link>
        </div>
      </div>
    </>
  );
}
