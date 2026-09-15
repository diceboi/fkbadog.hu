import Link from "next/link";
import CategoryTile from "./CategoryTile";
import CategorySlider from "./CategorySlider";
import { supabase } from "@/lib/supabase";

// Fallback images for dynamic categories
const fallbackImages = [
  "/products/compact-series/STIGMA 2.0.jpg",
  "/products/classic-series/ALFA.webp",
  "/products/classic-series/STIGMA.webp",
  "/products/classic-series/BAVARIA Roof.webp",
  "/products/classic-series/GAMMA.webp",
  "/products/classic-series/HETA.webp"
];

export default async function CategoryGrid({ textColor, activeColor }) {
  // 1. Elsődlegesen az új 'products' tábla kategóriáinak lekérdezése
  let distinctGroups = [];
  const { data: newCatData, error: newCatError } = await supabase
    .from("products")
    .select("kategoria")
    .eq("aktiv", true);

  if (!newCatError && newCatData && newCatData.length > 0) {
    distinctGroups = [...new Set(newCatData.map((d) => d.kategoria).filter(Boolean))];
  } else {
    // 2. Fallback: régi termekek tábla
    const { data: oldCatData } = await supabase
      .from("termekek")
      .select("csoport_nev")
      .limit(1000);
    distinctGroups = [...new Set((oldCatData || []).map((d) => d.csoport_nev).filter(Boolean))];
  }


  // Create featured list (limit to 10 for grid)
  const featured = distinctGroups.slice(0, 10).map((group, index) => {
    // Generate slug from group name
    const slug = group.toLowerCase().replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
      .replace(/ó/g, 'o').replace(/ö/g, 'o').replace(/ő/g, 'o')
      .replace(/ú/g, 'u').replace(/ü/g, 'u').replace(/ű/g, 'u')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    return {
      key: slug,
      label: group,
      image: fallbackImages[index % fallbackImages.length]
    };
  });


  return (
    <section className="bg-transparent relative z-1 w-full py-8 overflow-hidden">
      <div className="mx-auto px-4 lg:px-8">
        <p className="text-cream type-h5 uppercase mb-4">Termékkategóriák</p>
      </div>
      <CategorySlider textColor={textColor} activeColor={activeColor} items={featured} />
    </section>
  );
}
