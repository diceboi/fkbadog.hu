"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { H5, Small, Label, Span } from "@/components/ui/typography";

const PRODUCT_TILE_SHAPE_URL = "/svg/ProductTileShape.svg";

function useSvgPath(url, fallbackViewBox = "0 0 800 720") {
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
        console.error("ProductTileShape.svg betöltési hiba:", error);

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

export default function ProductCard({ product }) {
  const shape = useSvgPath(PRODUCT_TILE_SHAPE_URL);

  const clipId = useMemo(
    () => `productTileClip_${product.id}`.replace(/[^a-zA-Z0-9_-]/g, "_"),
    [product.id],
  );

  const formatPrice = (p) =>
    p.toLocaleString("hu-HU").replace(/\s/g, " ") + " Ft/" + product.unit;

  const stockColor =
    product.stock > 10 ? "#D6DF27" : product.stock > 0 ? "#f59e0b" : "#ef4444";

  return (
    <Link
      href={`/termekek/${product.category}/${product.slug}`}
      className="block no-underline group h-full "
    >
      <article className="relative overflow-visible transition-transform duration-300 group-hover:-translate-y-1 h-full aspect-[1/1.18]">
        {/* Ár kártya mögött */}
        <div className="absolute bg-linear-to-b from-[#adb420] to-accent flex items-end justify-end z-0 right-0 bottom-0 min-w-[75%] h-[15%] pl-7 pr-4 rounded-none rounded-br-lg p-4">
          <Span className="uppercase type-h4 text-black-dark">
            {formatPrice(product.price)}
          </Span>
        </div>

        {shape.loaded && (
          <svg
            className="absolute inset-0 z-1 h-full w-full pointer-events-none overflow-visible"
            viewBox={shape.viewBox}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id={clipId}>
                <path d={shape.path} />
              </clipPath>
            </defs>

            <path d={shape.path} fill="#FFFFFF" />

            <path
              d={shape.path}
              fill="none"
              stroke="#3A3A3A"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        )}

        {!shape.loaded && (
          <div className="absolute inset-0 z-1 bg-white border-2 border-black-dark hover:border-accent rounded-8" />
        )}

        <div className="absolute flex flex-col gap-4 inset-0 z-2">
          {/* Badges */}
          <div className="absolute top-px right-px rounded-tr-[10px] rounded-bl-lg overflow-hidden z-4 flex flex-col">
            {product.isNew && (
              <Label as="span" className="bg-accent text-black type-h6 p-4">
                ÚJ
              </Label>
            )}

            {product.isSale && (
              <Label as="span" className="bg-[#e53e3e] text-white px-2 py-0.75">
                AKCIÓ
              </Label>
            )}
          </div>

          {/* SKU, ha kell finoman jobb oldalon */}
          {product.sku && (
            <div className="absolute z-4 text-[10px] font-bold tracking-[0.14em] text-black/25 whitespace-nowrap uppercase right-4 bottom-[2%] transform-[rotate(90deg)_translateX(-50%)] origin-[right_center]">
              {product.sku}
            </div>
          )}

          {/* Márka badge jobb felül */}
          <div className="absolute z-4 rounded-full bg-[#F3F1E9] flex items-center justify-center top-7.5 right-8.5 w-14.5 h-14.5">
            <span className="text-[#e11919] font-black text-sm tracking-tight">
              BP2
            </span>
          </div>

          {/* Kép */}
          <div className="z-3 flex items-center justify-center pt-2">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={260}
              height={240}
              className="object-contain transition-transform duration-500 group-hover:scale-105 px-4 max-h-40 w-auto h-auto"
            />
          </div>

          {/* Termék név + anyag */}
          <div className="px-4">
            <H5 className="text-black uppercase type-h5">{product.name}</H5>

            <Small className="text-black block type-sm">
              {product.specs?.Anyag || "Alumínium tetőszellőző"}
            </Small>
          </div>

          {/* Raktár */}
          <div className="flex items-center gap-3 left-0 top-0 px-4">
            <div
              className="w-3.5 h-3.5 rounded-full"
              style={{
                backgroundColor: stockColor,
              }}
            />

            <div className="uppercase text-black type-small">
              Raktáron: {product.stock} db
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
