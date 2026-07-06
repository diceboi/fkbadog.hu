import { categories, getCategoryBySlug } from "@/data/categories";
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

  // Find the category in the static categories data for immediate rendering
  const staticCat = getCategoryBySlug(kategoria) || {
    nameFHU: kategoria.toUpperCase(),
    heroImage: "/products/classic-series/ALFA.webp",
    description: "Termékek a kiválasztott kategóriában",
  };

  const title = staticCat.nameFHU;

  return (
    <>
      <div className="relative bg-linear-to-b from-black-mid via-black-mid to-cream">
        <ProductsHero
          title={title}
          bgImage={staticCat.heroImage}
          breadcrumbs={[
            { href: "/termekek", label: "Termékek" },
            { label: title },
          ]}
        />
      </div>
      <section className="bg-cream">
        <div className="mx-auto px-4 lg:px-8">
          <ProductFiltersAndGrid kategoria={kategoria} />
        </div>
        <CategoryTabs activeSlug={kategoria} textColor={'text-black-mid'} activeColor={'text-black-mid'} />
      </section>
      <CalculatorCTA />
    </>
  );
}
