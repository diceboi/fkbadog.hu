"use client";
import { useState, useEffect } from "react";
import { categories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";

const defaultProduct = {
  coverage: 0.24, // m² per piece
  unit: "db",
  overlap: 0.15, // 15% overlap waste
};

export default function KalkulatorPage() {
  const [area, setArea] = useState("");
  const [selectedCat, setSelectedCat] = useState(categories[0].slug);
  const [result, setResult] = useState(null);

  const handleCalc = () => {
    const m2 = parseFloat(area);
    if (!m2 || m2 <= 0) return;

    const cat = categories.find((c) => c.slug === selectedCat);
    const prods = getProductsByCategory(selectedCat);

    // Simple formula: m² + waste / coverage = pieces
    const withWaste = m2 * (1 + defaultProduct.overlap);
    const pieces = Math.ceil(withWaste / defaultProduct.coverage);
    const cheapest = prods.sort((a, b) => a.price - b.price)[0];
    const totalPrice = cheapest ? pieces * cheapest.price : null;

    setResult({
      area: m2,
      pieces,
      categoryName: cat?.nameFHU,
      totalPrice,
      productName: cheapest?.name,
      unit: cheapest?.unit || "db",
    });
  };

  return (
    <>
      {/* Hero */}
      <section style={{ background: "#0a0a0a", padding: "80px 0 64px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <p className="section-label" style={{ marginBottom: 12 }}>Becslő eszköz</p>
          <h1 className="display-heading" style={{ fontSize: "clamp(48px, 8vw, 96px)" }}>
            Anyagszükséglet
            <br />
            <span style={{ color: "var(--color-accent)" }}>Kalkulátor</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginTop: 16, maxWidth: 500 }}>
            Add meg a tetőfelületed méretét és a termékkategóriát – mi kiszámítjuk a szükséges mennyiséget.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="section" style={{ background: "#0d0d0d" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "48px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
              {/* Area input */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 8 }}>
                  Felület mérete (m²) *
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="pl. 45.5"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 3,
                    padding: "12px 16px",
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: 600,
                    outline: "none",
                  }}
                />
              </div>

              {/* Category select */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", display: "block", marginBottom: 8 }}>
                  Termékkategória
                </label>
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#2a2a2a",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 3,
                    padding: "12px 16px",
                    color: "#fff",
                    fontSize: 14,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.nameFHU}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Info box */}
            <div style={{ background: "rgba(214,222,35,0.06)", border: "1px solid rgba(214,222,35,0.15)", borderRadius: 3, padding: "14px 18px", marginBottom: 28 }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                ℹ️ A kalkulátor 15%-os veszteséggel (átfedés, vágási hulladék) számol. Az eredmény becslésen alapul – pontos ajánlatért vegye fel velünk a kapcsolatot.
              </p>
            </div>

            <button
              onClick={handleCalc}
              className="btn-primary"
              style={{ fontSize: 16, padding: "14px 40px" }}
            >
              Kiszámolom
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Result */}
          {result && (
            <div
              style={{
                marginTop: 24,
                background: "rgba(214,222,35,0.08)",
                border: "2px solid var(--color-accent)",
                borderRadius: 6,
                padding: "40px 48px",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: 22,
                  marginBottom: 28,
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                }}
              >
                Eredmény
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
                {[
                  { label: "Felület", value: `${result.area} m²` },
                  { label: "Szükséges mennyiség", value: `${result.pieces} ${result.unit}`, accent: true },
                  result.totalPrice && { label: "Becsült ár (legolcsóbb)", value: `${result.totalPrice.toLocaleString("hu-HU")} Ft` },
                ].filter(Boolean).map((item) => (
                  <div key={item.label}>
                    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
                      {item.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 900,
                        fontSize: item.accent ? 36 : 24,
                        color: item.accent ? "var(--color-accent)" : "#fff",
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              {result.productName && (
                <p style={{ marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                  * Alapszámítás: {result.categoryName} – {result.productName}
                </p>
              )}
              <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                <a href={`/termekek/${selectedCat}`} className="btn-primary">
                  Termékek megtekintése
                </a>
                <a href="/kapcsolat" className="btn-outline">
                  Ajánlatot kérek
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 600px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr 1fr"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </>
  );
}
