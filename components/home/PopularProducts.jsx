"use client";

import Link from "next/link";
import { getPopularProducts } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";

export default function PopularProducts() {
  const products = getPopularProducts(10);

  return (
    <section className="section bg-cream z-1">
      <div className="flex justify-between items-end px-8 mb-6">
        <div>
          <p className="text-black-dark type-h5 uppercase">Népszerű termékek</p>
        </div>

        <Link href="/termekek" className="btn-outline z-1">
          Összes termék →
        </Link>
      </div>

      <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-5 px-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
