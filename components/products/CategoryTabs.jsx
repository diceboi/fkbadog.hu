"use client";
import CategorySlider from "@/components/home/CategorySlider";
import { categories } from "@/data/categories";

export default function CategoryTabs({ activeSlug }) {
  const sliderItems = categories.map((cat) => ({
    key: cat.slug,
    label: cat.nameFHU,
    image: cat.image,
  }));

  return (
    <section className="py-6 overflow-hidden">
      <div className="mx-auto px-4 lg:px-8 mb-4">
        <p className="section-label">Kategóriák</p>
      </div>
      <CategorySlider items={sliderItems} activeSlug={activeSlug} />
    </section>
  );
}
