"use client";
import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  "Gyors elérés": [
    { href: "/termekek", label: "Termékek" },
    { href: "/gyik", label: "GYIK" },
    { href: "/rolunk", label: "Rólunk" },
    { href: "/kapcsolat", label: "Kapcsolat" },
    { href: "/kalkulator", label: "Bádog kalkulátor" },
  ],
  "Fontos linkek": [
    { href: "/adatvedelmi-tajekoztato", label: "Adatkezelési tájékoztató" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-black-mid relative overflow-hidden pt-28 lg:pt-36 pb-0 z-0">
      <div className="container relative overflow-visible pb-16 lg:pb-24">

        {/* Main layout */}
        <div className="flex flex-col md:flex-row justify-between gap-12 items-start relative z-10">

          {/* Brand Column (Left) */}
          <div className="flex flex-col gap-4 max-w-[280px]">
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <Image src="/fk-logo-white.svg" alt="FK Tető" width={48} height={33} />
            </Link>
            <p className="text-white/45 text-[13px] leading-[1.7]">
              Bádogos és tetőfedő anyag kereskedés
            </p>
          </div>

          {/* Right Columns Container (Right) */}
          <div className="flex flex-wrap md:flex-nowrap gap-12 md:gap-16 xl:gap-24 md:ml-auto w-full md:w-auto">
            {/* Link columns */}
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group} className="min-w-[140px]">
                <p className="text-white font-extrabold text-[12px] tracking-[0.1em] uppercase mb-4 opacity-80">{group}</p>
                <ul className="list-none p-0 m-0">
                  {links.map((link) => (
                    <li key={link.href} className="mb-3">
                      <Link
                        href={link.href}
                        className="text-white/45 text-[13px] no-underline transition-colors duration-200 hover:text-accent font-semibold"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Social Column */}
            <div className="min-w-[120px]">
              <p className="text-white font-extrabold text-[12px] tracking-[0.1em] uppercase mb-4 opacity-80">Social média</p>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-white/45 hover:text-accent transition-colors duration-200"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-white/45 hover:text-accent transition-colors duration-200"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Big watermark stretched exactly across container edges */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-[38%] pointer-events-none select-none z-0 flex justify-between font-black text-white/[0.03] text-[12.5vw] xl:text-[170px] leading-none uppercase tracking-tighter w-full">
          <span>F</span>
          <span>K</span>
          <span className="w-[3vw] xl:w-[40px]" /> {/* Spacer for word break */}
          <span>T</span>
          <span>E</span>
          <span>T</span>
          <span>Ő</span>
        </div>
      </div>
    </footer>
  );
}
