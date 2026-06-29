# Charulata Homepage Full Clone (Premium + i18n) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the storefront homepage to closely match charulata.green with a premium finish — shared layout (header, left category sidebar, footer), a hero carousel, a Top Sellers carousel, category showcase rows, stock imagery, and a Bengali/English language toggle.

**Architecture:** Next.js 16 App Router with a `[locale]` route segment driven by `next-intl` (route-based i18n, default locale `bn`). UI chrome strings live in `messages/{bn,en}.json`; product/category names are bilingual in `lib/mock-data.ts`. Carousels use `embla-carousel-react`, animations use `framer-motion`, icons use `lucide-react`. Data stays mock for now but is shaped backend-swap-ready.

**Tech Stack:** Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4 (`@theme` in `globals.css`, NO `tailwind.config`), next-intl, embla-carousel-react, framer-motion, lucide-react, next/font (Geist + Noto Sans Bengali), Vitest + React Testing Library.

## Global Constraints

- Frontend root: `d:/Way_To_Job/ASP DOTNET/frontend`. All paths below are relative to it unless absolute.
- Tailwind is **v4** — design tokens live in `app/globals.css` under `@theme`. There is NO `tailwind.config.ts`. Brand colors already exist as `--color-brand-50..900` → usable as `bg-brand-600`, `text-brand-700`, etc.
- Vitest config: `vitest.config.ts` has `@` alias → repo `frontend/` root, `environment: jsdom`, `globals: true`, `setupFiles: ["./vitest.setup.ts"]`. Run a single file with `npx vitest run <path>`; full suite with `npx vitest run`.
- ProductCard label rule (DO NOT CHANGE): sold-out BADGE text is `Sold out`; sold-out BUTTON text is `Out of stock`; in-stock button text is `Add to cart`.
- Default locale is `bn`; `en` is the alternate. URLs are `/bn` and `/en`. `/` redirects to `/bn` via middleware.
- Existing test suite is 13 tests; keep it green (some tests get updated for the bilingual data shape and the i18n provider).
- All new components that call `useTranslations` are Client Components (`"use client"`) unless they only render server-side with `getTranslations`. Carousels (embla/framer-motion) MUST be Client Components.
- Commit after every task. Branch is `main`; commit directly (user works on main for this project).
- Bengali product/category display names come from `name.bn`; English from `name.en`.

---

### Task 1: Install dependencies and Bengali font

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `app/layout.tsx` (add Noto Sans Bengali font variable)
- Modify: `app/globals.css` (register `--font-bengali` token)

**Interfaces:**
- Produces: installed packages `next-intl`, `embla-carousel-react`, `framer-motion`, `lucide-react`; a `--font-bengali` CSS variable + `font-bengali` utility usable in later tasks.
- Consumes: nothing.

- [ ] **Step 1: Install packages**

```bash
cd "d:/Way_To_Job/ASP DOTNET/frontend"
npm install next-intl embla-carousel-react framer-motion lucide-react
```

Expected: packages added to `dependencies`, no peer-dep errors (all support React 19 / Next 16).

- [ ] **Step 2: Add the Bengali font to the root layout**

Edit `app/layout.tsx`. Add `Noto_Sans_Bengali` to the existing font imports and apply its variable on `<html>`:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Charulata — Online Plant Nursery",
  description: "Buy green to save green — fruit trees, flowers, ornamentals and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${notoBengali.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Register the font token in Tailwind v4**

Edit `app/globals.css`. Inside the existing `@theme inline { ... }` block, add this line after `--font-mono`:

```css
  --font-bengali: var(--font-bengali);
```

(This makes `font-bengali` a Tailwind utility class.)

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds (no font/import errors). If `npm run build` is slow, instead run `npx tsc --noEmit` and confirm no type errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json app/layout.tsx app/globals.css
git commit -m "chore: add next-intl, embla, framer-motion, lucide and Bengali font"
```

---

### Task 2: next-intl scaffolding (routing, middleware, request config, plugin)

**Files:**
- Create: `i18n/routing.ts`
- Create: `i18n/request.ts`
- Create: `middleware.ts`
- Create: `next.config.ts` wiring (modify existing `next.config.ts` — it exists from scaffold)
- Create: `messages/bn.json`
- Create: `messages/en.json`

**Interfaces:**
- Produces:
  - `routing` (from `i18n/routing.ts`) with `locales: ['bn','en']`, `defaultLocale: 'bn'`.
  - message catalogs loaded by locale; namespaces used later: `nav`, `header`, `sidebar`, `hero`, `sections`, `footer`, `product`.
- Consumes: nothing.

- [ ] **Step 1: Create the routing config**

Create `i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["bn", "en"],
  defaultLocale: "bn",
});
```

- [ ] **Step 2: Create the request config that loads messages**

Create `i18n/request.ts`:

```ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: Create the middleware**

Create `middleware.ts` (at `frontend/` root, beside `app/`):

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
```

- [ ] **Step 4: Wire the next-intl plugin into next.config**

Open the existing `next.config.ts`. Wrap the exported config with the next-intl plugin. The result must look like this (preserve any existing config keys inside the object):

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* keep any existing options here */
};

export default withNextIntl(nextConfig);
```

(`createNextIntlPlugin()` with no argument uses the default request file path `./i18n/request.ts`.)

- [ ] **Step 5: Create starter message catalogs**

Create `messages/en.json`:

```json
{
  "nav": {
    "home": "Home",
    "shop": "Shop",
    "about": "About Us",
    "contact": "Contact Us",
    "booking": "Book Appointment"
  },
  "header": {
    "searchPlaceholder": "Search for products",
    "wishlist": "Wishlist",
    "cart": "Cart",
    "account": "Account"
  },
  "sidebar": {
    "menu": "MENU"
  },
  "hero": {
    "tagline": "Country's largest online nursery",
    "cta": "Start shopping",
    "dontMiss": "Don't Miss"
  },
  "sections": {
    "topSellers": "Top Sellers",
    "viewAll": "View all"
  },
  "footer": {
    "tagline": "Buy green to save green.",
    "quickLinks": "Quick Links",
    "contact": "Contact",
    "followUs": "Follow Us",
    "rights": "All rights reserved."
  },
  "product": {
    "addToCart": "Add to cart",
    "outOfStock": "Out of stock",
    "soldOut": "Sold out"
  }
}
```

Create `messages/bn.json`:

```json
{
  "nav": {
    "home": "হোম",
    "shop": "শপ",
    "about": "আমাদের সম্পর্কে",
    "contact": "যোগাযোগ",
    "booking": "অ্যাপয়েন্টমেন্ট বুক করুন"
  },
  "header": {
    "searchPlaceholder": "পণ্য খুঁজুন",
    "wishlist": "উইশলিস্ট",
    "cart": "কার্ট",
    "account": "অ্যাকাউন্ট"
  },
  "sidebar": {
    "menu": "মেনু"
  },
  "hero": {
    "tagline": "দেশের সবচেয়ে বড় অনলাইন নার্সারি",
    "cta": "কেনাকাটা শুরু করুন",
    "dontMiss": "মিস করবেন না"
  },
  "sections": {
    "topSellers": "টপ সেলার",
    "viewAll": "সব দেখুন"
  },
  "footer": {
    "tagline": "সবুজ কিনুন, সবুজ বাঁচান।",
    "quickLinks": "দ্রুত লিংক",
    "contact": "যোগাযোগ",
    "followUs": "ফলো করুন",
    "rights": "সর্বস্বত্ব সংরক্ষিত।"
  },
  "product": {
    "addToCart": "কার্টে যোগ করুন",
    "outOfStock": "স্টক নেই",
    "soldOut": "বিক্রি শেষ"
  }
}
```

- [ ] **Step 6: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors. (Functional verification happens in Task 3 once the `[locale]` layout exists.)

- [ ] **Step 7: Commit**

```bash
git add i18n messages middleware.ts next.config.ts
git commit -m "feat: scaffold next-intl routing, middleware and message catalogs"
```

---

### Task 3: Move app into `[locale]` segment with NextIntlClientProvider

**Files:**
- Create: `app/[locale]/layout.tsx`
- Create: `app/[locale]/page.tsx` (temporary minimal homepage; replaced in Task 11)
- Delete: `app/page.tsx` (the current homepage moves under `[locale]`)
- Keep: `app/layout.tsx` (root — html/body/fonts only)

**Interfaces:**
- Consumes: `routing` (Task 2), message catalogs (Task 2).
- Produces: a working `/bn` and `/en` route where `useTranslations` works; later tasks add Header/Sidebar/Footer here.

- [ ] **Step 1: Simplify the root layout to host fonts only**

The root `app/layout.tsx` must NOT render `<html>`/`<body>` anymore (the `[locale]` layout owns those, per next-intl). Replace `app/layout.tsx` body with a pass-through, but keep font variables by moving them onto the locale layout. Update `app/layout.tsx` to:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Charulata — Online Plant Nursery",
  description: "Buy green to save green — fruit trees, flowers, ornamentals and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
```

- [ ] **Step 2: Create the locale layout (owns html/body + fonts + provider)**

Create `app/[locale]/layout.tsx`:

```tsx
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";
import { routing } from "@/i18n/routing";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const notoBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${notoBengali.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col ${locale === "bn" ? "font-bengali" : "font-sans"}`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

(Font variables now live here because this layout owns `<html>`. The earlier Task-1 edit to root layout is superseded — that's expected.)

- [ ] **Step 3: Create a temporary locale homepage that proves i18n works**

Create `app/[locale]/page.tsx`:

```tsx
import { setRequestLocale, getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hero");

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-brand-900">{t("tagline")}</h1>
    </main>
  );
}
```

- [ ] **Step 4: Delete the old homepage**

```bash
cd "d:/Way_To_Job/ASP DOTNET/frontend"
rm app/page.tsx
```

- [ ] **Step 5: Verify both locales render in the browser**

```bash
npm run dev
```

Visit `http://localhost:3000/en` → shows "Country's largest online nursery".
Visit `http://localhost:3000/bn` → shows "দেশের সবচেয়ে বড় অনলাইন নার্সারি" in Bengali font.
Visit `http://localhost:3000/` → redirects to `/bn`.
Stop the server.

- [ ] **Step 6: Commit**

```bash
git add app
git commit -m "feat: move homepage under [locale] segment with next-intl provider"
```

---

### Task 4: Bilingual mock-data + Unsplash images + remote image config

**Files:**
- Modify: `lib/mock-data.ts`
- Modify: `lib/mock-data.test.ts`
- Modify: `next.config.ts` (add `images.remotePatterns` for Unsplash)

**Interfaces:**
- Consumes: nothing new.
- Produces:
  - `type Localized = { en: string; bn: string }`
  - `type Product` with `name: Localized` (other fields unchanged: `id, slug, priceMin, priceMax, imageUrl, soldOut, category`)
  - `type Category` with `name: Localized` (`id, slug, imageUrl` unchanged)
  - `getTopSellers(): Product[]`, `getCategories(): Category[]`, `getProductsByCategory(slug: string): Product[]` (signatures unchanged)
  - All `imageUrl`s are remote Unsplash URLs.

- [ ] **Step 1: Update the test for the bilingual shape**

Replace `lib/mock-data.test.ts` with:

```ts
import { describe, it, expect } from "vitest";
import { getTopSellers, getCategories, getProductsByCategory } from "./mock-data";

describe("mock-data", () => {
  it("returns at least 4 top sellers", () => {
    expect(getTopSellers().length).toBeGreaterThanOrEqual(4);
  });

  it("returns the 10 nursery categories", () => {
    expect(getCategories().length).toBe(10);
  });

  it("filters products by category slug", () => {
    const firstSlug = getCategories()[0].slug;
    const products = getProductsByCategory(firstSlug);
    expect(products.every((p) => p.category === firstSlug)).toBe(true);
  });

  it("gives every product a bilingual name", () => {
    for (const p of getTopSellers()) {
      expect(typeof p.name.en).toBe("string");
      expect(typeof p.name.bn).toBe("string");
      expect(p.name.en.length).toBeGreaterThan(0);
      expect(p.name.bn.length).toBeGreaterThan(0);
    }
  });

  it("gives every category a bilingual name", () => {
    for (const c of getCategories()) {
      expect(c.name.en.length).toBeGreaterThan(0);
      expect(c.name.bn.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/mock-data.test.ts`
Expected: FAIL — `p.name.en` is undefined (name is currently a string).

- [ ] **Step 3: Rewrite the mock-data module**

Replace `lib/mock-data.ts` with:

```ts
export type Localized = { en: string; bn: string };

export type Product = {
  id: string;
  name: Localized;
  slug: string;
  priceMin: number;
  priceMax: number | null;
  imageUrl: string;
  soldOut: boolean;
  category: string;
};

export type Category = {
  id: string;
  name: Localized;
  slug: string;
  imageUrl: string;
};

const IMG = {
  fruit: "https://images.unsplash.com/photo-1502741126161-b048400d085d?auto=format&fit=crop&w=600&q=80",
  flower: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80",
  ornamental: "https://images.unsplash.com/photo-1462530260150-162092dbf011?auto=format&fit=crop&w=600&q=80",
  palm: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80",
};

export const categories: Category[] = [
  { id: "c1", name: { en: "Fruit Trees", bn: "ফল গাছ" }, slug: "fruit-trees", imageUrl: IMG.fruit },
  { id: "c2", name: { en: "Flower Plants", bn: "ফুল গাছ" }, slug: "flower-plants", imageUrl: IMG.flower },
  { id: "c3", name: { en: "Ornamental Plants", bn: "শোভাময় গাছ" }, slug: "ornamental-plants", imageUrl: IMG.ornamental },
  { id: "c4", name: { en: "Spice Plants", bn: "মশলা জাতীয় গাছ" }, slug: "spice-plants", imageUrl: IMG.ornamental },
  { id: "c5", name: { en: "Medicinal Plants", bn: "ঔষধি গাছ" }, slug: "medicinal-plants", imageUrl: IMG.ornamental },
  { id: "c6", name: { en: "Wood/Timber Trees", bn: "কাঠ গাছ" }, slug: "wood-timber-trees", imageUrl: IMG.fruit },
  { id: "c7", name: { en: "Vegetable Plants", bn: "সবজি জাতীয় গাছ" }, slug: "vegetable-plants", imageUrl: IMG.ornamental },
  { id: "c8", name: { en: "Gardening Tools", bn: "গার্ডেনিং টুলস" }, slug: "gardening-tools", imageUrl: IMG.palm },
  { id: "c9", name: { en: "Organic Fertilizers & Pesticides", bn: "জৈব সার ও কীটনাশক" }, slug: "fertilizers-pesticides", imageUrl: IMG.ornamental },
  { id: "c10", name: { en: "Pots & Geo-bags", bn: "টব ও জিও ব্যাগ" }, slug: "pots-geo-bags", imageUrl: IMG.palm },
];

export const products: Product[] = [
  { id: "p1", name: { en: "Cat's Claw Creeper", bn: "ক্যাট'স ক্ল ক্রিপার" }, slug: "cats-claw-creeper", priceMin: 600, priceMax: null, imageUrl: IMG.flower, soldOut: false, category: "flower-plants" },
  { id: "p2", name: { en: "Golden Shower", bn: "সোনালু" }, slug: "golden-shower", priceMin: 500, priceMax: null, imageUrl: IMG.flower, soldOut: false, category: "flower-plants" },
  { id: "p3", name: { en: "Rambutan", bn: "রাম্বুটান" }, slug: "rambutan", priceMin: 350, priceMax: 800, imageUrl: IMG.fruit, soldOut: false, category: "fruit-trees" },
  { id: "p4", name: { en: "Avocado", bn: "অ্যাভোকাডো" }, slug: "avocado", priceMin: 400, priceMax: 900, imageUrl: IMG.fruit, soldOut: false, category: "fruit-trees" },
  { id: "p5", name: { en: "Guava", bn: "পেয়ারা" }, slug: "guava", priceMin: 150, priceMax: 350, imageUrl: IMG.fruit, soldOut: true, category: "fruit-trees" },
  { id: "p6", name: { en: "Erica Palm", bn: "এরিকা পাম" }, slug: "erica-palm", priceMin: 100, priceMax: 185, imageUrl: IMG.palm, soldOut: false, category: "ornamental-plants" },
  { id: "p7", name: { en: "Camellia", bn: "ক্যামেলিয়া" }, slug: "camellia", priceMin: 500, priceMax: null, imageUrl: IMG.flower, soldOut: false, category: "flower-plants" },
  { id: "p8", name: { en: "Bougainvillea", bn: "বাগানবিলাস" }, slug: "bougainvillea", priceMin: 250, priceMax: 600, imageUrl: IMG.ornamental, soldOut: false, category: "ornamental-plants" },
];

export function getTopSellers(): Product[] {
  return products.slice(0, 4);
}

export function getCategories(): Category[] {
  return categories;
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run lib/mock-data.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Allow Unsplash images in next.config**

Edit `next.config.ts` — add an `images.remotePatterns` entry inside `nextConfig`:

```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};
```

(Keep the `withNextIntl(...)` wrapper from Task 2 Step 4.)

- [ ] **Step 6: Commit**

```bash
git add lib/mock-data.ts lib/mock-data.test.ts next.config.ts
git commit -m "feat: bilingual mock-data with Unsplash imagery and remote image config"
```

---

### Task 5: Update ProductCard for bilingual names + remote image fallback + translated labels

**Files:**
- Modify: `components/home/ProductCard.tsx`
- Modify: `components/home/ProductCard.test.tsx`

**Interfaces:**
- Consumes: `Product` (Task 4, `name: Localized`), `useLocale`/`useTranslations` from `next-intl`.
- Produces: `ProductCard({ product }: { product: Product })` — Client Component that renders `product.name[locale]`, translated button labels, badge "Sold out".

- [ ] **Step 1: Update the test to render inside an intl provider with both locales**

Replace `components/home/ProductCard.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/mock-data";

const messages = {
  product: { addToCart: "Add to cart", outOfStock: "Out of stock", soldOut: "Sold out" },
};

const product: Product = {
  id: "p1",
  name: { en: "Rambutan", bn: "রাম্বুটান" },
  slug: "rambutan",
  priceMin: 350,
  priceMax: 800,
  imageUrl: "https://images.unsplash.com/photo-1502741126161-b048400d085d",
  soldOut: false,
  category: "fruit-trees",
};

function renderWith(locale: string, p: Product) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ProductCard product={p} />
    </NextIntlClientProvider>,
  );
}

describe("ProductCard", () => {
  it("renders the English name under en locale", () => {
    renderWith("en", product);
    expect(screen.getByText("Rambutan")).toBeInTheDocument();
  });

  it("renders the Bengali name under bn locale", () => {
    renderWith("bn", product);
    expect(screen.getByText("রাম্বুটান")).toBeInTheDocument();
  });

  it("renders a price range when priceMax is set", () => {
    renderWith("en", product);
    expect(screen.getByText("৳350 – ৳800")).toBeInTheDocument();
  });

  it("renders a single price when priceMax is null", () => {
    renderWith("en", { ...product, priceMax: null });
    expect(screen.getByText("৳350")).toBeInTheDocument();
  });

  it("shows a Sold out badge and Out of stock button when soldOut", () => {
    renderWith("en", { ...product, soldOut: true });
    expect(screen.getByText("Sold out")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Out of stock" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/home/ProductCard.test.tsx`
Expected: FAIL — ProductCard does not yet read `name[locale]` / uses untranslated labels.

- [ ] **Step 3: Rewrite ProductCard**

Replace `components/home/ProductCard.tsx` with:

```tsx
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
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-brand-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square w-full overflow-hidden bg-brand-50">
        <Image
          src={product.imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {product.soldOut && (
          <span className="absolute left-2 top-2 rounded bg-gray-800 px-2 py-1 text-xs font-medium text-white">
            {t("soldOut")}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="text-sm font-medium text-brand-900">{name}</h3>
        <p className="text-sm font-semibold text-brand-700">{formatPrice(product)}</p>
        <button
          type="button"
          disabled={product.soldOut}
          className="mt-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {product.soldOut ? t("outOfStock") : t("addToCart")}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run components/home/ProductCard.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add components/home/ProductCard.tsx components/home/ProductCard.test.tsx
git commit -m "feat: ProductCard reads bilingual name, translated labels, image hover"
```

---

### Task 6: LanguageToggle component

**Files:**
- Create: `components/layout/LanguageToggle.tsx`
- Create: `components/layout/LanguageToggle.test.tsx`

**Interfaces:**
- Consumes: `useLocale` from `next-intl`, `usePathname`/`useRouter` from `next/navigation`.
- Produces: `LanguageToggle()` — two buttons (বাংলা / EN); clicking swaps the leading locale segment in the current path and navigates.

- [ ] **Step 1: Write the failing test**

Create `components/layout/LanguageToggle.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { LanguageToggle } from "./LanguageToggle";

vi.mock("next/navigation", () => ({
  usePathname: () => "/bn",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

function renderWith(locale: string) {
  return render(
    <NextIntlClientProvider locale={locale} messages={{}}>
      <LanguageToggle />
    </NextIntlClientProvider>,
  );
}

describe("LanguageToggle", () => {
  it("renders both language options", () => {
    renderWith("bn");
    expect(screen.getByRole("button", { name: /বাংলা/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /EN/ })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/layout/LanguageToggle.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `components/layout/LanguageToggle.tsx`:

```tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const LOCALES = [
  { code: "bn", label: "বাংলা" },
  { code: "en", label: "EN" },
] as const;

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: string) {
    // replace the leading /<locale> segment with the next locale
    const rest = pathname.replace(/^\/(bn|en)(?=\/|$)/, "");
    router.push(`/${next}${rest || ""}`);
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => switchTo(l.code)}
          className={`rounded px-2 py-1 transition ${
            locale === l.code
              ? "bg-brand-600 text-white"
              : "text-brand-700 hover:bg-brand-100"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run components/layout/LanguageToggle.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/layout/LanguageToggle.tsx components/layout/LanguageToggle.test.tsx
git commit -m "feat: add language toggle that swaps locale in the URL"
```

---

### Task 7: Header component

**Files:**
- Create: `components/layout/Header.tsx`
- Create: `components/layout/Header.test.tsx`

**Interfaces:**
- Consumes: `useTranslations` (namespaces `nav`, `header`), `Link` from `next-intl/navigation` OR `next/link` with locale prefix, `LanguageToggle` (Task 6), `lucide-react` icons.
- Produces: `Header()` — Client Component: logo, nav links, search input, wishlist+cart icons with badges, account icon, social icons, LanguageToggle. Sticky.

- [ ] **Step 1: Write the failing test**

Create `components/layout/Header.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "./Header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ push: vi.fn() }),
}));

const messages = {
  nav: { home: "Home", shop: "Shop", about: "About Us", contact: "Contact Us", booking: "Book Appointment" },
  header: { searchPlaceholder: "Search for products", wishlist: "Wishlist", cart: "Cart", account: "Account" },
};

describe("Header", () => {
  it("renders the brand and primary nav", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Header />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Charulata")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search for products")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/layout/Header.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `components/layout/Header.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Search, Heart, ShoppingCart, User, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
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
    <header className="sticky top-0 z-50 bg-brand-900 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href={p("")} className="font-serif text-2xl font-bold tracking-wide">
            Charulata
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navItems.map((item) => (
              <Link key={item.key} href={p(item.href)} className="transition hover:text-brand-200">
                {tNav(item.key)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-brand-200 sm:flex">
              <Facebook className="h-4 w-4" />
              <Twitter className="h-4 w-4" />
              <Instagram className="h-4 w-4" />
              <Linkedin className="h-4 w-4" />
            </div>
            <LanguageToggle />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="search"
              placeholder={tHeader("searchPlaceholder")}
              className="w-full rounded-md border border-brand-700 bg-brand-800 px-4 py-2 pr-10 text-sm text-white placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-brand-300" />
          </div>
          <button type="button" aria-label={tHeader("wishlist")} className="relative">
            <Heart className="h-6 w-6" />
            <span className="absolute -right-2 -top-2 rounded-full bg-brand-500 px-1.5 text-xs">0</span>
          </button>
          <button type="button" aria-label={tHeader("cart")} className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -right-2 -top-2 rounded-full bg-brand-500 px-1.5 text-xs">0</span>
          </button>
          <button type="button" aria-label={tHeader("account")}>
            <User className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run components/layout/Header.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/layout/Header.tsx components/layout/Header.test.tsx
git commit -m "feat: add sticky header with nav, search, cart and language toggle"
```

---

### Task 8: CategorySidebar component

**Files:**
- Create: `components/layout/CategorySidebar.tsx`
- Create: `components/layout/CategorySidebar.test.tsx`

**Interfaces:**
- Consumes: `getCategories()` (Task 4), `useLocale`/`useTranslations("sidebar")`, `Link` (next/link), `ChevronRight` from lucide.
- Produces: `CategorySidebar()` — Client Component: green MENU header + 10 localized category links each with a chevron.

- [ ] **Step 1: Write the failing test**

Create `components/layout/CategorySidebar.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { CategorySidebar } from "./CategorySidebar";

const messages = { sidebar: { menu: "MENU" } };

function renderWith(locale: string) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CategorySidebar />
    </NextIntlClientProvider>,
  );
}

describe("CategorySidebar", () => {
  it("renders the MENU header and 10 categories", () => {
    renderWith("en");
    expect(screen.getByText("MENU")).toBeInTheDocument();
    expect(screen.getByText("Fruit Trees")).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toBe(10);
  });

  it("renders Bengali category names under bn locale", () => {
    renderWith("bn");
    expect(screen.getByText("ফল গাছ")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/layout/CategorySidebar.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `components/layout/CategorySidebar.tsx`:

```tsx
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
    <aside className="w-full">
      <div className="flex items-center gap-2 rounded-t-md bg-brand-600 px-4 py-3 font-semibold text-white">
        <Menu className="h-5 w-5" />
        {t("menu")}
      </div>
      <ul className="divide-y divide-brand-100 rounded-b-md border border-t-0 border-brand-100 bg-white">
        {categories.map((c) => (
          <li key={c.id}>
            <Link
              href={`/${locale}/shop?category=${c.slug}`}
              className="flex items-center justify-between px-4 py-3 text-sm text-brand-900 transition hover:bg-brand-50"
            >
              {c.name[locale] ?? c.name.en}
              <ChevronRight className="h-4 w-4 text-brand-400" />
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run components/layout/CategorySidebar.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/layout/CategorySidebar.tsx components/layout/CategorySidebar.test.tsx
git commit -m "feat: add localized category sidebar with MENU header"
```

---

### Task 9: Footer component

**Files:**
- Create: `components/layout/Footer.tsx`
- Create: `components/layout/Footer.test.tsx`

**Interfaces:**
- Consumes: `useTranslations("footer")`, `useLocale`, lucide social icons.
- Produces: `Footer()` — Client Component: multi-column premium footer.

- [ ] **Step 1: Write the failing test**

Create `components/layout/Footer.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { Footer } from "./Footer";

const messages = {
  footer: { tagline: "Buy green to save green.", quickLinks: "Quick Links", contact: "Contact", followUs: "Follow Us", rights: "All rights reserved." },
};

describe("Footer", () => {
  it("renders the tagline and column headings", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Footer />
      </NextIntlClientProvider>,
    );
    expect(screen.getByText("Buy green to save green.")).toBeInTheDocument();
    expect(screen.getByText("Quick Links")).toBeInTheDocument();
    expect(screen.getByText("Follow Us")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/layout/Footer.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `components/layout/Footer.tsx`:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-white">Charulata</h3>
          <p className="mt-3 text-sm">{t("tagline")}</p>
        </div>
        <div>
          <h4 className="font-semibold text-white">{t("quickLinks")}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Home</li>
            <li>Shop</li>
            <li>About Us</li>
            <li>Contact Us</li>
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
            <Facebook className="h-5 w-5" />
            <Twitter className="h-5 w-5" />
            <Instagram className="h-5 w-5" />
            <Linkedin className="h-5 w-5" />
          </div>
        </div>
      </div>
      <div className="border-t border-brand-800 py-4 text-center text-xs text-brand-300">
        © {year} Charulata. {t("rights")}
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run components/layout/Footer.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/layout/Footer.tsx components/layout/Footer.test.tsx
git commit -m "feat: add premium multi-column footer"
```

---

### Task 10: HeroCarousel component (embla + framer-motion)

**Files:**
- Create: `components/home/HeroCarousel.tsx`
- Create: `components/home/HeroCarousel.test.tsx`

**Interfaces:**
- Consumes: `useTranslations("hero")`, `useLocale`, `embla-carousel-react` (`useEmblaCarousel`), `framer-motion`, lucide `ChevronLeft`/`ChevronRight`, `next/link`.
- Produces: `HeroCarousel()` — Client Component: 3 promo slides with gradient, "Don't Miss" badge, headline, CTA; prev/next arrows + dots.

- [ ] **Step 1: Write the failing test**

Create `components/home/HeroCarousel.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { HeroCarousel } from "./HeroCarousel";

vi.mock("embla-carousel-react", () => ({
  default: () => [vi.fn(), { scrollPrev: vi.fn(), scrollNext: vi.fn(), on: vi.fn(), off: vi.fn(), selectedScrollSnap: () => 0, scrollSnapList: () => [0, 1, 2], scrollTo: vi.fn() }],
}));

const messages = { hero: { tagline: "Country's largest online nursery", cta: "Start shopping", dontMiss: "Don't Miss" } };

describe("HeroCarousel", () => {
  it("renders the CTA and a Don't Miss badge", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <HeroCarousel />
      </NextIntlClientProvider>,
    );
    expect(screen.getAllByText("Don't Miss").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: /start shopping/i }).length).toBeGreaterThanOrEqual(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/home/HeroCarousel.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

Create `components/home/HeroCarousel.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const slides = [
  { id: 1, headline: "Green Friday", sub: "Such discounts you have not seen", gradient: "from-brand-400 to-brand-700" },
  { id: 2, headline: "Monsoon Greens", sub: "Fresh arrivals for the rainy season", gradient: "from-brand-500 to-brand-800" },
  { id: 3, headline: "Indoor Picks", sub: "Brighten every corner of your home", gradient: "from-brand-300 to-brand-600" },
];

export function HeroCarousel() {
  const locale = useLocale();
  const t = useTranslations("hero");
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    const id = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(id);
    };
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden rounded-xl">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s) => (
            <div key={s.id} className="relative min-w-0 flex-[0_0_100%]">
              <div className={`flex min-h-[320px] flex-col items-center justify-center gap-4 bg-gradient-to-br ${s.gradient} px-6 py-16 text-center text-white`}>
                <span className="rounded bg-red-500 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                  {t("dontMiss")}
                </span>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="font-serif text-4xl font-bold drop-shadow sm:text-6xl"
                >
                  {s.headline}
                </motion.h2>
                <p className="text-lg">{s.sub}</p>
                <Link
                  href={`/${locale}/shop`}
                  className="mt-2 rounded-full bg-white px-6 py-3 font-semibold text-brand-800 transition hover:bg-brand-50"
                >
                  {t("cta")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={scrollPrev} aria-label="Previous slide" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-brand-800 hover:bg-white">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={scrollNext} aria-label="Next slide" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-brand-800 hover:bg-white">
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 w-2 rounded-full transition ${selected === i ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run components/home/HeroCarousel.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/home/HeroCarousel.tsx components/home/HeroCarousel.test.tsx
git commit -m "feat: add premium hero carousel with embla and framer-motion"
```

---

### Task 11: Convert TopSellers to an embla carousel

**Files:**
- Modify: `components/home/TopSellers.tsx`
- Modify: `components/home/TopSellers.test.tsx`

**Interfaces:**
- Consumes: `getTopSellers()` (Task 4), `ProductCard` (Task 5), `useTranslations("sections")`, `useEmblaCarousel`, lucide chevrons.
- Produces: `TopSellers()` — Client Component: heading + horizontal carousel of ProductCards with prev/next arrows.

- [ ] **Step 1: Update the test**

Replace `components/home/TopSellers.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { TopSellers } from "./TopSellers";

vi.mock("embla-carousel-react", () => ({
  default: () => [vi.fn(), { scrollPrev: vi.fn(), scrollNext: vi.fn(), on: vi.fn(), off: vi.fn() }],
}));

const messages = {
  sections: { topSellers: "Top Sellers", viewAll: "View all" },
  product: { addToCart: "Add to cart", outOfStock: "Out of stock", soldOut: "Sold out" },
};

describe("TopSellers", () => {
  it("renders the heading and at least 4 product buttons", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <TopSellers />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("heading", { name: /top sellers/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /add to cart|out of stock/i }).length).toBeGreaterThanOrEqual(4);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/home/TopSellers.test.tsx`
Expected: FAIL — current TopSellers is not a client carousel / heading uses hardcoded text.

- [ ] **Step 3: Rewrite TopSellers**

Replace `components/home/TopSellers.tsx` with:

```tsx
"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { getTopSellers } from "@/lib/mock-data";
import { ProductCard } from "./ProductCard";

export function TopSellers() {
  const t = useTranslations("sections");
  const products = getTopSellers();
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-brand-900">{t("topSellers")}</h2>
        <div className="flex gap-2">
          <button onClick={scrollPrev} aria-label="Previous" className="rounded-full border border-brand-200 p-2 text-brand-700 hover:bg-brand-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={scrollNext} aria-label="Next" className="rounded-full border border-brand-200 p-2 text-brand-700 hover:bg-brand-50">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((product) => (
            <div key={product.id} className="min-w-0 flex-[0_0_50%] sm:flex-[0_0_33%] lg:flex-[0_0_25%]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run components/home/TopSellers.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/home/TopSellers.tsx components/home/TopSellers.test.tsx
git commit -m "feat: convert TopSellers to embla carousel with arrows"
```

---

### Task 12: Update CategoryShowcase for bilingual heading + scroll-reveal

**Files:**
- Modify: `components/home/CategoryShowcase.tsx`
- Modify: `components/home/CategoryShowcase.test.tsx`

**Interfaces:**
- Consumes: `getProductsByCategory` + `Category`/`Localized` (Task 4), `ProductCard` (Task 5), `useLocale`/`useTranslations("sections")`, `framer-motion`, `next/link`.
- Produces: `CategoryShowcase({ category }: { category: Category })` — Client Component: localized heading + "View all" link + grid of ProductCards with scroll-reveal; returns `null` if no products.

- [ ] **Step 1: Update the test**

Replace `components/home/CategoryShowcase.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { CategoryShowcase } from "./CategoryShowcase";
import type { Category } from "@/lib/mock-data";

const messages = {
  sections: { viewAll: "View all" },
  product: { addToCart: "Add to cart", outOfStock: "Out of stock", soldOut: "Sold out" },
};

const category: Category = {
  id: "c1",
  name: { en: "Fruit Trees", bn: "ফল গাছ" },
  slug: "fruit-trees",
  imageUrl: "https://images.unsplash.com/photo-1502741126161-b048400d085d",
};

function renderWith(locale: string) {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <CategoryShowcase category={category} />
    </NextIntlClientProvider>,
  );
}

describe("CategoryShowcase", () => {
  it("renders the English category heading", () => {
    renderWith("en");
    expect(screen.getByRole("heading", { name: "Fruit Trees" })).toBeInTheDocument();
  });

  it("renders the Bengali heading under bn locale", () => {
    renderWith("bn");
    expect(screen.getByRole("heading", { name: "ফল গাছ" })).toBeInTheDocument();
  });

  it("renders products from that category", () => {
    renderWith("en");
    expect(screen.getByText("Rambutan")).toBeInTheDocument();
    expect(screen.getByText("Avocado")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run components/home/CategoryShowcase.test.tsx`
Expected: FAIL — current component uses `category.name` as a string and hardcoded "View all".

- [ ] **Step 3: Rewrite CategoryShowcase**

Replace `components/home/CategoryShowcase.tsx` with:

```tsx
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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-brand-900">{category.name[locale] ?? category.name.en}</h2>
        <Link
          href={`/${locale}/shop?category=${category.slug}`}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          {t("viewAll")}
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run components/home/CategoryShowcase.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add components/home/CategoryShowcase.tsx components/home/CategoryShowcase.test.tsx
git commit -m "feat: bilingual CategoryShowcase heading with scroll-reveal"
```

---

### Task 13: Assemble layout + homepage, full verification

**Files:**
- Modify: `app/[locale]/layout.tsx` (add Header + main wrapper with sidebar + Footer)
- Modify: `app/[locale]/page.tsx` (real homepage)

**Interfaces:**
- Consumes: `Header` (T7), `CategorySidebar` (T8), `Footer` (T9), `HeroCarousel` (T10), `TopSellers` (T11), `CategoryShowcase` (T12), `getCategories` (T4).
- Produces: the final `/bn` and `/en` homepage.

- [ ] **Step 1: Wire Header/Sidebar/Footer into the locale layout**

Edit `app/[locale]/layout.tsx`. Import the layout components and wrap `children` with Header (top) and Footer (bottom). Replace the `<body>` content:

```tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
```

Change the `<body>` to:

```tsx
      <body className={`min-h-full flex flex-col ${locale === "bn" ? "font-bengali" : "font-sans"}`}>
        <NextIntlClientProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </NextIntlClientProvider>
      </body>
```

- [ ] **Step 2: Build the real homepage with the sidebar + sections layout**

Replace `app/[locale]/page.tsx` with:

```tsx
import { setRequestLocale } from "next-intl/server";
import { CategorySidebar } from "@/components/layout/CategorySidebar";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TopSellers } from "@/components/home/TopSellers";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { getCategories } from "@/lib/mock-data";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const categories = getCategories();

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-64 lg:flex-shrink-0">
          <CategorySidebar />
        </div>
        <div className="flex-1">
          <HeroCarousel />
        </div>
      </div>
      <TopSellers />
      {categories.map((category) => (
        <CategoryShowcase key={category.id} category={category} />
      ))}
    </main>
  );
}
```

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: PASS — all suites green (mock-data 5, ProductCard 5, LanguageToggle 1, Header 1, CategorySidebar 2, Footer 1, HeroCarousel 1, TopSellers 1, CategoryShowcase 3).

- [ ] **Step 4: Manually verify both locales in the browser**

```bash
npm run dev
```

Visit `http://localhost:3000/bn`: sticky dark-green header with Bengali nav + search + cart, left MENU sidebar with Bengali categories, hero carousel auto-advancing with arrows/dots, Top Sellers carousel, category rows with Unsplash images, premium footer. Click `EN` in the toggle → everything flips to English at `/en`. Resize narrow → sidebar stacks above hero, grids collapse to 2 columns. Confirm the Guava card shows the "বিক্রি শেষ" badge (bn) / "Sold out" (en) and a disabled "স্টক নেই" / "Out of stock" button.

- [ ] **Step 5: Commit**

```bash
git add app
git commit -m "feat: assemble premium bilingual homepage with layout, hero and carousels"
```

---

## Self-Review Notes

- **Spec coverage:** i18n foundation (T1–T3), bilingual data + images (T4), ProductCard (T5), LanguageToggle (T6), Header (T7), Sidebar (T8), Footer (T9), HeroCarousel (T10), TopSellers carousel (T11), CategoryShowcase (T12), assembly (T13) — every spec section maps to a task.
- **ProductCard labels preserved:** badge "Sold out" / "বিক্রি শেষ", button "Out of stock" / "স্টক নেই", in-stock "Add to cart" — driven by `messages` so both locales covered; English literals match the original rule.
- **Type consistency:** `Localized`, `Product.name: Localized`, `Category.name: Localized` defined in T4 and consumed identically in T5/T8/T12. `getTopSellers/getCategories/getProductsByCategory` signatures unchanged.
- **Tailwind v4:** all styling via utility classes + existing `@theme` brand tokens; new `--font-bengali` token added in T1. No `tailwind.config.ts` introduced.
- **Known follow-ups (out of scope):** real Shop/Product/Cart pages, backend wiring, working search, real cart/wishlist counts.
- **Execution note:** `app/[locale]/layout.tsx` is edited twice (T3 creates it, T13 adds Header/Footer) — intentional, each is independently testable.
```
