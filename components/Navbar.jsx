"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";

const navLinks = [
  { href: "/termekek", label: "Termékek" },
  { href: "/gyik", label: "GYIK" },
  { href: "/rolunk", label: "Rólunk" },
  { href: "/kapcsolat", label: "Kapcsolat" },
];

const SEARCH_END_SHAPE_URL = "/svg/SearchBarEndShape.svg";

const SEARCH = {
  height: 50,
  radius: 8,
  inputPaddingLeft: 22,
  inputPaddingRight: 12,
};

const SHAPE = {
  navHeight: 116,

  menuShapeHeight: 116,
  menuShapeWidth: 700,

  cutWidth: 116,

  rightTopRadius: 0,
  rightBottomRadius: 0,
  leftBottomRadius: 16,
};

function parseViewBox(viewBox) {
  const values = viewBox
    .trim()
    .split(/\s+/)
    .map((value) => Number(value));

  if (values.length !== 4 || values.some(Number.isNaN)) {
    return {
      minX: 0,
      minY: 0,
      width: 100,
      height: 48,
    };
  }

  return {
    minX: values[0],
    minY: values[1],
    width: values[2],
    height: values[3],
  };
}

function useSvgPath(url, fallbackViewBox = "0 0 100 48") {
  const [shape, setShape] = useState({
    loaded: false,
    path: "",
    viewBox: fallbackViewBox,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadShape() {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Nem sikerült betölteni: ${url}`);
        }

        const svgText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");

        const svg = doc.querySelector("svg");
        const path = doc.querySelector("path[d]");

        const viewBox = svg?.getAttribute("viewBox") || fallbackViewBox;
        const d = path?.getAttribute("d");

        if (!d) {
          throw new Error("Az SVG-ben nem található path d attribútum.");
        }

        if (isMounted) {
          setShape({
            loaded: true,
            path: d,
            viewBox,
          });
        }
      } catch (error) {
        console.error("SVG shape betöltési hiba:", error);

        if (isMounted) {
          setShape({
            loaded: false,
            path: "",
            viewBox: fallbackViewBox,
          });
        }
      }
    }

    loadShape();

    return () => {
      isMounted = false;
    };
  }, [url, fallbackViewBox]);

  return shape;
}



function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const endShape = useSvgPath(SEARCH_END_SHAPE_URL, "0 0 100 48");

  return (
    <div
      className="relative flex-1 w-full flex items-center group transition-all duration-300 h-[40px] xl:h-[50px]"
      style={{
        filter: "drop-shadow(0 0 20px rgba(214, 223, 39, 0.25))",
      }}
    >
      {/* Bal oldali input rész */}
      <div
        className="flex-1 flex items-center relative z-10 border-y border-l border-cream border-r-0 overflow-hidden h-full"
        style={{
          borderTopLeftRadius: SEARCH.radius,
          borderBottomLeftRadius: isSearchFocused ? 0 : SEARCH.radius,
          background: "var(--color-cream)",
          transition: "border-radius 0.3s ease-in-out",
        }}
      >
        <input
          type="text"
          placeholder="MIT KERESEL?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => {
            // setTimeout to allow clicking on links before it closes
            setTimeout(() => setIsSearchFocused(false), 200);
          }}
          className="relative z-20 w-full h-full pl-4 pr-10 bg-transparent outline-none font-bold text-[10px] xl:text-xs tracking-[0.12em] uppercase text-black-dark placeholder:text-black-dark/60"
        />
      </div>

      {/* Jobb oldali SVG shape */}
      <button
        type="button"
        className="relative shrink-0 h-full aspect-square bg-transparent cursor-pointer p-0 m-0 outline-none overflow-visible -ml-px z-20 flex items-center justify-center"
        aria-label="Keresés"
      >
        {endShape.loaded ? (
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox={endShape.viewBox}
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Aktív háttér (Mindig cream) */}
            <path
              d={endShape.path}
              fill="var(--color-cream)"
              className="opacity-100"
            />

            {/* Kontúr */}
            <path
              d={endShape.path}
              fill="none"
              stroke="var(--color-cream)"
              strokeWidth="0"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ) : (
          <div
            className="absolute inset-0 border-y border-r border-cream"
            style={{
              borderTopRightRadius: SEARCH.radius,
              borderBottomRightRadius: SEARCH.radius,
              background: "var(--color-cream)",
            }}
          />
        )}

        {/* Kereső ikon */}
        <FiSearch
          className="relative z-10 transition-transform duration-300 group-hover:scale-110 text-black-dark mr-3 xl:mr-6 w-4 h-4 xl:w-6 xl:h-6"
        />
      </button>

      {/* Dropdown javaslatok */}
      <div
        className={`absolute outline-1 outline-cream top-[calc(100%-8px)] left-[1px] w-[calc(100%-2px)] bg-cream z-[5] overflow-hidden transition-all duration-300 ease-in-out ${isSearchFocused
          ? "max-h-[300px] border-t border-black/10 opacity-100"
          : "max-h-0 opacity-0 pointer-events-none"
          }`}
        style={{
          borderBottomLeftRadius: SEARCH.radius,
          borderBottomRightRadius: SEARCH.radius,
        }}
      >
        <div className="p-5 flex flex-col gap-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40 m-0">
            Gyakori keresések
          </p>
          <ul className="flex flex-col gap-2 m-0 p-0 list-none">
            <li>
              <Link
                href="/termekek"
                className="text-sm font-bold text-black-dark hover:text-[#7f8518] transition-colors flex items-center gap-2 no-underline"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                Trapézlemezek
              </Link>
            </li>
            <li>
              <Link
                href="/termekek"
                className="text-sm font-bold text-black-dark hover:text-[#7f8518] transition-colors flex items-center gap-2 no-underline"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                Cserepeslemezek
              </Link>
            </li>
            <li>
              <Link
                href="/termekek"
                className="text-sm font-bold text-black-dark hover:text-[#7f8518] transition-colors flex items-center gap-2 no-underline"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                Ereszcsatorna rendszerek
              </Link>
            </li>
            <li>
              <Link
                href="/termekek"
                className="text-sm font-bold text-black-dark hover:text-[#7f8518] transition-colors flex items-center gap-2 no-underline"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                Sík- és tekercslemezek
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-75 ${isScrolled ? "pt-0 pl-0" : "pt-4 xl:pt-8 pl-0 xl:pl-8"
          } h-[70px] xl:h-[116px]`}
      >
        {/* Full-width grey-mid strip above nav content — fills the top padding space */}
        <div
          className={`absolute top-0 left-0 right-0 bg-black-mid transition-all duration-75 hidden xl:block ${isScrolled ? "h-0" : "h-8"
            }`}
        />
        <div
          className={`relative z-10 flex items-start justify-between gap-2 xl:gap-4 w-full transition-all duration-75 ${isScrolled ? "pl-4 pr-0 xl:pl-8 xl:pr-4" : "pl-8 pr-4"
            } h-[70px] xl:h-[116px]`}
        >
          <div
            className="flex items-center gap-2 xl:gap-4 flex-1 h-[70px] xl:h-[116px]"
          >
            <Link href="/" className="shrink-0 flex items-center mr-2 relative">
              <Image
                src="/fk-logo-green.svg"
                alt="FK Tető logó"
                width={80}
                height={80}
                priority
                className={`w-[58px] h-[58px] xl:w-[80px] xl:h-[80px] object-contain transition-opacity duration-150 ${isScrolled ? "opacity-0" : "opacity-100"}`}
              />
              <div
                className={`absolute inset-0 transition-opacity duration-150 pointer-events-none ${isScrolled ? "opacity-100" : "opacity-0"
                  }`}
                style={{
                  backdropFilter: "invert(1) blur(5px)",
                  WebkitBackdropFilter: "invert(1) blur(5px)",
                  WebkitMaskImage: "url(/fk-logo-green.svg)",
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskImage: "url(/fk-logo-green.svg)",
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                }}
              />
            </Link>

            <SearchBar />
          </div>

          <div
            className="relative ml-auto shrink-0 hidden xl:flex h-[116px]"
          >
            <img
              src="/svg/NavBarLeftEnd.svg"
              alt=""
              className="h-full w-auto object-cover pointer-events-none -mr-[1px]"
            />
            <div
              className="relative z-[2] flex items-center justify-end gap-1 transition-all duration-75 h-full"
              style={{
                paddingRight: 16,
                paddingLeft: 20,
                backgroundColor: "var(--color-black-mid)",
              }}
            >
              <div
                className={`absolute top-0 bottom-0 right-0 w-[16px] bg-black-mid transition-transform duration-75 z-[-1] ${isScrolled ? "translate-x-full" : "translate-x-0"
                  }`}
              />
              <img
                src="/svg/InnerRound.svg"
                alt=""
                className={`absolute top-29 right-4 w-[10px] h-[10px] pointer-events-none transition-opacity duration-75 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}
              />
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/80 font-bold text-[13px] tracking-[0.07em] uppercase py-2 px-[14px] no-underline transition-colors duration-200 whitespace-nowrap hover:text-accent"
                >
                  <span className="relative inline-block overflow-hidden px-1">
                    <span className="inline-block opacity-0 animate-block-reveal-text" style={{ animationDelay: `${600 + index * 100}ms` }}>
                      {link.label.toUpperCase()}
                    </span>
                    <span className="absolute inset-0 bg-accent animate-block-reveal-mask" style={{ animationDelay: `${600 + index * 100}ms`, transform: "translateX(-101%)" }} />
                  </span>
                </Link>
              ))}

              <span className="relative inline-block overflow-hidden ml-2 rounded-[8px]">
                <Link
                  href="/kalkulator"
                  className="inline-flex flex-col items-center justify-center bg-accent text-black font-extrabold text-[11px] tracking-[0.07em] uppercase py-[10px] px-[18px] no-underline whitespace-nowrap leading-[1.3] transition-all hover:opacity-90 opacity-0 animate-block-reveal-text"
                  style={{ animationDelay: `${600 + navLinks.length * 100}ms` }}
                >
                  Anyagszükséglet
                  <br />
                  <span className="opacity-[0.85]">Kalkulátor</span>
                </Link>
                <span className="absolute inset-0 bg-white animate-block-reveal-mask" style={{ animationDelay: `${600 + navLinks.length * 100}ms`, transform: "translateX(-101%)" }} />
              </span>
            </div>
          </div>

          <button
            className="flex xl:hidden items-center justify-end bg-transparent border-0 cursor-pointer p-0 my-auto h-[40px] w-[40px] relative"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü"
          >
            {/* Hamburger */}
            <span className={`absolute inset-0 flex items-center ${isScrolled ? "justify-start ml-1" : "justify-start ml-2"} transition-all duration-300 ${menuOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`}>
              <span className="relative flex items-end h-1/2">
                <img src="/svg/HamburgerToggle.svg" alt="" className={`h-full w-auto transition-opacity duration-150 ${isScrolled ? 'opacity-0' : 'opacity-100'}`} />
                <div
                  className={`absolute inset-0 transition-opacity duration-150 pointer-events-none ${isScrolled ? "opacity-100" : "opacity-0"
                    }`}
                  style={{
                    backdropFilter: "invert(1)",
                    WebkitBackdropFilter: "invert(1)",
                    WebkitMaskImage: "url(/svg/HamburgerToggle.svg)",
                    WebkitMaskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskImage: "url(/svg/HamburgerToggle.svg)",
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                  }}
                />
              </span>
            </span>

            {/* X */}
            <span className={`absolute inset-0 flex items-center ${isScrolled ? "justify-start mr-1" : "justify-start"} transition-all duration-300 ${menuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-cream)" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </span>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black-mid z-40 flex flex-col px-4 pt-16 pb-6 transition-transform duration-500 ease-in-out ${menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        style={{
          transitionDelay: menuOpen ? "0ms" : "300ms",
        }}
      >
        <div className="flex flex-col flex-1 overflow-y-auto mt-4">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-white font-bold text-2xl tracking-[0.06em] uppercase py-4 no-underline border-b border-white/[0.06] transition-all duration-300 ${menuOpen ? "" : "opacity-0"
                }`}
              style={{
                transitionDelay: menuOpen
                  ? "0ms"
                  : `${(navLinks.length - index) * 50}ms`,
              }}
            >
              <span className="relative inline-block overflow-hidden px-2 -mx-2">
                <span
                  className={`inline-block transition-opacity duration-300 ${menuOpen ? "opacity-0 animate-block-reveal-text" : "opacity-0"}`}
                  style={{ animationDelay: menuOpen ? `${400 + index * 100}ms` : '0ms' }}
                >
                  {link.label.toUpperCase()}
                </span>
                {menuOpen && (
                  <span
                    className="absolute inset-0 bg-accent animate-block-reveal-mask"
                    style={{ animationDelay: `${400 + index * 100}ms`, transform: "translateX(-101%)" }}
                  />
                )}
              </span>
            </Link>
          ))}

          <div
            className={`mt-8 self-start transition-all duration-300 ${menuOpen ? "" : "opacity-0"}`}
            style={{ transitionDelay: menuOpen ? "0ms" : "0ms" }}
          >
            <span className="relative inline-block overflow-hidden rounded-full">
              <Link
                href="/kalkulator"
                className={`btn-primary transition-opacity duration-300 ${menuOpen ? "opacity-0 animate-block-reveal-text" : "opacity-0"}`}
                style={{
                  animationDelay: menuOpen ? `${400 + navLinks.length * 100}ms` : "0ms",
                }}
                onClick={() => setMenuOpen(false)}
              >
                Anyagszükséglet kalkulátor
              </Link>
              {menuOpen && (
                <span
                  className="absolute inset-0 bg-white animate-block-reveal-mask"
                  style={{ animationDelay: `${400 + navLinks.length * 100}ms`, transform: "translateX(-101%)" }}
                />
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
