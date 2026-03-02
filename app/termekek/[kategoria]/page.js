import { notFound } from "next/navigation";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import ProductsHero from "@/components/products/ProductsHero";
import CategoryTabs from "@/components/products/CategoryTabs";
import ProductFiltersAndGrid from "@/components/products/ProductFiltersAndGrid";
import CalculatorCTA from "@/components/shared/CalculatorCTA";

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
  const cat = getCategoryBySlug(kategoria);
  if (!cat) notFound();

  const products = getProductsByCategory(kategoria);

  return (
    <>
      <ProductsHero
        title="Termékek"
        bgImage={cat.heroImage}
        breadcrumbs={[
          { href: "/termekek", label: "Termékek" },
          { label: cat.nameFHU },
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
