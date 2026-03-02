"use client";
import { useState } from "react";
import Image from "next/image";
import BookingModal from "@/components/productpage/BookingModal";

export default function ProductDetail({ product }) {
  const [activeImg, setActiveImg] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const formatPrice = (p) => p.toLocaleString("hu-HU") + " Ft/" + product.unit;

  const stockColor =
    product.stock > 10 ? "#22c55e" : product.stock > 0 ? "#f59e0b" : "#ef4444";
  const stockLabel =
    product.stock > 10
      ? `Raktáron (${product.stock} db)`
      : product.stock > 0
      ? `Korlátozott készlet (${product.stock} db)`
      : "Elfogyott";

  return (
    <>
      {showModal && <BookingModal product={product} onClose={() => setShowModal(false)} />}

      <section className="bg-[#0d0d0d] py-16">
        <div className="container">
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-16 max-md:gap-8 items-start">

            {/* Gallery */}
            <div>
              <div className="bg-black-mid border border-white/[0.06] rounded-[4px] aspect-[4/3] flex items-center justify-center mb-3 overflow-hidden relative">
                <Image src={product.images[activeImg]} alt={product.name} fill className="object-contain p-8" priority />
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-[72px] h-14 bg-black-mid rounded-[3px] overflow-hidden cursor-pointer p-1 relative shrink-0 border-2 transition-colors ${
                        i === activeImg ? "border-accent" : "border-white/10"
                      }`}
                    >
                      <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-contain" sizes="72px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div>
              <p className="text-white/35 text-[12px] mb-2 tracking-[0.1em] uppercase">
                Cikkszám: {product.sku}
              </p>
              <h1 className="display-heading text-white mb-5 leading-[1.05]" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
                {product.name}
              </h1>

              <div className="mb-6">
                <span className="font-black text-accent" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>
                  {formatPrice(product.price)}
                </span>
              </div>

              <p className="text-white/65 text-[15px] leading-[1.8] mb-8">{product.description}</p>

              <div className="flex items-center gap-2 mb-7">
                <span className="w-2 h-2 rounded-full" style={{ background: stockColor }} />
                <span className="text-[13px] text-white/50">{stockLabel}</span>
              </div>

              <button className="btn-primary text-[17px] py-4 px-9 mb-4"
                onClick={() => setShowModal(true)} disabled={product.stock === 0}>
                Lefoglalás
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <p className="text-[12px] text-white/30">
                * Online fizetés nem szükséges. A foglalás után munkatársunk felveszi Önnel a kapcsolatot.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
