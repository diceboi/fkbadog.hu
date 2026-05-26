import { notFound } from "next/navigation";
import { categories, getCategoryBySlug } from "@/data/categories";
import ProductsHero from "@/components/products/ProductsHero";
import CategoryTabs from "@/components/products/CategoryTabs";
import ProductFiltersAndGrid from "@/components/products/ProductFiltersAndGrid";
import CalculatorCTA from "@/components/shared/CalculatorCTA";
import { supabase, mapSupabaseProductToLocal } from "@/lib/supabase";

export async function generateStaticParams() {
  return categories.map((cat) => ({ kategoria: cat.slug }));
}

export async function generateMetadata({ params }) {
  const { kategoria } = await params;
  const cat = getCategoryBySlug(kategoria);
  if (!cat) return {};
  return {
    title: `${cat.nameFHU} – FK Tető`,
    description: cat.description,
  };
}

export default async function KategoriaPage({ params }) {
  const { kategoria } = await params;
  
  // Try to find the category in the static categories data for hero image/description
  const staticCat = getCategoryBySlug(kategoria) || {
    nameFHU: kategoria.toUpperCase(),
    heroImage: "/products/classic-series/ALFA.webp",
    description: "Termékek a kiválasztott kategóriában"
  };

  // Dynamically map slug back to db csoport_nev
  const { data: catData } = await supabase.from("termekek").select("csoport_nev").limit(1000);
  const distinctGroups = [...new Set((catData || []).map(d => d.csoport_nev).filter(Boolean))];
  
  const groupMapping = distinctGroups.reduce((acc, group) => {
    const slug = group.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
      .replace(/ó/g, 'o').replace(/ö/g, 'o').replace(/ő/g, 'o')
      .replace(/ú/g, 'u').replace(/ü/g, 'u').replace(/ű/g, 'u')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    acc[slug] = group;
    return acc;
  }, {});

  const dbGroup = groupMapping[kategoria];

  let query = supabase.from("termekek").select("*");
  if (dbGroup) {
    query = query.eq("csoport_nev", dbGroup);
  } else {
    // Fallback if not found
    query = query.limit(50); 
  }

  const { data: termekek } = await query;
  const products = (termekek || []).map(mapSupabaseProductToLocal);

  return (
    <>
      <ProductsHero
        title="Termékek"
        bgImage={staticCat.heroImage}
        breadcrumbs={[
          { href: "/termekek", label: "Termékek" },
          { label: dbGroup || staticCat.nameFHU },
        ]}
      />
      <CategoryTabs activeSlug={kategoria} />
      <section style={{ background: "#0d0d0d", padding: "48px 0 80px" }}>
        <div className="container">
          <ProductFiltersAndGrid products={products} />
        </div>
      </section>
      <CalculatorCTA />
    </>
  );
}
