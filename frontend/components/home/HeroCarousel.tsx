"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

type Slide = {
  id: number;
  headline: { en: string; bn: string };
  sub: { en: string; bn: string };
  image: string;
};

const hero = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

const slides: Slide[] = [
  {
    id: 1,
    headline: { en: "Green Friday", bn: "গ্রিন ফ্রাইডে" },
    sub: { en: "Such discounts you have not seen", bn: "এমন ছাড় আগে দেখেননি" },
    image: hero("photo-1466692476868-aef1dfb1e735"),
  },
  {
    id: 2,
    headline: { en: "Monsoon Greens", bn: "বর্ষার সবুজ" },
    sub: { en: "Fresh arrivals for the rainy season", bn: "বর্ষার নতুন গাছের সম্ভার" },
    image: hero("photo-1416879595882-3373a0480b5b"),
  },
  {
    id: 3,
    headline: { en: "Indoor Picks", bn: "ঘরের সেরা গাছ" },
    sub: { en: "Brighten every corner of your home", bn: "ঘরের প্রতিটি কোণ সবুজে ভরিয়ে তুলুন" },
    image: hero("photo-1485955900006-10f4d324d411"),
  },
];

export function HeroCarousel() {
  const locale = useLocale() as "en" | "bn";
  const t = useTranslations("hero");
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    const id = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(id);
    };
  }, [emblaApi]);

  return (
    <section className="relative w-full overflow-hidden rounded-xl shadow-sm">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s) => (
            <div key={s.id} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative flex min-h-[460px] flex-col items-center justify-center gap-5 overflow-hidden px-6 py-16 text-center text-white">
                {/* real plant photo */}
                <Image
                  src={s.image}
                  alt=""
                  fill
                  priority={s.id === 1}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                {/* strong, even dark overlay so text stays readable over ANY photo */}
                <div
                  className="pointer-events-none absolute inset-0 bg-ink-900/60"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-900/60 via-ink-900/30 to-ink-900/60"
                  aria-hidden
                />
                <span className="relative -rotate-2 rounded-md bg-accent-500 px-4 py-1.5 text-sm font-bold uppercase tracking-wide shadow-md">
                  {t("dontMiss")}
                </span>
                <motion.h2
                  key={`${s.id}-${selected}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative font-serif text-4xl font-bold italic drop-shadow-lg sm:text-6xl"
                >
                  {s.headline[locale]}
                </motion.h2>
                <p className="relative max-w-xl text-lg text-white/90">{s.sub[locale]}</p>
                <Link
                  href={`/${locale}/shop`}
                  className="relative mt-2 rounded-full bg-white px-8 py-3 font-semibold text-brand-800 shadow-lg transition hover:bg-brand-50"
                >
                  {t("cta")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-brand-800 shadow transition hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-brand-800 shadow transition hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 rounded-full transition-all ${selected === i ? "w-6 bg-white" : "w-2 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
