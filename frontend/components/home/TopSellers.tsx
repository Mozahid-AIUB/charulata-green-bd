"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTopSellers } from "@/lib/mock-data";
import { ProductCard } from "./ProductCard";

export function TopSellers({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("sections");
  const products = getTopSellers();
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // slide width: narrow box shows ~1, full row shows up to 4
  const slideBasis = compact
    ? "flex-[0_0_85%]"
    : "min-w-0 flex-[0_0_50%] sm:flex-[0_0_33%] lg:flex-[0_0_25%]";

  const wrapper = compact
    ? "rounded-xl border border-brand-100 bg-white p-4 shadow-sm"
    : "mx-auto max-w-7xl px-4 py-10";

  return (
    <section className={wrapper}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold uppercase tracking-wide text-brand-900">
          {t("topSellers")}
        </h2>
        <div className="flex gap-2">
          <button onClick={scrollPrev} aria-label="Previous" className="rounded-full border border-brand-200 p-1.5 text-brand-700 transition hover:bg-brand-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={scrollNext} aria-label="Next" className="rounded-full border border-brand-200 p-1.5 text-brand-700 transition hover:bg-brand-50">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((product) => (
            <div key={product.id} className={slideBasis}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
