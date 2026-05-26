import Link from "next/link";
import CategoryTile from "./CategoryTile";
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

export default async function CategoryGrid() {
  // Fetch distinct categories from the database
  // Note: Since Supabase API doesn't have a direct distinct() method, 
  // we'll fetch all and filter in JS, or we can just fetch a few known categories.
  // Let's use RPC if available, or just fetch all and deduplicate.
  // Actually, since we only have ~904 rows, fetching all is relatively fast for a Server Component,
  // but selecting just the column is better.
  const { data } = await supabase.from("termekek").select("csoport_nev").limit(1000);
  
  // Deduplicate and filter empty
  const distinctGroups = [...new Set((data || []).map(d => d.csoport_nev).filter(Boolean))];
  
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
    <section className="bg-transparent xl:px-8 lg:px-8 px-4 relative z-1">
      <p className="text-cream type-h5 uppercase mb-4">Termékkategóriák</p>

      <div
        className="grid gap-4 pb-16"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        {featured.map(({ key, label, image }) => (
          <CategoryTile
            key={key}
            slug={key}
            label={label}
            image={image}
          />
        ))}

        {/* "Összes kategória" card */}
        <Link href="/termekek" className="no-underline block">
          <div
            className="relative bg-accent overflow-hidden flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 hover:opacity-90 rounded-lg"
            style={{ aspectRatio: "16 / 10" }}
          >
            <span className="font-black text-[18px] tracking-[0.05em] uppercase text-black text-center leading-[1.2]">
              Összes
              <br />
              kategória
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
