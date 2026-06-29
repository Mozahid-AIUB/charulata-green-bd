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

        {/* search row: full-width input + green button + wishlist/cart/account */}
        <div className="flex items-center gap-3 pb-3">
          <div className="flex flex-1 overflow-hidden rounded-md bg-white ring-1 ring-white/20">
            <input
              type="search"
              placeholder={tHeader("searchPlaceholder")}
              className="w-full bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-gray-400 focus:outline-none"
            />
            <button
              type="button"
              aria-label="Search"
              className="flex items-center justify-center bg-brand-600 px-5 text-white transition hover:bg-brand-700"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
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
    </header>
  );
}
