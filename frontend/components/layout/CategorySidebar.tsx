"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Menu, ChevronRight } from "lucide-react";
import { getCategories, type Localized } from "@/lib/mock-data";

export function CategorySidebar() {
  const locale = useLocale() as keyof Localized;
  const t = useTranslations("sidebar");
  const categories = getCategories();

  return (
    <aside className="w-full overflow-hidden rounded-lg border border-brand-100 bg-white shadow-sm">
      <div className="flex items-center gap-2 bg-brand-600 px-4 py-3 font-semibold uppercase tracking-wide text-white">
        <Menu className="h-5 w-5" />
        {t("menu")}
      </div>
      <ul className="divide-y divide-brand-50">
        {categories.map((c) => (
          <li key={c.id}>
            <Link
              href={`/${locale}/shop?category=${c.slug}`}
              className="group flex items-center justify-between px-4 py-3 text-sm text-ink-800 transition hover:bg-brand-50 hover:text-brand-700"
            >
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400 transition group-hover:bg-brand-600" aria-hidden />
                {c.name[locale] ?? c.name.en}
              </span>
              <ChevronRight className="h-4 w-4 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
