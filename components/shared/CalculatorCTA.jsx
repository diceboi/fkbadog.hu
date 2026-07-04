import MainCtaButton from "@/components/ui/MainCtaButton";
import BlockRevealWord from "@/components/animations/BlockRevealWord";

export default function CalculatorCTA() {
  return (
    <section className="pt-10 pb-0 relative overflow-visible z-10 -mb-20 lg:-mb-28">
      {/* Background covering top portion while leaving bottom 80px/112px transparent so only the green card overlaps the black footer */}
      <div className="absolute top-0 left-0 right-0 bottom-20 lg:bottom-28 bg-cream z-0" />
      <div className="container relative overflow-visible z-10">
        {/* Floating Green Card */}
        <div className="bg-accent rounded-[20px] lg:rounded-[28px] px-8 py-10 md:px-12 md:py-14 xl:px-16 xl:py-16 relative overflow-hidden shadow-2xl z-10 min-h-[320px] lg:min-h-[380px] xl:min-h-[420px] flex flex-col justify-between items-start">
          {/* Grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30 z-0"
            style={{
              backgroundImage: "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Top-right corner category label */}
          <span className="absolute top-6 right-8 text-[9px] xl:text-[10px] font-extrabold tracking-[0.2em] text-black/60 uppercase select-none hidden sm:block z-10">
            Anyagszükséglet kalkulátor
          </span>

          {/* Top part */}
          <span className="text-black/75 font-extrabold text-[12px] xl:text-[13px] tracking-[0.18em] uppercase relative z-10 block">
            Egyedi lemezt szeretnél?
          </span>

          {/* Middle part: H1 with block reveal */}
          <h1 className="type-h1 text-left flex flex-col items-start gap-1 md:gap-2 leading-[.8] my-4 relative z-10">
            <span className="sr-only">Számold ki Online</span>
            <div className="flex flex-col items-start gap-1 md:gap-2" aria-hidden="true">
              <BlockRevealWord textClass="text-black" colorClass="bg-black" delay="100ms">
                Számold ki
              </BlockRevealWord>
              <BlockRevealWord textClass="text-white" colorClass="bg-white" delay="300ms">
                Online
              </BlockRevealWord>
            </div>
          </h1>

          {/* Bottom part */}
          <div className="mt-2 relative z-10">
            <MainCtaButton href="/kalkulator" variant="black">
              Irány a kalkulátor
            </MainCtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
