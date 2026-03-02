"use client";
import Image from "next/image";
import Link from "next/link";
import { H2, H5, Small, Label, Span } from "@/components/ui/typography";
import { getPopularProducts } from "@/data/products";

function ProductCard({ product }) {
  const formatPrice = (p) => p.toLocaleString("hu-HU") + " Ft/" + product.unit;
  const stockColor =
    product.stock > 10 ? "#22c55e" : product.stock > 0 ? "#f59e0b" : "#ef4444";

  return (
    <Link href={`/termekek/${product.category}/${product.slug}`} className="no-underline">
      <div className="product-card bg-white">
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-[2] flex flex-col gap-1">
          {product.isNew && (
            <Label as="span" className="bg-accent text-black px-2 py-[3px]">ÚJ</Label>
          )}
          {product.isSale && (
            <Label as="span" className="bg-[#e53e3e] text-white px-2 py-[3px]">AKCIÓ</Label>
          )}
        </div>

        {/* SKU tag */}
        <div
          className="absolute top-1/2 z-[2] text-[10px] font-bold tracking-[0.1em] text-black/30 whitespace-nowrap"
          style={{ right: -28, transform: "rotate(90deg) translateX(-50%)" }}
        >
          {product.sku}
        </div>

        {/* Stock indicator */}
        <div className="absolute top-2.5 right-10 flex items-center gap-1 z-[2]">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: stockColor }} />
          <Small className="text-black/40 font-semibold">RAKTÁRON: {product.stock}</Small>
        </div>

        {/* Image */}
        <div className="h-40 flex items-center justify-center p-6 bg-[#f8f8f8] relative">
          <Image src={product.images[0]} alt={product.name} width={140} height={120} className="object-contain max-h-[120px]" />
        </div>

        {/* Info */}
        <div className="p-3">
          <H5 className="text-black mb-0.5 uppercase">{product.name}</H5>
          <Small className="text-black/45 block mb-2.5">{product.specs?.Anyag || "Alumínium"}</Small>
          <div className="bg-accent px-3 py-1.5 inline-block">
            <Span
              className="font-black text-black"
              style={{ fontFamily: "var(--font-sans)", fontSize: "var(--type-h6)", fontVariationSettings: '"wdth" 110, "wght" 900' }}
            >
              {formatPrice(product.price)}
            </Span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function PopularProducts() {
  const products = getPopularProducts(10);

  return (
    <section className="section bg-[#0f0f0f]">
      <div className="container">
        <div className="flex justify-between items-end mb-8">
          <div>
            <Label className="block mb-2">Népszerű termékek</Label>
            <H2>
              Legkeresettebb<br />
              <Span className="text-accent">termékek</Span>
            </H2>
          </div>
          <Link href="/termekek" className="btn-outline">Összes termék →</Link>
        </div>

        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
