"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";

const SHAPE_URL = "/svg/CategoryTileShape.svg";

function parseViewBox(viewBox) {
  const values = viewBox
    .trim()
    .split(/\s+/)
    .map((value) => Number(value));

  if (values.length !== 4 || values.some(Number.isNaN)) {
    return {
      minX: 0,
      minY: 0,
      width: 800,
      height: 500,
    };
  }

  return {
    minX: values[0],
    minY: values[1],
    width: values[2],
    height: values[3],
  };
}

export default function CategoryTile({ slug, label, image, href }) {
  const uid = useId().replace(/:/g, "_");

  const clipId = `categoryClip_${uid}`;
  const gradientId = `categoryGradient_${uid}`;

  const [shape, setShape] = useState({
    loaded: false,
    path: "",
    viewBox: "0 0 800 500",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadShape() {
      try {
        const response = await fetch(SHAPE_URL);

        if (!response.ok) {
          throw new Error(`Nem sikerült betölteni: ${SHAPE_URL}`);
        }

        const svgText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");

        const svg = doc.querySelector("svg");
        const path = doc.querySelector("path[d]");

        const viewBox = svg?.getAttribute("viewBox") || "0 0 800 500";
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
        console.error("CategoryTileShape.svg hiba:", error);

        if (isMounted) {
          setShape({
            loaded: false,
            path: "",
            viewBox: "0 0 800 500",
          });
        }
      }
    }

    loadShape();

    return () => {
      isMounted = false;
    };
  }, []);

  const viewBoxData = parseViewBox(shape.viewBox);

  const imageX = viewBoxData.minX + viewBoxData.width * 0.08;
  const imageY = viewBoxData.minY + viewBoxData.height * 0.06;
  const imageW = viewBoxData.width * 0.84;
  const imageH = viewBoxData.height * 0.72;

  return (
    <Link
      href={href || `/termekek/${slug}`}
      className="block no-underline group"
    >
      <div className="relative overflow-visible aspect-16/10 bg-transparent">
        {shape.loaded && (
          <>
            {/* SVG alap: háttér, maszkolt kép, kontúr */}
            <svg
              className="absolute inset-0 z-1 h-full w-full overflow-visible pointer-events-none"
              viewBox={shape.viewBox}
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#202124" />
                  <stop offset="100%" stopColor="#191A1D" />
                </linearGradient>

                <clipPath id={clipId}>
                  <path d={shape.path} />
                </clipPath>
              </defs>

              {/* Sötét forma */}
              <path d={shape.path} fill={`url(#${gradientId})`} />

              {/* Kép a forma belsejébe maszkolva */}
              <g clipPath={`url(#${clipId})`}>
                <image
                  href={image}
                  x={imageX}
                  y={imageY}
                  width={imageW}
                  height={imageH}
                  preserveAspectRatio="xMidYMid meet"
                  className="transition-transform duration-500 group-hover:scale-105 origin-center transform-fill"
                />
              </g>

              {/* Sárga kontúr */}
              <path
                d={shape.path}
                fill="none"
                stroke="#D6DF27"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Felirat külön rétegben */}
            <div className="absolute z-3 right-0 bottom-0 w-1/2 text-right">
              <span className="uppercase text-white type-h6">{label}</span>
            </div>
          </>
        )}

        {/* Fallback, ha az SVG nem töltődne be */}
        {!shape.loaded && (
          <div className="absolute inset-0 rounded-[14px] bg-linear-to-b from-[#202124] to-[#191A1D] border-2 border-[#D6DF27]">
            <Image
              src={image}
              alt={label}
              fill
              className="object-contain pt-4 px-5 pb-14"
            />

            <div className="absolute right-0 bottom-0 w-1/2 text-right">
              <span className="block text-[#F4F0E8] font-extrabold text-[clamp(12px,1.45vw,14px)] leading-[0.95] uppercase tracking-[-0.035em] [text-shadow:0_2px_6px_rgba(0,0,0,0.45)]">
                {label}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
