import Link from "next/link";
import { supabase, mapSupabaseProductToLocal } from "@/lib/supabase";
import ProductCard from "@/components/products/ProductCard";

export default async function PopularProducts() {
  // Fetch top 10 products from Supabase
  const { data: termekek, error } = await supabase
    .from("termekek")
    .select("*")
    .limit(10);

  const products = (termekek || []).map(mapSupabaseProductToLocal);

  return (
    <section className="section bg-cream z-1 pb-20">
      <div className="flex justify-between items-end xl:px-8 px-4 mb-6">
        <div>
          <p className="text-black-dark type-h5 uppercase">Népszerű termékek</p>
        </div>

        <Link href="/termekek" className="btn-outline z-1">
          Összes termék →
        </Link>
      </div>

      <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-2 xl:px-8 px-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
