# Frontend Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Next.js storefront and build a fully styled Homepage matching charulata.green's layout, using local mock data (no backend yet).

**Architecture:** Next.js 14 App Router + TypeScript + Tailwind CSS. Mock product/category data lives in a local `lib/mock-data.ts` module behind the same shape the real API will later return, so swapping in real fetches later is a drop-in change. Each homepage section (Hero, TopSellers, PromoBanner, CategoryShowcase) is its own component under `components/home/`.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, no backend calls in this plan.

## Global Constraints

- Frontend root: `frontend/` directory inside the project root (`d:/Way_To_Job/ASP DOTNET/frontend`)
- Styling: Tailwind CSS only — no other CSS framework
- Color palette: green/nature tones (primary green `#2F6B3A`-ish, white cards, neutral grays) — exact hex chosen in Task 2
- Language: English UI copy for now (Bengali content layer deferred to a later plan, per spec's "out of scope for this spec" not listing i18n as built yet)
- No backend/API calls in this plan — all data from `lib/mock-data.ts`
- Images: use placeholder images (local `/public/images/placeholder-plant.svg` or similar) since we have no real product photos yet

---

### Task 1: Scaffold Next.js project

**Files:**
- Create: `frontend/` (via `create-next-app`)
- Modify: none

**Interfaces:**
- Produces: a running Next.js dev server at `http://localhost:3000`, App Router structure (`frontend/app/`), Tailwind preconfigured

- [ ] **Step 1: Run create-next-app**

```bash
cd "d:/Way_To_Job/ASP DOTNET"
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm
```

When prompted, accept defaults (no Turbopack-specific choices needed beyond defaults).

- [ ] **Step 2: Verify it runs**

```bash
cd "d:/Way_To_Job/ASP DOTNET/frontend"
npm run dev
```

Expected: dev server starts, `http://localhost:3000` shows the default Next.js welcome page. Stop the server (Ctrl+C) once confirmed.

- [ ] **Step 3: Commit**

```bash
git init
git add frontend
git commit -m "chore: scaffold Next.js frontend with TypeScript and Tailwind"
```

(If `git init` was already done by the user, skip that sub-step and just add/commit.)

---

### Task 2: Define design tokens (colors, fonts) in Tailwind config

**Files:**
- Modify: `frontend/tailwind.config.ts`
- Modify: `frontend/app/globals.css`

**Interfaces:**
- Produces: Tailwind theme extension with `brand` color scale (`brand-50`...`brand-900`) and a configured sans font, usable as `text-brand-700`, `bg-brand-600`, etc. in every later task.

- [ ] **Step 1: Extend the Tailwind theme**

Open `frontend/tailwind.config.ts` and replace its `theme` key:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f7f1",
          100: "#dcebdc",
          200: "#b9d7ba",
          300: "#8fbd90",
          400: "#62a064",
          500: "#3f7f42",
          600: "#2f6b3a",
          700: "#26562f",
          800: "#1e4326",
          900: "#16331c",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Verify Tailwind picks up the new colors**

Temporarily add `<div className="bg-brand-600 text-white p-4">test</div>` to `frontend/app/page.tsx`, run `npm run dev`, confirm a dark-green box renders at `localhost:3000`, then remove that test div.

- [ ] **Step 3: Commit**

```bash
git add frontend/tailwind.config.ts frontend/app/page.tsx
git commit -m "feat: add brand color palette to Tailwind theme"
```

---

### Task 3: Mock data module

**Files:**
- Create: `frontend/lib/mock-data.ts`
- Test: `frontend/lib/mock-data.test.ts`

**Interfaces:**
- Produces:
  - `type Product = { id: string; name: string; slug: string; priceMin: number; priceMax: number | null; imageUrl: string; soldOut: boolean; category: string }`
  - `type Category = { id: string; name: string; slug: string; imageUrl: string }`
  - `getTopSellers(): Product[]`
  - `getCategories(): Category[]`
  - `getProductsByCategory(categorySlug: string): Product[]`
- Consumes: nothing (this is the data root)

- [ ] **Step 1: Install a test runner**

```bash
cd "d:/Way_To_Job/ASP DOTNET/frontend"
npm install -D vitest @vitejs/plugin-react
```

Add to `frontend/package.json` scripts:
```json
"test": "vitest run"
```

- [ ] **Step 2: Write the failing test**

Create `frontend/lib/mock-data.test.ts`:

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
    const categories = getCategories();
    const firstSlug = categories[0].slug;
    const products = getProductsByCategory(firstSlug);
    expect(products.every((p) => p.category === firstSlug)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run`
Expected: FAIL with "Cannot find module './mock-data'" or similar

- [ ] **Step 3: Write the implementation**

Create `frontend/lib/mock-data.ts`:

```ts
export type Product = {
  id: string;
  name: string;
  slug: string;
  priceMin: number;
  priceMax: number | null;
  imageUrl: string;
  soldOut: boolean;
  category: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
};

export const categories: Category[] = [
  { id: "c1", name: "Fruit Trees", slug: "fruit-trees", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c2", name: "Flower Plants", slug: "flower-plants", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c3", name: "Ornamental Plants", slug: "ornamental-plants", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c4", name: "Spice Plants", slug: "spice-plants", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c5", name: "Medicinal Plants", slug: "medicinal-plants", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c6", name: "Wood/Timber Trees", slug: "wood-timber-trees", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c7", name: "Vegetable Plants", slug: "vegetable-plants", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c8", name: "Gardening Tools", slug: "gardening-tools", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c9", name: "Organic Fertilizers & Pesticides", slug: "fertilizers-pesticides", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c10", name: "Pots & Geo-bags", slug: "pots-geo-bags", imageUrl: "/images/placeholder-plant.svg" },
];

export const products: Product[] = [
  { id: "p1", name: "Cat's Claw Creeper", slug: "cats-claw-creeper", priceMin: 600, priceMax: null, imageUrl: "/images/placeholder-plant.svg", soldOut: false, category: "flower-plants" },
  { id: "p2", name: "Golden Shower", slug: "golden-shower", priceMin: 500, priceMax: null, imageUrl: "/images/placeholder-plant.svg", soldOut: false, category: "flower-plants" },
  { id: "p3", name: "Rambutan", slug: "rambutan", priceMin: 350, priceMax: 800, imageUrl: "/images/placeholder-plant.svg", soldOut: false, category: "fruit-trees" },
  { id: "p4", name: "Avocado", slug: "avocado", priceMin: 400, priceMax: 900, imageUrl: "/images/placeholder-plant.svg", soldOut: false, category: "fruit-trees" },
  { id: "p5", name: "Guava", slug: "guava", priceMin: 150, priceMax: 350, imageUrl: "/images/placeholder-plant.svg", soldOut: true, category: "fruit-trees" },
  { id: "p6", name: "Erica Palm", slug: "erica-palm", priceMin: 100, priceMax: 185, imageUrl: "/images/placeholder-plant.svg", soldOut: false, category: "ornamental-plants" },
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add frontend/lib/mock-data.ts frontend/lib/mock-data.test.ts frontend/package.json
git commit -m "feat: add mock product/category data for homepage"
```

---

### Task 4: Placeholder plant image asset

**Files:**
- Create: `frontend/public/images/placeholder-plant.svg`

**Interfaces:**
- Produces: a static asset at `/images/placeholder-plant.svg`, referenced by every `Product.imageUrl` and `Category.imageUrl` in Task 3's mock data.

- [ ] **Step 1: Create a simple placeholder SVG**

Create `frontend/public/images/placeholder-plant.svg`:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#dcebdc"/>
  <path d="M200 320 C200 320 200 200 200 160" stroke="#2f6b3a" stroke-width="6" fill="none"/>
  <ellipse cx="170" cy="170" rx="40" ry="22" fill="#3f7f42" transform="rotate(-30 170 170)"/>
  <ellipse cx="230" cy="170" rx="40" ry="22" fill="#3f7f42" transform="rotate(30 230 170)"/>
  <ellipse cx="200" cy="140" rx="40" ry="22" fill="#62a064"/>
  <text x="200" y="370" font-family="sans-serif" font-size="14" fill="#26562f" text-anchor="middle">plant image</text>
</svg>
```

- [ ] **Step 2: Verify it's servable**

Run `npm run dev`, visit `http://localhost:3000/images/placeholder-plant.svg`, confirm the SVG renders in-browser.

- [ ] **Step 3: Commit**

```bash
git add frontend/public/images/placeholder-plant.svg
git commit -m "chore: add placeholder plant image asset"
```

---

### Task 5: ProductCard component

**Files:**
- Create: `frontend/components/home/ProductCard.tsx`
- Test: `frontend/components/home/ProductCard.test.tsx`

**Interfaces:**
- Consumes: `Product` type from `frontend/lib/mock-data.ts` (Task 3)
- Produces: `function ProductCard({ product }: { product: Product }): JSX.Element` — used by Task 6 (TopSellers) and later the Shop page plan.

- [ ] **Step 1: Install React Testing Library**

```bash
cd "d:/Way_To_Job/ASP DOTNET/frontend"
npm install -D @testing-library/react @testing-library/jest-dom jsdom
```

Create `frontend/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
  },
});
```

- [ ] **Step 2: Write the failing test**

Create `frontend/components/home/ProductCard.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/mock-data";

const product: Product = {
  id: "p1",
  name: "Rambutan",
  slug: "rambutan",
  priceMin: 350,
  priceMax: 800,
  imageUrl: "/images/placeholder-plant.svg",
  soldOut: false,
  category: "fruit-trees",
};

describe("ProductCard", () => {
  it("renders the product name", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText("Rambutan")).toBeInTheDocument();
  });

  it("renders a price range when priceMax is set", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText("৳350 – ৳800")).toBeInTheDocument();
  });

  it("renders a single price when priceMax is null", () => {
    render(<ProductCard product={{ ...product, priceMax: null }} />);
    expect(screen.getByText("৳350")).toBeInTheDocument();
  });

  it("shows a Sold out badge when soldOut is true", () => {
    render(<ProductCard product={{ ...product, soldOut: true }} />);
    expect(screen.getByText("Sold out")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run components/home/ProductCard.test.tsx`
Expected: FAIL — `ProductCard` module not found

- [ ] **Step 4: Write the implementation**

Create `frontend/components/home/ProductCard.tsx`:

```tsx
import Image from "next/image";
import type { Product } from "@/lib/mock-data";

function formatPrice(product: Product): string {
  if (product.priceMax === null) {
    return `৳${product.priceMin}`;
  }
  return `৳${product.priceMin} – ৳${product.priceMax}`;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-brand-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-square w-full bg-brand-50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
        {product.soldOut && (
          <span className="absolute left-2 top-2 rounded bg-gray-800 px-2 py-1 text-xs font-medium text-white">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="text-sm font-medium text-brand-900">{product.name}</h3>
        <p className="text-sm font-semibold text-brand-700">{formatPrice(product)}</p>
        <button
          type="button"
          disabled={product.soldOut}
          className="mt-2 rounded bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {product.soldOut ? "Sold out" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run components/home/ProductCard.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add frontend/components/home/ProductCard.tsx frontend/components/home/ProductCard.test.tsx frontend/vitest.config.ts frontend/package.json
git commit -m "feat: add ProductCard component with price formatting and sold-out state"
```

---

### Task 6: TopSellers section

**Files:**
- Create: `frontend/components/home/TopSellers.tsx`
- Test: `frontend/components/home/TopSellers.test.tsx`

**Interfaces:**
- Consumes: `getTopSellers()` from `frontend/lib/mock-data.ts` (Task 3), `ProductCard` from Task 5
- Produces: `function TopSellers(): JSX.Element`, used by Task 9 (page assembly)

- [ ] **Step 1: Write the failing test**

Create `frontend/components/home/TopSellers.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TopSellers } from "./TopSellers";

describe("TopSellers", () => {
  it("renders a heading and at least 4 product cards", () => {
    render(<TopSellers />);
    expect(screen.getByRole("heading", { name: /top sellers/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /add to cart|sold out/i }).length).toBeGreaterThanOrEqual(4);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/home/TopSellers.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Write the implementation**

Create `frontend/components/home/TopSellers.tsx`:

```tsx
import { getTopSellers } from "@/lib/mock-data";
import { ProductCard } from "./ProductCard";

export function TopSellers() {
  const products = getTopSellers();
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="mb-6 text-2xl font-semibold text-brand-900">Top Sellers</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/home/TopSellers.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/components/home/TopSellers.tsx frontend/components/home/TopSellers.test.tsx
git commit -m "feat: add TopSellers homepage section"
```

---

### Task 7: Hero section

**Files:**
- Create: `frontend/components/home/Hero.tsx`
- Test: `frontend/components/home/Hero.test.tsx`

**Interfaces:**
- Consumes: nothing (static content for now — carousel mechanics deferred, single static slide)
- Produces: `function Hero(): JSX.Element`, used by Task 9

- [ ] **Step 1: Write the failing test**

Create `frontend/components/home/Hero.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the nursery tagline", () => {
    render(<Hero />);
    expect(screen.getByText(/country's largest online nursery/i)).toBeInTheDocument();
  });

  it("renders a shop now call to action", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /shop now/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/home/Hero.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Write the implementation**

Create `frontend/components/home/Hero.tsx`:

```tsx
import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-brand-50">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
          Country&apos;s largest online nursery
        </p>
        <h1 className="text-4xl font-bold text-brand-900 sm:text-5xl">
          Buy green to save green
        </h1>
        <p className="max-w-2xl text-brand-700">
          Fruit trees, flowers, ornamentals, and everything your garden needs —
          delivered to your door.
        </p>
        <Link
          href="/shop"
          className="rounded bg-brand-600 px-6 py-3 font-medium text-white transition hover:bg-brand-700"
        >
          Shop now
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/home/Hero.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/components/home/Hero.tsx frontend/components/home/Hero.test.tsx
git commit -m "feat: add Hero homepage section"
```

---

### Task 8: CategoryShowcase section

**Files:**
- Create: `frontend/components/home/CategoryShowcase.tsx`
- Test: `frontend/components/home/CategoryShowcase.test.tsx`

**Interfaces:**
- Consumes: `getProductsByCategory(slug)` and `Category` type from `frontend/lib/mock-data.ts` (Task 3), `ProductCard` from Task 5
- Produces: `function CategoryShowcase({ category }: { category: Category }): JSX.Element`, used by Task 9 once per category that has products

- [ ] **Step 1: Write the failing test**

Create `frontend/components/home/CategoryShowcase.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CategoryShowcase } from "./CategoryShowcase";
import type { Category } from "@/lib/mock-data";

const category: Category = {
  id: "c1",
  name: "Fruit Trees",
  slug: "fruit-trees",
  imageUrl: "/images/placeholder-plant.svg",
};

describe("CategoryShowcase", () => {
  it("renders the category name as a heading", () => {
    render(<CategoryShowcase category={category} />);
    expect(screen.getByRole("heading", { name: "Fruit Trees" })).toBeInTheDocument();
  });

  it("renders products belonging to that category", () => {
    render(<CategoryShowcase category={category} />);
    expect(screen.getByText("Rambutan")).toBeInTheDocument();
    expect(screen.getByText("Avocado")).toBeInTheDocument();
  });

  it("does not render products from other categories", () => {
    render(<CategoryShowcase category={category} />);
    expect(screen.queryByText("Erica Palm")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/home/CategoryShowcase.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Write the implementation**

Create `frontend/components/home/CategoryShowcase.tsx`:

```tsx
import Link from "next/link";
import { getProductsByCategory, type Category } from "@/lib/mock-data";
import { ProductCard } from "./ProductCard";

export function CategoryShowcase({ category }: { category: Category }) {
  const products = getProductsByCategory(category.slug);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-brand-900">{category.name}</h2>
        <Link
          href={`/shop?category=${category.slug}`}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/home/CategoryShowcase.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add frontend/components/home/CategoryShowcase.tsx frontend/components/home/CategoryShowcase.test.tsx
git commit -m "feat: add CategoryShowcase homepage section with view-all link"
```

---

### Task 9: Assemble the Homepage

**Files:**
- Modify: `frontend/app/page.tsx`

**Interfaces:**
- Consumes: `Hero` (Task 7), `TopSellers` (Task 6), `CategoryShowcase` (Task 8), `getCategories` (Task 3)
- Produces: the final rendered `/` route — no further tasks depend on this in this plan

- [ ] **Step 1: Replace the default homepage**

Replace the full contents of `frontend/app/page.tsx`:

```tsx
import { Hero } from "@/components/home/Hero";
import { TopSellers } from "@/components/home/TopSellers";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { getCategories } from "@/lib/mock-data";

export default function Home() {
  const categories = getCategories();

  return (
    <main>
      <Hero />
      <TopSellers />
      {categories.map((category) => (
        <CategoryShowcase key={category.id} category={category} />
      ))}
    </main>
  );
}
```

- [ ] **Step 2: Manually verify in the browser**

```bash
cd "d:/Way_To_Job/ASP DOTNET/frontend"
npm run dev
```

Visit `http://localhost:3000`. Confirm: Hero renders with "Shop now" button, Top Sellers grid shows 4 products, each non-empty category renders its own section with a "View all" link, Sold-out badge shows on Guava, page is responsive (resize browser narrower — grid should collapse to 2 columns).

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: PASS — all tests from Tasks 3, 5, 6, 7, 8 pass together

- [ ] **Step 4: Commit**

```bash
git add frontend/app/page.tsx
git commit -m "feat: assemble homepage from Hero, TopSellers, and CategoryShowcase sections"
```

---

## Self-Review Notes

- **Spec coverage:** Home page layout (Hero, Top Sellers, category showcase rows) from the spec's "Reference Site Map" section is covered. Header/nav and Footer are intentionally NOT included in this plan — they are shared layout, not homepage-specific, and belong in a follow-up "Shared Layout" plan before the Shop page plan.
- **Out of scope reminder for next plan:** promo banners (Corporate Greening, Monthly Care Packages), header navigation, footer, and the Shop/Product Detail/Cart pages are separate follow-up plans.
