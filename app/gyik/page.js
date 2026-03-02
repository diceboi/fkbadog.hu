"use client";
import { useState } from "react";
import CalculatorCTA from "@/components/shared/CalculatorCTA";

const faqs = [
  {
    q: "Hogyan működik a lefoglalás?",
    a: "A termékek oldalán a 'Lefoglalás' gombra kattintva egy rövid formot tölthet ki (név, telefon, mennyiség). Ezután munkatársunk felveszi Önnel a kapcsolatot a részletek egyeztetéséhez. Online fizetésre nincs szükség."
  },
  {
    q: "Milyen fizetési lehetőségek állnak rendelkezésre?",
    a: "Személyes átvételkor lehetőség van készpénzes és bankkártyás fizetésre egyaránt. Előre utalásos megrendelés esetén az összeg banki átutalással rendezhető."
  },
  {
    q: "Van-e lehetőség házhozszállításra?",
    a: "Igen, megrendeléstől függően biztosítunk szállítást. A szállítási feltételekről bővebb tájékoztatást a kapcsolatfelvétel során adunk."
  },
  {
    q: "Mire való az anyagszükséglet-kalkulátor?",
    a: "A kalkulátorral megbecsülheti, hogy adott felülethez (m²) hány darab lemezre vagy egyéb termékre van szüksége. Ez megkönnyíti az anyagrendelést és elkerülheti a felesleges túlrendelést."
  },
  {
    q: "Milyen típusú tetőkhöz ajánlják a termékeiket?",
    a: "Termékpalettánk széleskörű: klasszikus cserép alá, hullámpalás, trapézlemezes és lapos tetőkre egyaránt kínálunk szellőzőket, rögzítőket és kiegészítőket."
  },
  {
    q: "Van-e garancia a termékekre?",
    a: "Igen, termékeinket gyártói garanciával szállítjuk. A garanciaidő termékenként eltér, amelyről a termékoldalon vagy üzletünkben részletes tájékoztatást adunk."
  },
  {
    q: "Mennyibe kerül a szállítás?",
    a: "A szállítási díj a rendelés értékétől és a szállítási helyszín távolságától függ. Pontos ajánlatot a foglalás folyamán küldünk."
  },
  {
    q: "Vásárolhatok-e nagyobb mennyiséget kedvezményes áron?",
    a: "Igen, nagyobb mennyiségű rendelés esetén törzsvásárlói és mennyiségi kedvezményt biztosítunk. Kérjük, vegye fel velünk a kapcsolatot az egyedi árajánlatért."
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 8,
        transition: "border-color 0.2s",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px",
          background: open ? "rgba(214,222,35,0.06)" : "rgba(255,255,255,0.02)",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.2s",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 16,
            color: open ? "var(--color-accent)" : "#fff",
            letterSpacing: "0.01em",
            transition: "color 0.2s",
          }}
        >
          {q}
        </span>
        <span
          style={{
            color: "var(--color-accent)",
            fontSize: 20,
            fontWeight: 300,
            flexShrink: 0,
            marginLeft: 16,
            transform: open ? "rotate(45deg)" : "rotate(0)",
            transition: "transform 0.25s",
            display: "inline-block",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: "4px 24px 20px",
            color: "rgba(255,255,255,0.6)",
            fontSize: 15,
            lineHeight: 1.8,
            background: "rgba(214,222,35,0.03)",
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

export default function GyikPage() {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: "#0a0a0a",
          padding: "80px 0 64px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="container">
          <p className="section-label" style={{ marginBottom: 12 }}>
            Kérdések és válaszok
          </p>
          <h1
            className="display-heading"
            style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
          >
            Gyak. Ism.
            <br />
            <span style={{ color: "var(--color-accent)" }}>Kérdések</span>
          </h1>
        </div>
      </section>

      {/* FAQ list */}
      <section className="section" style={{ background: "#0d0d0d" }}>
        <div className="container" style={{ maxWidth: 860 }}>
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}

          <div
            style={{
              marginTop: 48,
              padding: "32px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 4,
              textAlign: "center",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 16, fontSize: 15 }}>
              Nem találtad meg a választ a kérdésedre?
            </p>
            <a href="/kapcsolat" className="btn-primary">
              Lépj kapcsolatba velünk
            </a>
          </div>
        </div>
      </section>

      <CalculatorCTA />
    </>
  );
}
