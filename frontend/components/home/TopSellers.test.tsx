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
