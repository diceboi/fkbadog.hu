"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { H1, P, Label } from "@/components/ui/typography";
import BlockRevealWord from "@/components/animations/BlockRevealWord";
import MainCtaButton from "@/components/ui/MainCtaButton";
import { IoCloseOutline, IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const photos = [
  "/photos/0138f3f2-df23-4e40-986e-ebea45599cdb.jpg",
  "/photos/4afe475d-e9bc-4217-8a85-5d4bea08f436.jpg",
  "/photos/987760d1-84ef-4906-9649-6fcba29fb912.jpg",
  "/photos/398f16b2-a960-41d9-a3e2-c6522d95d4d8.jpg",
  "/photos/0a9f5e16-3aa9-45c6-8332-637fed53b33c.jpg",
];

// GÁLÉRIA POZÍCIÓK (Könnyen finomhangolható Tailwind osztályokkal)
const galleryClasses = [
  {
    transform: "rotate-[-12deg] translate-y-[20px] lg:translate-y-[60px]",
    zIndex: "z-10",
  },
  {
    transform: "rotate-[-4deg] translate-y-[5px] lg:translate-y-[15px]",
    zIndex: "z-20",
  },
  { transform: "rotate-0 translate-y-0 lg:translate-y-0", zIndex: "z-30" },
  {
    transform: "rotate-[4deg] translate-y-[5px] lg:translate-y-[15px]",
    zIndex: "z-20",
  },
  {
    transform: "rotate-[12deg] translate-y-[20px] lg:translate-y-[60px]",
    zIndex: "z-10",
  },
];

export default function AboutSnippet() {
  const [photoIndex, setPhotoIndex] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openLightbox = (index) => setPhotoIndex(index);
  const closeLightbox = () => setPhotoIndex(null);

  const showNext = useCallback(() => {
    if (photoIndex !== null) {
      setPhotoIndex((prev) => (prev + 1) % photos.length);
    }
  }, [photoIndex]);

  const showPrev = useCallback(() => {
    if (photoIndex !== null) {
      setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  }, [photoIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (photoIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [photoIndex, showNext, showPrev]);

  return (
    <section className="section bg-cream overflow-hidden">
      <div className="flex flex-col container gap-8">
        <Label as="p" className="text-center block mb-2 text-gray-dark">
          MIÉRT MI?
        </Label>
        <H1 className="type-h1 text-center flex flex-col items-center justify-center gap-2 md:gap-3 leading-[.8] mb-10 lg:mb-20">
          <span className="sr-only">Mi is Bádogosok vagyunk</span>

          <div
            className="flex flex-col items-center gap-2 md:gap-3"
            aria-hidden="true"
          >
            <span className="flex flex-wrap justify-center gap-x-2">
              <BlockRevealWord
                textClass="text-gray-mid"
                colorClass="bg-gray-mid"
                delay="100ms"
              >
                Mi is
              </BlockRevealWord>
            </span>
            <span className="flex flex-wrap justify-center gap-x-2">
              <BlockRevealWord
                textClass="text-accent"
                colorClass="bg-accent"
                delay="300ms"
              >
                Bádogosok
              </BlockRevealWord>
            </span>
            <span className="flex flex-wrap justify-center gap-x-2">
              <BlockRevealWord
                textClass="text-gray-mid"
                colorClass="bg-gray-mid"
                delay="500ms"
              >
                vagyunk
              </BlockRevealWord>
            </span>
          </div>
        </H1>

        {/* Photo collage */}
        <div className="flex justify-center items-center w-full pt-0 lg:pt-16 pb-16 lg:pb-32">
          {photos.map((src, i) => (
            <div
              key={src}
              onClick={() => openLightbox(i)}
              className={`
                relative shrink-0 transition-all duration-500 ease-out cursor-pointer origin-bottom
                ${galleryClasses[i].zIndex} 
                ${galleryClasses[i].transform}
                hover:!z-50 hover:scale-110 hover:-translate-y-4 lg:hover:-translate-y-6 hover:rotate-0 lg:hover:rotate-0
                ${i === 0 ? "ml-0" : "-ml-[35px] md:-ml-[50px] lg:-ml-[100px]"}
              `}
            >
              <div className="overflow-hidden rounded-lg lg:rounded-xl shadow-2xl relative w-[75px] h-[110px] md:w-[120px] md:h-[180px] lg:w-[240px] lg:h-[360px]">
                <Image
                  src={src}
                  alt={`Munka fotó ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 240px, (min-width: 768px) 120px, 75px"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Description + CTA */}
        <div className="flex justify-center flex-col items-center gap-8 max-w-[800px] mx-auto">
          <P className="text-gray-dark text-center font-medium text-sm lg:text-base leading-relaxed">
            Nem csak áruljuk a termékeket: nap mint nap használjuk is őket,
            ezért pontosan tudjuk, mi kell a szakmának a gyors, tiszta és tartós
            munkához. Olyan anyagokat és kiegészítőket válogattunk össze, amik a
            gyakorlatban is beválnak – és ha kérdésed van, szakmai szemmel
            segítünk, hogy biztosan a megfelelőt vidd.
          </P>
          <div className="shrink-0 flex items-center justify-center gap-6 flex-wrap">
            <MainCtaButton href="/rolunk">
              Kapcsolatfelvétel
            </MainCtaButton>
            <Link
              href="/kapcsolat"
              className="text-gray-dark font-semibold underline transition-opacity hover:opacity-70 uppercase type-small"
            >
              Tudj meg többet rólunk
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {photoIndex !== null && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center select-none transition-opacity duration-300 animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 z-50 text-white/70 hover:text-white transition-colors duration-200 p-2 bg-black/25 rounded-full hover:bg-black/50"
            onClick={closeLightbox}
            aria-label="Bezárás"
          >
            <IoCloseOutline size={32} />
          </button>

          {/* Navigation Arrows */}
          <button
            className="absolute left-4 lg:left-8 z-50 text-white/70 hover:text-white transition-colors duration-200 p-3 bg-black/25 rounded-full hover:bg-black/50"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Előző kép"
          >
            <IoChevronBackOutline size={28} />
          </button>

          <button
            className="absolute right-4 lg:right-8 z-50 text-white/70 hover:text-white transition-colors duration-200 p-3 bg-black/25 rounded-full hover:bg-black/50"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Következő kép"
          >
            <IoChevronForwardOutline size={28} />
          </button>

          {/* Active Image Container */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] aspect-[2/3] w-[450px] lg:w-[500px] max-md:w-[320px] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[photoIndex]}
              alt={`Munka fotó ${photoIndex + 1}`}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 500px, 320px"
              priority
            />
            {/* Image Counter Badge */}
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-black/60 text-white/90 text-xs font-semibold tracking-wider">
              {photoIndex + 1} / {photos.length}
            </span>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
