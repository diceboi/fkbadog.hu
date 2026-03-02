import Image from "next/image";
import { H2, Label } from "@/components/ui/typography";

export default function USPBanner() {
  const stats = [
    { num: "200 000+", label: "m² eladott lemez" },
    { num: "100+", label: "elkészült projekt" },
    { num: "200+", label: "féle termék" },
  ];

  return (
    <section className="bg-cream py-20 overflow-hidden">
      <div className="container flex items-center justify-between gap-12 flex-wrap">

        {/* Left */}
        <div className="flex-[1_1_380px] max-w-[520px]">
          <H2 className="text-black leading-[1.05] mb-4">
            Minőségi bádogos<br />termékek<br />
            <span className="text-accent-dark">a legjobb árakon</span>
          </H2>

          <div className="flex gap-8 mt-10 flex-wrap">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p
                  className="font-black text-black leading-none mb-1"
                  style={{ fontSize: "var(--type-h3)", fontVariationSettings: '"wdth" 125, "wght" 900' }}
                >
                  {stat.num}
                </p>
                <Label className="text-black/45">{stat.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex-[1_1_300px] flex items-center justify-end relative">
          <Image
            src="/fk-creative-1.webp"
            alt="FK logó isometrikus"
            width={520}
            height={420}
            className="object-contain max-w-full"
            priority
          />
        </div>
      </div>
    </section>
  );
}
