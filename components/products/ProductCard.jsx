"use client";

import Image from "next/image";
import Link from "next/link";
import { H5, Small, Label, Span } from "@/components/ui/typography";

/**
 * Bottom corner shape — extracted from ProductTileBottom.svg
 * viewBox: 0 0 51.92 33.07 — just the diagonal corner element
 */

export default function ProductCard({ product }) {
  const formatPrice = (p) =>
    p.toLocaleString("hu-HU").replace(/\s/g, " ") + " Ft/" + product.unit;

  const stockColor =
    product.stock > 10 ? "#D6DF27" : product.stock > 0 ? "#f59e0b" : "#ef4444";

  return (
    <Link
      href={`/termekek/${product.category}/${product.slug}`}
      className="block no-underline group h-full"
    >
      <article className="relative transition-transform duration-300 h-full flex flex-col">
        {/* ── Closed card body — full border, all corners rounded ── */}
        <div className="relative z-1 flex-1 bg-white border-2 border-white group-hover:border-black-mid duration-300 rounded-t-lg rounded-br-lg overflow-hidden flex flex-col shadow-lg">
          {/* Badges */}
          <div className="absolute top-0 right-0 rounded-tr-sm rounded-bl-lg overflow-hidden z-4 flex flex-col">
            {product.isNew && (
              <Label as="span" className="bg-accent text-black type-h6 xl:p-4 p-2">
                ÚJ
              </Label>
            )}

            {product.isSale && (
              <Label as="span" className="bg-[#e53e3e] text-white px-2 py-0.75">
                AKCIÓ
              </Label>
            )}
          </div>

          {/* Brand badge */}
          {product.brand && (
            <div className="absolute z-4 bg-[#F3F1E9] flex items-center justify-center top-0 left-0 rounded-tl-sm rounded-br-lg xl:p-3 p-1 h-[32px] min-w-[48px]">
              {product.brand.toLowerCase() === 'bp2' ? (
                <Image src="/logos/BP2-logo-red.png" alt="BP2" width={40} height={16} className="object-contain w-auto h-4" />
              ) : (
                <span className="text-[#e11919] font-black text-sm tracking-tight uppercase">
                  {product.brand}
                </span>
              )}
            </div>
          )}

          {/* Image */}
          <div className="z-3 flex items-center justify-center pt-2 flex-1">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={260}
              height={240}
              className="object-contain transition-transform duration-500 group-hover:scale-105 px-4 max-h-40 w-auto h-auto"
            />
          </div>

          {/* Product name + material */}
          <div className="px-2 py-2">
            <H5 className="text-black uppercase type-h6 leading-[1] ">{product.name}</H5>

            {/* SKU */}
          {product.sku && (
            <div className="z-4 text-[10px] text-black/50 whitespace-nowrap uppercase right-4 bottom-[2%]">
              {product.sku}
            </div>
          )}

            <Small className="text-black block type-sm">
              {product.specs?.Anyag || "Alumínium tetőszellőző"}
            </Small>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-1 px-2 pb-3 pt-1">
            <div
              className="w-3.5 h-3.5 rounded-full"
              style={{
                backgroundColor: stockColor,
              }}
            />

            <div className="text-black type-small">
              Raktáron: {product.stock} db
            </div>
          </div>
        </div>

        {/* ── Bottom hanging section ── */}
        <div className="flex items-stretch w-full -mt-[12px] lg:h-[52px] h-[40px] bg-accent rounded-lg">
          {/* White card extension — fills remaining space on the left */}
          <div className="flex-1 bg-white border-l-2 border-b-2 border-white group-hover:border-black-mid transition-all duration-300 rounded-bl-lg z-2 lg:h-[52px] h-[40px]" />

          {/* SVG corner — maintains aspect ratio, transitions white→green */}
          <svg
            className="shrink-0 lg:h-[41px] h-[29px] lg:-ml-[2px] -ml-[1px] w-auto block mt-[10px] z-1 overflow-visible"
            viewBox="0 0 51.92 33.07"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="z-10"
              d="M0,0v33.07c6.37,0,12.47-2.53,16.97-7.03l17.98-17.98c4.5-4.5,10.61-7.03,16.97-7.03V0H0Z"
              fill="#FFFFFF"
            />
            <path
              d="M0,33.07c6.37,0,12.47-2.53,16.97-7.03l17.98-17.98c4.5-4.5,10.61-7.03,16.97-7.03"
              fill="none"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              className="stroke-white group-hover:stroke-black-mid transition-all duration-300"
            />
          </svg>

          {/* Price text — in the green area on the right */}
          <div className="shrink-0 flex items-center -ml-1 pl-0 lg:pr-4 pr-2 pt-0 lg:h-16 h-13">
            <Span className="uppercase type-h4 text-black-dark leading-none text-xs">
              {formatPrice(product.price)}
            </Span>
          </div>
        </div>
      </article>
    </Link>
  );
}
