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
