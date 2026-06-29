"use client";

import { useTranslations } from "next-intl";
import { Facebook, Twitter, Instagram, Linkedin } from "./SocialIcons";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-ink-900 text-white/70">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-serif text-xl font-semibold italic text-white">
            Charulata<span className="text-brand-400">.</span>
          </h3>
          <p className="mt-3 text-sm">{t("tagline")}</p>
        </div>
        <div>
          <h4 className="font-semibold text-white">{t("quickLinks")}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="transition hover:text-white">Home</li>
            <li className="transition hover:text-white">Shop</li>
            <li className="transition hover:text-white">About Us</li>
            <li className="transition hover:text-white">Contact Us</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">{t("contact")}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Dhaka, Bangladesh</li>
            <li>+880 1XXX-XXXXXX</li>
            <li>hello@charulata.green</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">{t("followUs")}</h4>
          <div className="mt-3 flex gap-3">
            <a href="#" aria-label="Facebook" className="transition hover:text-white"><Facebook className="h-5 w-5" /></a>
            <a href="#" aria-label="Twitter" className="transition hover:text-white"><Twitter className="h-5 w-5" /></a>
            <a href="#" aria-label="Instagram" className="transition hover:text-white"><Instagram className="h-5 w-5" /></a>
            <a href="#" aria-label="LinkedIn" className="transition hover:text-white"><Linkedin className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {year} Charulata. {t("rights")}
      </div>
    </footer>
  );
}
