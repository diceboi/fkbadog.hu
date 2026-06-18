"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import CategoryTile from "./CategoryTile";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

export default function CategorySlider({ items, activeSlug, textColor, activeColor }) {
  const activeIndex = items.findIndex((item) => item.key === activeSlug);
  const initialSlide = activeIndex !== -1 ? activeIndex : 0;

  return (
    <div className="relative category-slider-container">
      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={1.5}
        slidesOffsetBefore={16}
        slidesOffsetAfter={16}
        initialSlide={initialSlide}
        navigation={{
          prevEl: ".category-slider-prev",
          nextEl: ".category-slider-next",
        }}
        breakpoints={{
          640: {
            slidesPerView: 2.2,
            slidesOffsetBefore: 16,
            slidesOffsetAfter: 16,
          },
          1024: {
            slidesPerView: 3.5,
            slidesOffsetBefore: 32,
            slidesOffsetAfter: 32,
          },
          1280: {
            slidesPerView: 4.5,
            slidesOffsetBefore: 32,
            slidesOffsetAfter: 32,
          },
        }}
        className="pb-8"
      >
        {items.map(({ key, label, image }) => (
          <SwiperSlide key={key} className="h-auto py-4">
            <CategoryTile
              slug={key}
              label={label}
              image={image}
              isActive={key === activeSlug}
              textColor={textColor}
              activeColor={activeColor}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      <div className="absolute top-1/2 -translate-y-1/2 right-2 lg:right-12 z-10 flex">
        <button
          className="category-slider-next w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-accent text-black flex items-center justify-center hover:scale-105 hover:bg-accent-light transition-all shadow-lg disabled:opacity-0 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Következő"
        >
          <FiChevronRight size={20} className="lg:size-6" />
        </button>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 left-2 lg:left-12 z-10 flex">
        <button
          className="category-slider-prev w-8 h-8 lg:w-12 lg:h-12 rounded-full bg-accent text-black flex items-center justify-center hover:scale-105 hover:bg-accent-light transition-all shadow-lg disabled:opacity-0 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Előző"
        >
          <FiChevronLeft size={20} className="lg:size-6" />
        </button>
      </div>
    </div>
  );
}
