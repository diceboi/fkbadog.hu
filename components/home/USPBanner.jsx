import Image from "next/image";
import { H2, Label } from "@/components/ui/typography";

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
        <div className="lg:w-1/2 w-full z-1">
          <h1 className="type-h1 text-left">
            <span className="text-cream">Minőségi bádogos termékek</span>
            <br />
            <span className="text-black">a legjobb árakon</span>
          </h1>
        </div>

        {/* Right */}
        <Image
          src="/fk-creative-1.webp"
          alt="FK Tető"
          width={2000}
          height={2000}
          className="absolute lg:top-1/2 top-2/3 -translate-y-1/2 -right-1/5 lg:w-3/4 w-full z-0"
        />
      </div>
    </section>
  );
}
