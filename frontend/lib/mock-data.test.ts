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
