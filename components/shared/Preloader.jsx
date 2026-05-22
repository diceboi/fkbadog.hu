"use client";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [isFilling, setIsFilling] = useState(false);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    // Ha már lefutott, ne csináljunk semmit (az inline script már elrejtette)
    if (sessionStorage.getItem("preloader_run")) return;

    // Késleltetett indulás a hullámzó folyadékra
    const fillTimer = setTimeout(() => {
      setIsFilling(true);
    }, 0);

    // Két másodperc után elindítjuk a zoom (lyuk) animációt
    const zoomTimer = setTimeout(() => {
      setIsZooming(true);
    }, 2000);

    // Zoom animáció (0.8s) lefutása után teljesen levesszük
    const endTimer = setTimeout(() => {
      sessionStorage.setItem("preloader_run", "true");
      document.documentElement.classList.add("preloader-finished");
    }, 3000); 

    return () => {
      clearTimeout(fillTimer);
      clearTimeout(zoomTimer);
      clearTimeout(endTimer);
    };
  }, []);

  return (
    <div id="global-preloader" className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {/* Háttér réteg: Phase 1 alatt takarja az oldalt, Phase 2 alatt azonnal eltűnik */}
      <div className={`absolute inset-0 bg-accent ${isZooming ? "hidden" : "block"}`} />

      {/* Lyuk réteg (Zoom): Native SVG Mask a garantáltan pixelmentes és hiba-mentes lyukért */}
      {isZooming && (
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300vw] h-[300vh] animate-zoom-layer pointer-events-none"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <mask id="hole-mask">
              <rect width="100%" height="100%" fill="white" />
              <svg x="50%" y="50%" overflow="visible">
                <g className="animate-zoom-path">
                  <g transform="translate(-44.165, -30.37)">
                    <path
                      d="M87.11,0h-18.04c-.32,0-.63.13-.86.36l-19.28,19.28h0l-2.79,2.79c-.23.23-.54.36-.86.36h-6.11c-.67,0-1.21-.54-1.21-1.21v-5.16c0-.67.54-1.21,1.21-1.21h2.92c.32,0,.63-.13.86-.36l12.77-12.76c.77-.77.22-2.07-.86-2.07H1.21C.54,0,0,.54,0,1.21v12.76c0,.67.54,1.21,1.21,1.21h20.35c.67,0,1.21.54,1.21,1.21v5.16c0,.67-.54,1.21-1.21,1.21h-8.96c-.67,0-1.21.54-1.21,1.21v12.76c0,.67.54,1.21,1.21,1.21h8.96c.67,0,1.21.54,1.21,1.21v20.35c0,.67.54,1.21,1.21,1.21h12.76c.67,0,1.21-.54,1.21-1.21v-6.95c0-.32.13-.63.36-.86l9.75-9.75c.47-.47,1.24-.47,1.72,0l9.76,9.76c.23.23.36.54.36.86v6.95c0,.67.54,1.21,1.21,1.21h25.99c1.08,0,1.62-1.31.86-2.07l-27.44-27.44c-.47-.47-.47-1.24,0-1.72L87.97,2.07c.77-.77.22-2.07-.86-2.07Z"
                      fill="black"
                    />
                  </g>
                </g>
              </svg>
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="var(--color-accent)" mask="url(#hole-mask)" />
        </svg>
      )}

      {/* Logó és Folyadék réteg */}
      <div className={`absolute inset-0 flex items-center justify-center ${isZooming ? "flex animate-fade-out-fast" : "flex"}`}>
        <div
          className={`relative w-[160px] h-[160px] overflow-hidden ${isZooming ? "animate-zoom-logo" : ""}`}
          style={{
            WebkitMaskImage: "url(/fk-logo-green.svg)",
            WebkitMaskSize: "contain",
            WebkitMaskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            maskImage: "url(/fk-logo-green.svg)",
            maskSize: "contain",
            maskPosition: "center",
            maskRepeat: "no-repeat",
          }}
        >
          {/* Halvány sziluett */}
          <div className="absolute inset-0 bg-black-mid/10" />
          
          {/* Hullámzó folyadék */}
          <div
            className={`absolute w-[200%] h-[200%] left-[-50%] bg-black-mid rounded-[40%] ${
              isFilling ? "animate-liquid-wave" : "top-[100%]"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
