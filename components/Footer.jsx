"use client";
import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  "Gyors elérés": [
    { href: "/termekek", label: "Termékek" },
    { href: "/gyik", label: "GYIK" },
    { href: "/rolunk", label: "Rólunk" },
    { href: "/kapcsolat", label: "Kapcsolat" },
    { href: "/kalkulator", label: "Bádogos kalkulátor" },
  ],
  "Fontos linkek": [
    { href: "/adatvedelmi-tajekoztato", label: "Adatkezelési tájékoztató" },
    { href: "/aszf", label: "ÁSZF" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-white/[0.06] relative overflow-hidden pt-16">
      <div className="container">

        {/* Main grid */}
        <div className="grid grid-cols-4 max-md:grid-cols-2 max-[480px]:grid-cols-1 gap-12 pb-12 items-start">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4 no-underline">
              <Image src="/fk-logo-white.svg" alt="FK Tető" width={48} height={33} />
              <span className="font-black text-[13px] tracking-[0.12em] text-white uppercase leading-[1.2]">
                FK<br />TETŐ
              </span>
            </Link>
            <p className="text-white/45 text-[13px] leading-[1.7] max-w-[200px]">
              Bádogos és tetőfedő anyag kereskedés
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="section-label text-white/35 mb-4">{group}</p>
              <ul className="list-none">
                {links.map((link) => (
                  <li key={link.href} className="mb-2">
                    <Link
                      href={link.href}
                      className="text-white/55 text-[13px] no-underline transition-colors duration-200 hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social */}
          <div>
            <p className="section-label text-white/35 mb-4">Social média</p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white/55 flex items-center justify-center w-9 h-9 rounded-full border border-white/15 no-underline transition-all duration-200 hover:text-accent hover:border-accent"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/55 flex items-center justify-center w-9 h-9 rounded-full border border-white/15 no-underline transition-all duration-200 hover:text-accent hover:border-accent"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] py-4 flex justify-between items-center">
          <p className="text-white/25 text-[12px]">
            © {new Date().getFullYear()} FK Tető. Minden jog fenntartva.
          </p>
        </div>
      </div>

      {/* Big watermark */}
      <div className="text-center overflow-hidden -mt-5 select-none pointer-events-none">
        <span
          className="font-black text-white/[0.04] tracking-[0.02em] leading-none block"
          style={{ fontSize: "clamp(80px, 16vw, 200px)" }}
        >
          FK TETŐ
        </span>
      </div>
    </footer>
  );
}
