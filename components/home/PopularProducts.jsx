import Link from "next/link";
import { supabase, mapSupabaseProductToLocal } from "@/lib/supabase";
import ProductCard from "@/components/products/ProductCard";

export default async function PopularProducts() {
  // 1. Próbáljuk lekérdezni az új 'products' táblából az aktív termékeket
  let { data: productsData, error } = await supabase
    .from("products")
    .select("*")
    .eq("aktiv", true)
    .limit(10);

  // 2. Ha az új tábla még nem készült el vagy üres, fallback a régi termekek-re
  if (error || !productsData || productsData.length === 0) {
    const { data: oldData } = await supabase
      .from("termekek")
      .select("*")
      .limit(10);
    productsData = oldData || [];
  }

  const products = (productsData || []).map(mapSupabaseProductToLocal).filter(Boolean);


  return (
    <section className="section bg-cream z-1 pb-20">
      <div className="flex justify-between items-end xl:px-8 px-4 mb-6">
        <div>
          <p className="text-black-dark type-h5 uppercase leading-[1.15]">
            Népszerű termékek
          </p>
        </div>
      </div>

      <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2 xl:px-8 px-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <Link href="/termekek/classic-series" className="btn-outline z-1 ">
        Összes termék →
      </Link>
    </section>
  );
}
