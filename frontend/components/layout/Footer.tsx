"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Facebook, Twitter, Instagram, Linkedin } from "./SocialIcons";
import { getProductsByCategory, type Localized } from "@/lib/mock-data";

const TOP_SELLING_CATEGORIES = ["flower-plants", "fruit-trees", "ornamental-plants"] as const;

const USEFUL_LINKS = ["about", "contactUs", "privacy", "returns", "terms", "sitemap"] as const;

export function Footer() {
  const locale = useLocale() as keyof Localized;
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-ink-900 text-white/70">
      {/* main columns */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-5">
        {/* brand + contact */}
        <div className="lg:col-span-1">
          <h3 className="font-serif text-2xl font-semibold italic text-white/40">Charulata</h3>
          <p className="mt-4 font-semibold text-white">{t("questions")}</p>
          <p className="text-sm">01799-880886</p>
          <p className="mt-4 text-sm">{t("address")}</p>
          <p className="mt-2 text-sm">{t("office")}</p>
          <p className="mt-2 text-sm">charulatagreen@gmail.com</p>
        </div>

        {/* three top-selling columns */}
        {TOP_SELLING_CATEGORIES.map((slug) => {
          const products = getProductsByCategory(slug);
          // derive the column heading from the first product's category name via mock-data
          return (
            <div key={slug}>
              <h4 className="font-semibold uppercase tracking-wide text-white">
                {slug === "flower-plants" ? "Top Selling Flower" : slug === "fruit-trees" ? "Top Selling Fruit" : "Top Selling Ornamental"}
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                {products.map((p) => (
                  <li key={p.id}>
                    <Link href={`/${locale}/shop`} className="transition hover:text-white">
                      {p.name[locale] ?? p.name.en}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* useful links */}
        <div>
          <h4 className="font-semibold uppercase tracking-wide text-white">{t("quickLinks")}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {USEFUL_LINKS.map((key) => (
              <li key={key}>
                <Link href={`/${locale}`} className="transition hover:text-white">
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* payment / shipping / social strip */}
      <div className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3">
          <div>
            <p className="mb-2 font-semibold text-white">{t("paymentSystem")}</p>
            <div className="flex flex-wrap gap-2">
              {["bKash", "Nagad", "Rocket", "Visa", "MasterCard", "Amex"].map((m) => (
                <span key={m} className="rounded bg-white px-2 py-1 text-xs font-semibold text-ink-900">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold text-white">{t("shippingSystem")}</p>
            <div className="flex flex-wrap gap-2">
              {["SteadFast", "Pathao", "S.A Paribahan", "RedX"].map((s) => (
                <span key={s} className="rounded bg-white/90 px-2 py-1 text-xs font-semibold text-ink-900">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold text-white">{t("followUs")}</p>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="rounded-full bg-white/10 p-2 transition hover:bg-brand-600 hover:text-white"><Facebook className="h-5 w-5" /></a>
              <a href="#" aria-label="Twitter" className="rounded-full bg-white/10 p-2 transition hover:bg-brand-600 hover:text-white"><Twitter className="h-5 w-5" /></a>
              <a href="#" aria-label="Instagram" className="rounded-full bg-white/10 p-2 transition hover:bg-brand-600 hover:text-white"><Instagram className="h-5 w-5" /></a>
              <a href="#" aria-label="LinkedIn" className="rounded-full bg-white/10 p-2 transition hover:bg-brand-600 hover:text-white"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {year} Charulata. {t("rights")}
      </div>
    </footer>
  );
}
