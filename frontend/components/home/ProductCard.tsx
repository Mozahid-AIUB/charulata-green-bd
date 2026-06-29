"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { Product, Localized } from "@/lib/mock-data";

function formatPrice(product: Product): string {
  if (product.priceMax === null) {
    return `৳${product.priceMin}`;
  }
  return `৳${product.priceMin} – ৳${product.priceMax}`;
}

export function ProductCard({ product }: { product: Product }) {
  const locale = useLocale() as keyof Localized;
  const t = useTranslations("product");
  const name = product.name[locale] ?? product.name.en;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-brand-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square w-full overflow-hidden bg-brand-50">
        <Image
          src={product.imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-110"
        />
        {product.soldOut && (
          <span className="absolute left-2 top-2 rounded bg-ink-900/90 px-2 py-1 text-xs font-medium text-white">
            {t("soldOut")}
          </span>
        )}
        {/* plant-tag price — nursery hang-tag, the page's signature element */}
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-md border border-accent-500 bg-white/95 px-2.5 py-1 text-sm font-bold text-accent-600 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" aria-hidden />
          {formatPrice(product)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="text-sm font-medium text-brand-900">{name}</h3>
        <button
          type="button"
          disabled={product.soldOut}
          className="mt-auto rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {product.soldOut ? t("outOfStock") : t("addToCart")}
        </button>
      </div>
    </div>
  );
}
