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
