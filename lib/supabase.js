import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Utility to map a Supabase termekek row to the format expected by ProductCard.
 */
export function mapSupabaseProductToLocal(row) {
  // Generate a URL-friendly slug from the product name
  let baseSlug = row.megnevezes1 ? row.megnevezes1.toLowerCase() : 'termek';
  // Replace Hungarian accents and remove special characters
  baseSlug = baseSlug
    .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
    .replace(/ó/g, 'o').replace(/ö/g, 'o').replace(/ő/g, 'o')
    .replace(/ú/g, 'u').replace(/ü/g, 'u').replace(/ű/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
    
  // Append ID to ensure uniqueness
  const slug = `${baseSlug}-${row.id}`;

  let categorySlug = row.focsoport_nev ? row.focsoport_nev.toLowerCase() : 'kategoria';
  categorySlug = categorySlug
    .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
    .replace(/ó/g, 'o').replace(/ö/g, 'o').replace(/ő/g, 'o')
    .replace(/ú/g, 'u').replace(/ü/g, 'u').replace(/ű/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return {
    id: row.id.toString(),
    category: categorySlug,
    categoryName: row.focsoport_nev,
    slug: slug,
    name: row.megnevezes1 || 'Névtelen termék',
    sku: row.cikkszam || '',
    price: row.ertekesitesi_netto_ar_listaar || 0,
    unit: row.elsodleges_mennyisegi_egyseg || 'db',
    stock: row.aktualis_keszlet || 0,
    images: row.image_url ? [row.image_url] : ['/placeholder.png'],
    isNew: false, // Could be determined from letrehozas_ideje if needed
    isSale: false,
    brand: null, // FIXME: Nincs egyértelmű oszlop a Supabase-ben, ami a gyártót tartalmazza (pl. "BP2").
    specs: {
      Anyag: row.jellemzo_tulajdonsagok || "Acél"
    }
  };
}
