"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Az adminisztrációs felületen nem jelenítjük meg a publikus menüt
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <Navbar />;
}

