"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ConditionalBodyPadding() {
  const pathname = usePathname();

  useEffect(() => {
    // No top padding on homepage (Hero has its own header)
    // Other pages need padding for the fixed Navbar
    document.body.style.paddingTop = pathname === "/" ? "0" : "var(--nav-height)";
  }, [pathname]);

  return null;
}
