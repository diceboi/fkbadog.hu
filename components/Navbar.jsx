"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/termekek", label: "Termékek" },
  { href: "/gyik", label: "GYIK" },
  { href: "/rolunk", label: "Rólunk" },
  { href: "/kapcsolat", label: "Kapcsolat" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`navbar transition-all duration-300 ${
          scrolled
            ? "bg-black-dark/97 shadow-[0_2px_24px_rgba(0,0,0,0.5)]"
            : "bg-black-dark/80"
        }`}
      >
        <div className="container flex items-center gap-4 h-[72px]">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2.5">
            <Image src="/fk-logo-white.svg" alt="FK Tető logó" width={44} height={30} priority />
            <span className="font-black text-[13px] tracking-[0.12em] text-white uppercase leading-[1.2]">
              FK<br />TETŐ
            </span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-[420px] mx-6 relative max-[640px]:hidden">
            <input
              type="text"
              placeholder="Mit keresél?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.07] border border-white/[0.12] rounded-[4px] py-[10px] pl-4 pr-11 text-white text-sm outline-none transition-all duration-200 focus:border-accent focus:bg-white/10 placeholder:text-white/40"
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 bg-transparent border-0 cursor-pointer p-0 flex items-center hover:text-accent"
              aria-label="Keresés"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>

          {/* Nav links – desktop */}
          <div className="nav-links flex items-center gap-1 ml-auto max-[900px]:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 font-bold text-[14px] tracking-[0.06em] uppercase py-2 px-[14px] no-underline rounded-[2px] transition-colors duration-200 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/kalkulator"
              className="btn-primary ml-2 text-[12px] py-[10px] px-4 rounded-[3px] flex-col items-center leading-[1.3]"
            >
              Anyagszükséglet
              <br />
              <span className="opacity-[0.85]">Kalkulátor</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="hamburger hidden max-[900px]:flex ml-auto bg-transparent border-0 text-white cursor-pointer p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-[72px] left-0 right-0 bg-black-dark border-b border-white/10 z-[99] px-6 pt-4 pb-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-white font-bold text-xl tracking-[0.06em] uppercase py-3 no-underline border-b border-white/[0.06]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/kalkulator"
            className="btn-primary mt-5 inline-flex"
            onClick={() => setMenuOpen(false)}
          >
            Anyagszükséglet kalkulátor
          </Link>
        </div>
      )}
    </>
  );
}
