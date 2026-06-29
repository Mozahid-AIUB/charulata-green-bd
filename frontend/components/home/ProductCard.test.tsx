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

  it("shows a discount badge and strikethrough original price", () => {
    renderWith("en", { ...product, priceMin: 650, priceMax: null, originalPrice: 750 });
    expect(screen.getByText("-13%")).toBeInTheDocument();
    expect(screen.getByText("৳750")).toBeInTheDocument();
  });

  it("shows no discount badge when there is no original price", () => {
    renderWith("en", { ...product, priceMax: null });
    expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
  });
});
