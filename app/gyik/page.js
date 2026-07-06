"use client";
import { useState } from "react";
import ProductsHero from "@/components/products/ProductsHero";
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
    <div className="relative bg-white border border-black/10 hover:border-black-mid/20 rounded-[8px] transition-all duration-300 shadow-xs mb-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center py-5 px-6 md:py-6 md:px-8 bg-transparent border-none cursor-pointer text-left outline-none"
      >
        <span className="font-extrabold text-sm md:text-base text-black-dark tracking-wide uppercase select-none pr-8">
          {q}
        </span>
      </button>

      {/* Accordion content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[1000px] opacity-100 pb-8 px-6 md:px-8" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="border-t border-black/10 pt-4">
          <p className="text-black-dark/75 text-sm md:text-[15px] leading-relaxed font-medium">
            {a}
          </p>
        </div>
      </div>

      {/* Custom organic cut corner with yellow/green triangle and arrow */}
      <div className="absolute bottom-[-1px] right-[-1px] w-8 h-8 pointer-events-none z-10">
        <svg className="w-full h-full" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          {/* Yellow/Green corner cut */}
          <path d="M 0,32 L 32,0 V 32 Z" fill="#D6DF27" />
          {/* Diagonal border line matching parent border */}
          <path d="M 0,32 L 32,0" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
        </svg>
        {/* Arrow icon */}
        <div 
          className="absolute bottom-1.5 right-1.5 text-black transition-transform duration-300"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function GyikPage() {
  return (
    <>
      {/* Hero section */}
      <div className="relative bg-linear-to-b from-black-mid via-black-mid to-cream">
        <ProductsHero
          title="Gyakran Ismételt Kérdések"
          bgImage="/photos/4afe475d-e9bc-4217-8a85-5d4bea08f436.jpg"
          breadcrumbs={[
            { href: "/", label: "Főoldal" },
            { label: "GYIK" },
          ]}
        />
      </div>

      {/* FAQ list */}
      <section className="section bg-cream py-16 lg:py-24 min-h-[50vh]">
        <div className="container max-w-[860px]">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}

          {/* Contact box */}
          <div className="mt-16 p-8 bg-white border border-black/10 rounded-[8px] text-center shadow-xs">
            <p className="text-black-dark/65 mb-6 text-sm md:text-base font-semibold">
              Nem találtad meg a választ a kérdésedre?
            </p>
            <a 
              href="/kapcsolat" 
              className="inline-flex items-center justify-center bg-black-mid hover:bg-black text-white font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-lg transition-all duration-300"
            >
              Lépj kapcsolatba velünk
            </a>
          </div>
        </div>
      </section>

      <CalculatorCTA />
    </>
  );
}
