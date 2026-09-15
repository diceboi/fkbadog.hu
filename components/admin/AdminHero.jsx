"use client";

import { usePathname } from "next/navigation";

const TITLES = {
  "/admin": {
    title: "Vezérlőpult",
    subtitle: "Áttekintés a termékekről, készletről és a Supabase szinkronizációról.",
  },
  "/admin/termekek": {
    title: "Termékek kezelése",
    subtitle: "Termékek megtekintése, szerkesztése, új termék rögzítése és azonnali közzététele.",
  },
  "/admin/kategoriak": {
    title: "Kategóriák áttekintése",
    subtitle: "A termékek csoportosítása és kategóriarendszer ellenőrzése.",
  },
};

export default function AdminHero({ customTitle, customSubtitle }) {
  const pathname = usePathname();
  const config = TITLES[pathname] || {
    title: customTitle || "Admin Felület",
    subtitle: customSubtitle || "Közvetlen kapcsolat a Supabase adatbázissal.",
  };

  return (
    <div className="bg-white border-b border-gray-200 py-6 px-6 sm:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-950">
          {customTitle || config.title}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          {customSubtitle || config.subtitle}
        </p>
      </div>
    </div>
  );
}
