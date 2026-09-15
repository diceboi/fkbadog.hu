"use client";

import { useState, useEffect, useContext, useCallback } from "react";
import { AdminContext } from "@/app/admin/AdminContext";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ArrowUpRight,
  RefreshCw,
  PlusCircle,
  Database
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminSideMenu() {
  const { activeMenu, setActiveMenu, setIsModalOpen, setEditingProduct } = useContext(AdminContext);
  const pathname = usePathname();
  const router = useRouter();

  // Dinamikus termékszámláló
  const [productCount, setProductCount] = useState(null);
  const [activeProductCount, setActiveProductCount] = useState(null);

  const fetchCounts = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true });

      if (!error && count !== null) {
        setProductCount(count);
      } else {
        // Ha a tábla még nincs létrehozva, fallback 0
        setProductCount(0);
      }

      const { count: activeCount } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("aktiv", true);

      if (activeCount !== null) {
        setActiveProductCount(activeCount);
      }
    } catch {
      setProductCount(0);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
    const handleProductsChanged = () => fetchCounts();
    window.addEventListener("products:changed", handleProductsChanged);
    return () => window.removeEventListener("products:changed", handleProductsChanged);
  }, [fetchCounts]);

  const menuItems = [
    {
      id: "vezerlopult",
      label: "Vezérlőpult",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      id: "termekek",
      label: "Termékek",
      href: "/admin/termekek",
      icon: Package,
      badge: productCount !== null ? productCount : "…",
    },
    {
      id: "kategoriak",
      label: "Kategóriák",
      href: "/admin/kategoriak",
      icon: Layers,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white md:border-r border-b border-gray-200 flex md:flex-col shrink-0">
      {/* Sidebar Navigation */}
      <div className="flex-1 py-4 px-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
        <div className="text-[11px] font-bold text-gray-600 uppercase tracking-wider px-3 mb-2 hidden md:block">
          Kezelés
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id);
                router.push(item.href);
              }}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#1D1D1E] text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#d6df27]" : "text-gray-600"}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-[#d6df27] text-black"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Gyorsműveletek & Státusz az alsó részen */}
        <div className="hidden md:flex flex-col mt-auto pt-6 border-t border-gray-100 px-2">
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] text-gray-600">
              <span className="flex items-center gap-1.5 font-medium">
                <Database className="w-3.5 h-3.5 text-emerald-600" /> Supabase
              </span>
              <button
                onClick={fetchCounts}
                title="Frissítés"
                className="hover:text-gray-900 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-gray-600 hover:rotate-180 transition-transform duration-300" />
              </button>
            </div>

            <div className="flex flex-col gap-1 text-xs">
              <div className="flex justify-between font-medium text-gray-700">
                <span>Összes termék:</span>
                <span className="font-bold text-gray-900">{productCount ?? 0} db</span>
              </div>
              <div className="flex justify-between text-gray-600 text-[11px]">
                <span>Aktív a webshopban:</span>
                <span className="font-bold text-emerald-600">{activeProductCount ?? 0} db</span>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              className="mt-1 flex items-center justify-center gap-1.5 w-full py-1.5 px-2 bg-white border border-gray-200 hover:border-black rounded-lg text-xs font-semibold text-gray-800 transition-colors shadow-2xs cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#d6df27] fill-[#1D1D1E]" />
              <span>Új termék felvitele</span>
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between mt-3 px-3 py-2 text-xs font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
          >
            <span>fkbadog.hu előnézet</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </aside>
  );
}
