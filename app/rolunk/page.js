import Image from "next/image";
import CalculatorCTA from "@/components/shared/CalculatorCTA";

export const metadata = {
  title: "Rólunk – FK Tető",
  description:
    "Megismerjük az FK Tető csapatát: bádogos szakemberek, akik a termékeikkel dolgoznak nap mint nap.",
};

const photos = [
  "/photos/0138f3f2-df23-4e40-986e-ebea45599cdb.jpg",
  "/photos/4b4cf965-ab26-4c93-8b47-66739a6295d0.jpg",
  "/photos/398f16b2-a960-41d9-a3e2-c6522d95d4d8.jpg",
  "/photos/987760d1-84ef-4906-9649-6fcba29fb912.jpg",
];

const stats = [
  { num: "200 000", unit: "m²", label: "Eladott lemez" },
  { num: "100+", unit: "", label: "Elkészült projekt" },
  { num: "200+", unit: "", label: "Termék" },
];

export default function RolunkPage() {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          height: 360,
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          background: "#0a0a0a",
        }}
      >
        <Image
          src="/photos/0138f3f2-df23-4e40-986e-ebea45599cdb.jpg"
          alt="Rólunk hero"
          fill
          style={{ objectFit: "cover", opacity: 0.3 }}
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.4) 100%)",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 2, paddingBottom: 56 }}>
          <h1
            className="display-heading"
            style={{ fontSize: "clamp(56px, 10vw, 120px)", color: "var(--color-accent)" }}
          >
            Rólunk
          </h1>
        </div>
      </section>

      {/* Who we are */}
      <section className="section" style={{ background: "#0f0f0f" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: 64,
              alignItems: "start",
            }}
          >
            <div>
              <h2
                className="display-heading"
                style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.05 }}
              >
                Kik <br />vagyunk?
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
              }}
            >
              {[
                "Nem csak áruljuk a termékeket: nap mint nap használjuk őket, életet pontosan tudjuk, mi kell a szerelőnek a gyors, tiszta és tartós munkához. Olyan anyagokat és kiegészítőket válogattunk össze, amelyek a szakmai praxisban is bevonltak.",
                "Ha kérdésed van, szívesen segítünk, hogy biztosan a megfelelő terméket válaszd. Csapatunk tapasztalt bádogos mesterekből áll, akik értenek a tetőfedés minden aspektusához – az alapanyagoktól a speciális csatlakozó elemekig.",
              ].map((text, i) => (
                <p
                  key={i}
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 15,
                    lineHeight: 1.8,
                  }}
                >
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Photo strip */}
      <section style={{ background: "#0a0a0a", padding: "0 0 80px" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
              height: 280,
            }}
          >
            {photos.map((src, i) => (
              <div
                key={src}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: i === 0 ? "4px 0 0 4px" : i === 3 ? "0 4px 4px 0" : 0,
                }}
                className="photo-strip-item"
              >
                <Image
                  src={src}
                  alt={`Munka fotó ${i + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#fff", padding: "72px 0" }}>
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "clamp(40px, 6vw, 72px)",
                    color: "#000",
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {s.num}
                  {s.unit && (
                    <span style={{ color: "var(--color-accent-dark)" }}>
                      {" "}{s.unit}
                    </span>
                  )}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(0,0,0,0.4)",
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CalculatorCTA />

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 2fr"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="repeat(4, 1fr)"][style*="height: 280px"] { grid-template-columns: repeat(2, 1fr) !important; height: auto !important; }
          div[style*="repeat(4, 1fr)"][style*="height: 280px"] > div { height: 180px !important; }
        }
      `}</style>
    </>
  );
}
