import Link from "next/link";
import { H2, Span } from "@/components/ui/typography";

export default function CalculatorCTA() {
  return (
    <section className="bg-accent py-20 relative overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container relative z-[1]">
        <div className="flex justify-between items-start flex-wrap gap-8">
          <div>
            <p className="section-label text-black/55 mb-3">Anyagszükséglet kalkulátor</p>
            <p
              className="font-extrabold text-black uppercase mb-1"
              style={{ fontSize: "var(--type-h5)", fontVariationSettings: '"wdth" 110, "wght" 800' }}
            >
              Egyedi lemezt szeretnél?
            </p>
            <H2 className="text-black leading-[0.95]">
              Számold ki <Span className="text-white">online</Span>
            </H2>
          </div>

          <div className="flex items-end pb-1">
            <Link href="/kalkulator" className="btn-dark">
              Irány a kalkulátor
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
