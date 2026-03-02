import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import USPBanner from "@/components/home/USPBanner";
import PopularProducts from "@/components/home/PopularProducts";
import AboutSnippet from "@/components/home/AboutSnippet";
import CalculatorCTA from "@/components/shared/CalculatorCTA";

export const metadata = {
  title: "FK Tető – Bádogos és Tetőfedő Anyag Kereskedés",
  description:
    "Minőségi bádogos és tetőfedő anyagok, tetőszellőzők és trapézlemezek a legjobb árakon. Lefoglalás és anyagszükséglet kalkulátor.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <USPBanner />
      <PopularProducts />
      <AboutSnippet />
      <CalculatorCTA />
    </>
  );
}
