"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  // Hide the navbar on the homepage — Hero has its own integrated header
  if (pathname === "/") return null;
  return <Navbar />;
}
