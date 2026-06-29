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
