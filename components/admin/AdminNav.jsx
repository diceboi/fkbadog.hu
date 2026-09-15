"use client";

import Link from "next/link";
import { useContext } from "react";
import { AdminContext } from "@/app/admin/AdminContext";
import { Search, ExternalLink, ShieldCheck, Plus } from "lucide-react";

export default function AdminNav() {
  const { searchTerm, setSearchTerm, setIsModalOpen, setEditingProduct } = useContext(AdminContext);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-[#1D1D1E] flex items-center justify-center text-[#d6df27] font-black text-lg shadow-sm">
              FK
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-gray-900 group-hover:text-black">
                FK BÁDOG
              </span>
              <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Admin Felület
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Keresés cikkszám, név, kategória alapján..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#1D1D1E] focus:ring-1 focus:ring-[#1D1D1E] outline-hidden transition-all text-gray-800 placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#1D1D1E] text-[#d6df27] hover:bg-black transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Új termék</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="Webáruház megnyitása"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Webshop</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
