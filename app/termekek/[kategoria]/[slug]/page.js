import { notFound } from "next/navigation";
import { products, getProductBySlug, getRelatedProducts } from "@/data/products";
import { categories, getCategoryBySlug } from "@/data/categories";
import ProductDetail from "@/components/productpage/ProductDetail";
import ProductCard from "@/components/products/ProductCard";
import CalculatorCTA from "@/components/shared/CalculatorCTA";

export async function generateStaticParams() {
  return products.map((p) => ({
    kategoria: p.category,
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} – FK Tető`,
    description: product.description,
  };
}

export default async function TermeklaPPage({ params }) {
  const { kategoria, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.category !== kategoria) notFound();

  const cat = getCategoryBySlug(kategoria);
  const related = getRelatedProducts(product, 5);

  return (
    <>
      {/* Breadcrumb bar */}
      <div style={{ background: "#111", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 0" }}>
        <div className="container" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {[
            { href: "/termekek", label: "Termékek" },
            { href: `/termekek/${kategoria}`, label: cat?.nameFHU || kategoria },
            { label: product.name },
          ].map((crumb, i) => (
            <span key={crumb.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {i > 0 && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-display)",
                    textDecoration: "none",
                  }}
                >
                  {crumb.label}
                </a>
              ) : (
                <span
                  style={{
                    color: "var(--color-accent)",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Product detail */}
      <ProductDetail product={product} />

      {/* Specs */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <section style={{ background: "#111", padding: "64px 0" }}>
          <div className="container" style={{ maxWidth: 860 }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 20,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 28,
                paddingBottom: 16,
                borderBottom: "2px solid var(--color-accent)",
                display: "inline-block",
              }}
            >
              Termékinformációk
            </h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {Object.entries(product.specs).map(([key, val], i) => (
                  <tr
                    key={key}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <td
                      style={{
                        padding: "14px 16px",
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                        fontSize: 14,
                        color: "rgba(255,255,255,0.5)",
                        width: 200,
                        background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                      }}
                    >
                      {key}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: 14,
                        color: "#fff",
                        background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                      }}
                    >
                      {val}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section style={{ background: "#0d0d0d", padding: "64px 0" }}>
          <div className="container">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 20,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 28,
                paddingBottom: 16,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                display: "inline-block",
              }}
            >
              Kapcsolódó termékek
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: 12,
              }}
            >
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CalculatorCTA />
    </>
  );
}
