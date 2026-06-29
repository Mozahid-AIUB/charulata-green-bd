"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { getProductsByCategory, type Category, type Localized } from "@/lib/mock-data";
import { ProductCard } from "./ProductCard";

export function CategoryShowcase({ category }: { category: Category }) {
  const locale = useLocale() as keyof Localized;
  const t = useTranslations("sections");
  const products = getProductsByCategory(category.slug);

  if (products.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-7xl px-4 py-10"
    >
      <div className="mb-6 flex items-center justify-between border-b border-brand-100 pb-3">
        <h2 className="text-2xl font-semibold text-brand-900">
          {category.name[locale] ?? category.name.en}
        </h2>
        <Link
          href={`/${locale}/shop?category=${category.slug}`}
          className="text-sm font-medium text-brand-600 transition hover:text-brand-700"
        >
          {t("viewAll")} →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </motion.section>
  );
}
