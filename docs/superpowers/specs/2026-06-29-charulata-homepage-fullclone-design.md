# Charulata Homepage — Full Clone + Premium (Design Spec)

**Date:** 2026-06-29
**Status:** Approved for planning

## Goal

Rebuild the storefront homepage to closely match **charulata.green** and exceed it in
polish ("premium"). Includes a shared site layout (header, left category sidebar, footer),
a multi-slide hero carousel, a Top Sellers carousel, category showcase rows, real-looking
stock imagery, and a **Bengali/English language toggle** across the whole UI. Data still
comes from `lib/mock-data.ts` (no backend yet) but is reshaped to be bilingual and
backend-swap-ready.

This is a single spec, but execution is staged into independently testable tasks
(i18n foundation → layout frame → hero → top sellers → category rows → assemble) so each
stage is reviewable in the browser before the next.

## Tech Stack (premium tooling — chosen deliberately)

- **Next.js 16** (App Router, Turbopack) + **TypeScript** + **Tailwind CSS v4** (`@theme`, not v3 config).
- **i18n:** `next-intl` — route-based locale (`/en`, `/bn`) with a language switcher. Industry-standard, job-ready. Default locale `bn` (the real site is Bengali-first); `en` available via toggle.
- **Carousel:** `embla-carousel-react` — hero slides + Top Sellers row. Lightweight, performant, accessible.
- **Animation:** `framer-motion` — slide transitions, hover lift, scroll-reveal on rows.
- **Icons:** `lucide-react` — search, cart, wishlist, account, social, chevrons.
- **Fonts:** Next.js font loader — a Latin font for English + **Noto Sans Bengali** for Bengali, wired through Tailwind.
- **Images:** Next.js `<Image>` with remote Unsplash URLs (configured in `next.config` `images.remotePatterns`), with a local placeholder fallback on error.

**Why next-intl over a hand-rolled Context:** the user wants advanced, job-ready tech. `next-intl`
gives locale-aware routing, message namespacing, formatting (numbers/currency), and a clean
`useTranslations()` API. A Context approach would need retrofitting later; next-intl is the
real-world choice.

## Architecture

```
app/
  [locale]/
    layout.tsx        # NextIntlClientProvider + Header + CategorySidebar + Footer
    page.tsx          # Homepage: HeroCarousel + TopSellers + CategoryShowcase rows
  layout.tsx          # root html/body, fonts
i18n/
  routing.ts          # locales ['bn','en'], defaultLocale 'bn'
  request.ts          # next-intl request config
messages/
  bn.json             # Bengali strings (nav, sidebar, hero, sections, footer)
  en.json             # English strings (same keys)
components/
  layout/
    Header.tsx            # logo, nav, search, social, wishlist+cart, account, LanguageToggle
    LanguageToggle.tsx    # বাংলা / EN switch (locale-aware Link)
    CategorySidebar.tsx   # green MENU header + 10 categories
    Footer.tsx            # multi-column premium footer
  home/
    HeroCarousel.tsx      # embla multi-slide, gradient/badge/CTA, framer-motion
    TopSellers.tsx        # embla carousel row with prev/next arrows
    CategoryShowcase.tsx  # scroll-reveal product row per non-empty category
    ProductCard.tsx       # (existing) — updated to read bilingual name + stock image
lib/
  mock-data.ts        # bilingual Product/Category shape + stock image URLs
middleware.ts         # next-intl locale routing
```

### Data shape (bilingual, backend-swap-ready)

```ts
type Localized = { en: string; bn: string };

type Product = {
  id: string;
  name: Localized;
  slug: string;
  priceMin: number;
  priceMax: number | null;
  imageUrl: string;     // remote Unsplash URL
  soldOut: boolean;
  category: string;     // category slug
};

type Category = {
  id: string;
  name: Localized;
  slug: string;
  imageUrl: string;
};
```

`getTopSellers()`, `getCategories()`, `getProductsByCategory(slug)` keep their signatures;
only the returned shape gains `Localized` names. Components pick `name[locale]`.

### Data flow

mock-data (bilingual) → server component reads `locale` (from next-intl) → passes localized
strings / current locale to client carousel components → render. UI chrome strings
(nav, buttons, headings) come from `messages/{locale}.json` via `useTranslations()`.
When a real backend arrives, only the mock-data fetch is swapped.

## Components (one clear purpose each)

- **Header** — top bar: logo, primary nav, social icons, wishlist+cart badges, search input, account icon, LanguageToggle. Sticky on scroll. Consumes `useTranslations('nav')`.
- **LanguageToggle** — switches between `/bn` and `/en` for the current path; persists via the URL (next-intl handles it).
- **CategorySidebar** — green "MENU" header + 10 categories from `getCategories()`, each a locale-aware link with a chevron; hover state.
- **Footer** — premium multi-column: about/quick links/contact/social/newsletter. Translated.
- **HeroCarousel** — embla, 2–3 promo slides (e.g. "Green Friday SALE" style): gradient background, "Don't Miss" badge, headline, subcopy, CTA button. framer-motion fade/slide; autoplay with pause-on-hover; dots + arrows.
- **TopSellers** — section heading + embla carousel of ProductCards with prev/next arrows; responsive slides-per-view.
- **CategoryShowcase** — per non-empty category: heading + "View all" link + responsive grid/row of ProductCards; framer-motion scroll-reveal.
- **ProductCard** — (existing) updated to render `name[locale]`, remote image, price; badge "Sold out", button "Out of stock" (UNCHANGED labels — keep both as-is).

## Error handling / edge cases

- Image load failure → swap to local `/images/placeholder-plant.svg` (onError fallback).
- Empty category → `CategoryShowcase` returns `null` (hidden), as today.
- Carousel with a single slide → hide arrows/dots; disable autoplay.
- Missing translation key → next-intl surfaces the key name (caught in tests).
- Invalid/unknown locale in URL → next-intl middleware redirects to `defaultLocale`.

## Testing

- Vitest + React Testing Library, existing 13 tests stay green (updated for bilingual shape where needed).
- Each component gets a test rendered inside a `NextIntlClientProvider` with a test message catalog.
- Bilingual render test: a representative component renders correctly under both `bn` and `en` messages.
- mock-data test: `Localized` shape present; filters still work.
- ProductCard: price formatting, sold-out badge ("Sold out") + button ("Out of stock"), localized name.
- Manual browser verification after each stage (`npm run dev`), and a final full-homepage check at `/bn` and `/en`.

## Staged execution (one spec, reviewable stages)

1. **i18n foundation** — next-intl install, routing/middleware, `messages/{bn,en}.json`, `[locale]` segment, fonts, LanguageToggle. Verify toggle flips a sample string.
2. **Shared layout** — Header, CategorySidebar, Footer wired into `[locale]/layout.tsx`.
3. **Bilingual mock-data + images** — reshape to `Localized`, add Unsplash URLs, `next.config` remote patterns, ProductCard update.
4. **HeroCarousel** — embla + framer-motion premium slides.
5. **TopSellers carousel** — embla row with arrows.
6. **CategoryShowcase** — scroll-reveal rows.
7. **Assemble homepage** — `[locale]/page.tsx`, full verification at `/bn` and `/en`.

## Out of scope (future specs)

- Shop / Product Detail / Cart / Checkout pages.
- Real backend wiring, auth, SSLCommerz payment.
- Wishlist/cart persistence and real counts (badges show static/mock count for now).
- Search functionality (input is visual only this round).
- Booking/appointment flow.
```
