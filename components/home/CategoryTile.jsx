"use client";

import Image from "next/image";
import Link from "next/link";

export default function CategoryTile({ slug, label, image, href }) {
  return (
    <Link
      href={href || `/termekek/${slug}`}
      className="block no-underline group h-full"
    >
      <article className="relative transition-transform duration-300 h-full min-h-[200px] group flex flex-col overflow-visible">

        
        {/* ── Closed card body — dark gradient background, yellow border ── */}
        <div className="relative z-2 flex-1 bg-black-mid border-black-mid border-2 group-hover:border-accent transition-all duration-300 rounded-t-lg rounded-br-lg overflow-hidden flex flex-col ">          
          {/* Image Container */}
          <div className="z-3 flex items-center justify-center flex-1 p-6 pb-2">
            <Image
              src={image}
              alt={label}
              width={260}
              height={160}
              className="object-contain transition-transform duration-500 group-hover:scale-105 max-h-[140px] w-auto h-auto"
            />
          </div>
        </div>

        {/* ── Bottom hanging section ── */}
        <div className="flex items-stretch w-full h-[53px] bg-transparent -mt-[2px] z-2">
          {/* Dark card extension — matching the bottom gradient color */}
          <div className="flex-1 bg-black-mid border-black-mid border-l-2 border-b-2 group-hover:border-accent group-hover:border-l-2 group-hover:border-b-2 transition-all duration-300 rounded-bl-lg z-0 h-[42px]" />

          {/* SVG corner — transitions dark → transparent */}
          <svg
            className="shrink-0 h-[41px] w-auto block -ml-[1px]  z-[100] overflow-visible"
            viewBox="0 0 51.92 33.07"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0v33.07c6.37,0,12.47-2.53,16.97-7.03l17.98-17.98c4.5-4.5,10.61-7.03,16.97-7.03V0H0Z"
              fill="#1D1D1E"
            />
            <path
              d="M0,33.07c6.37,0,12.47-2.53,16.97-7.03l17.98-17.98c4.5-4.5,10.61-7.03,16.97-7.03"
              fill="none"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              className="stroke-black-mid group-hover:stroke-accent transition-all duration-300"
            />

          </svg>

          {/* Text container / empty spacer on the right */}
          <div className="shrink flex items-center justify-end -ml-1 pl-2 pr-0  z-3 max-w-[65%] w-min h-[58px]">
            <span className="uppercase text-white type-h6 leading-[1.15] text-wrap text-right break-words">
              {label}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};