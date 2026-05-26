import Image from "next/image";
import { H2, Label } from "@/components/ui/typography";
import BlockRevealWord from "@/components/animations/BlockRevealWord";

export default function USPBanner() {
  const stats = [
    { num: "200 000+", label: "m² eladott lemez" },
    { num: "100+", label: "elkészült projekt" },
    { num: "200+", label: "féle termék" },
  ];

  return (
    <section className="flex items-center bg-transparent lg:min-h-[70vh] h-[50vh] lg:px-8 p-4 relative">
      <div className="flex lg:flex-row flex-col lg:items-center items-start h-full">
        {/* Left */}
        <div className="z-1">
          <h2 className="type-h1 text-center flex flex-col items-center justify-center gap-2 md:gap-3 leading-[.9]">
            <span className="sr-only">Minőségi Bádogos és tetőfedő termékek</span>

            {/* Asztali / Tablet: Egybefüggő nagy blokkok */}
            <div className="flex flex-col items-start gap-2 md:gap-3" aria-hidden="true">
              <BlockRevealWord textClass="text-cream" colorClass="bg-gray-mid" delay="100ms">Minőségi</BlockRevealWord>
              <BlockRevealWord textClass="text-cream" colorClass="bg-gray-mid" delay="100ms">termékek</BlockRevealWord>
              <BlockRevealWord textClass="text-gray-mid" colorClass="bg-gray-mid" delay="300ms">amiket mi is</BlockRevealWord>
              <BlockRevealWord textClass="text-gray-mid" colorClass="bg-gray-mid" delay="300ms">használunk</BlockRevealWord>
            </div>           
          </h2>
        </div>

        {/* Right */}
        <Image
          src="/fk-creative-1.webp"
          alt="FK Tető"
          width={2000}
          height={2000}
          className="absolute lg:top-1/2 top-2/3 -translate-y-1/2 lg:-right-1/5 -right-1/3 lg:w-3/4 w-[120%] z-0"
        />
      </div>
    </section>
  );
}
