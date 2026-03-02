import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const formatPrice = (p) => p.toLocaleString("hu-HU") + " Ft/" + product.unit;
  const stockColor =
    product.stock > 10 ? "#22c55e" : product.stock > 0 ? "#f59e0b" : "#ef4444";

  return (
    <Link href={`/termekek/${product.category}/${product.slug}`} className="no-underline">
      <div className="product-card bg-white h-full flex flex-col">

        {/* Badges */}
        <div className="absolute top-2 left-2 z-[2] flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-accent text-black font-extrabold text-[10px] px-2 py-[3px] tracking-[0.08em]">ÚJ</span>
          )}
          {product.isSale && (
            <span className="bg-[#e53e3e] text-white font-extrabold text-[10px] px-2 py-[3px] tracking-[0.08em]">AKCIÓ</span>
          )}
        </div>

        {/* SKU tag */}
        <div
          className="absolute top-[45%] z-[2] font-bold text-[9px] tracking-[0.1em] text-black/25 whitespace-nowrap"
          style={{ right: -24, transform: "rotate(90deg) translateX(-50%)" }}
        >
          {product.sku}
        </div>

        {/* Stock */}
        <div className="absolute top-2 right-9 flex items-center gap-1 z-[2]">
          <span className="w-[5px] h-[5px] rounded-full" style={{ background: stockColor }} />
          <span className="text-[9px] text-black/35 font-semibold">RAKTÁRON: {product.stock}</span>
        </div>

        {/* Image */}
        <div className="shrink-0 h-[180px] bg-[#f4f4f4] flex items-center justify-center p-5 relative">
          <Image src={product.images[0]} alt={product.name} width={160} height={140} className="object-contain" />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between px-3.5 pt-3 pb-3.5">
          <div className="p-4 mt-20">
            <p className="font-extrabold text-[13px] text-black uppercase tracking-[0.03em] mb-0.5 leading-[1.2]">
              {product.name}
            </p>
            <p className="text-[11px] text-black/40 mb-2.5">{product.specs?.Anyag || ""}</p>
          </div>
          <div className="bg-accent px-3 py-[7px] inline-block">
            <span className="font-black text-[14px] text-black">{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
