"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { getProductsByCategory, type Category, type Localized } from "@/lib/mock-data";
import { ProductCard } from "./ProductCard";

const INITIAL_COUNT = 4;
const TABS = ["tabAll", "tabLocal", "tabForeign", "tabSeasonal"] as const;

export function CategoryShowcase({ category }: { category: Category }) {
  const locale = useLocale() as keyof Localized;
  const t = useTranslations("sections");
  const products = getProductsByCategory(category.slug);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("tabAll");
  const [expanded, setExpanded] = useState(false);

  if (products.length === 0) {
    return null;
  }

  // tabs are visual-only for now (no backend variants yet); active tab styled
  const visible = expanded ? products : products.slice(0, INITIAL_COUNT);
  const hasMore = products.length > INITIAL_COUNT;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-7xl px-4 py-10"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-brand-100 pb-3">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-2xl font-semibold text-brand-900">
            {category.name[locale] ?? category.name.en}
          </h2>
          <div className="flex flex-wrap gap-1 text-sm">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-3 py-1 transition ${
                  activeTab === tab
                    ? "bg-brand-50 font-medium text-brand-700"
                    : "text-gray-500 hover:text-brand-600"
                }`}
              >
                {t(tab)}
              </button>
            ))}
          </div>
        </div>
        <Link
          href={`/${locale}/shop?category=${category.slug}`}
          className="text-sm font-medium text-brand-600 transition hover:text-brand-700"
        >
          {t("viewAll")} →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && !expanded && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="rounded-full border border-brand-300 px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-brand-700 transition hover:bg-brand-600 hover:text-white"
          >
            {t("loadMore")}
          </button>
        </div>
      )}
    </motion.section>
  );
}
