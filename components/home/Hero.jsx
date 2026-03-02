"use client";
import Image from "next/image";
import Link from "next/link";

const BAR_H = "3.25rem";
const ICON_RIGHT = "calc(3.25rem / 2)";

const navLinks = [
  { href: "/termekek", label: "Termékek" },
  { href: "/gyik", label: "GYIK" },
  { href: "/rolunk", label: "Rólunk" },
  { href: "/kapcsolat", label: "Kapcsolat" },
];

import { useEffect, useRef, useState } from "react";

// ── Fix pixelértékek (az Illustrator-ból kiolvasott, nem skálázható részek) ──
const R  = 10.33;  // sarok rádiusz
const N  = 82.79;  // diagonális bevágás (103.49 × 0.8 = −20%)
const CI = 17.53;  // bevágás be-/kivezető görbe (21.91 × 0.8)
// A bevágás + felső jobb sarok által elfoglalt függőleges magasság:
const NOTCH_TOP_H = 7.26 + N + 7.26 + R; // (9.08×0.8 + N + 9.08×0.8 + R) ≈ 107.64 px

/** 3-slice path: bal/jobb szakasz skálázódik, a bevágás mindig fix px */
function buildMaskPath(W, H) {
  const side = (W - 2 * R - 2 * CI - N) / 2;
  const vDown = H - NOTCH_TOP_H - R;
  return [
    `M ${(W - R).toFixed(2)},${H}`,
    `H ${R}`,
    `c -5.7,0,-${R},-4.62,-${R},-${R}`,
    `V ${R}`,
    `C 0,4.62,4.62,0,${R},0`,
    `h ${side.toFixed(2)}`,
    `c 6.58,0,12.88,2.61,${CI},7.26`,
    `l ${N},${N}`,
    `c 4.65,4.65,10.95,7.26,${CI},7.26`,
    `h ${side.toFixed(2)}`,
    `c 5.7,0,${R},4.62,${R},${R}`,
    `v ${vDown.toFixed(2)}`,
    `c 0,5.7,-4.62,${R},-${R},${R}`,
    `Z`,
  ].join(" ");
}

export default function Hero() {
  const videoRef   = useRef(null);
  const sectionRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [maskPath,    setMaskPath]    = useState("");

  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  }, []);

  // ResizeObserver – újraszámolja a path-ot az elem valós mérete alapján
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const update = () => {
      const W = el.offsetWidth;
      const H = el.offsetHeight;
      if (W > 0 && H > 0) setMaskPath(buildMaskPath(W, H));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="hero-section relative overflow-hidden bg-black-dark flex flex-col">

      {/* Video background */}
      <div className="absolute inset-0 overflow-hidden p-4">

        {/* Egyetlen dinamikus clipPath – userSpaceOnUse pixelkoordináták */}
        <svg width="0" height="0" style={{ position: "absolute", overflow: "hidden" }}>
          <defs>
            <clipPath id="hero-mask" clipPathUnits="userSpaceOnUse">
              <path d={maskPath} />
            </clipPath>
          </defs>
        </svg>

        {/* Maszkolt tartály */}
        <div className="relative w-full h-full" style={{ clipPath: "url(#hero-mask)" }}>
          <video
            ref={videoRef}
            src="/hero-background.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-[0.55]"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.15) 100%)"
            }}
          />
        </div>
      </div>

      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-[120px] pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)" }}
      />

      {/* Header */}
      <header className="relative z-10 py-8 pr-4 pl-8">
        <div className="flex items-center justify-between gap-4 h-[72px] w-full">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center mr-2">
            <Image src="/fk-logo-green.svg" alt="FK Tető logó" width={80} height={80} priority />
          </Link>

          {/* Search bar */}
          <div className="relative shrink-0 w-[clamp(16rem,40vw,50rem)]">
            {/* Green icon – shows in the cut-away triangle */}
            <button
              className="absolute top-1/2 -translate-y-1/2 z-[1] bg-transparent border-0 cursor-pointer p-0 flex items-center justify-center"
              style={{ right: ICON_RIGHT }}
              aria-label="Keresés"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Clip wrapper – 45° diagonal cut */}
            <div
              className="relative z-[2]"
            >
              {/* White bar */}
              <div
                className="bg-cream flex items-center relative rounded-tl-[0.625rem] rounded-tr-[0.625rem]"
                style={{ height: BAR_H }}
              >
                <input
                  type="text"
                  placeholder="MIT KERESEL?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none pl-[1.125rem] pr-4 text-black-dark font-bold text-xs tracking-[0.12em] uppercase placeholder:text-black-dark/45"
                />
                {/* Black icon */}
                <button
                  className="absolute top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer p-0 flex items-center justify-center text-black-dark"
                  style={{ right: ICON_RIGHT }}
                  aria-label="Keresés"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1 ml-auto shrink-0 max-[900px]:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 font-bold text-[13px] tracking-[0.07em] uppercase py-2 px-[14px] no-underline transition-colors duration-200 whitespace-nowrap hover:text-accent"
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
            <Link
              href="/kalkulator"
              className="inline-flex flex-col items-center justify-center bg-accent text-black font-extrabold text-[11px] tracking-[0.07em] uppercase py-[10px] px-[18px] no-underline whitespace-nowrap leading-[1.3] ml-2 transition-all hover:bg-accent-dark"
            >
              Anyagszükséglet<br />
              <span className="opacity-[0.85]">Kalkulátor</span>
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="hidden max-[900px]:flex bg-transparent border-0 text-white cursor-pointer p-2 ml-auto"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-black-dark border-b border-white/10 z-20 px-8 pt-4 pb-6 flex flex-col">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-white font-bold text-xl tracking-[0.06em] uppercase py-3 no-underline border-b border-white/[0.06]"
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
          <Link href="/kalkulator" className="btn-primary mt-5 self-start" onClick={() => setMenuOpen(false)}>
            Anyagszükséglet kalkulátor
          </Link>
        </div>
      )}

      {/* Hero content */}
      <div className="relative z-[5] flex-1 flex flex-col justify-center items-center px-8 pb-12 max-w-[1440px] mx-auto w-full">
        <div className="inline-flex items-center gap-1.5 text-white/65 font-semibold text-[11px] tracking-[0.14em] uppercase mb-[18px] fade-in-up">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>Csurgó és környéke</span>
        </div>

        <h1
          className="font-bold leading-none tracking-[-0.02em] uppercase fade-in-up text-center"
          style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)", fontVariationSettings: '"wdth" 125, "wght" 700', animationDelay: "0.1s" }}
        >
          <span className="text-accent">Bádogos és<br />Tetőfedő anyag</span>
          <br />
          <span className="text-white">Kereskedés</span>
        </h1>
      </div>
    </section>
  );
}
