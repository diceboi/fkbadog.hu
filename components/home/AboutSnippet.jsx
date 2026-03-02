"use client";
import Image from "next/image";
import Link from "next/link";
import { H2, P, Span, Label } from "@/components/ui/typography";

const photos = [
  "/photos/0138f3f2-df23-4e40-986e-ebea45599cdb.jpg",
  "/photos/4afe475d-e9bc-4217-8a85-5d4bea08f436.jpg",
  "/photos/987760d1-84ef-4906-9649-6fcba29fb912.jpg",
  "/photos/398f16b2-a960-41d9-a3e2-c6522d95d4d8.jpg",
];

const rotations = ["-3deg", "2deg", "-1.5deg", "2.5deg"];

export default function AboutSnippet() {
  return (
    <section className="section bg-black-dark">
      <div className="container">
        <Label as="p" className="text-center block mb-4">Miért mi?</Label>
        <H2 className="text-center mb-14">
          Mi is{" "}
          <Span className="text-accent">Bádogosok</Span>
          <br />vagyunk
        </H2>

        {/* Photo collage */}
        <div className="flex justify-center items-center gap-4 mb-14 flex-wrap">
          {photos.map((src, i) => (
            <div
              key={src}
              className="shrink-0 transition-transform duration-300 cursor-pointer"
              style={{ transform: `rotate(${rotations[i]})` }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(0deg) scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = `rotate(${rotations[i]})`)}
            >
              <div
                className="overflow-hidden border-4 border-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative"
                style={{ width: "clamp(160px, 18vw, 260px)", height: "clamp(130px, 14vw, 200px)" }}
              >
                <Image src={src} alt={`Munka fotó ${i + 1}`} fill className="object-cover" sizes="260px" />
              </div>
            </div>
          ))}
        </div>

        {/* Description + CTA */}
        <div className="flex justify-center gap-16 flex-wrap max-w-[900px] mx-auto items-start">
          <P className="text-white/60 max-w-[420px] flex-[1_1_300px]">
            Nem csak áruljuk a termékeket: nap mint nap használjuk őket, életen pontosan
            tudjuk, mi kell a szerelőnek a gyors, tiszta és tartós munkához. Olyan anyagokat
            és kiegészítőket válogattunk össze, amelyek a gyakorlatban is bevonltak – és ha
            kérdésed van, szívesen segítünk, hogy biztosan a megfelelők közé válassz.
          </P>
          <div className="shrink-0 flex flex-col gap-4 items-start">
            <Link href="/rolunk" className="btn-outline">Tudj meg többet rólunk</Link>
            <Link
              href="/kapcsolat"
              className="text-accent font-semibold underline transition-opacity hover:opacity-70"
              style={{ fontSize: "var(--type-small)" }}
            >
              Kapcsolatfelvétel →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
