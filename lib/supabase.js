import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
    .replace(/ó/g, 'o').replace(/ö/g, 'o').replace(/ő/g, 'o')
    .replace(/ú/g, 'u').replace(/ü/g, 'u').replace(/ű/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Utility to map a Supabase products (or legacy termekek) row to the format expected by the frontend.
 */
export function mapSupabaseProductToLocal(row) {
  if (!row) return null;

  // Ha az új 'products' tábla struktúrája (van megnevezes vagy netto_ar vagy kategoria):
  if ('megnevezes' in row || 'netto_ar' in row || 'termekkep_link' in row) {
    const rawCategory = row.kategoria || 'Egyéb';
    // Kategória slug képzés (ha pl. "Csavarok > Opel Csavarok", az első vagy fő kategória szerint)
    const categorySlug = slugify(rawCategory.split('>')[0].trim());
    const name = row.megnevezes || 'Névtelen termék';
    const slug = row.slug || `${slugify(name)}-${row.id}`;
    const price = Number(row.netto_ar) || 0;
    const afa = Number(row.afa_kulcs) || 27;
    const grossPrice = Math.round(price * (1 + afa / 100));

    return {
      id: row.id.toString(),
      category: categorySlug,
      categoryName: rawCategory,
      slug: slug,
      name: name,
      sku: row.cikkszam || '',
      price: price,
      grossPrice: grossPrice,
      afa: afa,
      unit: row.mennyisegi_egyseg || 'db',
      stock: Number(row.keszlet) || 0,
      canBackorder: !!row.utanrendelheto,
      weight: row.suly_g ? Number(row.suly_g) : null,
      packageSize: row.kiszereles || 1,
      isDivisible: !!row.bonthato,
      warranty: row.garancia || null,
      description: row.leiras || '',
      images: row.termekkep_link ? [row.termekkep_link] : ['/placeholder.png'],
      active: row.aktiv !== false,
      finishPrices: {
        fenyes: row.fenyes_ar ? Number(row.fenyes_ar) : null,
        standardMatt: row.standard_matt_ar ? Number(row.standard_matt_ar) : null,
        ultraMatt: row.ultra_matt_ar ? Number(row.ultra_matt_ar) : null,
        alucink: row.alucink_ar ? Number(row.alucink_ar) : null,
      },
      isNew: false,
      isSale: false,
      brand: 'FK Bádog',
      specs: {
        'Cikkszám': row.cikkszam || '-',
        'Kategória': rawCategory,
        'Kiszerelés': `${row.kiszereles || 1} ${row.mennyisegi_egyseg || 'db'}`,
        'Garancia': row.garancia || '1 év',
        'Készlet': `${row.keszlet || 0} ${row.mennyisegi_egyseg || 'db'}`,
      }
    };
  }

  // Fallback: Régi 'termekek' tábla mezőinek kezelése
  let baseSlug = row.megnevezes1 ? slugify(row.megnevezes1) : 'termek';
  const slug = `${baseSlug}-${row.id}`;
  let categorySlug = row.focsoport_nev ? slugify(row.focsoport_nev) : 'kategoria';

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
    isNew: false,
    isSale: false,
    brand: null,
    specs: {
      Anyag: row.jellemzo_tulajdonsagok || "Acél"
    }
  };
}

