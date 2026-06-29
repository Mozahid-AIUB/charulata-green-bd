"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Search, Heart, ShoppingCart, User, Leaf } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin } from "./SocialIcons";
import { LanguageToggle } from "./LanguageToggle";

export function Header() {
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const tHeader = useTranslations("header");
  const p = (path: string) => `/${locale}${path}`;

  const navItems = [
    { key: "home", href: "" },
    { key: "shop", href: "/shop" },
    { key: "about", href: "/about" },
    { key: "contact", href: "/contact" },
    { key: "booking", href: "/booking" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-ink-900 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4">
        {/* top bar: logo · nav · social + toggle */}
        <div className="flex items-center justify-between gap-4 py-3">
          <Link href={p("")} className="flex items-center gap-1.5 font-serif text-2xl font-semibold italic tracking-wide">
            <Leaf className="h-6 w-6 -rotate-45 text-brand-400" fill="currentColor" strokeWidth={1} />
            Charulata
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium uppercase tracking-wide md:flex">
            {navItems.map((item) => (
              <Link key={item.key} href={p(item.href)} className="text-white/80 transition hover:text-white">
                {tNav(item.key)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-white/60 lg:flex">
              <Facebook className="h-4 w-4 transition hover:text-white" />
              <Twitter className="h-4 w-4 transition hover:text-white" />
              <Instagram className="h-4 w-4 transition hover:text-white" />
              <Linkedin className="h-4 w-4 transition hover:text-white" />
            </div>
            <LanguageToggle />
          </div>
        </div>

        {/* search row: search fills the space, icons sit right beside it */}
        <div className="flex items-center gap-4 pb-3">
          <form className="flex h-11 flex-1 items-stretch overflow-hidden rounded-full bg-white shadow-sm">
            <input
              type="search"
              placeholder={tHeader("searchPlaceholder")}
              className="min-w-0 flex-1 bg-white pl-5 pr-2 text-sm text-ink-900 placeholder:text-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex w-12 items-center justify-center bg-brand-600 text-white transition hover:bg-brand-700"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
          <div className="flex items-center gap-4">
          <button type="button" aria-label={tHeader("wishlist")} className="relative text-white/90 hover:text-white">
            <Heart className="h-6 w-6" />
            <span className="absolute -right-2 -top-2 rounded-full bg-brand-500 px-1.5 text-xs">0</span>
          </button>
          <button type="button" aria-label={tHeader("cart")} className="relative text-white/90 hover:text-white">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -right-2 -top-2 rounded-full bg-brand-500 px-1.5 text-xs">0</span>
          </button>
          <button type="button" aria-label={tHeader("account")} className="text-white/90 hover:text-white">
            <User className="h-6 w-6" />
          </button>
          </div>
        </div>
      </div>
    </header>
  );
}
